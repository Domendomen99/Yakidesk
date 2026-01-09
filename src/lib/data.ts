import type { Desk, Booking } from './types';
import { addDays, format } from 'date-fns';

export const initialDesks: Desk[] = [
  { id: 'D1', label: 'Desk 1' },
  { id: 'D2', label: 'Desk 2' },
  { id: 'D3', label: 'Desk 3' },
];

export const initialBookings: Booking[] = [
  {
    id: 'B1',
    deskId: 'D3',
    userId: 'user-1',
    date: format(new Date(), 'yyyy-MM-dd'),
    timeSlot: 'morning',
  },
];
