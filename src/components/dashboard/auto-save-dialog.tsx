
"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { getAutomatedSavingsGoal } from "@/app/actions";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2, Wand2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { AutomatedSavingsGoalOutput } from "@/lib/types";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useParams } from "next/navigation";


const formSchema = z.object({
  income: z.coerce.number().min(1, "Please enter your monthly income."),
  riskTolerance: z.enum(["low", "medium", "high"], {
    required_error: "You need to select a risk tolerance.",
  }),
  financialGoal: z.string().min(5, "Please describe your financial goal.").optional().or(z.literal('')),
  assets: z.array(z.string()).refine((value) => value.some((item) => item), {
    message: "You have to select at least one asset.",
  }),
});


export function AutoSaveDialog({ dict }: { dict: any }) {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [suggestion, setSuggestion] =
    useState<AutomatedSavingsGoalOutput | null>(null);
  const { toast } = useToast();
  const params = useParams();
  const lang = params.lang as 'tr' | 'en';
  
  const autoSaveDialogDict = dict.portfolioSummary.autoSaveDialog;
  const assetNames = dict.assetNames;
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      income: 1000,
      financialGoal: "",
      assets: [],
    },
  });

  const availableAssets = Object.keys(assetNames).filter(symbol => symbol !== 'USD_TRY');


  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      const assetSymbols = values.assets.map(assetName => {
        const assetKey = Object.keys(assetNames).find(key => assetNames[key] === assetName);
        return assetKey || assetName;
      });

      const result = await getAutomatedSavingsGoal({
        income: values.income,
        riskTolerance: values.riskTolerance,
        financialGoal: values.financialGoal || 'General savings',
        assets: assetSymbols,
        language: lang,
      });
      setSuggestion(result);
      setStep(2);
    } catch (error) {
      console.error("Error generating suggestion:", error);
      toast({
        variant: "destructive",
        title: autoSaveDialogDict.toastErrorTitle,
        description: autoSaveDialogDict.toastErrorDescription,
      });
    } finally {
      setIsLoading(false);
    }
  }

  function handleAccept() {
    if (!suggestion) return;

    // In a real app, you'd save this to a database
    console.log("Accepted Plan:", {
        assetSymbol: suggestion.suggestedAsset,
        amount: suggestion.suggestedAmount,
    });

    toast({
      variant: "success",
      title: autoSaveDialogDict.toastSuccessTitle,
      description: autoSaveDialogDict.toastSuccessDescription.replace('{asset}', suggestion?.suggestedAsset),
    });
    
    resetAndClose();
  }

  function resetAndClose() {
    setIsOpen(false);
    // Add a small delay to allow the closing animation to finish before resetting state
    setTimeout(() => {
        form.reset();
        setStep(1);
        setSuggestion(null);
    }, 300);
  }

  const getAssetName = (symbol: string) => {
    return assetNames[symbol] || symbol;
  }

  const suggestedAssetName = suggestion?.suggestedAsset ? getAssetName(suggestion.suggestedAsset) : '';


  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if(!open) resetAndClose(); else setIsOpen(true);}}>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Wand2 className="h-4 w-4" />
                <span className="sr-only">{autoSaveDialogDict.title}</span>
              </Button>
            </DialogTrigger>
          </TooltipTrigger>
          <TooltipContent>
            <p>{autoSaveDialogDict.title}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {step === 1 ? autoSaveDialogDict.createTitle : autoSaveDialogDict.suggestionTitle}
          </DialogTitle>
          <DialogDescription>
            {step === 1
              ? autoSaveDialogDict.createDescription
              : autoSaveDialogDict.suggestionDescription}
          </DialogDescription>
        </DialogHeader>

        {step === 1 && (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
              <FormField
                control={form.control}
                name="financialGoal"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{autoSaveDialogDict.goalLabel}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={autoSaveDialogDict.goalPlaceholder}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="income"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{autoSaveDialogDict.incomeLabel}</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder={autoSaveDialogDict.incomePlaceholder} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="riskTolerance"
                render={({ field }) => (
                  <FormItem className="space-y-1">
                    <FormLabel>{autoSaveDialogDict.riskLabel}</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex flex-col space-y-1"
                      >
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="low" />
                          </FormControl>
                          <FormLabel className="font-normal">{autoSaveDialogDict.riskLow}</FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="medium" />
                          </FormControl>
                          <FormLabel className="font-normal">{autoSaveDialogDict.riskMedium}</FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="high" />
                          </FormControl>
                          <FormLabel className="font-normal">{autoSaveDialogDict.riskHigh}</FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="assets"
                render={() => (
                  <FormItem>
                    <div className="mb-2">
                      <FormLabel>{autoSaveDialogDict.assetsLabel}</FormLabel>
                    </div>
                    {availableAssets.map((symbol) => {
                      if (!symbol) return null;
                      const assetName = getAssetName(symbol);
                      return (
                      <FormField
                        key={symbol}
                        control={form.control}
                        name="assets"
                        render={({ field }) => {
                          return (
                            <FormItem
                              key={symbol}
                              className="flex flex-row items-start space-x-3 space-y-0 mb-1"
                            >
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(assetName)}
                                  onCheckedChange={(checked) => {
                                    return checked
                                      ? field.onChange([
                                          ...field.value,
                                          assetName,
                                        ])
                                      : field.onChange(
                                          field.value?.filter(
                                            (value) => value !== assetName
                                          )
                                        );
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="font-normal">
                                {assetName}
                              </FormLabel>
                            </FormItem>
                          );
                        }}
                      />
                    )})}
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter className="pt-4">
                <Button type="submit" disabled={isLoading}>
                  {isLoading && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  {autoSaveDialogDict.generateButton}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        )}

        {step === 2 && suggestion && (
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>{suggestion.suggestedGoal}</CardTitle>
                <CardDescription
                  dangerouslySetInnerHTML={{
                    __html: autoSaveDialogDict.suggestionCardDescription
                      .replace('{amount}', suggestion.suggestedAmount.toString())
                      .replace('{asset}', suggestedAssetName),
                  }}
                />
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {suggestion.rationale}
                </p>
              </CardContent>
            </Card>
            <DialogFooter className="sm:justify-between">
               <Button variant="ghost" onClick={() => setStep(1)}>{autoSaveDialogDict.backButton}</Button>
               <Button onClick={handleAccept}>{autoSaveDialogDict.acceptButton}</Button>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
