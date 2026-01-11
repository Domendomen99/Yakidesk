'use client';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import type { Booking, Desk, TimeSlot, UserProfile } from '@/lib/types';
import { format } from 'date-fns';

interface BookingCancellationDialogProps {
  booking: Booking;
  desk?: Desk;
  user?: UserProfile;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (booking: Booking) => void;
  isRootMode?: boolean;
}

const timeSlotLabels: Record<TimeSlot, string> = {
  morning: 'Morning (9 AM - 1 PM)',
  afternoon: 'Afternoon (2 PM - 6 PM)',
  'full-day': 'Full Day (9 AM - 6 PM)',
};

export default function BookingCancellationDialog({
  booking,
  desk,
  user,
  isOpen,
  onOpenChange,
  onConfirm,
  isRootMode = false,
}: BookingCancellationDialogProps) {
  const handleConfirm = () => {
    onConfirm(booking);
    onOpenChange(false);
  };

  const title = isRootMode ? 'Force Cancel Booking' : 'Cancel Booking';
  const description = isRootMode ? (
    <>
      Are you sure you want to cancel the booking for <strong>{user?.name ?? 'this user'}</strong> on{' '}
      <strong>{desk?.label ?? 'this desk'}</strong>? This action cannot be undone.
    </>
  ) : (
    <>
      Are you sure you want to cancel your booking for <strong>{desk?.label ?? 'this desk'}</strong> on{' '}
      <strong>{format(new Date(booking.date), 'PPP')}</strong> for the{' '}
      <strong>{timeSlotLabels[booking.timeSlot]}</strong> slot?
    </>
  );

  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="font-headline text-2xl">{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Keep Booking</AlertDialogCancel>
          <AlertDialogAction onClick={handleConfirm} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
            Yes, Cancel Booking
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
