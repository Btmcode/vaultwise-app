
"use client";

import { useState, useEffect, useMemo } from 'react';
import { useParams } from 'next/navigation';
import { getDictionary } from '@/app/dictionaries';
import { Header } from '@/components/header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from "@/hooks/use-toast";
import { getIbanAccounts, getTransactions, getUserProfile } from '@/lib/firebase/firestore';
import type { IbanAccount, Transaction, UserProfile } from '@/lib/types';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2, Info, Banknote, Landmark, Wallet, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

const TRANSACTION_FEE = 1; // 1 TL
const WITHDRAWAL_LIMIT_24H = 25000000;
const WITHDRAWAL_LIMIT_30D = 9999584.99;

export default function WithdrawPage() {
  const params = useParams();
  const lang = params.lang as 'tr' | 'en';
  const dict = getDictionary(lang);
  const withdrawDict = dict.withdrawPage;

  const [ibanAccounts, setIbanAccounts] = useState<IbanAccount[]>([]);
  const [selectedIban, setSelectedIban] = useState<string | null>(null);
  const [amount, setAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  
  const [profile, setProfile] = useState<Omit<UserProfile, 'portfolio' | 'ibanAccounts' | 'transactions'> | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);

  const [withdrawn24h, setWithdrawn24h] = useState(0);
  const [withdrawn30d, setWithdrawn30d] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
        setIsLoadingData(true);
        const [accounts, userTransactions, userProfile] = await Promise.all([
            getIbanAccounts(),
            getTransactions(),
            getUserProfile()
        ]);
        setIbanAccounts(accounts);
        setTransactions(userTransactions);
        setProfile(userProfile);

        const now = new Date();
        const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

        const withdrawalsLast24h = userTransactions
            .filter(tx => tx.type === 'Withdraw' && new Date(tx.date) > twentyFourHoursAgo)
            .reduce((sum, tx) => sum + tx.amountUsd, 0);

        const withdrawalsLast30d = userTransactions
            .filter(tx => tx.type === 'Withdraw' && new Date(tx.date) > thirtyDaysAgo)
            .reduce((sum, tx) => sum + tx.amountUsd, 0);

        setWithdrawn24h(withdrawalsLast24h);
        setWithdrawn30d(withdrawalsLast30d);
        setIsLoadingData(false);
    }
    fetchData();
  }, []);

  const numericAmount = useMemo(() => parseFloat(amount.replace(/\./g, '').replace(',', '.')) || 0, [amount]);
  const netAmount = useMemo(() => numericAmount > 0 ? numericAmount - TRANSACTION_FEE : 0, [numericAmount]);

  const remaining24h = useMemo(() => Math.max(0, WITHDRAWAL_LIMIT_24H - withdrawn24h), [withdrawn24h]);
  const remaining30d = useMemo(() => Math.max(0, WITHDRAWAL_LIMIT_30D - withdrawn30d), [withdrawn30d]);

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/[^\d]/g, '');
    if (rawValue) {
        const numericValue = parseInt(rawValue, 10);
        setAmount(numericValue.toLocaleString('tr-TR'));
    } else {
        setAmount('');
    }
  };

  const handleWithdraw = (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedIban || isNaN(numericAmount) || numericAmount <= 0) {
      toast({
        variant: "destructive",
        title: withdrawDict.toast.error.title,
        description: withdrawDict.toast.error.invalidInput,
      });
      return;
    }
    
    if (numericAmount < 10) {
        toast({
            variant: "destructive",
            title: withdrawDict.toast.error.title,
            description: withdrawDict.toast.error.minAmount.replace('{min}', '10'),
        });
        return;
    }

    if (profile && numericAmount > profile.availableBalanceTRY) {
        toast({
            variant: "destructive",
            title: withdrawDict.toast.error.title,
            description: withdrawDict.toast.error.insufficientBalance,
        });
        return;
    }

    if (numericAmount > remaining24h) {
        toast({
            variant: "destructive",
            title: withdrawDict.toast.error.title,
            description: withdrawDict.toast.error.limit24h,
        });
        return;
    }

     if (numericAmount > remaining30d) {
        toast({
            variant: "destructive",
            title: withdrawDict.toast.error.title,
            description: withdrawDict.toast.error.limit30d,
        });
        return;
    }


    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      toast({
        variant: "success",
        title: withdrawDict.toast.success.title,
        description: withdrawDict.toast.success.description.replace('{amount}', netAmount.toLocaleString('tr-TR')),
      });
      // In a real app, you would update the user's balance and transaction history here.
      setAmount('');
      setSelectedIban(null);
      setIsLoading(false);
    }, 1000);
  };
  
  const formatTL = (value: number) => {
    return `${value.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} TL`;
  }

  if (isLoadingData) {
      return (
        <div className="flex min-h-screen w-full flex-col bg-background">
            <Header lang={lang} dict={dict.header} />
            <main className="flex flex-1 items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </main>
        </div>
      )
  }

  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <Header lang={lang} dict={dict.header} />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="mx-auto grid w-full max-w-3xl gap-2">
          <Link href={`/${lang}/dashboard`} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-2">
              <ArrowLeft className="h-4 w-4" />
              {dict.backToDashboard}
            </Link>
          <h1 className="text-3xl font-semibold">{withdrawDict.title}</h1>
          <p className="text-muted-foreground">{withdrawDict.description}</p>
        </div>
        <div className="mx-auto grid w-full max-w-3xl items-start gap-6">
            <Card>
                <CardHeader>
                    <CardTitle>{withdrawDict.summary.title}</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center gap-4">
                        <Wallet className="h-10 w-10 text-muted-foreground" />
                        <div>
                            <p className="text-sm text-muted-foreground">{withdrawDict.summary.availableBalance}</p>
                            <p className="text-2xl font-bold">{formatTL(profile?.availableBalanceTRY ?? 0)}</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
          <Card>
            <CardHeader>
              <CardTitle>{withdrawDict.cardTitle}</CardTitle>
              <CardDescription>{withdrawDict.cardDescription}</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleWithdraw} className="grid gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="amount">{withdrawDict.amountLabel}</Label>
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
                 <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="text-muted-foreground">{withdrawDict.transactionFeeLabel}</div>
                    <div className="text-right font-medium">{TRANSACTION_FEE.toLocaleString('tr-TR')} TL</div>
                    <div className="text-muted-foreground">{withdrawDict.netAmountLabel}</div>
                    <div className="text-right font-semibold text-primary">{netAmount > 0 ? netAmount.toLocaleString('tr-TR') : '0'} TL</div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="iban-select">{withdrawDict.ibanLabel}</Label>
                  {ibanAccounts.length > 0 ? (
                    <Select onValueChange={setSelectedIban} value={selectedIban || undefined}>
                      <SelectTrigger id="iban-select">
                        <SelectValue placeholder={withdrawDict.ibanPlaceholder} />
                      </SelectTrigger>
                      <SelectContent>
                        {ibanAccounts.map(account => (
                          <SelectItem key={account.id} value={account.id}>
                            <div className="flex items-center gap-3">
                                <Landmark className="h-4 w-4 text-muted-foreground" />
                                <div>
                                    <span className="font-medium">{account.accountHolder}</span>
                                    <span className="text-muted-foreground ml-2">{account.iban}</span>
                                </div>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                     <p className="text-sm text-muted-foreground">
                        {withdrawDict.noIban} <Link href={`/${lang}/settings`} className="text-primary underline">{dict.header.settings}</Link>
                    </p>
                  )}
                </div>
                <Button type="submit" className="w-full" disabled={isLoading || ibanAccounts.length === 0}>
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {withdrawDict.button}
                </Button>
              </form>
            </CardContent>
          </Card>
          
          <Alert className="bg-blue-50 border-blue-200 dark:bg-blue-950 dark:border-blue-800">
            <Info className="h-4 w-4 !text-blue-600 dark:!text-blue-400" />
            <AlertTitle className="text-blue-800 dark:text-blue-300">{withdrawDict.fastInfo.title}</AlertTitle>
            <AlertDescription className="text-blue-700 dark:text-blue-400">
              {withdrawDict.fastInfo.description}
            </AlertDescription>
          </Alert>

          <div className="text-sm text-muted-foreground space-y-3">
            <h3 className="text-lg font-semibold text-foreground">{withdrawDict.info.title}</h3>
            <ul className="list-disc list-inside space-y-2">
              <li>{withdrawDict.info.personalAccount}</li>
              <li>{withdrawDict.info.limit24h.replace('{amount}', formatTL(remaining24h))}</li>
              <li>{withdrawDict.info.limit30d.replace('{amount}', formatTL(remaining30d))}</li>
              <li>{withdrawDict.info.minWithdrawal.replace('{amount}', '10')}</li>
              <li>{withdrawDict.info.supportedBanks}</li>
              <li>{withdrawDict.info.otherBanks}</li>
            </ul>
          </div>

        </div>
      </main>
    </div>
  );
}
