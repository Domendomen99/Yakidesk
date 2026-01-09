'use client';

import { useState } from 'react';
import { format, addDays, subDays, isBefore, startOfToday } from 'date-fns';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import { collection, doc, addDoc, writeBatch } from 'firebase/firestore';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import type { Booking, Desk, TimeSlot } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import DeskMap from './desk-map';
import { useCollection, useUser, useFirestore, useMemoFirebase, addDocumentNonBlocking } from '@/firebase';
import { initialDesks } from '@/lib/data';

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
    // Note: This only fetches bookings for the current user. 
    // To show all bookings for availability, we'd need a different query and rules.
    return collection(firestore, 'users', user.uid, 'bookings');
  }, [firestore, user]);

  const { data: desksFromFirestore, isLoading: isLoadingDesks } = useCollection<Desk>(desksQuery);
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

  const seedDesks = async () => {
    if (!firestore) {
      toast({ title: "Firestore not available", variant: 'destructive' });
      return;
    }
    const batch = writeBatch(firestore);
    const desksCol = collection(firestore, 'desks');

    initialDesks.forEach((desk) => {
      const deskRef = doc(desksCol, desk.id);
      batch.set(deskRef, desk);
    });

    try {
      await batch.commit();
      toast({ title: "Success!", description: "Desks have been seeded to Firestore." });
    } catch (e: any) {
      toast({ title: "Error seeding desks", description: e.message, variant: 'destructive' });
      console.error(e);
    }
  }
  
  // Use Firestore desks if available, otherwise fall back to initial local data
  const currentDesks = (desksFromFirestore && desksFromFirestore.length > 0) ? desksFromFirestore : initialDesks;
  const currentBookings = bookings || [];
  const isLoading = isLoadingDesks || isLoadingBookings;

  if (isLoading && desksFromFirestore === null) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <p>Loading desks...</p>
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
      />
      
      {(!desksFromFirestore || desksFromFirestore.length === 0) && (
        <div className="absolute bottom-4 right-4">
          <Button onClick={seedDesks} variant="destructive">Seed Desks in Firestore</Button>
        </div>
      )}
    </div>
  );
}
