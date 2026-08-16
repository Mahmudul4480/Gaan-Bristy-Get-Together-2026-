export interface TeamMember {
  id: string;
  name: string;
  role: 'Captain' | 'Co-Captain' | 'Admin' | 'Super Active Member';
  roleBengali: string;
  starMakerId?: string;
  phone?: string;
  image: string;
  imageClass?: string;
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
  familyName: string;
  starMakerId?: string;
  phone: string;
  email?: string;
  photoUrl?: string;
  adultCount: number;
  kidCount: number;
  totalAmount: number;
  paymentMethod: 'bKash' | 'Nagad' | 'Rocket' | 'Bank Transfer';
  transactionId: string;
  status: 'Confirmed' | 'Pending';
  issueDate: string;
  seatNumbers: string[];
  songRequest?: string;
  createdByAdmin?: boolean;
}

export interface AppointedAdmin {
  id: string;
  name: string;
  phone: string;
  role: 'Super Admin' | 'Card Editor';
  appointedAt: string;
}

export interface GalleryPhoto {
  id: string;
  title: string;
  url: string;
  category: 'Previous Events' | 'Family Meeting' | 'Performance';
  storagePath?: string;
  createdAt?: string;
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
