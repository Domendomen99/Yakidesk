'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { useAuth, useUser, useFirestore } from '@/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Logo } from '@/components/logo';

export default function LoginPage() {
  const auth = useAuth();
  const firestore = useFirestore();
  const { user, isUserLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!isUserLoading && user) {
      // User is logged in, but we need to check their profile status
      // This check is now handled in the DashboardLayout, so we just redirect.
      router.push('/dashboard');
    }
  }, [user, isUserLoading, router]);

  const handleGoogleSignIn = async () => {
    if (!auth || !firestore) return;
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const signedInUser = result.user;

      const userDocRef = doc(firestore, 'users', signedInUser.uid);
      const userDoc = await getDoc(userDocRef);
      
      if (!userDoc.exists()) {
        // This is a new user, create their profile with 'pending' status
        const newUserProfile = {
          id: signedInUser.uid,
          name: signedInUser.displayName,
          email: signedInUser.email,
          avatarUrl: signedInUser.photoURL,
          status: 'pending',
          roles: [],
        };
        // We use a blocking write here because the subsequent navigation depends on it.
        await setDoc(userDocRef, newUserProfile);
      }
      
      // After sign-in, the useEffect will trigger the redirection to the dashboard,
      // where the layout will handle the status check.
    } catch (error) {
      console.error('Error during Google sign-in:', error);
    }
  };
  
  // Show a loading indicator while checking auth state or if the user is already logged in
  if (isUserLoading || (!isUserLoading && user)) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <Logo className="w-16 h-16 text-primary" />
          </div>
          <CardTitle className="text-4xl font-headline text-foreground">
            Yakidesk
          </CardTitle>
          <CardDescription className="pt-2 text-base">
            Welcome! Please sign in to book your desk.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <Button
              onClick={handleGoogleSignIn}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-6 text-base"
            >
              Sign in with Google
            </Button>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
