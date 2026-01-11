'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser, useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { doc, setDoc } from 'firebase/firestore';
import type { UserProfile } from '@/lib/types';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();
  const router = useRouter();

  const userProfileRef = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return doc(firestore, 'users', user.uid);
  }, [firestore, user]);

  const { data: userProfile, isLoading: isProfileLoading } = useDoc<UserProfile>(userProfileRef);

  const [isAccessChecked, setIsAccessChecked] = useState(false);

  useEffect(() => {
    // 1. Redirect unauthenticated users
    if (!isUserLoading && !user) {
      router.push('/login');
      return;
    }

    // 2. Wait for profile to load
    if (isUserLoading || isProfileLoading) {
      return; // Wait until we have user and profile info
    }

    // 3. Handle user with loaded profile
    if (userProfile) {
      if (userProfile.status === 'approved') {
        setIsAccessChecked(true); // Access granted
      } else {
        router.push('/pending'); // Redirect pending/rejected users
      }
    } else if (user && !isProfileLoading) {
      // 4. Handle existing users without a status field (backward compatibility)
      // This case handles users created before the 'status' field was introduced.
      const legacyUserProfileRef = doc(firestore, 'users', user.uid);
      // We grant them access and update their profile to 'approved'.
      setDoc(legacyUserProfileRef, { status: 'approved' }, { merge: true })
        .then(() => {
          setIsAccessChecked(true); // Grant access after updating profile
        })
        .catch(error => {
          console.error("Error updating legacy user profile:", error);
          // Decide on fallback behavior, e.g., redirect to an error page
        });
    }

  }, [user, isUserLoading, userProfile, isProfileLoading, router, firestore]);

  if (!isAccessChecked) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <p>Verifying access...</p>
      </div>
    );
  }

  // User is approved, render the dashboard
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <main className="flex-1">{children}</main>
    </div>
  );
}
