'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import type { Booking, Desk, TimeSlot } from '@/lib/types';
import { format, isFuture, parseISO } from 'date-fns';
import { CalendarDays, Clock, Trash2 } from 'lucide-react';
import { useMemo } from 'react';

interface MyBookingsDialogProps {
  bookings: Booking[];
  desks: Desk[];
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onCancelBooking: (booking: Booking) => void;
}

const timeSlotLabels: Record<TimeSlot, string> = {
  morning: 'Morning',
  afternoon: 'Afternoon',
  'full-day': 'Full Day',
};

export default function MyBookingsDialog({
  bookings,
  desks,
  isOpen,
  onOpenChange,
  onCancelBooking,
}: MyBookingsDialogProps) {

  const sortedBookings = useMemo(() => {
    return [...bookings].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [bookings]);

  const upcomingBookings = sortedBookings.filter(b => isFuture(parseISO(b.date)) || format(new Date(b.date), 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd'));
  const pastBookings = sortedBookings.filter(b => !upcomingBookings.includes(b));


  const BookingItem = ({ booking }: { booking: Booking }) => {
    const desk = desks.find((d) => d.id === booking.deskId);
    if (!desk) return null;
    
    return (
        <div className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors">
            <div className="flex items-center gap-4">
                <div className="flex flex-col">
                    <span className="font-semibold text-foreground">{desk.label}</span>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <CalendarDays className="h-4 w-4" />
                        <span>{format(new Date(booking.date), 'PPP')}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        <span>{timeSlotLabels[booking.timeSlot]}</span>
                    </div>
                </div>
            </div>
            <Button
                variant="ghost"
                size="icon"
                onClick={() => onCancelBooking(booking)}
                className="text-destructive hover:text-destructive-foreground hover:bg-destructive"
                aria-label="Cancel booking"
            >
                <Trash2 className="h-4 w-4" />
            </Button>
        </div>
    );
  };


  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-headline text-2xl">My Bookings</DialogTitle>
          <DialogDescription>
            Here are all your upcoming and past desk reservations.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[60vh] pr-4">
            {upcomingBookings.length > 0 ? (
                 <div className="space-y-2">
                    <h3 className="font-semibold text-lg text-primary mt-4 mb-2">Upcoming</h3>
                    {upcomingBookings.map((booking) => <BookingItem key={booking.id} booking={booking} />)}
                </div>
            ) : (
                <p className="text-muted-foreground text-center py-8">You have no upcoming bookings.</p>
            )}

            {pastBookings.length > 0 && (
                 <div className="space-y-2 mt-6">
                    <h3 className="font-semibold text-lg text-muted-foreground/80 mt-4 mb-2">Past</h3>
                    {pastBookings.map((booking) => (
                        <div key={booking.id} className="opacity-60">
                             <div className="flex items-center justify-between p-3 rounded-lg">
                                <div className="flex items-center gap-4">
                                    <div className="flex flex-col">
                                        <span className="font-semibold ">{desks.find(d => d.id === booking.deskId)?.label}</span>
                                        <div className="flex items-center gap-2 text-sm ">
                                            <CalendarDays className="h-4 w-4" />
                                            <span>{format(new Date(booking.date), 'PPP')}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </ScrollArea>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="outline">
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
