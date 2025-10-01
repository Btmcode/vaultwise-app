
"use client";

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { getDictionary } from '@/app/dictionaries';
import { Header } from '@/components/header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from "@/hooks/use-toast";
import { getIbanAccounts } from '@/lib/firebase/firestore';
import type { IbanAccount } from '@/lib/types';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2, AlertTriangle, ArrowLeft, Banknote } from 'lucide-react';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default function DepositPage() {
  const params = useParams();
  const lang = params.lang as 'tr' | 'en';
  const dict = getDictionary(lang);
  const depositDict = dict.depositPage;

  const [ibanAccounts, setIbanAccounts] = useState<IbanAccount[]>([]);
  const [selectedIban, setSelectedIban] = useState<string | null>(null);
  const [amount, setAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingIbans, setIsLoadingIbans] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    async function fetchIbans() {
        setIsLoadingIbans(true);
        const accounts = await getIbanAccounts();
        setIbanAccounts(accounts);
        setIsLoadingIbans(false);
    }
    fetchIbans();
  }, []);

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/[^\d]/g, '');
    if (rawValue) {
        const numericValue = parseInt(rawValue, 10);
        setAmount(numericValue.toLocaleString('tr-TR'));
    } else {
        setAmount('');
    }
  };

  const handleDeposit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const numericAmount = parseFloat(amount.replace(/\./g, ''));
    
    if (!selectedIban || !amount || isNaN(numericAmount) || numericAmount <= 0) {
      toast({
        variant: "destructive",
        title: depositDict.toast.error.title,
        description: depositDict.toast.error.invalidInput,
      });
      return;
    }

    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      toast({
        variant: "success",
        title: depositDict.toast.success.title,
        description: depositDict.toast.success.description.replace('{amount}', numericAmount.toLocaleString('tr-TR')),
      });
      setAmount('');
      setSelectedIban(null);
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <Header lang={lang} dict={dict.header} />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="mx-auto grid w-full max-w-2xl gap-2">
           <Link href={`/${lang}/dashboard`} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-2">
              <ArrowLeft className="h-4 w-4" />
              {dict.backToDashboard}
            </Link>
          <h1 className="text-3xl font-semibold">{depositDict.title}</h1>
          <p className="text-muted-foreground">{depositDict.description}</p>
        </div>
        <div className="mx-auto w-full max-w-2xl">
          <Card>
            <CardHeader>
              <CardTitle>{depositDict.cardTitle}</CardTitle>
              <CardDescription>{depositDict.cardDescription}</CardDescription>
            </CardHeader>
            <CardContent>
                {lang === 'tr' && (
                    <Alert className="mb-6">
                        <AlertTriangle className="h-4 w-4" />
                        <AlertTitle>{depositDict.identityWarning.title}</AlertTitle>
                        <AlertDescription>
                            {depositDict.identityWarning.description}
                        </AlertDescription>
                    </Alert>
                )}
              <form onSubmit={handleDeposit} className="grid gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="amount">{depositDict.amountLabel}</Label>
                  <div className="relative">
                     <Banknote className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                     <Input
                        id="amount"
                        type="text"
                        placeholder="1.000"
                        value={amount}
                        onChange={handleAmountChange}
                        className="pl-10"
                      />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="iban-select">{depositDict.ibanLabel}</Label>
                  {isLoadingIbans ? (
                     <div className="text-center py-4"><Loader2 className="mx-auto h-6 w-6 animate-spin text-muted-foreground"/></div>
                  ) : ibanAccounts.length > 0 ? (
                    <Select onValueChange={setSelectedIban} value={selectedIban || undefined}>
                      <SelectTrigger id="iban-select">
                        <SelectValue placeholder={depositDict.ibanPlaceholder} />
                      </SelectTrigger>
                      <SelectContent>
                        {ibanAccounts.map(account => (
                          <SelectItem key={account.id} value={account.id}>
                            <span className="font-medium">{account.accountHolder}</span> - <span className="text-muted-foreground">{account.iban}</span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                     <p className="text-sm text-muted-foreground">
                        {depositDict.noIban} <Link href={`/${lang}/settings`} className="text-primary underline">{dict.header.settings}</Link>
                    </p>
                  )}
                </div>
                <Button type="submit" className="w-full" disabled={isLoading || isLoadingIbans || ibanAccounts.length === 0}>
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {depositDict.button}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
