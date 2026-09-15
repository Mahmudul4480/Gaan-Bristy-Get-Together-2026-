import { useEffect, useMemo, useRef, useState } from 'react';
import { Ticket } from '../types';
import {
  DEFAULT_QUIZ_TIMER_SECONDS,
  QUIZ_OPTION_COLORS,
  QUIZ_OPTION_SHAPES,
  QUIZ_PRIZES,
  getQuizQuestions,
} from '../data/quizQuestions';
import { remainingQuestionMs } from '../utils/quizScoring';
import {
  IDLE_STATE,
  getGuestCardPageUrl,
  isQuizJoinable,
  joinQuiz,
  leaderboardForSession,
  submitQuizAnswer,
  subscribeToQuizAnswers,
  subscribeToQuizPlayers,
  subscribeToQuizState,
} from '../utils/quizStorage';
import { playJoinChime, startQuestionCountdownMusic, unlockQuizAudio } from '../utils/quizAudio';
import { Loader2, Music2, Search, ShieldAlert, Trophy, ChevronLeft } from 'lucide-react';

const SELF_ID_STORAGE_KEY = 'gb2026-quiz-self-ticket';

function readCachedSelfTicketId(): string | null {
  try {
    return window.localStorage.getItem(SELF_ID_STORAGE_KEY);
  } catch {
    return null;
  }
}

function cacheSelfTicketId(ticketId: string): void {
  try {
    window.localStorage.setItem(SELF_ID_STORAGE_KEY, ticketId);
  } catch {
    // Private mode / storage full — not fatal, they'll just search again next time.
  }
}

function clearCachedSelfTicketId(): void {
  try {
    window.localStorage.removeItem(SELF_ID_STORAGE_KEY);
  } catch {
    // ignore
  }
}

interface QuizPlayerProps {
  /** Set only when this device opened a guest-specific link (`?guest=<id>`), e.g. from the card's own "join quiz" button. */
  ticket: Ticket | undefined;
  /** Full guest list — needed so a bare `?quiz=play` link (posted once in WhatsApp) can let anyone self-identify. */
  guests: Ticket[];
  guestsLoaded: boolean;
}

/** Search-your-own-name screen shown when this device has no guest-specific ticket yet. */
function QuizSelfIdentify({ guests, onIdentified }: { guests: Ticket[]; onIdentified: (ticket: Ticket) => void }) {
  const [query, setQuery] = useState('');
  const trimmed = query.trim();

  const matches = useMemo(() => {
    if (trimmed.length < 3) return [];
    const q = trimmed.toLowerCase();
    return guests
      .filter((g) => g.status === 'Confirmed')
      .filter(
        (g) =>
          g.phone.includes(trimmed) ||
          g.fullName.toLowerCase().includes(q) ||
          g.familyName.toLowerCase().includes(q) ||
          (g.starMakerId || '').toLowerCase().includes(q)
      )
      .slice(0, 8);
  }, [guests, trimmed]);

  return (
    <div className="mt-6">
      <div className="rounded-2xl border border-[#D4AF37]/40 bg-[#1C1730] p-5 text-center">
        <Search className="w-8 h-8 text-[#D4AF37] mx-auto mb-2" />
        <p className="text-sm font-bold">নিজেকে চিহ্নিত করুন</p>
        <p className="text-xs text-[#B3A6C9] mt-1">আপনার মোবাইল নাম্বার, নাম বা StarMaker ID লিখুন</p>
      </div>
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="যেমনঃ 017... বা আপনার নাম"
        autoFocus
        className="mt-4 w-full bg-[#1C1730] border border-[#D4AF37]/40 rounded-xl px-4 py-3 text-sm text-[#F6EFE0] outline-none"
      />
      {trimmed.length > 0 && trimmed.length < 3 && (
        <p className="mt-2 text-[11px] text-[#B3A6C9] text-center">কমপক্ষে ৩ অক্ষর লিখুন</p>
      )}
      <div className="mt-3 space-y-2 max-h-72 overflow-y-auto">
        {matches.map((g) => (
          <button
            key={g.ticketId}
            type="button"
            onClick={() => {
              unlockQuizAudio();
              onIdentified(g);
            }}
            className="w-full text-left rounded-xl border border-[#D4AF37]/30 bg-[#1C1730] px-4 py-3 hover:border-[#D4AF37] transition cursor-pointer"
          >
            <p className="font-bold text-[#F6EFE0]">{g.fullName}</p>
            <p className="text-[11px] text-[#B3A6C9]">
              {g.familyName} · ফোন শেষে {g.phone.slice(-3)}
            </p>
          </button>
        ))}
        {trimmed.length >= 3 && matches.length === 0 && (
          <p className="text-center text-xs text-[#B3A6C9] mt-3 px-2">
            কোনো অ্যাপ্রুভড কার্ড পাওয়া যায়নি। বানান/নাম্বার আবার চেক করুন, অথবা নিজের গেস্ট কার্ডের QR স্ক্যান করুন।
          </p>
        )}
      </div>
    </div>
  );
}

export default function QuizPlayer({ ticket, guests, guestsLoaded }: QuizPlayerProps) {
  const [state, setState] = useState(IDLE_STATE);
  const [players, setPlayers] = useState<import('../types').QuizPlayer[]>([]);
  const [answers, setAnswers] = useState<import('../types').QuizAnswer[]>([]);
  const [joinError, setJoinError] = useState('');
  const [submitError, setSubmitError] = useState('');
  const [joining, setJoining] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [now, setNow] = useState(Date.now());
  const [stateReady, setStateReady] = useState(false);
  const [selfTicketId, setSelfTicketId] = useState<string | null>(() => readCachedSelfTicketId());
  const joinKeyRef = useRef('');
  const joinedChimeRef = useRef('');

  useEffect(
    () =>
      subscribeToQuizState((next) => {
        setState(next);
        setStateReady(true);
      }),
    []
  );
  useEffect(() => subscribeToQuizPlayers(setPlayers), []);
  useEffect(() => subscribeToQuizAnswers(setAnswers), []);

  // The one specific ticket came from a personal QR link; otherwise fall back
  // to whatever this device self-identified as (fresh search or cached).
  const resolvedTicket = ticket || (selfTicketId ? guests.find((g) => g.ticketId === selfTicketId) : undefined);

  const handleIdentified = (guest: Ticket) => {
    cacheSelfTicketId(guest.ticketId);
    setSelfTicketId(guest.ticketId);
    const url = new URL(window.location.href);
    url.searchParams.set('guest', guest.ticketId);
    window.history.replaceState({}, '', url.toString());
  };

  const handleForgetIdentity = () => {
    clearCachedSelfTicketId();
    setSelfTicketId(null);
    const url = new URL(window.location.href);
    url.searchParams.delete('guest');
    window.history.replaceState({}, '', url.toString());
  };

  useEffect(() => {
    if (!stateReady) return;
    if (isQuizJoinable(state.phase) || state.phase === 'podium') return;
    // Only bounce guest-specific-link visitors back to their card. Anyone who
    // arrived via the bare WhatsApp link should stay here and wait — the join
    // effect below fires automatically the moment the host opens the lobby.
    if (!ticket) return;
    window.location.replace(getGuestCardPageUrl(ticket.ticketId));
  }, [stateReady, state.phase, ticket]);

  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 250);
    return () => window.clearInterval(timer);
  }, []);

  // 20s (or whatever the host set) suspense pulse for every question — this
  // is the "মিউজিক সহ" countdown, synthesized so it works with zero assets.
  useEffect(() => {
    if (state.phase !== 'question') return;
    const stop = startQuestionCountdownMusic(state.timerSeconds || DEFAULT_QUIZ_TIMER_SECONDS);
    return stop;
  }, [state.phase, state.sessionId, state.questionIndex, state.timerSeconds]);

  const questions = getQuizQuestions(state.questionCount);
  const question = questions[state.questionIndex];
  const myAnswer = answers.find(
    (answer) =>
      answer.ticketId === resolvedTicket?.ticketId &&
      answer.sessionId === state.sessionId &&
      answer.questionIndex === state.questionIndex
  );
  const board = leaderboardForSession(players, answers, state.sessionId);
  const myRow = board.find((row) => row.ticketId === resolvedTicket?.ticketId);
  const remainingMs = remainingQuestionMs(state.questionStartedAt, state.timerSeconds || DEFAULT_QUIZ_TIMER_SECONDS, now);
  const remainingSec = Math.ceil(remainingMs / 1000);
  const timeUp = state.phase === 'question' && remainingMs <= 0;

  useEffect(() => {
    if (!resolvedTicket || resolvedTicket.status !== 'Confirmed') return;
    if (!isQuizJoinable(state.phase) && state.phase !== 'podium') return;
    if (!state.sessionId) return;
    const key = `${state.sessionId}:${resolvedTicket.ticketId}`;
    if (joinKeyRef.current === key) return;
    joinKeyRef.current = key;
    setJoining(true);
    setJoinError('');
    joinQuiz(resolvedTicket, state)
      .then(() => {
        if (joinedChimeRef.current !== key) {
          joinedChimeRef.current = key;
          playJoinChime();
        }
      })
      .catch((error) => setJoinError(error instanceof Error ? error.message : 'যোগ দেওয়া যায়নি'))
      .finally(() => setJoining(false));
  }, [resolvedTicket, state]);

  const handleChoice = async (choiceIndex: number) => {
    if (!resolvedTicket || submitting || myAnswer || state.phase !== 'question' || timeUp) return;
    unlockQuizAudio();
    setSubmitting(true);
    setSubmitError('');
    try {
      await submitQuizAnswer({ ticketId: resolvedTicket.ticketId, choiceIndex, state });
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'উত্তর জমা হয়নি');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-dvh bg-[#0F0C1A] text-[#F6EFE0] midnight-bg-glow px-4 py-6 font-body">
      <div className="max-w-md mx-auto">
        {resolvedTicket && (
          <a
            href={getGuestCardPageUrl(resolvedTicket.ticketId)}
            className="mb-4 inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#1C1730] border border-[#D4AF37]/60 text-[#F0D78C] font-bold text-sm"
          >
            <ChevronLeft className="w-4 h-4" />
            গেস্ট কার্ডে ফিরুন
          </a>
        )}
        <p className="text-center text-[10px] uppercase tracking-[0.3em] text-[#D4AF37] font-black">Gaan Bristy Quiz</p>
        <h1 className="text-center text-xl font-black font-serif text-[#F0D78C] mt-1">স্টেজ কুইজ</h1>

        {!resolvedTicket && !ticket && guestsLoaded && (
          <p className="text-center text-[11px] text-[#B3A6C9] mt-2">
            একটাই লিংক — নিজের নাম/মোবাইল দিয়ে খুঁজে যোগ দিন, আলাদা QR লাগবে না।
          </p>
        )}

        {!ticket && resolvedTicket && (
          <button type="button" onClick={handleForgetIdentity} className="mt-2 block mx-auto text-[11px] text-[#B3A6C9] underline">
            আপনি {resolvedTicket.fullName} না? পরিবর্তন করুন
          </button>
        )}

        {!guestsLoaded || !stateReady ? (
          <p className="mt-10 text-center text-sm text-[#B3A6C9] flex items-center justify-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin" /> কার্ড খোঁজা হচ্ছে...
          </p>
        ) : !resolvedTicket ? (
          <QuizSelfIdentify guests={guests} onIdentified={handleIdentified} />
        ) : resolvedTicket.status !== 'Confirmed' ? (
          <div className="mt-8 rounded-2xl border border-[#A52C54]/50 bg-[#1C1730] p-5 text-center">
            <p className="text-sm font-bold">এই কার্ড এখনও অ্যাপ্রুভড নয়</p>
            <p className="text-xs text-[#B3A6C9] mt-2">{resolvedTicket.ticketId}</p>
          </div>
        ) : (
          <>
            <div className="mt-4 flex items-center gap-3 rounded-2xl border border-[#D4AF37]/30 bg-[#1C1730] px-3 py-2">
              {resolvedTicket.photoUrl ? (
                <img src={resolvedTicket.photoUrl} alt="" className="w-10 h-10 rounded-full object-cover border border-[#D4AF37]/50" />
              ) : (
                <div className="w-10 h-10 rounded-full bg-[#7A1F3D] flex items-center justify-center font-black text-[#F0D78C]">
                  {resolvedTicket.fullName.charAt(0)}
                </div>
              )}
              <div className="min-w-0">
                <p className="font-bold truncate">{resolvedTicket.fullName}</p>
                <p className="text-[11px] text-[#B3A6C9] truncate">{resolvedTicket.familyName}</p>
              </div>
            </div>

            {joinError && <p className="mt-3 text-xs text-[#FFB4C4]">{joinError}</p>}

            {state.phase === 'idle' && (
              <p className="mt-8 text-center text-sm text-[#B3A6C9]">
                {ticket
                  ? 'কুইজ বন্ধ — গেস্ট কার্ডে ফেরত যাচ্ছেন।'
                  : 'কুইজ এখনও শুরু হয়নি — এই পেজেই থাকুন, হোস্ট শুরু করলে স্বয়ংক্রিয়ভাবে লবিতে যোগ হয়ে যাবেন।'}
              </p>
            )}

            {(state.phase === 'lobby' || joining) && state.phase !== 'idle' && (
              <div className="mt-8 text-center">
                <Music2 className="w-10 h-10 text-[#D4AF37] mx-auto mb-3" />
                <p className="font-bold text-[#F0D78C]">আপনি লবিতে আছেন</p>
                <p className="text-xs text-[#B3A6C9] mt-2">স্টেজ থেকে প্রশ্ন শুরু হলে এখানে অপশন আসবে।</p>
                <p className="mt-4 text-2xl font-black text-[#F0D78C]">{players.filter((p) => p.sessionId === state.sessionId).length}</p>
                <p className="text-[11px] text-[#B3A6C9]">জন খেলোয়াড়</p>
              </div>
            )}

            {state.phase === 'question' && question && (
              <div className="mt-6">
                <div className="flex items-center justify-between text-xs mb-3">
                  <span className="text-[#B3A6C9]">প্রশ্ন {state.questionIndex + 1}/{state.questionCount}</span>
                  <span className={`font-black ${remainingSec <= 5 ? 'text-[#FFB4C4]' : 'text-[#F0D78C]'}`}>
                    {timeUp ? 'সময় শেষ' : `${remainingSec}s`}
                  </span>
                </div>
                <p className="text-base font-bold leading-snug mb-4">{question.prompt}</p>
                <div className="grid grid-cols-1 gap-2">
                  {question.options.map((option, index) => {
                    const selected = myAnswer?.choiceIndex === index;
                    return (
                      <button
                        key={option}
                        type="button"
                        disabled={Boolean(myAnswer) || submitting || timeUp}
                        onClick={() => handleChoice(index)}
                        className="w-full rounded-xl px-3 py-3 text-left font-bold text-sm text-white disabled:opacity-80 cursor-pointer"
                        style={{
                          background: QUIZ_OPTION_COLORS[index],
                          outline: selected ? '3px solid #F0D78C' : 'none',
                        }}
                      >
                        <span className="mr-2">{QUIZ_OPTION_SHAPES[index]}</span>
                        {option}
                      </button>
                    );
                  })}
                </div>
                {myAnswer && <p className="mt-3 text-center text-xs text-[#F0D78C] font-bold">উত্তর গৃহীত — ফলাফল আসছে</p>}
                {timeUp && !myAnswer && <p className="mt-3 text-center text-xs text-[#FFB4C4]">সময় শেষ — পরের রাউন্ডের অপেক্ষা করুন</p>}
                {submitError && <p className="mt-2 text-xs text-[#FFB4C4]">{submitError}</p>}
              </div>
            )}

            {state.phase === 'reveal' && question && (
              <div className="mt-6 text-center">
                <p className="text-xs text-[#B3A6C9] mb-2">প্রশ্ন {state.questionIndex + 1} — সঠিক উত্তর</p>
                <p className="rounded-xl bg-[#26890C] text-white font-bold py-3 px-3">
                  {question.options[question.answerIndex]}
                </p>
                <p className={`mt-4 text-lg font-black ${myAnswer?.correct ? 'text-[#F0D78C]' : 'text-[#FFB4C4]'}`}>
                  {myAnswer?.correct ? `সঠিক! +${myAnswer.points}` : myAnswer ? 'ভুল উত্তর' : 'উত্তর দেননি'}
                </p>
                {myRow && (
                  <p className="mt-2 text-sm text-[#B3A6C9]">
                    এখন র্যাঙ্ক #{myRow.rank} · {myRow.totalPoints} পয়েন্ট
                  </p>
                )}
              </div>
            )}

            {state.phase === 'podium' && (
              <div className="mt-8 text-center">
                <Trophy className="w-12 h-12 text-[#D4AF37] mx-auto mb-3" />
                {myRow && myRow.rank <= 3 ? (
                  <>
                    <p className="text-2xl font-black text-[#F0D78C]">{QUIZ_PRIZES[myRow.rank - 1].label} স্থান</p>
                    <p className="mt-2 text-lg font-bold">StarMaker Gold Coin {QUIZ_PRIZES[myRow.rank - 1].coins}</p>
                  </>
                ) : (
                  <>
                    <p className="text-lg font-bold">ধন্যবাদ খেলার জন্য</p>
                    {myRow && <p className="mt-2 text-sm text-[#B3A6C9]">আপনার স্থান #{myRow.rank} · {myRow.totalPoints} পয়েন্ট</p>}
                  </>
                )}
                <a href={getGuestCardPageUrl(resolvedTicket.ticketId)} className="inline-block mt-6 text-xs text-[#B3A6C9] underline">
                  গেস্ট কার্ডে ফিরুন
                </a>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
