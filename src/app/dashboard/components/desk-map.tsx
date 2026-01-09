'use client';

import { useState } from 'react';
import type { Booking, Desk, TimeSlot } from '@/lib/types';
import { format } from 'date-fns';
import DeskItem from './desk-item';
import BookingConfirmationDialog from './booking-confirmation-dialog';
import BookingCancellationDialog from './booking-cancellation-dialog';

interface DeskMapProps {
  desks: Desk[];
  bookings: Booking[];
  selectedDate: Date;
  selectedTimeSlot: TimeSlot;
  onBookDesk: (desk: Desk, timeSlot: TimeSlot) => void;
  onCancelBooking: (booking: Booking) => void;
}

export default function DeskMap({
  desks,
  bookings,
  selectedDate,
  selectedTimeSlot,
  onBookDesk,
  onCancelBooking,
}: DeskMapProps) {
  const [selectedDesk, setSelectedDesk] = useState<Desk | null>(null);
  const [bookingToCancel, setBookingToCancel] = useState<Booking | null>(null);

  const [isBookingDialogOpen, setIsBookingDialogOpen] = useState(false);
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);

  const formattedDate = format(selectedDate, 'yyyy-MM-dd');

  const findBookingForDesk = (deskId: string, timeSlot: TimeSlot): Booking | undefined => {
    return bookings.find(
      (booking) =>
        booking.deskId === deskId &&
        booking.date === formattedDate &&
        (booking.timeSlot === timeSlot || booking.timeSlot === 'full-day' || timeSlot === 'full-day')
    );
  };

  const handleDeskClick = (desk: Desk) => {
    const existingBooking = findBookingForDesk(desk.id, selectedTimeSlot);
    if (existingBooking) {
      setBookingToCancel(existingBooking);
      setIsCancelDialogOpen(true);
    } else {
      setSelectedDesk(desk);
      setIsBookingDialogOpen(true);
    }
  };

  const getDeskItem = (desk: Desk) => {
    const booking = findBookingForDesk(desk.id, selectedTimeSlot);
    return <DeskItem key={desk.id} desk={desk} isBooked={!!booking} onClick={() => handleDeskClick(desk)} />;
  };

  const desk1 = desks.find((d) => d.id === 'D1');
  const desk2 = desks.find((d) => d.id === 'D2');
  const desk3 = desks.find((d) => d.id === 'D3');

  return (
    <>
      <div className="p-4 border border-border rounded-lg bg-background/30 w-full">
        <div className="grid grid-cols-2 grid-rows-2 gap-4 h-96">
          {desk1 && <div className="justify-self-start self-start">{getDeskItem(desk1)}</div>}
          {desk2 && <div className="justify-self-end self-start">{getDeskItem(desk2)}</div>}
          {desk3 && <div className="justify-self-start self-end">{getDeskItem(desk3)}</div>}
          {/* Empty cell for bottom right */}
          <div></div>
        </div>
      </div>
      {selectedDesk && (
        <BookingConfirmationDialog
          desk={selectedDesk}
          date={selectedDate}
          bookings={bookings}
          isOpen={isBookingDialogOpen}
          onOpenChange={setIsBookingDialogOpen}
          onConfirm={onBookDesk}
        />
      )}
      {bookingToCancel && (
        <BookingCancellationDialog
          booking={bookingToCancel}
          desk={desks.find((d) => d.id === bookingToCancel.deskId)}
          isOpen={isCancelDialogOpen}
          onOpenChange={setIsCancelDialogOpen}
          onConfirm={onCancelBooking}
        />
      )}
    </>
  );
}
