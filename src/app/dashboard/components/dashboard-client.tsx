'use client';

import { useState, useEffect, useMemo } from 'react';
import { format, addDays, subDays, isBefore, startOfToday } from 'date-fns';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, KeyRound, Users } from 'lucide-react';
import { collection, doc, query, where, writeBatch, getDocs, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import type { Booking, Desk, TimeSlot, UserProfile } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import DeskMap from './desk-map';
import { useCollection, useUser, useFirestore, useMemoFirebase, addDocumentNonBlocking, deleteDocumentNonBlocking, setDocumentNonBlocking, useDoc } from '@/firebase';
import MyBookingsDialog from './my-bookings-dialog';
import RootModeDialog from './root-mode-dialog';
import { Header } from '@/components/header';
import UserManagementDialog from './user-management-dialog';
import DisableRootModeDialog from './disable-root-mode-dialog';

export default function DashboardClient() {
  const { toast } = useToast();
  const { user } = useUser();
  const firestore = useFirestore();

  const [date, setDate] = useState<Date>(new Date());
  const [timeSlot, setTimeSlot] = useState<TimeSlot>('morning');
  const [isMyBookingsOpen, setIsMyBookingsOpen] = useState(false);
  const [isRootMode, setIsRootMode] = useState(false);
  const [isRootModeDialogOpen, setIsRootModeDialogOpen] = useState(false);
  const [isDisableRootModeDialogOpen, setIsDisableRootModeDialogOpen] = useState(false);
  const [isUserManagementOpen, setIsUserManagementOpen] = useState(false);

  useEffect(() => {
    if (isRootMode) {
      document.body.classList.add('root-mode');
    } else {
      document.body.classList.remove('root-mode');
    }
  }, [isRootMode]);

  useEffect(() => {
    // Set initial time slot based on current time
    const currentHour = new Date().getHours();
    if (currentHour >= 13) {
      setTimeSlot('afternoon');
    } else {
      setTimeSlot('morning');
    }
  }, []);
  
  const userProfileRef = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return doc(firestore, 'users', user.uid);
  }, [firestore, user]);

  const { data: userProfile } = useDoc<UserProfile>(userProfileRef);
  
  // Set root mode based on user profile
  useEffect(() => {
    if (userProfile?.roles?.includes('root')) {
      setIsRootMode(true);
    } else {
      setIsRootMode(false);
    }
  }, [userProfile]);


  const desksQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return collection(firestore, 'desks');
  }, [firestore]);

  const formattedDate = format(date, 'yyyy-MM-dd');

  const bookingsQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'bookings'), where('date', '==', formattedDate));
  }, [firestore, formattedDate]);
  
  const usersQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return collection(firestore, 'users');
  }, [firestore]);

  const userBookingsQuery = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return query(collection(firestore, 'bookings'), where('userId', '==', user.uid));
  }, [firestore, user]);

  const { data: desks, isLoading: isLoadingDesks } = useCollection<Desk>(desksQuery);
  const { data: bookings, isLoading: isLoadingBookings } = useCollection<Booking>(bookingsQuery);
  const { data: users, isLoading: isLoadingUsers } = useCollection<UserProfile>(usersQuery);
  const { data: userBookings, isLoading: isLoadingUserBookings } = useCollection<Booking>(userBookingsQuery);

  const handleDateChange = (newDate: Date | undefined) => {
    if (newDate) {
      setDate(newDate);
    }
  };
  
   const handleUserCreation = async () => {
    if (!user || !firestore) return;
    const userDocRef = doc(firestore, 'users', user.uid);
    setDocumentNonBlocking(userDocRef, {
      id: user.uid,
      name: user.displayName,
      email: user.email,
      avatarUrl: user.photoURL,
    }, { merge: true });
  };

  const handleBooking = async (desk: Desk, selectedTimeSlot: TimeSlot) => {
    if (!user || !firestore) {
      toast({
        variant: 'destructive',
        title: 'Authentication Error',
        description: 'You must be logged in to book a desk.',
      });
      return;
    }
    
    await handleUserCreation();

    const bookingsCollectionRef = collection(firestore, 'bookings');
    const newBooking = {
      deskId: desk.id,
      userId: user.uid,
      date: format(date, 'yyyy-MM-dd'),
      timeSlot: selectedTimeSlot,
    };
    
    addDocumentNonBlocking(bookingsCollectionRef, newBooking);

    toast({
      title: 'Booking Confirmed!',
      description: `Desk ${desk.label} booked for ${format(date, 'PPP')} (${selectedTimeSlot}).`,
    });
  };


  const handleCancellation = (booking: Booking) => {
    if (!user || !firestore || !booking.id) {
      toast({
        variant: 'destructive',
        title: 'Authentication Error',
        description: 'You must be logged in to cancel a booking.',
      });
      return;
    }
    const bookingDocRef = doc(firestore, 'bookings', booking.id);
    
    deleteDocumentNonBlocking(bookingDocRef);

    toast({
      title: 'Booking Cancelled',
      description: `Your booking for desk ${desks?.find(d => d.id === booking.deskId)?.label} on ${format(new Date(booking.date), 'PPP')} has been cancelled.`,
    });
  };
  
  const handleRootModeToggle = () => {
    if (userProfile?.roles?.includes('root')) {
      setIsDisableRootModeDialogOpen(true);
    } else {
      setIsRootModeDialogOpen(true);
    }
  };

  const handleUserStatusUpdate = async (userId: string, status: 'approved' | 'rejected') => {
    if (!firestore) return;
    const userDocRef = doc(firestore, 'users', userId);
    try {
      await updateDoc(userDocRef, { status });
      toast({
        title: 'User Updated',
        description: `User has been ${status}.`,
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Update Failed',
        description: `Could not update user status.`,
      });
      console.error('Error updating user status:', error);
    }
  };
  
  const handleSetRootRole = async () => {
    if (!user || !firestore) return;
    const userDocRef = doc(firestore, 'users', user.uid);
    try {
      await updateDoc(userDocRef, {
        roles: arrayUnion('root'),
      });
      setIsRootMode(true); // Visually enter root mode immediately
      setIsRootModeDialogOpen(false); // Close the dialog
      toast({
        title: 'Root Privileges Granted!',
        description: 'Your account now has permanent root privileges.',
        className: 'bg-destructive text-destructive-foreground',
      });
    } catch (error) {
       toast({
        variant: 'destructive',
        title: 'Update Failed',
        description: `Could not set root role. See console for details.`,
      });
      console.error('Error setting root role:', error);
    }
  };

  const handleRemoveRootRole = async () => {
    if (!user || !firestore) return;
    const userDocRef = doc(firestore, 'users', user.uid);
    try {
      await updateDoc(userDocRef, {
        roles: arrayRemove('root'),
      });
      setIsRootMode(false); // Visually exit root mode immediately
      setIsDisableRootModeDialogOpen(false); // Close the dialog
      toast({
        title: 'Root Privileges Revoked',
        description: 'Your account no longer has root privileges.',
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Update Failed',
        description: `Could not remove root role. See console for details.`,
      });
      console.error('Error removing root role:', error);
    }
  };


  const currentDesks = desks || [];
  const currentBookings = bookings || [];
  const userProfiles = users || [];
  const allUserBookings = userBookings || [];
  const isLoading = isLoadingDesks || isLoadingBookings || isLoadingUsers || isLoadingUserBookings;

  if (isLoading && desks === null) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <p>Loading desks...</p>
      </div>
    );
  }
  
  if (!isLoading && (!desks || desks.length === 0)) {
     return (
      <div className="flex min-h-screen items-center justify-center bg-background text-center p-4">
        <div>
           <h2 className="text-2xl font-headline mb-4">Welcome to Yakidesk!</h2>
           <p className="text-muted-foreground mb-2">It looks like there are no desks configured in the database.</p>
           <p className="text-muted-foreground">Please add them via the Firestore console to get started.</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Header onMyBookingsClick={() => setIsMyBookingsOpen(true)} />
      <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4 p-4 border border-border rounded-lg bg-background/50">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => handleDateChange(subDays(date, 1))}
              disabled={isBefore(date, addDays(startOfToday(), 1))}
              aria-label="Previous day"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={'outline'}
                  className={cn('w-[240px] justify-start text-left font-normal', !date && 'text-muted-foreground')}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, 'PPP') : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={handleDateChange}
                  disabled={(d) => isBefore(d, startOfToday())}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            <Button variant="outline" size="icon" onClick={() => handleDateChange(addDays(date, 1))} aria-label="Next day">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          <Tabs value={timeSlot} onValueChange={(value) => setTimeSlot(value as TimeSlot)} className="w-full md:w-auto">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="morning">Morning</TabsTrigger>
              <TabsTrigger value="afternoon">Afternoon</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <DeskMap
          desks={currentDesks}
          bookings={currentBookings}
          users={userProfiles}
          selectedDate={date}
          onBookDesk={handleBooking}
          onCancelBooking={handleCancellation}
          currentUser={user}
          timeSlot={timeSlot}
          isRootMode={isRootMode}
        />
        
        <div className="flex justify-end mt-4 gap-2">
           {isRootMode && (
            <Button
              variant="outline"
              onClick={() => setIsUserManagementOpen(true)}
            >
              <Users className="mr-2 h-4 w-4" />
              Manage Users
            </Button>
          )}
           <Button
            variant={isRootMode ? 'destructive' : 'outline'}
            className={cn(
              isRootMode && 'text-destructive-foreground',
              !isRootMode && 'border-destructive text-destructive hover:bg-destructive/10'
            )}
            onClick={handleRootModeToggle}
          >
            <KeyRound className="mr-2 h-4 w-4" />
            {isRootMode ? 'Disable Root' : 'Enable Root'}
          </Button>
        </div>
      </div>
      <MyBookingsDialog
        isOpen={isMyBookingsOpen}
        onOpenChange={setIsMyBookingsOpen}
        bookings={allUserBookings}
        desks={currentDesks}
        onCancelBooking={handleCancellation}
      />
      <RootModeDialog 
        isOpen={isRootModeDialogOpen}
        onOpenChange={setIsRootModeDialogOpen}
        onSuccess={handleSetRootRole}
      />
       <DisableRootModeDialog
        isOpen={isDisableRootModeDialogOpen}
        onOpenChange={setIsDisableRootModeDialogOpen}
        onConfirm={handleRemoveRootRole}
      />
      <UserManagementDialog
        isOpen={isUserManagementOpen}
        onOpenChange={setIsUserManagementOpen}
        users={userProfiles}
        onUserUpdate={handleUserStatusUpdate}
      />
    </>
  );
}

    