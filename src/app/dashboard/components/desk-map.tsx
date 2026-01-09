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

  return (
    <>
      <div className="grid grid-cols-4 grid-rows-4 gap-6 md:gap-8 text-center p-4 border border-border rounded-lg bg-background/30 aspect-[16/9] min-h-[600px]">
        {/* Top-left corner */}
        <div className="col-start-1 col-span-2 row-start-1 row-span-2 flex items-start justify-start">
            <div className='grid grid-cols-2 gap-4'>
                {desks.slice(0, 2).map(getDeskItem)}
            </div>
        </div>

        {/* Top-right corner */}
        <div className="col-start-3 col-span-2 row-start-1 row-span-2 flex items-start justify-end">
             <div className='grid grid-cols-2 gap-4'>
                {desks.slice(2, 4).map(getDeskItem)}
            </div>
        </div>

        {/* Bottom-left corner */}
        <div className="col-start-1 col-span-2 row-start-3 row-span-2 flex items-end justify-start">
             <div className='grid grid-cols-2 gap-4'>
                {desks.slice(4, 6).map(getDeskItem)}
            </div>
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
