import type { Desk, Booking } from './types';
import { addDays, format } from 'date-fns';

export const initialDesks: Desk[] = [
  { id: 'D1', label: 'Desk 1' },
  { id: 'D2', label: 'Desk 2' },
  { id: 'D3', label: 'Desk 3' },
  { id: 'D4', label: 'Desk 4' },
  { id: 'D5', label: 'Desk 5' },
  { id: 'D6', label: 'Desk 6' },
];

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
    id: 'B4',
    deskId: 'D6',
    userId: 'user-4',
    date: format(addDays(new Date(), 1), 'yyyy-MM-dd'),
    timeSlot: 'full-day',
  },
];
