'use client';

import { useState } from 'react';
import type { Booking, Desk, TimeSlot } from '@/lib/types';
import { format } from 'date-fns';
import DeskItem from './desk-item';
import BookingConfirmationDialog from './booking-confirmation-dialog';

interface DeskMapProps {
  desks: Desk[];
  bookings: Booking[];
  selectedDate: Date;
  selectedTimeSlot: TimeSlot;
  onBookDesk: (desk: Desk, timeSlot: TimeSlot) => void;
}

export default function DeskMap({ desks, bookings, selectedDate, selectedTimeSlot, onBookDesk }: DeskMapProps) {
  const [selectedDesk, setSelectedDesk] = useState<Desk | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const formattedDate = format(selectedDate, 'yyyy-MM-dd');

  const isDeskBooked = (deskId: string, timeSlot: TimeSlot): boolean => {
    return bookings.some(booking =>
      booking.deskId === deskId &&
      booking.date === formattedDate &&
      (booking.timeSlot === timeSlot || booking.timeSlot === 'full-day' || timeSlot === 'full-day')
    );
  };
  
  const handleDeskClick = (desk: Desk) => {
      setSelectedDesk(desk);
      setIsDialogOpen(true);
  };

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6 md:gap-8 text-center p-4">
        {desks.map((desk) => {
          const booked = isDeskBooked(desk.id, selectedTimeSlot);
          return (
            <DeskItem
              key={desk.id}
              desk={desk}
              isBooked={booked}
              onClick={() => handleDeskClick(desk)}
            />
          );
        })}
      </div>
      {selectedDesk && (
        <BookingConfirmationDialog
          desk={selectedDesk}
          date={selectedDate}
          bookings={bookings}
          isOpen={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          onConfirm={onBookDesk}
        />
      )}
    </>
  );
}
