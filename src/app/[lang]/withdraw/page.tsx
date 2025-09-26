
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
import { getIbanAccounts, type IbanAccount } from '@/lib/data';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2, Info, Banknote, Landmark } from 'lucide-react';
import Link from 'next/link';

const TRANSACTION_FEE = 1; // 1 TRY

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

  useEffect(() => {
    setIbanAccounts(getIbanAccounts());
  }, []);

  const numericAmount = useMemo(() => parseFloat(amount.replace(/\./g, '').replace(',', '.')) || 0, [amount]);
  const netAmount = useMemo(() => numericAmount > 0 ? numericAmount - TRANSACTION_FEE : 0, [numericAmount]);

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
    
    if (!selectedIban || !amount || isNaN(numericAmount) || numericAmount <= 10) {
      toast({
        variant: "destructive",
        title: withdrawDict.toast.error.title,
        description: withdrawDict.toast.error.invalidInput.replace('{min}', '10'),
      });
      return;
    }

    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      toast({
        title: withdrawDict.toast.success.title,
        description: withdrawDict.toast.success.description.replace('{amount}', netAmount.toLocaleString('tr-TR')),
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
        <div className="mx-auto grid w-full max-w-3xl gap-2">
          <h1 className="text-3xl font-semibold">{withdrawDict.title}</h1>
          <p className="text-muted-foreground">{withdrawDict.description}</p>
        </div>
        <div className="mx-auto grid w-full max-w-3xl items-start gap-6">
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
                    <div className="text-right font-medium">{TRANSACTION_FEE.toLocaleString('tr-TR')} TRY</div>
                    <div className="text-muted-foreground">{withdrawDict.netAmountLabel}</div>
                    <div className="text-right font-semibold text-primary">{netAmount > 0 ? netAmount.toLocaleString('tr-TR') : '0'} TRY</div>
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
              <li>{withdrawDict.info.limit24h.replace('{amount}', '25,000,000.00')}</li>
              <li>{withdrawDict.info.limit30d.replace('{amount}', '99,999,584.99')}</li>
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

    