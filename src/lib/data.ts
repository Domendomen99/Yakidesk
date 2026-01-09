import type { Desk, Booking } from './types';
import { addDays, format } from 'date-fns';

// This data is used to seed Firestore and as a fallback.

export const initialDesks: Desk[] = [
  { id: 'D1', label: 'Desk 1', location: 'A1', type: 'Standard' },
  { id: 'D2', label: 'Desk 2', location: 'A2', type: 'Standard' },
  { id: 'D3', label: 'Desk 3', location: 'B1', type: 'Standing' },
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
