import { useEffect, useMemo, useState } from 'react';
import { QuizQuestionCount, QuizState } from '../types';
import {
  DEFAULT_QUIZ_TIMER_SECONDS,
  getQuizQuestions,
} from '../data/quizQuestions';
import { remainingQuestionMs } from '../utils/quizScoring';
import {
  IDLE_STATE,
  getQuizScreenUrl,
  leaderboardForSession,
  openQuizLobby,
  resetQuiz,
  revealQuizQuestion,
  showQuizPodium,
  startQuizQuestion,
  subscribeToQuizAnswers,
  subscribeToQuizPlayers,
  subscribeToQuizState,
} from '../utils/quizStorage';
import { Check, Copy, Loader2, MonitorPlay, Music2, RotateCcw, Trophy } from 'lucide-react';

interface AdminQuizPanelProps {
  actorName: string;
}

export default function AdminQuizPanel({ actorName }: AdminQuizPanelProps) {
  const [state, setState] = useState<QuizState>(IDLE_STATE);
  const [players, setPlayers] = useState<import('../types').QuizPlayer[]>([]);
  const [answers, setAnswers] = useState<import('../types').QuizAnswer[]>([]);
  const [questionCount, setQuestionCount] = useState<QuizQuestionCount>(10);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [now, setNow] = useState(Date.now());

  useEffect(() => subscribeToQuizState(setState), []);
  useEffect(() => subscribeToQuizPlayers(setPlayers), []);
  useEffect(() => subscribeToQuizAnswers(setAnswers), []);
  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 250);
    return () => window.clearInterval(timer);
  }, []);

  const sessionPlayers = players.filter((player) => player.sessionId === state.sessionId);
  const board = leaderboardForSession(players, answers, state.sessionId);
  const questions = getQuizQuestions(state.questionCount || questionCount);
  const question = questions[state.questionIndex];
  const remainingSec = Math.ceil(
    remainingQuestionMs(state.questionStartedAt, state.timerSeconds || DEFAULT_QUIZ_TIMER_SECONDS, now) / 1000
  );
  const isLastQuestion = state.questionIndex >= state.questionCount - 1;
  const answeredThisQuestion = answers.filter(
    (answer) => answer.sessionId === state.sessionId && answer.questionIndex === state.questionIndex
  ).length;
  const screenUrl = useMemo(() => (typeof window === 'undefined' ? '' : getQuizScreenUrl()), []);

  const run = async (action: () => Promise<void>) => {
    setBusy(true);
    setError('');
    try {
      await action();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'কাজটি হয়নি');
    } finally {
      setBusy(false);
    }
  };

  const copyScreen = async () => {
    try {
      await navigator.clipboard.writeText(screenUrl);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setError('লিংক কপি হয়নি');
    }
  };

  return (
    <div className="space-y-4 font-body">
      <p className="text-xs text-[#B3A6C9] bg-[#0F0C1A] border border-[#D4AF37]/30 rounded-xl p-3">
        স্টেজ কুইজ Kahoot স্টাইল। প্রজেক্টরে{' '}
        <span className="text-[#F0D78C] font-mono">?quiz=screen</span> খুলুন। গেস্ট QR সবসময় কার্ডই খোলে —
        কুইজ চলাকালীন কার্ডে <span className="text-[#F0D78C] font-bold">কুইজে যোগ দিন</span> বাটন আসবে।
        শেষে <span className="text-[#F0D78C] font-bold">কুইজ রিসেট / বন্ধ</span> চাপুন, নাহলে লবি খোলা থেকে যায়।
        সিস্টেম ১ম/২য়/৩য় ঠিক করবে — StarMaker কয়েন অ্যাপে হাতে গিফট করবেন।
      </p>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={copyScreen}
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#1C1730] border border-[#D4AF37]/50 text-[#F0D78C] text-xs font-bold cursor-pointer"
        >
          {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
          {copied ? 'কপি হয়েছে' : 'প্রজেক্টর লিংক কপি'}
        </button>
        <a
          href={screenUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#7A1F3D] border border-[#D4AF37]/50 text-[#F0D78C] text-xs font-bold"
        >
          <MonitorPlay className="w-3.5 h-3.5" />
          স্ক্রিন খুলুন
        </a>
      </div>

      {state.phase === 'idle' && (
        <div className="rounded-2xl border border-[#D4AF37]/30 bg-[#0F0C1A] p-4 space-y-3">
          <p className="text-sm font-bold text-[#F0D78C]">লবি খুলুন</p>
          <div className="flex gap-2">
            {([10, 15] as const).map((count) => (
              <button
                key={count}
                type="button"
                onClick={() => setQuestionCount(count)}
                className={`px-3 py-1.5 rounded-full text-xs font-bold cursor-pointer border ${
                  questionCount === count
                    ? 'bg-[#7A1F3D] text-[#F0D78C] border-[#D4AF37]'
                    : 'bg-[#1C1730] text-[#B3A6C9] border-[#D4AF37]/30'
                }`}
              >
                {count} টি প্রশ্ন
              </button>
            ))}
          </div>
          <button
            type="button"
            disabled={busy}
            onClick={() => run(() => openQuizLobby({ questionCount, actorName }))}
            className="w-full py-3 gold-gradient-btn text-[#0F0C1A] font-extrabold rounded-xl cursor-pointer disabled:opacity-60"
          >
            {busy ? 'খুলছে...' : 'লবি খুলুন — অতিথিরা জয়েন করুক'}
          </button>
        </div>
      )}

      {state.phase === 'lobby' && (
        <div className="rounded-2xl border border-[#D4AF37]/30 bg-[#0F0C1A] p-4 space-y-3">
          <p className="text-sm font-bold text-[#F0D78C] flex items-center gap-2">
            <Music2 className="w-4 h-4" /> লবি চলছে · {sessionPlayers.length} জন
          </p>
          <div className="max-h-32 overflow-y-auto text-xs space-y-1">
            {sessionPlayers.length === 0 ? (
              <p className="text-[#B3A6C9]">এখনও কেউ জয়েন করেনি — স্টেজ থেকে QR স্ক্যান করতে বলুন।</p>
            ) : (
              sessionPlayers.map((player) => (
                <p key={player.ticketId} className="text-[#F6EFE0]">
                  {player.fullName} <span className="text-[#B3A6C9]">· {player.familyName}</span>
                </p>
              ))
            )}
          </div>
          <button
            type="button"
            disabled={busy || sessionPlayers.length === 0}
            onClick={() => run(() => startQuizQuestion({ state, questionIndex: 0, actorName }))}
            className="w-full py-3 gold-gradient-btn text-[#0F0C1A] font-extrabold rounded-xl cursor-pointer disabled:opacity-60"
          >
            প্রথম প্রশ্ন শুরু করুন
          </button>
        </div>
      )}

      {state.phase === 'question' && question && (
        <div className="rounded-2xl border border-[#D4AF37]/30 bg-[#0F0C1A] p-4 space-y-3">
          <div className="flex justify-between text-xs text-[#B3A6C9]">
            <span>
              প্রশ্ন {state.questionIndex + 1}/{state.questionCount}
            </span>
            <span className="font-black text-[#F0D78C]">{remainingSec}s</span>
          </div>
          <p className="text-sm font-bold">{question.prompt}</p>
          <p className="text-xs text-[#B3A6C9]">
            উত্তর এসেছে {answeredThisQuestion}/{sessionPlayers.length}
          </p>
          <button
            type="button"
            disabled={busy}
            onClick={() => run(() => revealQuizQuestion({ state, actorName }))}
            className="w-full py-3 gold-gradient-btn text-[#0F0C1A] font-extrabold rounded-xl cursor-pointer disabled:opacity-60"
          >
            লক করুন ও সঠিক উত্তর দেখান
          </button>
        </div>
      )}

      {state.phase === 'reveal' && question && (
        <div className="rounded-2xl border border-[#D4AF37]/30 bg-[#0F0C1A] p-4 space-y-3">
          <p className="text-xs text-[#B3A6C9]">সঠিক: {question.options[question.answerIndex]}</p>
          <ol className="text-xs space-y-1">
            {board.slice(0, 5).map((row) => (
              <li key={row.ticketId} className="flex justify-between text-[#F6EFE0]">
                <span>
                  #{row.rank} {row.fullName}
                </span>
                <span className="text-[#F0D78C] font-bold">{row.totalPoints}</span>
              </li>
            ))}
          </ol>
          {isLastQuestion ? (
            <button
              type="button"
              disabled={busy}
              onClick={() => run(() => showQuizPodium({ state, actorName }))}
              className="w-full py-3 gold-gradient-btn text-[#0F0C1A] font-extrabold rounded-xl cursor-pointer disabled:opacity-60 inline-flex items-center justify-center gap-2"
            >
              <Trophy className="w-4 h-4" />
              পডিয়াম দেখান (১ম ২য় ৩য়)
            </button>
          ) : (
            <button
              type="button"
              disabled={busy}
              onClick={() => run(() => startQuizQuestion({ state, questionIndex: state.questionIndex + 1, actorName }))}
              className="w-full py-3 gold-gradient-btn text-[#0F0C1A] font-extrabold rounded-xl cursor-pointer disabled:opacity-60"
            >
              পরের প্রশ্ন
            </button>
          )}
        </div>
      )}

      {state.phase === 'podium' && (
        <div className="rounded-2xl border border-[#D4AF37]/30 bg-[#0F0C1A] p-4 space-y-2">
          <p className="text-sm font-bold text-[#F0D78C]">ফাইনাল স্ট্যান্ডিং</p>
          {board.slice(0, 3).map((row, index) => (
            <p key={row.ticketId} className="text-sm">
              {index === 0 ? '১ম' : index === 1 ? '২য়' : '৩য়'} · {row.fullName} · {row.totalPoints} পয়েন্ট
            </p>
          ))}
        </div>
      )}

      {state.phase !== 'idle' && (
        <button
          type="button"
          disabled={busy}
          onClick={() => run(() => resetQuiz(actorName))}
          className="w-full py-2.5 rounded-xl bg-[#0F0C1A] border border-[#A52C54]/50 text-[#F6EFE0] text-xs font-bold cursor-pointer inline-flex items-center justify-center gap-2"
        >
          {busy ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <RotateCcw className="w-3.5 h-3.5" />}
          কুইজ রিসেট / বন্ধ
        </button>
      )}

      {error && <p className="text-xs text-[#FFB4C4]">{error}</p>}
    </div>
  );
}
