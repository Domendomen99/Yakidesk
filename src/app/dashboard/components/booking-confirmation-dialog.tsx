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

interface BookingConfirmationDialogProps {
  desk: Desk;
  date: Date;
  bookings: Booking[];
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (desk: Desk, timeSlot: TimeSlot) => void;
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
}: BookingConfirmationDialogProps) {
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<TimeSlot | null>(null);

  const formattedDate = format(date, 'yyyy-MM-dd');

  const availableSlots = useMemo(() => {
    const deskBookingsForDate = bookings.filter(b => b.deskId === desk.id && b.date === formattedDate);
    const bookedSlots = deskBookingsForDate.map(b => b.timeSlot);

    return timeSlots.filter(slot => {
      if (bookedSlots.includes(slot.id)) return false;
      if (bookedSlots.includes('full-day')) return false;
      if (slot.id === 'full-day' && bookedSlots.length > 0) return false;
      return true;
    });
  }, [desk.id, formattedDate, bookings]);

  useEffect(() => {
    // Pre-select the first available slot if available
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

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="font-headline text-2xl">Confirm Booking</DialogTitle>
          <DialogDescription>
            You are booking <strong>{desk.label}</strong> for <strong>{format(date, 'PPP')}</strong>.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <h3 className="mb-4 text-sm font-medium text-foreground">Select an available time slot:</h3>
          <RadioGroup
            value={selectedTimeSlot ?? ''}
            onValueChange={(value) => setSelectedTimeSlot(value as TimeSlot)}
            className="space-y-3"
          >
            {availableSlots.map((slot) => (
              <Label
                key={slot.id}
                htmlFor={slot.id}
                className="flex items-center space-x-3 p-3 rounded-md border border-border has-[:checked]:border-primary has-[:checked]:bg-primary/10 transition-colors cursor-pointer"
              >
                <RadioGroupItem value={slot.id} id={slot.id} />
                <span>{slot.label}</span>
              </Label>
            ))}
             {availableSlots.length === 0 && (
              <p className="text-sm text-muted-foreground p-3 text-center">No available slots for this desk on the selected date.</p>
            )}
          </RadioGroup>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => handleOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleConfirm} disabled={!selectedTimeSlot}>
            Confirm Booking
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
