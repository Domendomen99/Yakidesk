'use client';

import { useState } from 'react';
import type { Booking, Desk, TimeSlot, UserProfile } from '@/lib/types';
import DeskItem from './desk-item';
import BookedDeskItem from './booked-desk-item';
import BookingConfirmationDialog from './booking-confirmation-dialog';
import BookingCancellationDialog from './booking-cancellation-dialog';
import type { User } from 'firebase/auth';

interface DeskMapProps {
  desks: Desk[];
  bookings: Booking[];
  users: UserProfile[];
  selectedDate: Date;
  onBookDesk: (desk: Desk, timeSlot: TimeSlot, force?: boolean) => void;
  onCancelBooking: (booking: Booking) => void;
  currentUser: User | null;
  timeSlot: TimeSlot;
  isRootMode: boolean;
}

export default function DeskMap({
  desks,
  bookings,
  users,
  selectedDate,
  onBookDesk,
  onCancelBooking,
  currentUser,
  timeSlot,
  isRootMode,
}: DeskMapProps) {
  const [selectedDesk, setSelectedDesk] = useState<Desk | null>(null);
  const [bookingToCancel, setBookingToCancel] = useState<Booking | null>(null);
  const [isBookingDialogOpen, setIsBookingDialogOpen] = useState(false);
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);

  const findBookingForDesk = (deskId: string, timeSlot: TimeSlot): Booking | undefined => {
    return bookings.find(
      (booking) =>
        booking.deskId === deskId &&
        (booking.timeSlot === timeSlot || booking.timeSlot === 'full-day')
    );
  };
  
  const isDeskBookedByCurrentUser = (booking: Booking | undefined) => {
    return booking && currentUser && booking.userId === currentUser.uid;
  }

  const handleDeskClick = (desk: Desk) => {
    const existingBooking = findBookingForDesk(desk.id, timeSlot);

    if (existingBooking) {
      const isCurrentUserBooking = isDeskBookedByCurrentUser(existingBooking);
      if (isRootMode || isCurrentUserBooking) {
        // In root mode, or if it's the current user's booking, open cancellation dialog.
        setBookingToCancel(existingBooking);
        setIsCancelDialogOpen(true);
      }
      // If it's booked by someone else and not in root mode, do nothing.
    } else {
      // If the desk is free, open the booking dialog.
      setSelectedDesk(desk);
      setIsBookingDialogOpen(true);
    }
  };

  const getDeskItem = (desk: Desk) => {
    const booking = findBookingForDesk(desk.id, timeSlot);
    const deskClassName = 'w-24 h-24';
    
    if (booking) {
      const user = users.find(u => u.id === booking.userId);
      const isCurrentUser = isDeskBookedByCurrentUser(booking);
      return (
        <div className="relative">
          <BookedDeskItem
            key={desk.id}
            desk={desk}
            user={user}
            isCurrentUser={isCurrentUser}
            onClick={() => handleDeskClick(desk)}
            className={deskClassName}
            isRootMode={isRootMode}
          />
        </div>
      );
    }
    
    return (
       <div className="relative">
        <DeskItem key={desk.id} desk={desk} onClick={() => handleDeskClick(desk)} className={deskClassName} />
      </div>
    )
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
          isRootMode={isRootMode}
        />
      )}
      {bookingToCancel && (
        <BookingCancellationDialog
          booking={bookingToCancel}
          desk={desks.find((d) => d.id === bookingToCancel.deskId)}
          user={users.find(u => u.id === bookingToCancel.userId)}
          isOpen={isCancelDialogOpen}
          onOpenChange={setIsCancelDialogOpen}
          onConfirm={onCancelBooking}
          isRootMode={isRootMode && !isDeskBookedByCurrentUser(bookingToCancel)}
        />
      )}
    </>
  );
}
