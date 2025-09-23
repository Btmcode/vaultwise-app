
"use client";

import { useParams } from 'next/navigation';
import { getDictionary } from '@/app/dictionaries';
import { Header } from '@/components/header';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export default function ProfilePage() {
  const params = useParams();
  const lang = params.lang as 'tr' | 'en';
  const dict = getDictionary(lang);
  
  const userAvatar = PlaceHolderImages.find((img) => img.id === 'user-avatar');
  const profileDict = dict.profilePage;

  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <Header lang={lang} dict={dict.header} />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="mx-auto grid w-full max-w-4xl gap-2">
          <h1 className="text-3xl font-semibold">{profileDict.title}</h1>
        </div>
        <div className="mx-auto grid w-full max-w-4xl items-start gap-6">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle>{profileDict.cardTitle}</CardTitle>
                <CardDescription>{profileDict.cardDescription}</CardDescription>
              </CardHeader>
              <CardContent>
                <form className="grid gap-4">
                  <div className="flex items-center gap-4">
                    {userAvatar && (
                        <Avatar className="h-20 w-20">
                        <AvatarImage src={userAvatar.imageUrl} alt={userAvatar.description} />
                        <AvatarFallback>AV</AvatarFallback>
                    </Avatar>
                    )}
                    <Button variant="outline">{profileDict.changePicture}</Button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                     <div className="grid gap-2">
                        <label htmlFor="name">{profileDict.nameLabel}</label>
                        <Input id="name" defaultValue="Ali Veli" />
                    </div>
                    <div className="grid gap-2">
                        <label htmlFor="email">{profileDict.emailLabel}</label>
                        <Input id="email" type="email" defaultValue="ali.veli@example.com" />
                    </div>
                  </div>
                </form>
              </CardContent>
              <CardFooter className="border-t px-6 py-4">
                <Button>{profileDict.saveButton}</Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
