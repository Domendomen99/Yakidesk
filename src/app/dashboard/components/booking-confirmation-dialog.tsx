'use client';

import { useState, useMemo, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import type { Booking, Desk, TimeSlot } from '@/lib/types';
import { format } from 'date-fns';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Terminal } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BookingConfirmationDialogProps {
  desk: Desk;
  date: Date;
  bookings: Booking[];
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (desk: Desk, timeSlot: TimeSlot) => void;
  isRootMode?: boolean;
  conflictingBooking?: Booking;
}

const timeSlots: { id: TimeSlot; label: string }[] = [
  { id: 'morning', label: 'Morning (9 AM - 1 PM)' },
  { id: 'afternoon', label: 'Afternoon (2 PM - 6 PM)' },
  { id: 'full-day', label: 'Full Day (9 AM - 6 PM)' },
];

export default function BookingConfirmationDialog({
  desk,
  date,
  bookings,
  isOpen,
  onOpenChange,
  onConfirm,
  isRootMode = false,
  conflictingBooking,
}: BookingConfirmationDialogProps) {
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<TimeSlot | null>(null);

  const formattedDate = format(date, 'yyyy-MM-dd');

  const availableSlots = useMemo(() => {
    if (isRootMode) {
      return timeSlots; // Root can see all slots
    }
    const deskBookingsForDate = bookings.filter(b => b.deskId === desk.id && b.date === formattedDate);
    const bookedSlots = deskBookingsForDate.map(b => b.timeSlot);

    return timeSlots.filter(slot => {
      if (bookedSlots.includes(slot.id)) return false;
      if (bookedSlots.includes('full-day')) return false;
      if (slot.id === 'full-day' && bookedSlots.length > 0) return false;
      return true;
    });
  }, [desk.id, formattedDate, bookings, isRootMode]);

  useEffect(() => {
    if (isOpen && availableSlots.length > 0) {
      setSelectedTimeSlot(availableSlots[0].id);
    } else {
      setSelectedTimeSlot(null);
    }
  }, [isOpen, availableSlots]);
  
  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setSelectedTimeSlot(null);
    }
    onOpenChange(open);
  };

  const handleConfirm = () => {
    if (selectedTimeSlot) {
      onConfirm(desk, selectedTimeSlot);
      handleOpenChange(false);
    }
  };

  const showConflictWarning = isRootMode && selectedTimeSlot && (
    bookings.some(b => b.deskId === desk.id && b.date === formattedDate && (b.timeSlot === selectedTimeSlot || b.timeSlot === 'full-day' || selectedTimeSlot === 'full-day'))
  );


  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="font-headline text-2xl">
            {isRootMode ? 'Root Booking Override' : 'Confirm Booking'}
          </DialogTitle>
          <DialogDescription>
            You are booking <strong>{desk.label}</strong> for <strong>{format(date, 'PPP')}</strong>.
            {isRootMode && " As root, you can override existing bookings."}
          </DialogDescription>
        </DialogHeader>

        {showConflictWarning && (
          <Alert variant="destructive">
            <Terminal className="h-4 w-4" />
            <AlertTitle>Override Warning</AlertTitle>
            <AlertDescription>
              This will cancel the existing booking for this slot and create your own.
            </AlertDescription>
          </Alert>
        )}

        <div className="py-4">
          <h3 className="mb-4 text-sm font-medium text-foreground">
            {availableSlots.length > 0 ? 'Select a time slot:' : 'No available slots'}
          </h3>
          <RadioGroup
            value={selectedTimeSlot ?? ''}
            onValueChange={(value) => setSelectedTimeSlot(value as TimeSlot)}
            className="space-y-3"
          >
            {availableSlots.map((slot) => {
              const isBooked = bookings.some(b => b.deskId === desk.id && b.date === formattedDate && (b.timeSlot === slot.id || b.timeSlot === 'full-day' || slot.id === 'full-day'));
              return (
              <Label
                key={slot.id}
                htmlFor={slot.id}
                className={cn(
                  "flex items-center space-x-3 p-3 rounded-md border border-border has-[:checked]:border-primary has-[:checked]:bg-primary/10 transition-colors cursor-pointer",
                  isBooked && isRootMode && "border-destructive/50 text-destructive/80"
                )}
              >
                <RadioGroupItem value={slot.id} id={slot.id} />
                <span>{slot.label} {isBooked && isRootMode && "(Booked)"}</span>
              </Label>
            )})}
             {availableSlots.length === 0 && !isRootMode &&(
              <p className="text-sm text-muted-foreground p-3 text-center">No available slots for this desk on the selected date.</p>
            )}
          </RadioGroup>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => handleOpenChange(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleConfirm} 
            disabled={!selectedTimeSlot}
            className={isRootMode ? 'bg-destructive text-destructive-foreground hover:bg-destructive/90' : ''}
          >
            {isRootMode ? 'Force Confirm' : 'Confirm Booking'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
