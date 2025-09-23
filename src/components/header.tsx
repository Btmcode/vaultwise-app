"use client";
import Link from "next/link";
import Image from "next/image";
import { useTheme } from "next-themes";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { VaultWiseLogo } from "@/components/icons";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { User, Settings, LogOut, Languages, Moon, Sun } from "lucide-react";

const userAvatar = PlaceHolderImages.find((img) => img.id === "user-avatar");

export function Header({ lang, dict }: { lang: 'tr' | 'en', dict: any }) {
  const { theme, setTheme } = useTheme();
  const otherLang = lang === 'tr' ? 'en' : 'tr';
  
  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <header className="sticky top-0 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6 z-50">
      <Link href={`/${lang}`} className="flex items-center gap-2 font-semibold" prefetch={false}>
        <VaultWiseLogo className="h-8 w-8 text-primary" />
        <span className="text-xl font-bold">VaultWise</span>
      </Link>
      <div className="flex w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
        <div className="ml-auto flex items-center gap-2">
           <Button variant="ghost" size="icon" onClick={toggleTheme}>
            <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>
           <Button variant="ghost" size="icon" asChild>
            <Link href={`/${otherLang}`} prefetch={false}>
              <Languages />
              <span className="sr-only">Change language</span>
            </Link>
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" size="icon" className="rounded-full">
                {userAvatar && (
                  <Image
                    src={userAvatar.imageUrl}
                    width={40}
                    height={40}
                    alt={userAvatar.description}
                    data-ai-hint={userAvatar.imageHint}
                    className="rounded-full"
                  />
                )}
                <span className="sr-only">Toggle user menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>{dict.myAccount}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href={`/${lang}/profile`} className="cursor-pointer">
                  <User className="mr-2 h-4 w-4" />
                  <span>{dict.profile}</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href={`/${lang}/settings`} className="cursor-pointer">
                  <Settings className="mr-2 h-4 w-4" />
                  <span>{dict.settings}</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <LogOut className="mr-2 h-4 w-4" />
                <span>{dict.logout}</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
