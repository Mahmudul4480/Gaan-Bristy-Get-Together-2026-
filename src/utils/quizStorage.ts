import {
  collection,
  doc,
  getDoc,
  onSnapshot,
  query,
  setDoc,
} from 'firebase/firestore';
import {
  QuizAnswer,
  QuizLeaderboardRow,
  QuizPlayer,
  QuizQuestionCount,
  QuizState,
  Ticket,
} from '../types';
import { db } from '../config/firebase';
import { DEFAULT_QUIZ_TIMER_SECONDS, getQuizQuestions } from '../data/quizQuestions';
import { computeQuizLeaderboard, remainingQuestionMs, scoreQuizAnswer } from './quizScoring';

const STATE_COLLECTION = 'quizState';
const STATE_ID = 'live';
const PLAYERS_COLLECTION = 'quizPlayers';
const ANSWERS_COLLECTION = 'quizAnswers';

const IDLE_STATE: QuizState = {
  phase: 'idle',
  sessionId: '',
  questionCount: 10,
  questionIndex: 0,
  timerSeconds: DEFAULT_QUIZ_TIMER_SECONDS,
  updatedAt: '',
};

function omitUndefined<T extends Record<string, unknown>>(data: T): Record<string, unknown> {
  return Object.fromEntries(Object.entries(data).filter(([, value]) => value !== undefined));
}

function requireDb() {
  if (!db) throw new Error('Firebase কনফিগার করা নেই');
  return db;
}

function stateRef() {
  return doc(requireDb(), STATE_COLLECTION, STATE_ID);
}

function playerRef(ticketId: string) {
  return doc(requireDb(), PLAYERS_COLLECTION, ticketId);
}

function answerDocId(sessionId: string, ticketId: string, questionIndex: number): string {
  return `${sessionId}_${ticketId}_${questionIndex}`;
}

function answerRef(sessionId: string, ticketId: string, questionIndex: number) {
  return doc(requireDb(), ANSWERS_COLLECTION, answerDocId(sessionId, ticketId, questionIndex));
}

export function getGuestCardPageUrl(ticketId: string): string {
  return `${window.location.origin}${window.location.pathname}?guest=${encodeURIComponent(ticketId)}#honorable-guests`;
}

export function getQuizPlayUrl(ticketId: string): string {
  const url = new URL(window.location.origin + window.location.pathname);
  url.searchParams.set('quiz', 'play');
  url.searchParams.set('guest', ticketId);
  return url.toString();
}

export function getQuizScreenUrl(): string {
  const url = new URL(window.location.origin + window.location.pathname);
  url.searchParams.set('quiz', 'screen');
  return url.toString();
}

export function isQuizJoinable(phase: QuizState['phase']): boolean {
  return phase === 'lobby' || phase === 'question' || phase === 'reveal';
}

export function subscribeToQuizState(
  onChange: (state: QuizState) => void,
  onError?: (error: Error) => void
): () => void {
  if (!db) {
    onChange(IDLE_STATE);
    return () => {};
  }

  return onSnapshot(
    stateRef(),
    (snap) => {
      if (!snap.exists()) {
        onChange(IDLE_STATE);
        return;
      }
      onChange(snap.data() as QuizState);
    },
    (error) => {
      console.error('[Quiz] state subscription failed:', error);
      onError?.(error as Error);
    }
  );
}

export function subscribeToQuizPlayers(
  onChange: (players: QuizPlayer[]) => void,
  onError?: (error: Error) => void
): () => void {
  if (!db) {
    onChange([]);
    return () => {};
  }

  return onSnapshot(
    query(collection(db, PLAYERS_COLLECTION)),
    (snap) => {
      onChange(snap.docs.map((item) => item.data() as QuizPlayer));
    },
    (error) => {
      console.error('[Quiz] players subscription failed:', error);
      onError?.(error as Error);
    }
  );
}

export function subscribeToQuizAnswers(
  onChange: (answers: QuizAnswer[]) => void,
  onError?: (error: Error) => void
): () => void {
  if (!db) {
    onChange([]);
    return () => {};
  }

  return onSnapshot(
    query(collection(db, ANSWERS_COLLECTION)),
    (snap) => {
      onChange(
        snap.docs.map((item) => ({
          id: item.id,
          ...(item.data() as Omit<QuizAnswer, 'id'>),
        }))
      );
    },
    (error) => {
      console.error('[Quiz] answers subscription failed:', error);
      onError?.(error as Error);
    }
  );
}

async function writeState(patch: QuizState): Promise<void> {
  await setDoc(stateRef(), omitUndefined({ ...patch }));
}

export async function openQuizLobby(input: {
  questionCount: QuizQuestionCount;
  actorName: string;
  timerSeconds?: number;
}): Promise<void> {
  await writeState({
    phase: 'lobby',
    sessionId: `qs-${Date.now()}`,
    questionCount: input.questionCount,
    questionIndex: 0,
    timerSeconds: input.timerSeconds ?? DEFAULT_QUIZ_TIMER_SECONDS,
    updatedAt: new Date().toISOString(),
    updatedBy: input.actorName,
  });
}

export async function startQuizQuestion(input: {
  state: QuizState;
  questionIndex: number;
  actorName: string;
}): Promise<void> {
  if (input.state.phase === 'idle' || !input.state.sessionId) {
    throw new Error('আগে লবি খুলুন');
  }
  const lastIndex = input.state.questionCount - 1;
  const questionIndex = Math.max(0, Math.min(lastIndex, input.questionIndex));
  await writeState({
    ...input.state,
    phase: 'question',
    questionIndex,
    questionStartedAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    updatedBy: input.actorName,
  });
}

export async function revealQuizQuestion(input: { state: QuizState; actorName: string }): Promise<void> {
  if (input.state.phase !== 'question') {
    throw new Error('এখন কোনো চলমান প্রশ্ন নেই');
  }
  await writeState({
    ...input.state,
    phase: 'reveal',
    updatedAt: new Date().toISOString(),
    updatedBy: input.actorName,
  });
}

export async function showQuizPodium(input: { state: QuizState; actorName: string }): Promise<void> {
  if (!input.state.sessionId) throw new Error('কোনো কুইজ সেশন নেই');
  await writeState({
    ...input.state,
    phase: 'podium',
    updatedAt: new Date().toISOString(),
    updatedBy: input.actorName,
  });
}

export async function resetQuiz(actorName: string): Promise<void> {
  await writeState({
    ...IDLE_STATE,
    updatedAt: new Date().toISOString(),
    updatedBy: actorName,
  });
}

export async function joinQuiz(ticket: Ticket, state: QuizState): Promise<QuizPlayer> {
  if (ticket.status !== 'Confirmed') {
    throw new Error('শুধু অ্যাপ্রুভড গেস্ট কার্ড দিয়ে কুইজে যোগ দেওয়া যায়');
  }
  if (!isQuizJoinable(state.phase) && state.phase !== 'podium') {
    throw new Error('কুইজ এখন বন্ধ। স্টেজ থেকে ঘোষণার পর আবার চেষ্টা করুন।');
  }
  if (!state.sessionId) {
    throw new Error('কুইজ সেশন খোলা নেই');
  }

  const existing = await getDoc(playerRef(ticket.ticketId));
  if (existing.exists()) {
    const player = existing.data() as QuizPlayer;
    if (player.sessionId === state.sessionId) return player;
  }

  const player: QuizPlayer = {
    ticketId: ticket.ticketId,
    fullName: ticket.fullName,
    familyName: ticket.familyName,
    photoUrl: ticket.photoUrl,
    starMakerId: ticket.starMakerId,
    sessionId: state.sessionId,
    joinedAt: new Date().toISOString(),
  };

  await setDoc(playerRef(ticket.ticketId), omitUndefined({ ...player }));
  return player;
}

export async function submitQuizAnswer(input: {
  ticketId: string;
  choiceIndex: number;
  state: QuizState;
}): Promise<QuizAnswer> {
  if (input.state.phase !== 'question' || !input.state.sessionId) {
    throw new Error('এখন উত্তর দেওয়া যাচ্ছে না');
  }

  const remaining = remainingQuestionMs(input.state.questionStartedAt, input.state.timerSeconds);
  if (remaining <= 0) {
    throw new Error('সময় শেষ');
  }

  const questions = getQuizQuestions(input.state.questionCount);
  const question = questions[input.state.questionIndex];
  if (!question) throw new Error('প্রশ্ন পাওয়া যায়নি');

  const choiceIndex = input.choiceIndex;
  if (choiceIndex < 0 || choiceIndex > 3) throw new Error('ভুল অপশন');

  const ref = answerRef(input.state.sessionId, input.ticketId, input.state.questionIndex);
  const existing = await getDoc(ref);
  if (existing.exists()) {
    throw new Error('এই প্রশ্নের উত্তর আগেই দেওয়া হয়েছে');
  }

  const started = input.state.questionStartedAt ? new Date(input.state.questionStartedAt).getTime() : Date.now();
  const elapsedMs = Math.max(0, Date.now() - started);
  const correct = choiceIndex === question.answerIndex;
  const points = scoreQuizAnswer({
    correct,
    elapsedMs,
    timerSeconds: input.state.timerSeconds,
  });

  const answer: QuizAnswer = {
    id: ref.id,
    ticketId: input.ticketId,
    sessionId: input.state.sessionId,
    questionIndex: input.state.questionIndex,
    choiceIndex,
    submittedAt: new Date().toISOString(),
    correct,
    points,
    elapsedMs,
  };

  await setDoc(ref, omitUndefined({ ...answer }));
  return answer;
}

export function leaderboardForSession(
  players: QuizPlayer[],
  answers: QuizAnswer[],
  sessionId: string
): QuizLeaderboardRow[] {
  if (!sessionId) return [];
  return computeQuizLeaderboard(players, answers, sessionId);
}

export { IDLE_STATE };
