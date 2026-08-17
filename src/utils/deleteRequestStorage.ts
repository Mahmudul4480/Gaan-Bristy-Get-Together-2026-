import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
} from 'firebase/firestore';
import { CardDeleteRequest, Ticket } from '../types';
import { db } from '../config/firebase';
import { deleteHonorableGuest } from './guestStorage';

const REQUESTS_COLLECTION = 'cardDeleteRequests';

function requestsCol() {
  if (!db) throw new Error('Firebase চালু নেই');
  return collection(db, REQUESTS_COLLECTION);
}

export function subscribeToDeleteRequests(
  onChange: (requests: CardDeleteRequest[]) => void,
  onError?: (error: Error) => void
): () => void {
  if (!db) {
    onChange([]);
    return () => {};
  }

  const requestsQuery = query(requestsCol(), orderBy('createdAt', 'desc'));
  return onSnapshot(
    requestsQuery,
    (snapshot) => {
      const requests = snapshot.docs.map((snap) => ({
        id: snap.id,
        ...(snap.data() as Omit<CardDeleteRequest, 'id'>),
      }));
      onChange(requests);
    },
    (error) => {
      console.error('[Delete requests] subscription failed:', error);
      onError?.(error as Error);
    }
  );
}

export async function requestCardDelete(ticket: Ticket, requestedBy: string): Promise<void> {
  if (!db) throw new Error('Firebase কনফিগার করা নেই।');
  await addDoc(requestsCol(), {
    ticketId: ticket.ticketId,
    guestName: ticket.fullName,
    guestPhone: ticket.phone,
    requestedBy: requestedBy.trim() || 'Card Editor',
    status: 'Pending',
    createdAt: new Date().toISOString(),
  });
}

export async function rejectDeleteRequest(requestId: string): Promise<void> {
  if (!db) throw new Error('Firebase কনফিগার করা নেই।');
  await updateDoc(doc(db, REQUESTS_COLLECTION, requestId), {
    status: 'Rejected',
    resolvedAt: new Date().toISOString(),
  });
}

export async function approveDeleteRequest(request: CardDeleteRequest): Promise<void> {
  if (!db) throw new Error('Firebase কনফিগার করা নেই।');
  await deleteHonorableGuest(request.ticketId);
  await updateDoc(doc(db, REQUESTS_COLLECTION, request.id), {
    status: 'Approved',
    resolvedAt: new Date().toISOString(),
  });
}

export async function deleteCardAsSuperAdmin(ticketId: string, pendingRequests: CardDeleteRequest[]): Promise<void> {
  if (!db) throw new Error('Firebase কনফিগার করা নেই।');
  await deleteHonorableGuest(ticketId);
  const related = pendingRequests.filter((r) => r.ticketId === ticketId && r.status === 'Pending');
  await Promise.all(
    related.map((r) =>
      updateDoc(doc(db, REQUESTS_COLLECTION, r.id), {
        status: 'Approved',
        resolvedAt: new Date().toISOString(),
      })
    )
  );
}

export async function removeDeleteRequest(requestId: string): Promise<void> {
  if (!db) throw new Error('Firebase কনফিগার করা নেই।');
  await deleteDoc(doc(db, REQUESTS_COLLECTION, requestId));
}
