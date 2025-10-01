
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
import { signupWithEmail } from '@/app/actions';


export default function SignupPage() {
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
  const signupDict = dict.signupPage;


  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (password.length < 6) {
        toast({
            variant: 'destructive',
            title: signupDict.toast.error.title,
            description: signupDict.toast.error.passwordLength,
        });
        setIsLoading(false);
        return;
    }

    const result = await signupWithEmail({ email, password });

    if (result.error) {
        let description = result.error;
        if (result.error.includes('auth/api-key-not-valid')) {
            description = "Configuration error. Please contact support.";
        }
        toast({
            variant: 'destructive',
            title: signupDict.toast.error.title,
            description: description,
        });
    } else {
        toast({
            variant: 'success',
            title: signupDict.toast.success.title,
            description: signupDict.toast.success.description,
        });
        // Redirect to dashboard after successful signup
        router.push(`/${lang}/dashboard`);
    }
    
    setIsLoading(false);
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-background px-4 relative">
      <HeroScene />
      <Card className="mx-auto max-w-sm w-full z-10">
        <CardHeader className="text-center">
            <div className="flex justify-center items-center mb-4">
                <VaultWiseLogo className="h-12 w-12 text-primary" />
            </div>
          <CardTitle className="text-2xl">{signupDict.title}</CardTitle>
          <CardDescription>
            {signupDict.description}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignup} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">{signupDict.emailLabel}</Label>
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
              <Label htmlFor="password">{signupDict.passwordLabel}</Label>              
              <Input 
                id="password" 
                type="password" 
                required
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {signupDict.buttonText}
            </Button>
          </form>
          <div className="mt-4 text-center text-sm">
            {signupDict.loginText}
            <Link href={`/${lang}/login`} className="underline ml-1">
              {signupDict.loginLink}
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
