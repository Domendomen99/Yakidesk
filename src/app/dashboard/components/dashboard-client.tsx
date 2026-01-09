'use client';

import { useState } from 'react';
import { format, addDays, subDays, isToday, isBefore, startOfToday } from 'date-fns';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import type { Booking, Desk, TimeSlot } from '@/lib/types';
import { initialBookings, initialDesks } from '@/lib/data';
import { useToast } from '@/hooks/use-toast';
import DeskMap from './desk-map';

export default function DashboardClient() {
  const { toast } = useToast();
  const [date, setDate] = useState<Date>(new Date());
  const [timeSlot, setTimeSlot] = useState<TimeSlot>('morning');
  const [bookings, setBookings] = useState<Booking[]>(initialBookings);

  const handleDateChange = (newDate: Date | undefined) => {
    if (newDate) {
      setDate(newDate);
    }
  };

  const handleBooking = (desk: Desk, selectedTimeSlot: TimeSlot) => {
    const newBooking: Booking = {
      id: `B${bookings.length + 1}`,
      deskId: desk.id,
      userId: 'current-user', // Simulated user
      date: format(date, 'yyyy-MM-dd'),
      timeSlot: selectedTimeSlot,
    };

    setBookings([...bookings, newBooking]);

    toast({
      title: 'Booking Confirmed!',
      description: `Desk ${desk.label} booked for ${format(date, 'PPP')} (${selectedTimeSlot}).`,
    });
  };

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
        desks={initialDesks}
        bookings={bookings}
        selectedDate={date}
        selectedTimeSlot={timeSlot}
        onBookDesk={handleBooking}
      />
    </div>
  );
}
