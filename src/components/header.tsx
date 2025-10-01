
"use client";
import Link from "next/link";
import { useTheme } from "next-themes";
import { useParams, useRouter } from "next/navigation";
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
import { User, Settings, LogOut, Languages, Moon, Sun, Landmark, ArrowLeftRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useState, useTransition, useEffect } from "react";
import type { FirestoreUser } from "@/lib/types";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { logout } from "@/app/actions";

export function Header({ lang, dict }: { lang: 'tr' | 'en', dict: any }) {
  const { theme, setTheme } = useTheme();
  const params = useParams();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [user, setUser] = useState<FirestoreUser | null>(null);
  
  useEffect(() => {
    async function fetchUserForHeader() {
      const response = await fetch('/api/user');
      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
      } else {
        setUser(null);
      }
    }
    
    fetchUserForHeader();
  }, []);


  const currentLang = (params.lang || 'tr') as 'tr' | 'en';
  const otherLang = currentLang === 'tr' ? 'en' : 'tr';
  
  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const handleLogout = async () => {
    startTransition(async () => {
      await logout();
    });
  };

  return (
    <header className="sticky top-0 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6 z-50">
      <Link href={`/${currentLang}/dashboard`} className="flex items-center gap-2 font-semibold" prefetch={false}>
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
            <Link href={`/${otherLang}/dashboard`} prefetch={false}>
              <Languages />
              <span className="sr-only">Change language</span>
            </Link>
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" size="icon" className="rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user?.photoURL || undefined} alt={user?.name} />
                  <AvatarFallback>{user?.name ? user.name.charAt(0).toUpperCase() : <User className="h-5 w-5" />}</AvatarFallback>
                </Avatar>
                <span className="sr-only">Toggle user menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>{user?.name || dict.myAccount}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href={`/${currentLang}/deposit`} className="cursor-pointer">
                  <Landmark className="mr-2 h-4 w-4" />
                  <span>{dict.deposit}</span>
                </Link>
              </DropdownMenuItem>
               <DropdownMenuItem asChild>
                <Link href={`/${currentLang}/withdraw`} className="cursor-pointer">
                  <ArrowLeftRight className="mr-2 h-4 w-4" />
                  <span>{dict.withdraw}</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href={`/${currentLang}/profile`} className="cursor-pointer">
                  <User className="mr-2 h-4 w-4" />
                  <span>{dict.profile}</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href={`/${currentLang}/settings`} className="cursor-pointer">
                  <Settings className="mr-2 h-4 w-4" />
                  <span>{dict.settings}</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} disabled={isPending} className="cursor-pointer">
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
