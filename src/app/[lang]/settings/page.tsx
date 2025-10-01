

"use client";

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { getDictionary } from '@/app/dictionaries';
import { Header } from '@/components/header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Eye, EyeOff, Loader2, Trash2, ArrowLeft } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { analyzeFeedback } from "@/app/actions";
import { Textarea } from '@/components/ui/textarea';
import { getIbanAccounts, addIbanAccount, removeIbanAccount } from '@/lib/firebase/firestore';
import type { IbanAccount } from '@/lib/types';
import { BankIcon } from '@/components/icons';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default function SettingsPage() {
  const params = useParams();
  const lang = params.lang as 'tr' | 'en';
  const dict = getDictionary(lang);
  
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);
  const [feedbackText, setFeedbackText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  // IBAN State
  const [ibanAccounts, setIbanAccounts] = useState<IbanAccount[]>([]);
  const [newAccountHolder, setNewAccountHolder] = useState("");
  const [newIban, setNewIban] = useState("");
  const [isAddingIban, setIsAddingIban] = useState(false);
  const [isLoadingIbans, setIsLoadingIbans] = useState(true);


  useEffect(() => {
    const fetchIbans = async () => {
        setIsLoadingIbans(true);
        const accounts = await getIbanAccounts();
        setIbanAccounts(accounts);
        setIsLoadingIbans(false);
    }
    fetchIbans();
  }, []);

  if (!dict) {
    return null; // or a loading skeleton
  }

  const settingsDict = dict.settingsPage;

  const handleGenericSave = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
        variant: "success",
        title: settingsDict.toast.saveSuccess.title,
        description: settingsDict.toast.saveSuccess.description,
    });
  };

  const handleFeedbackSubmit = async () => {
    if (feedbackText.trim().length < 10) {
      toast({
        variant: "destructive",
        title: settingsDict.feedback.toast.error.title,
        description: settingsDict.feedback.toast.error.tooShort,
      });
      return;
    }
    setIsSubmitting(true);
    try {
      await analyzeFeedback({ feedbackText });
      toast({
        variant: "success",
        title: settingsDict.feedback.toast.success.title,
        description: settingsDict.feedback.toast.success.description,
      });
      setFeedbackText("");
    } catch (error) {
      console.error("Feedback submission error:", error);
      toast({
        variant: "destructive",
        title: settingsDict.feedback.toast.error.title,
        description: settingsDict.feedback.toast.error.general,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddIban = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newAccountHolder.trim() === "" || newIban.trim() === "") {
        toast({
            variant: "destructive",
            title: settingsDict.iban.toast.error.title,
            description: settingsDict.iban.toast.error.emptyFields,
        });
        return;
    }
    setIsAddingIban(true);
    // Simple IBAN validation (basic check)
    if (newIban.trim().length < 15) {
         toast({
            variant: "destructive",
            title: settingsDict.iban.toast.error.title,
            description: settingsDict.iban.toast.error.invalidIban,
        });
        setIsAddingIban(false);
        return;
    }
    await addIbanAccount({ accountHolder: newAccountHolder, iban: newIban });
    // Refetch accounts
    const updatedAccounts = await getIbanAccounts();
    setIbanAccounts(updatedAccounts);

    setNewAccountHolder("");
    setNewIban("");
    toast({
        variant: "success",
        title: settingsDict.iban.toast.success.addTitle,
        description: settingsDict.iban.toast.success.addDescription,
    });
    setIsAddingIban(false);
  };

  const handleDeleteIban = async (accountId: string) => {
    await removeIbanAccount(accountId);
    // Refetch accounts
    const updatedAccounts = await getIbanAccounts();
    setIbanAccounts(updatedAccounts);
    toast({
        variant: "destructive",
        title: settingsDict.iban.toast.success.deleteTitle,
        description: settingsDict.iban.toast.success.deleteDescription,
    });
  };


  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <Header lang={lang} dict={dict.header} />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="mx-auto grid w-full max-w-4xl gap-2">
           <Link href={`/${lang}/dashboard`} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-2">
              <ArrowLeft className="h-4 w-4" />
              {dict.backToDashboard}
            </Link>
          <h1 className="text-3xl font-semibold">{settingsDict.title}</h1>
        </div>
        <div className="mx-auto grid w-full max-w-4xl items-start gap-6">
            <div className="grid gap-6">

                <Card>
                    <CardHeader>
                        <CardTitle>{settingsDict.iban.title}</CardTitle>
                        <CardDescription>{settingsDict.iban.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleAddIban} className="grid gap-4 sm:grid-cols-3 sm:gap-6">
                            <div className="grid gap-2">
                                <label htmlFor="account-holder">{settingsDict.iban.accountHolder}</label>
                                <Input 
                                  id="account-holder"
                                  value={newAccountHolder}
                                  onChange={(e) => setNewAccountHolder(e.target.value)}
                                  placeholder={settingsDict.iban.accountHolderPlaceholder}
                                />
                            </div>
                            <div className="grid gap-2">
                                <label htmlFor="iban">{settingsDict.iban.iban}</label>
                                <Input 
                                  id="iban"
                                  value={newIban}
                                  onChange={(e) => setNewIban(e.target.value)}
                                  placeholder={settingsDict.iban.ibanPlaceholder}
                                />
                            </div>
                             <Button type="submit" className="self-end" disabled={isAddingIban}>
                                {isAddingIban && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                {settingsDict.iban.addButton}
                             </Button>
                        </form>
                         <div className="mt-6 space-y-4">
                            <h3 className="text-md font-medium">{settingsDict.iban.savedAccounts}</h3>
                            {isLoadingIbans ? (
                                <div className="text-center py-4"><Loader2 className="mx-auto h-6 w-6 animate-spin text-muted-foreground"/></div>
                            ) : ibanAccounts.length > 0 ? (
                                ibanAccounts.map(account => (
                                <div key={account.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                                    <div className="flex items-center gap-4">
                                        <BankIcon className="h-6 w-6 text-muted-foreground" />
                                        <div>
                                            <p className="font-semibold">{account.accountHolder}</p>
                                            <p className="text-sm text-muted-foreground font-mono">{account.iban}</p>
                                        </div>
                                    </div>
                                    <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                            <Button variant="ghost" size="icon">
                                                <Trash2 className="h-4 w-4 text-red-500" />
                                            </Button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                            <AlertDialogHeader>
                                                <AlertDialogTitle>{settingsDict.iban.deleteConfirm.title}</AlertDialogTitle>
                                                <AlertDialogDescription>
                                                    {settingsDict.iban.deleteConfirm.description.replace('{iban}', account.iban)}
                                                </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                                <AlertDialogCancel>{settingsDict.iban.deleteConfirm.cancel}</AlertDialogCancel>
                                                <AlertDialogAction onClick={() => handleDeleteIban(account.id)} className="bg-destructive hover:bg-destructive/90">{settingsDict.iban.deleteConfirm.confirm}</AlertDialogAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>
                                </div>
                                ))
                            ) : (
                                <p className="text-sm text-muted-foreground text-center py-4">{settingsDict.iban.noAccounts}</p>
                            )}
                        </div>
                    </CardContent>
                </Card>

                <form onSubmit={handleGenericSave}>
                    <Card>
                        <CardHeader>
                            <CardTitle>{settingsDict.account.title}</CardTitle>
                            <CardDescription>{settingsDict.account.description}</CardDescription>
                        </CardHeader>
                        <CardContent className="grid gap-4">
                            <div className="grid gap-2">
                                <label htmlFor="current-password">{settingsDict.account.currentPassword}</label>
                                <div className="relative">
                                    <Input id="current-password" name="current-password" type={showCurrentPassword ? "text" : "password"} autoComplete="current-password" />
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
                                    <Input id="new-password" name="new-password" type={showNewPassword ? "text" : "password"} autoComplete="new-password"/>
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
                                    <Input id="confirm-new-password" name="confirm-new-password" type={showConfirmNewPassword ? "text" : "password"} autoComplete="new-password" />
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
                            <Button type="submit">{settingsDict.account.saveButton}</Button>
                        </CardFooter>
                    </Card>
                </form>

                <form onSubmit={handleGenericSave}>
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
                            <Button type="submit">{settingsDict.notifications.saveButton}</Button>
                        </CardFooter>
                    </Card>
                </form>

                <Card>
                    <CardHeader>
                        <CardTitle>{settingsDict.feedback.title}</CardTitle>
                        <CardDescription>{settingsDict.feedback.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-2">
                            <Textarea
                                id="feedback"
                                placeholder={settingsDict.feedback.placeholder}
                                value={feedbackText}
                                onChange={(e) => setFeedbackText(e.target.value)}
                                rows={4}
                            />
                        </div>
                    </CardContent>
                    <CardFooter className="border-t px-6 py-4">
                        <Button onClick={handleFeedbackSubmit} disabled={isSubmitting}>
                            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {settingsDict.feedback.submitButton}
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        </div>
      </main>
    </div>
  );
}
