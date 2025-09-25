
"use client";
import Link from "next/link";
import Image from "next/image";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
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
import { User, Settings, LogOut, Languages, Moon, Sun, Landmark, ArrowLeftRight } from "lucide-react";
import { auth } from "@/lib/firebase/client";
import { signOut } from "firebase/auth";
import { useToast } from "@/hooks/use-toast";

const userAvatar = PlaceHolderImages.find((img) => img.id === "user-avatar");

export function Header({ lang, dict }: { lang: 'tr' | 'en', dict: any }) {
  const { theme, setTheme } = useTheme();
  const router = useRouter();
  const { toast } = useToast();
  const otherLang = lang === 'tr' ? 'en' : 'tr';
  
  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const handleLogout = async () => {
    try {
      // Clear the client-side token
      await signOut(auth);
      
      // Call the API route to clear the server-side session cookie
      await fetch('/api/auth/logout', { method: 'POST' });

      toast({
        title: "Success",
        description: "You have been logged out.",
      });

      // Redirect to the login page after a short delay to ensure cookie is cleared
      setTimeout(() => {
        window.location.href = `/${lang}/login`;
      }, 500);

    } catch (error) {
      console.error("Logout Error:", error);
      toast({
        variant: "destructive",
        title: "Logout Failed",
        description: "An error occurred while logging out. Please try again.",
      });
    }
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
                  <div className="relative h-9 w-9">
                    <Image
                      src={userAvatar.imageUrl}
                      fill
                      sizes="36px"
                      alt={userAvatar.description}
                      data-ai-hint={userAvatar.imageHint}
                      className="rounded-full object-cover"
                    />
                  </div>
                )}
                <span className="sr-only">Toggle user menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>{dict.myAccount}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href={`/${lang}/deposit`} className="cursor-pointer">
                  <Landmark className="mr-2 h-4 w-4" />
                  <span>{dict.deposit}</span>
                </Link>
              </DropdownMenuItem>
               <DropdownMenuItem asChild>
                <Link href={`/${lang}/withdraw`} className="cursor-pointer">
                  <ArrowLeftRight className="mr-2 h-4 w-4" />
                  <span>{dict.withdraw}</span>
                </Link>
              </DropdownMenuItem>
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
              <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
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
