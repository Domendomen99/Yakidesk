'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { useAuth, useUser, useFirestore, addDocumentNonBlocking } from '@/firebase';
import { doc, getDoc } from 'firebase/firestore';

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
      router.push('/dashboard');
    }
  }, [user, isUserLoading, router]);

  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const signedInUser = result.user;

      // After sign-in, check if the user document exists and create it if it doesn't.
      const userDocRef = doc(firestore, 'users', signedInUser.uid);
      const userDoc = await getDoc(userDocRef);
      
      if (!userDoc.exists()) {
        const newUserProfile = {
          id: signedInUser.uid,
          name: signedInUser.displayName,
          email: signedInUser.email,
          avatarUrl: signedInUser.photoURL,
        };
        // Use non-blocking write. The security rule will protect this operation.
        addDocumentNonBlocking(userDocRef, newUserProfile);
      }

      // The useEffect hook will handle the redirection.
    } catch (error) {
      console.error('Error during Google sign-in:', error);
    }
  };
  
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
