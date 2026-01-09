import type { Desk, Booking } from './types';
import { addDays, format } from 'date-fns';

export const initialDesks: Desk[] = Array.from({ length: 12 }, (_, i) => ({
  id: `D${i + 1}`,
  label: `Desk ${i + 1}`,
}));

export const initialBookings: Booking[] = [
  {
    id: 'B1',
    deskId: 'D3',
    userId: 'user-1',
    date: format(new Date(), 'yyyy-MM-dd'),
    timeSlot: 'morning',
  },
  {
    id: 'B2',
    deskId: 'D5',
    userId: 'user-2',
    date: format(new Date(), 'yyyy-MM-dd'),
    timeSlot: 'afternoon',
  },
  {
    id: 'B3',
    deskId: 'D5',
    userId: 'user-3',
    date: format(new Date(), 'yyyy-MM-dd'),
    timeSlot: 'morning',
  },
  {
    id: 'B4',
    deskId: 'D10',
    userId: 'user-4',
    date: format(addDays(new Date(), 1), 'yyyy-MM-dd'),
    timeSlot: 'full-day',
  },
];
