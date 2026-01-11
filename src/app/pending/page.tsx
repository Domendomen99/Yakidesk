'use client';

import { useAuth, useUser } from '@/firebase';
import { signOut } from 'firebase/auth';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Logo } from '@/components/logo';

export default function PendingPage() {
  const auth = useAuth();
  const { user } = useUser();

  const handleLogout = async () => {
    if (auth) {
      await signOut(auth);
      // The user will be redirected to the login page automatically by the layout logic
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <div className="flex justify-center mb-4">
            <Logo className="w-16 h-16 text-primary" />
          </div>
          <CardTitle className="text-3xl font-headline text-foreground">
            Approval Pending
          </CardTitle>
          <CardDescription className="pt-2 text-base">
            Welcome, {user?.displayName ?? 'User'}!
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Your account is currently awaiting approval from an administrator. 
            You will be able to access the dashboard once your request has been reviewed.
          </p>
          <p className="text-muted-foreground mt-2">
            Thank you for your patience.
          </p>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button variant="outline" onClick={handleLogout}>
            Log Out
          </Button>
        </CardFooter>
      </Card>
    </main>
  );
}
