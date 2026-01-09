export type TimeSlot = 'morning' | 'afternoon' | 'full-day';

export interface Desk {
  id: string;
  label: string;
  location: string;
  type: string;
}

export interface Booking {
  id: string;
  deskId: string;
  userId: string;
  date: string; // YYYY-MM-DD format
  timeSlot: TimeSlot;
}
