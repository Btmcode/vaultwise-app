
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
import { auth } from '@/lib/firebase/client';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { Loader2 } from 'lucide-react';


export default function LoginPage() {
  const params = useParams();
  const router = useRouter();
  const lang = params.lang as 'tr' | 'en';
  const dict = getDictionary(lang);
  const loginDict = dict.loginPage;

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (!email || !password) {
        toast({
            variant: 'destructive',
            title: loginDict.toast.error.title,
            description: loginDict.toast.error.invalidCredentials,
        });
        setIsLoading(false);
        return;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const idToken = await userCredential.user.getIdToken();

      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${idToken}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ details: 'Unknown server error' }));
        console.error('Session cookie API error:', errorData);
        throw new Error(errorData.details || 'Session cookie creation failed');
      }

      toast({
        title: loginDict.toast.success.title,
        description: loginDict.toast.success.description,
      });
      // Use window.location.href for a full page refresh to ensure middleware catches the new cookie state.
      // This is the most reliable way to handle redirection after setting an httpOnly cookie.
      window.location.href = `/${lang}`;
    } catch (error: any) {
      console.error('Login error:', error);
      
      let description = loginDict.toast.error.default;
      // Handle Firebase client auth errors
      if (error.code) {
        switch (error.code) {
          case 'auth/user-not-found':
          case 'auth/wrong-password':
          case 'auth/invalid-credential':
          case 'auth/invalid-email':
            description = loginDict.toast.error.invalidCredentials;
            break;
          default:
            description = error.message;
        }
      } else if (error.message) {
        // Handle server-side errors from our API
        description = error.message;
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
    <div className="flex min-h-screen w-full items-center justify-center bg-background px-4">
       <Card className="mx-auto max-w-sm w-full">
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
                <Label htmlFor="password">{loginDict.passwordLabel}</Label>
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
