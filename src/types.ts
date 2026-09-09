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
  status: 'Confirmed' | 'Pending' | 'Rejected';
  issueDate: string;
  seatNumbers: string[];
  songRequest?: string;
  createdByAdmin?: boolean;
  createdBy?: string;
  approvedBy?: string;
  approvedAt?: string;
  rejectedBy?: string;
  rejectedAt?: string;
  /** paid = real TrxID counted in budget; due = will pay later; complimentary = honorary, ৳0 */
  paymentKind?: 'paid' | 'due' | 'complimentary';
}

export interface AppointedAdmin {
  id: string;
  name: string;
  phone: string;
  role: 'Super Admin' | 'Card Editor';
  appointedAt: string;
}

export type AdminRole = 'Super Admin' | 'Card Editor';

export interface CardDeleteRequest {
  id: string;
  ticketId: string;
  guestName: string;
  guestPhone: string;
  requestedBy: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  createdAt: string;
  resolvedAt?: string;
}

export interface GalleryPhoto {
  id: string;
  title: string;
  url: string;
  category: 'Previous Events' | 'Family Meeting' | 'Performance' | 'Family Funny Moment';
  featured?: boolean;
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
  createdAt?: string;
  likes: number;
  badge?: string;
  avatarColor?: string;
}

export type ProgramLedgerKind = 'income' | 'expense';

export interface ProgramLedgerEntry {
  id: string;
  kind: ProgramLedgerKind;
  title: string;
  amount: number;
  note?: string;
  category?: string;
  createdBy: string;
  createdAt: string;
}

export type QuizPhase = 'idle' | 'lobby' | 'question' | 'reveal' | 'podium';
export type QuizQuestionCount = 10 | 15;

export interface QuizState {
  phase: QuizPhase;
  sessionId: string;
  questionCount: QuizQuestionCount;
  questionIndex: number;
  questionStartedAt?: string;
  timerSeconds: number;
  updatedAt: string;
  updatedBy?: string;
}

export interface QuizPlayer {
  ticketId: string;
  fullName: string;
  familyName: string;
  photoUrl?: string;
  starMakerId?: string;
  sessionId: string;
  joinedAt: string;
}

export interface QuizAnswer {
  id: string;
  ticketId: string;
  sessionId: string;
  questionIndex: number;
  choiceIndex: number;
  submittedAt: string;
  correct: boolean;
  points: number;
  elapsedMs: number;
}

export interface QuizLeaderboardRow {
  ticketId: string;
  fullName: string;
  familyName: string;
  photoUrl?: string;
  starMakerId?: string;
  totalPoints: number;
  correctCount: number;
  totalElapsedMs: number;
  rank: number;
}
