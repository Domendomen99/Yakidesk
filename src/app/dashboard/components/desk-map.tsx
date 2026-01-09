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
  
  const getDeskItem = (desk: Desk) => {
    const booked = isDeskBooked(desk.id, selectedTimeSlot);
    return (
      <DeskItem
        key={desk.id}
        desk={desk}
        isBooked={booked}
        onClick={() => handleDeskClick(desk)}
      />
    );
  }

  const desk1 = desks.find(d => d.id === 'D1');
  const desk2 = desks.find(d => d.id === 'D2');
  const desk3 = desks.find(d => d.id === 'D3');

  return (
    <>
      <div className="p-4 border border-border rounded-lg bg-background/30 w-full">
        <div className="grid grid-cols-2 grid-rows-2 gap-4 justify-items-center items-center w-max mx-auto">
            {desk1 && <div className="justify-self-start">{getDeskItem(desk1)}</div>}
            {desk2 && <div className="justify-self-end">{getDeskItem(desk2)}</div>}
            {desk3 && <div className="justify-self-start row-start-2">{getDeskItem(desk3)}</div>}
            {/* Empty cell for bottom right */}
            <div></div> 
        </div>
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
