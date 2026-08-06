export interface TeamMember {
  id: string;
  name: string;
  role: 'Captain' | 'Co-Captain' | 'Sub-Admin';
  roleBengali: string;
  starMakerId?: string;
  phone?: string;
  image: string;
  bio?: string;
}

export interface ScheduleItem {
  time: string;
  title: string;
  titleBengali: string;
  description: string;
  iconName: string;
}

export interface Ticket {
  ticketId: string;
  fullName: string;
  starMakerId: string;
  phone: string;
  email?: string;
  adultCount: number;
  kidCount: number;
  totalAmount: number;
  paymentMethod: 'bKash' | 'Nagad' | 'Rocket' | 'Bank Transfer';
  transactionId: string;
  status: 'Confirmed' | 'Pending';
  issueDate: string;
  seatNumbers: string[];
}

export interface GalleryPhoto {
  id: string;
  title: string;
  url: string;
  category: 'Previous Events' | 'Family Meeting' | 'Performance';
}

export interface GuestbookEntry {
  id: string;
  name: string;
  starMakerId?: string;
  message: string;
  favoriteSong?: string;
  timestamp: string;
  likes: number;
  badge?: string;
  avatarColor?: string;
}
