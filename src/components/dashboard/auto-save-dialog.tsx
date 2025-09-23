"use client";

import { useState } from "react";
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
import { assets } from "@/lib/data";
import { useToast } from "@/hooks/use-toast";
import type { AutomatedSavingsGoalOutput } from "@/ai/flows/automated-savings-goal-suggestions";

const formSchema = z.object({
  income: z.coerce.number().min(1, "Please enter your monthly income."),
  riskTolerance: z.enum(["low", "medium", "high"], {
    required_error: "You need to select a risk tolerance.",
  }),
  financialGoal: z.string().min(5, "Please describe your financial goal."),
  assets: z.array(z.string()).refine((value) => value.some((item) => item), {
    message: "You have to select at least one asset.",
  }),
});

const availableAssets = Object.values(assets);

export function AutoSaveDialog({ dict }: { dict: any }) {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [suggestion, setSuggestion] =
    useState<AutomatedSavingsGoalOutput | null>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      income: 1000,
      financialGoal: "",
      assets: [],
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      const result = await getAutomatedSavingsGoal(values);
      setSuggestion(result);
      setStep(2);
    } catch (error) {
      toast({
        variant: "destructive",
        title: dict.toastErrorTitle,
        description: dict.toastErrorDescription,
      });
    } finally {
      setIsLoading(false);
    }
  }

  function handleAccept() {
    toast({
      title: dict.toastSuccessTitle,
      description: dict.toastSuccessDescription.replace('{asset}', suggestion?.suggestedAsset),
    });
    resetAndClose();
  }

  function resetAndClose() {
    setIsOpen(false);
    setTimeout(() => {
        form.reset();
        setStep(1);
        setSuggestion(null);
    }, 300);
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Wand2 className="mr-2 h-4 w-4" />
          {dict.title}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {step === 1 ? dict.createTitle : dict.suggestionTitle}
          </DialogTitle>
          <DialogDescription>
            {step === 1
              ? dict.createDescription
              : dict.suggestionDescription}
          </DialogDescription>
        </DialogHeader>

        {step === 1 && (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="financialGoal"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{dict.goalLabel}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={dict.goalPlaceholder}
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
                    <FormLabel>{dict.incomeLabel}</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder={dict.incomePlaceholder} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="riskTolerance"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>{dict.riskLabel}</FormLabel>
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
                          <FormLabel className="font-normal">{dict.riskLow}</FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="medium" />
                          </FormControl>
                          <FormLabel className="font-normal">{dict.riskMedium}</FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="high" />
                          </FormControl>
                          <FormLabel className="font-normal">{dict.riskHigh}</FormLabel>
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
                    <div className="mb-4">
                      <FormLabel>{dict.assetsLabel}</FormLabel>
                    </div>
                    {availableAssets.map((item) => (
                      <FormField
                        key={item.symbol}
                        control={form.control}
                        name="assets"
                        render={({ field }) => {
                          return (
                            <FormItem
                              key={item.symbol}
                              className="flex flex-row items-start space-x-3 space-y-0"
                            >
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(item.name)}
                                  onCheckedChange={(checked) => {
                                    return checked
                                      ? field.onChange([
                                          ...field.value,
                                          item.name,
                                        ])
                                      : field.onChange(
                                          field.value?.filter(
                                            (value) => value !== item.name
                                          )
                                        );
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="font-normal">
                                {item.name}
                              </FormLabel>
                            </FormItem>
                          );
                        }}
                      />
                    ))}
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button type="submit" disabled={isLoading}>
                  {isLoading && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  {dict.generateButton}
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
                    __html: dict.suggestionCardDescription
                      .replace('{amount}', suggestion.suggestedAmount)
                      .replace('{asset}', suggestion.suggestedAsset),
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
               <Button variant="ghost" onClick={() => setStep(1)}>{dict.backButton}</Button>
               <Button onClick={handleAccept}>{dict.acceptButton}</Button>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
