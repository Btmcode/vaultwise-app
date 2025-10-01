
"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { getDictionary } from '@/app/dictionaries';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { VaultWiseLogo } from '@/components/icons';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '@/lib/firebase/client';
import { Loader2, ArrowLeft } from 'lucide-react';
import HeroScene from '@/components/landing/hero-scene';

export default function ForgotPasswordPage() {
  const params = useParams();
  const lang = params.lang as 'tr' | 'en';
  const dict = getDictionary(lang);
  
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  
  if (!dict) {
    return null; // or a loading skeleton
  }
  const forgotPasswordDict = dict.forgotPasswordPage;

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (!email) {
      toast({
        variant: 'destructive',
        title: forgotPasswordDict.toast.error.title,
        description: forgotPasswordDict.toast.error.noEmail,
      });
      setIsLoading(false);
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      toast({
        variant: 'success',
        title: forgotPasswordDict.toast.success.title,
        description: forgotPasswordDict.toast.success.description,
      });
      setEmail('');
    } catch (error: any) {
      console.error('Password reset error:', error);
      let description = forgotPasswordDict.toast.error.default;
      if (error.code === 'auth/user-not-found') {
        description = forgotPasswordDict.toast.error.userNotFound;
      } else if (error.code === 'auth/api-key-not-valid') {
        description = "Configuration error. Please contact support.";
      }
      toast({
        variant: 'destructive',
        title: forgotPasswordDict.toast.error.title,
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
          <CardTitle className="text-2xl">{forgotPasswordDict.title}</CardTitle>
          <CardDescription>{forgotPasswordDict.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handlePasswordReset} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">{forgotPasswordDict.emailLabel}</Label>
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
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {forgotPasswordDict.buttonText}
            </Button>
          </form>
          <div className="mt-4 text-center text-sm">
            <Link href={`/${lang}/login`} className="flex items-center justify-center gap-1 text-muted-foreground hover:text-primary">
              <ArrowLeft className="h-4 w-4" />
              {forgotPasswordDict.backToLogin}
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
