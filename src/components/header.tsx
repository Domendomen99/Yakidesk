'use client';

import Link from 'next/link';
import { LogOut, User as UserIcon } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Logo } from '@/components/logo';
import { useAuth, useUser } from '@/firebase';
import { signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';

export function Header() {
  const { user, isUserLoading } = useUser();
  const auth = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    if (auth) {
      await signOut(auth);
      router.push('/login');
    }
  };
  
  const handleMyBookings = () => {
    // Placeholder for future implementation
    console.log("My Bookings clicked");
  }
  
  const handleProfile = () => {
    // Placeholder for future implementation
    console.log("Profile clicked");
  }


  const userAvatar = user?.photoURL;
  const userName = user?.displayName;
  const userEmail = user?.email;
  
  const getInitials = (name: string | undefined | null) => {
    if (!name) return '??';
    const names = name.split(' ');
    if (names.length > 1) {
      return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const userInitials = getInitials(userName);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-7xl items-center">
        <div className="flex-1 flex items-center">
          <Link href="/dashboard" className="flex items-center space-x-2">
            <Logo className="h-8 w-8 text-primary" />
            <span className="font-bold text-lg font-headline">Yakidesk</span>
          </Link>
        </div>
        
        <div className="flex-none">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="relative h-9 w-9 rounded-full"
                disabled={isUserLoading}
              >
                <Avatar className="h-9 w-9">
                  {userAvatar && <AvatarImage src={userAvatar} alt={userName ?? 'User Avatar'} />}
                  <AvatarFallback>{userInitials}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {userName ?? 'User'}
                  </p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {userEmail ?? 'No email'}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleProfile}>
                <UserIcon className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleMyBookings}>
                <UserIcon className="mr-2 h-4 w-4" />
                <span>My Bookings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}