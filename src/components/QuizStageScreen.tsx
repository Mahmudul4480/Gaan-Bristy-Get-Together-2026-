import { useEffect, useMemo, useState } from 'react';
import confetti from 'canvas-confetti';
import { QuizLeaderboardRow } from '../types';
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
  leaderboardForSession,
  subscribeToQuizAnswers,
  subscribeToQuizPlayers,
  subscribeToQuizState,
} from '../utils/quizStorage';
import { Music2, Trophy } from 'lucide-react';

export default function QuizStageScreen() {
  const [state, setState] = useState(IDLE_STATE);
  const [players, setPlayers] = useState<import('../types').QuizPlayer[]>([]);
  const [answers, setAnswers] = useState<import('../types').QuizAnswer[]>([]);
  const [now, setNow] = useState(Date.now());
  const [podiumStep, setPodiumStep] = useState(0);

  useEffect(() => subscribeToQuizState(setState), []);
  useEffect(() => subscribeToQuizPlayers(setPlayers), []);
  useEffect(() => subscribeToQuizAnswers(setAnswers), []);
  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 200);
    return () => window.clearInterval(timer);
  }, []);

  const sessionPlayers = players.filter((player) => player.sessionId === state.sessionId);
  const board = leaderboardForSession(players, answers, state.sessionId);
  const questions = getQuizQuestions(state.questionCount);
  const question = questions[state.questionIndex];
  const remainingSec = Math.ceil(
    remainingQuestionMs(state.questionStartedAt, state.timerSeconds || DEFAULT_QUIZ_TIMER_SECONDS, now) / 1000
  );
  const answeredCount = answers.filter(
    (answer) => answer.sessionId === state.sessionId && answer.questionIndex === state.questionIndex
  ).length;

  useEffect(() => {
    if (state.phase !== 'podium') {
      setPodiumStep(0);
      return;
    }
    setPodiumStep(0);
    const timers = [
      window.setTimeout(() => setPodiumStep(1), 600),
      window.setTimeout(() => setPodiumStep(2), 2400),
      window.setTimeout(() => {
        setPodiumStep(3);
        confetti({
          particleCount: 160,
          spread: 80,
          origin: { y: 0.35 },
          colors: ['#D4AF37', '#F0D78C', '#7A1F3D', '#FFFFFF'],
        });
      }, 4300),
    ];
    return () => timers.forEach((timer) => window.clearTimeout(timer));
  }, [state.phase, state.sessionId]);

  const topThree = useMemo(() => board.slice(0, 3), [board]);

  return (
    <div className="min-h-dvh bg-[#0F0C1A] text-[#F6EFE0] midnight-bg-glow overflow-hidden">
      <div className="max-w-6xl mx-auto px-6 py-8 min-h-dvh flex flex-col">
        <p className="text-center text-xs uppercase tracking-[0.4em] text-[#D4AF37] font-black">Gaan Bristy Get Together 2026</p>
        <h1 className="text-center text-3xl sm:text-5xl font-black font-serif royal-title-effect mt-2">স্টেজ কুইজ</h1>

        {state.phase === 'idle' && (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-xl text-[#B3A6C9]">হোস্ট লবি খুললে এখানে খেলোয়াড়দের নাম উঠবে</p>
          </div>
        )}

        {state.phase === 'lobby' && (
          <div className="flex-1 mt-8">
            <p className="text-center text-[#F0D78C] font-bold text-lg mb-6 flex items-center justify-center gap-2">
              <Music2 className="w-6 h-6" />
              নিজের গেস্ট কার্ড QR স্ক্যান করে জয়েন করুন
            </p>
            <p className="text-center text-5xl font-black text-[#F0D78C] mb-6">{sessionPlayers.length}</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {sessionPlayers.map((player) => (
                <div key={player.ticketId} className="rounded-2xl border border-[#D4AF37]/35 bg-[#1C1730] px-3 py-3 text-center">
                  <p className="font-bold truncate">{player.fullName}</p>
                  <p className="text-[11px] text-[#B3A6C9] truncate">{player.familyName}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {state.phase === 'question' && question && (
          <div className="flex-1 mt-6">
            <div className="flex justify-between items-end mb-4">
              <p className="text-[#B3A6C9]">
                প্রশ্ন {state.questionIndex + 1} / {state.questionCount}
              </p>
              <p className={`text-5xl font-black ${remainingSec <= 5 ? 'text-[#FFB4C4]' : 'text-[#F0D78C]'}`}>
                {remainingSec}
              </p>
            </div>
            <p className="text-2xl sm:text-4xl font-black leading-snug text-center mb-8">{question.prompt}</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {question.options.map((option, index) => (
                <div
                  key={option}
                  className="rounded-2xl px-5 py-6 text-white text-xl font-black"
                  style={{ background: QUIZ_OPTION_COLORS[index] }}
                >
                  <span className="mr-3">{QUIZ_OPTION_SHAPES[index]}</span>
                  {option}
                </div>
              ))}
            </div>
            <p className="text-center text-sm text-[#B3A6C9] mt-6">
              উত্তর এসেছে {answeredCount} / {sessionPlayers.length}
            </p>
          </div>
        )}

        {state.phase === 'reveal' && question && (
          <div className="flex-1 mt-6">
            <p className="text-center text-sm text-[#B3A6C9] mb-3">সঠিক উত্তর</p>
            <p className="text-center text-2xl sm:text-4xl font-black text-[#F0D78C] mb-8">
              {question.options[question.answerIndex]}
            </p>
            <div className="max-w-xl mx-auto space-y-2">
              {board.slice(0, 8).map((row) => (
                <div key={row.ticketId} className="flex items-center justify-between rounded-xl bg-[#1C1730] border border-[#D4AF37]/25 px-4 py-2">
                  <span className="font-bold">
                    #{row.rank} {row.fullName}
                  </span>
                  <span className="text-[#F0D78C] font-black">{row.totalPoints}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {state.phase === 'podium' && (
          <div className="flex-1 flex flex-col items-center justify-center gap-6">
            <Trophy className="w-16 h-16 text-[#D4AF37]" />
            <p className="text-xl text-[#B3A6C9]">StarMaker Gold Coin বিজয়ী</p>
            <div className="flex items-end justify-center gap-4 sm:gap-8 w-full max-w-3xl">
              <PodiumCard place={2} row={topThree[1]} visible={podiumStep >= 2} height="h-40" />
              <PodiumCard place={1} row={topThree[0]} visible={podiumStep >= 3} height="h-52" />
              <PodiumCard place={3} row={topThree[2]} visible={podiumStep >= 1} height="h-32" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function PodiumCard({
  place,
  row,
  visible,
  height,
}: {
  place: 1 | 2 | 3;
  row?: QuizLeaderboardRow;
  visible: boolean;
  height: string;
}) {
  const prize = QUIZ_PRIZES[place - 1];
  return (
    <div
      className={`flex-1 max-w-[200px] rounded-3xl border-2 border-[#D4AF37] bg-[#1C1730] p-4 text-center transition-all duration-700 ${height} ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
    >
      <p className="text-sm font-black text-[#D4AF37]">{prize.label}</p>
      <p className="mt-2 font-black text-lg leading-tight">{row?.fullName || '—'}</p>
      <p className="text-[11px] text-[#B3A6C9] truncate">{row?.familyName}</p>
      <p className="mt-3 text-[#F0D78C] font-black">{prize.coins} Coins</p>
    </div>
  );
}
