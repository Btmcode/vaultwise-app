
"use client";

import { useRef, useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { getDictionary } from '@/app/dictionaries';
import { Header } from '@/components/header';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useToast } from "@/hooks/use-toast";
import { Loader2, ArrowLeft } from 'lucide-react';
import { updateUserProfile } from '@/lib/firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import type { FirestoreUser } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import Link from 'next/link';
import { getClientApp } from '@/lib/firebase/client';

// Initialize client app and storage
const app = getClientApp();
const storage = getStorage(app);


export default function ProfilePage() {
  const params = useParams();
  const lang = params.lang as 'tr' | 'en';
  const dict = getDictionary(lang);
  const profileDict = dict.profilePage;

  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [user, setUser] = useState<FirestoreUser | null>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  useEffect(() => {
    async function fetchUser() {
        setIsLoading(true);
        try {
            const response = await fetch('/api/user');
            if (!response.ok) throw new Error('Failed to fetch user profile');
            const data = await response.json();
            if (data.user) {
                const userDoc = data.user as FirestoreUser;
                setUser(userDoc);
                setName(userDoc.name);
                setEmail(userDoc.email);
                setAvatarPreview(userDoc.photoURL || null);
            }
        } catch (error) {
            console.error("Failed to fetch user profile:", error);
            toast({ variant: "destructive", title: "Error", description: "Could not load profile." });
        } finally {
            setIsLoading(false);
        }
    }
    fetchUser();
  }, [toast]);

  const handlePictureChangeClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveChanges = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsSaving(true);

    try {
        const updateData: { name: string; email: string; photoURL?: string | null } = {
            name,
            email,
        };

        // 1. If a new avatar file is selected, upload it
        if (avatarFile) {
            const storageRef = ref(storage, `avatars/${user.id}/${avatarFile.name}`);
            const snapshot = await uploadBytes(storageRef, avatarFile);
            updateData.photoURL = await getDownloadURL(snapshot.ref);
        } else {
            // Only include photoURL if it has actually changed to prevent unnecessary writes.
            // If user had a photo and didn't change it, no need to send the URL again.
            if (user.photoURL !== avatarPreview) {
               updateData.photoURL = avatarPreview;
            }
        }

        // 2. Update user profile in Firestore & Auth via server action
        await updateUserProfile(updateData);

        // 3. Update local state and show success toast
        setUser(prev => {
            if (!prev) return null;
            const newPhotoURL = updateData.photoURL !== undefined ? updateData.photoURL : prev.photoURL;
            return { ...prev, name, email, photoURL: newPhotoURL };
        });
        setAvatarFile(null); // Clear the file after upload

        toast({
            variant: "success",
            title: profileDict.toast.success.title,
            description: profileDict.toast.success.description,
        });

    } catch (error) {
        console.error("Profile update error:", error);
        toast({
            variant: "destructive",
            title: profileDict.toast.error.title,
            description: profileDict.toast.error.description,
        });
    } finally {
        setIsSaving(false);
    }
};


  if (isLoading) {
    return (
      <div className="flex min-h-screen w-full flex-col bg-background">
        <Header lang={lang} dict={dict.header} />
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
          <div className="mx-auto grid w-full max-w-4xl gap-2">
            <Skeleton className="h-9 w-48" />
          </div>
          <div className="mx-auto grid w-full max-w-4xl items-start gap-6">
            <Card>
              <CardHeader>
                <Skeleton className="h-8 w-64" />
                <Skeleton className="h-4 w-96 mt-2" />
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4">
                  <Skeleton className="h-20 w-20 rounded-full" />
                  <Skeleton className="h-10 w-32" />
                </div>
              </CardContent>
              <CardFooter className="border-t px-6 py-4">
                <Skeleton className="h-10 w-24" />
              </CardFooter>
            </Card>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <Header lang={lang} dict={dict.header} />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="mx-auto grid w-full max-w-4xl gap-2">
           <Link href={`/${lang}/dashboard`} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-2">
              <ArrowLeft className="h-4 w-4" />
              {dict.backToDashboard}
            </Link>
          <h1 className="text-3xl font-semibold">{profileDict.title}</h1>
        </div>
        <div className="mx-auto grid w-full max-w-4xl items-start gap-6">
          <div className="grid gap-6">
            <form onSubmit={handleSaveChanges}>
              <Card>
                <CardHeader>
                  <CardTitle>{profileDict.cardTitle}</CardTitle>
                  <CardDescription>{profileDict.cardDescription}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-6">
                    <div className="flex items-center gap-4">
                      <Avatar className="h-20 w-20">
                        <AvatarImage src={avatarPreview || undefined} alt={user?.name} className="object-cover" loading="lazy" />
                        <AvatarFallback>{name.charAt(0).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        className="hidden"
                        accept="image/png, image/jpeg, image/gif"
                      />
                      <Button type="button" variant="outline" onClick={handlePictureChangeClick}>{profileDict.changePicture}</Button>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <label htmlFor="name">{profileDict.nameLabel}</label>
                        <Input id="name" name="name" value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" />
                      </div>
                      <div className="grid gap-2">
                        <label htmlFor="email">{profileDict.emailLabel}</label>
                        <Input id="email" name="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" />
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="border-t px-6 py-4">
                  <Button type="submit" disabled={isSaving}>
                    {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {profileDict.saveButton}
                  </Button>
                </CardFooter>
              </Card>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
