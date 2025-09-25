
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
import { getIbanAccounts, type IbanAccount } from '@/lib/data';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function DepositPage() {
  const params = useParams();
  const lang = params.lang as 'tr' | 'en';
  const dict = getDictionary(lang);
  const depositDict = dict.depositPage;

  const [ibanAccounts, setIbanAccounts] = useState<IbanAccount[]>([]);
  const [selectedIban, setSelectedIban] = useState<string | null>(null);
  const [amount, setAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    setIbanAccounts(getIbanAccounts());
  }, []);

  const handleDeposit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (!selectedIban || !amount || parseFloat(amount) <= 0) {
      toast({
        variant: "destructive",
        title: depositDict.toast.error.title,
        description: depositDict.toast.error.invalidInput,
      });
      setIsLoading(false);
      return;
    }

    // Simulate API call
    setTimeout(() => {
      toast({
        title: depositDict.toast.success.title,
        description: depositDict.toast.success.description.replace('{amount}', parseFloat(amount).toLocaleString('tr-TR')),
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
              <form onSubmit={handleDeposit} className="grid gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="amount">{depositDict.amountLabel}</Label>
                  <Input
                    id="amount"
                    type="number"
                    placeholder="1000"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="iban-select">{depositDict.ibanLabel}</Label>
                  {ibanAccounts.length > 0 ? (
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
                <Button type="submit" className="w-full" disabled={isLoading || ibanAccounts.length === 0}>
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

