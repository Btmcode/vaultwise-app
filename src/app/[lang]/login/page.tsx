"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { getDictionary } from '@/app/dictionaries';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { VaultWiseLogo } from '@/components/icons';
import { Loader2 } from 'lucide-react';
import HeroScene from '@/components/landing/hero-scene';
import { loginWithEmail } from '@/app/actions';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase/client'; // Correct, centralized import

export default function LoginPage() {
  const params = useParams();
  const router = useRouter();
  const lang = params.lang as 'tr' | 'en';
  const dict = getDictionary(lang);
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  if (!dict) {
    return null; // or a loading skeleton
  }
  const loginDict = dict.loginPage;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (!email || !password) {
        toast({
            variant: 'destructive',
            title: loginDict.toast.error.title,
            description: "Please enter both email and password.",
        });
        setIsLoading(false);
        return;
    }
    
    try {
        // 1. Sign in on the client side to get the user and ID token
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const idToken = await userCredential.user.getIdToken();

        // 2. Pass the ID token to the server action to create a session cookie
        const result = await loginWithEmail({ idToken });

        if (result.error) {
            // If the server action fails, it's a server-side problem.
            throw new Error(result.error);
        }

        toast({
            variant: "success",
            title: loginDict.toast.success.title,
            description: loginDict.toast.success.description,
        });
        
        // Use router.replace to avoid adding a new entry to the history stack
        router.replace(`/${lang}/dashboard`);

    } catch (error: any) {
        console.error('Login error:', error);
        let description = loginDict.toast.error.default;
        
        // Handle specific client-side Firebase Auth errors
        if (error.code === 'auth/invalid-credential' || error.code === 'auth/wrong-password' || error.code === 'auth/user-not-found' || error.code === 'auth/api-key-not-valid') {
            description = loginDict.toast.error.invalidCredentials;
        } else if (error.message.includes('session creation failed')) {
            // Handle server-side errors passed from the server action
            description = "Could not create a session on the server. Please try again.";
        }
        
        toast({
            variant: 'destructive',
            title: loginDict.toast.error.title,
            description: description,
        });
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-background px-4 relative">
       <HeroScene />
       <Card className="mx-auto max-w-sm w-full z-10">
        <CardHeader className="text-center">
            <div className="flex justify-center items-center mb-4">
                <VaultWiseLogo className="h-12 w-12 text-primary" />
            </div>
          <CardTitle className="text-2xl">{loginDict.title}</CardTitle>
          <CardDescription>
            {loginDict.description}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">{loginDict.emailLabel}</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
                <div className="flex items-center">
                    <Label htmlFor="password">{loginDict.passwordLabel}</Label>
                    <Link href={`/${lang}/forgot-password`} className="ml-auto inline-block text-sm underline">
                        {loginDict.forgotPassword}
                    </Link>
                </div>
              <Input 
                id="password" 
                type="password" 
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
               />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {loginDict.buttonText}
            </Button>
          </form>
          <div className="mt-4 text-center text-sm">
            {loginDict.signupText}
            <Link href={`/${lang}/signup`} className="underline ml-1">
              {loginDict.signupLink}
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
