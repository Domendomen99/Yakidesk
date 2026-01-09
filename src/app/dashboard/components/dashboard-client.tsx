'use client';

import { useState } from 'react';
import { format, addDays, subDays, isBefore, startOfToday } from 'date-fns';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import { collection, doc } from 'firebase/firestore';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import type { Booking, Desk, TimeSlot } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import DeskMap from './desk-map';
import { useCollection, useUser, useFirestore, useMemoFirebase, addDocumentNonBlocking, deleteDocumentNonBlocking } from '@/firebase';

export default function DashboardClient() {
  const { toast } = useToast();
  const { user } = useUser();
  const firestore = useFirestore();

  const [date, setDate] = useState<Date>(new Date());
  const [timeSlot, setTimeSlot] = useState<TimeSlot>('morning');
  
  const desksQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return collection(firestore, 'desks');
  }, [firestore]);

  const bookingsQuery = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    // We are fetching all bookings for the user. We will filter them client-side.
    // For a larger scale app, we would query by date.
    return collection(firestore, 'users', user.uid, 'bookings');
  }, [firestore, user]);

  const { data: desks, isLoading: isLoadingDesks } = useCollection<Desk>(desksQuery);
  const { data: bookings, isLoading: isLoadingBookings } = useCollection<Booking>(bookingsQuery);

  const handleDateChange = (newDate: Date | undefined) => {
    if (newDate) {
      setDate(newDate);
    }
  };

  const handleBooking = (desk: Desk, selectedTimeSlot: TimeSlot) => {
    if (!user || !firestore) {
      toast({
        variant: 'destructive',
        title: 'Authentication Error',
        description: 'You must be logged in to book a desk.',
      });
      return;
    }

    const bookingsCollectionRef = collection(firestore, 'users', user.uid, 'bookings');
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
    const bookingDocRef = doc(firestore, 'users', user.uid, 'bookings', booking.id);
    
    deleteDocumentNonBlocking(bookingDocRef);

    toast({
      title: 'Booking Cancelled',
      description: `Your booking for desk ${desks?.find(d => d.id === booking.deskId)?.label} on ${format(new Date(booking.date), 'PPP')} has been cancelled.`,
    });
  };
  
  const currentDesks = desks || [];
  const currentBookings = bookings || [];
  const isLoading = isLoadingDesks || isLoadingBookings;

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
           <p className="text-muted-foreground">Please add them in the Firestore console to get started.</p>
        </div>
      </div>
    );
  }


  return (
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
           <Button variant="ghost" onClick={() => handleDateChange(new Date())} className="hidden sm:inline-flex">
            Today
          </Button>
        </div>

        <Tabs value={timeSlot} onValueChange={(value) => setTimeSlot(value as TimeSlot)}>
          <TabsList className="grid w-full grid-cols-3 md:w-auto">
            <TabsTrigger value="morning">Morning</TabsTrigger>
            <TabsTrigger value="afternoon">Afternoon</TabsTrigger>
            <TabsTrigger value="full-day">Full Day</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <DeskMap
        desks={currentDesks}
        bookings={currentBookings}
        selectedDate={date}
        selectedTimeSlot={timeSlot}
        onBookDesk={handleBooking}
        onCancelBooking={handleCancellation}
        currentUser={user}
      />
      
    </div>
  );
}
