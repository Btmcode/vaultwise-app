
"use client";

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { getDictionary } from '@/app/dictionaries';
import { Header } from '@/components/header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Eye, EyeOff } from 'lucide-react';


export default function SettingsPage() {
  const params = useParams();
  const lang = params.lang as 'tr' | 'en';
  const [dict, setDict] = useState<any>(null);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);

  useEffect(() => {
    if (lang) {
      getDictionary(lang).then(setDict);
    }
  }, [lang]);

  if (!dict) {
    return null; // or a loading skeleton
  }

  const settingsDict = dict.settingsPage;

  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <Header lang={lang} dict={dict.header} />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="mx-auto grid w-full max-w-4xl gap-2">
          <h1 className="text-3xl font-semibold">{settingsDict.title}</h1>
        </div>
        <div className="mx-auto grid w-full max-w-4xl items-start gap-6">
            <div className="grid gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>{settingsDict.account.title}</CardTitle>
                        <CardDescription>{settingsDict.account.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-4">
                         <div className="grid gap-2">
                            <label htmlFor="current-password">{settingsDict.account.currentPassword}</label>
                            <div className="relative">
                                <Input id="current-password" type={showCurrentPassword ? "text" : "password"} />
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2 text-muted-foreground"
                                    onClick={() => setShowCurrentPassword((prev) => !prev)}
                                >
                                    {showCurrentPassword ? <EyeOff /> : <Eye />}
                                </Button>
                            </div>
                        </div>
                         <div className="grid gap-2">
                            <label htmlFor="new-password">{settingsDict.account.newPassword}</label>
                            <div className="relative">
                                <Input id="new-password" type={showNewPassword ? "text" : "password"} />
                                 <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2 text-muted-foreground"
                                    onClick={() => setShowNewPassword((prev) => !prev)}
                                >
                                    {showNewPassword ? <EyeOff /> : <Eye />}
                                </Button>
                            </div>
                        </div>
                         <div className="grid gap-2">
                            <label htmlFor="confirm-new-password">{settingsDict.account.confirmNewPassword}</label>
                            <div className="relative">
                                <Input id="confirm-new-password" type={showConfirmNewPassword ? "text" : "password"} />
                                 <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2 text-muted-foreground"
                                    onClick={() => setShowConfirmNewPassword((prev) => !prev)}
                                >
                                    {showConfirmNewPassword ? <EyeOff /> : <Eye />}
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter className="border-t px-6 py-4">
                        <Button>{settingsDict.account.saveButton}</Button>
                    </CardFooter>
                </Card>

                 <Card>
                    <CardHeader>
                        <CardTitle>{settingsDict.notifications.title}</CardTitle>
                        <CardDescription>{settingsDict.notifications.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-4">
                        <div className="flex items-center space-x-2">
                            <Switch id="price-alerts" defaultChecked />
                            <label htmlFor="price-alerts">{settingsDict.notifications.priceAlerts}</label>
                        </div>
                         <div className="flex items-center space-x-2">
                            <Switch id="auto-save-updates" />
                            <label htmlFor="auto-save-updates">{settingsDict.notifications.autoSaveUpdates}</label>
                        </div>
                         <div className="flex items-center space-x-2">
                            <Switch id="newsletter" defaultChecked />
                            <label htmlFor="newsletter">{settingsDict.notifications.newsletter}</label>
                        </div>
                    </CardContent>
                    <CardFooter className="border-t px-6 py-4">
                        <Button>{settingsDict.notifications.saveButton}</Button>
                    </CardFooter>
                </Card>
            </div>
        </div>
      </main>
    </div>
  );
}
