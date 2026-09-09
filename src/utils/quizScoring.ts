import { QuizAnswer, QuizLeaderboardRow, QuizPlayer } from '../types';

const MAX_POINTS = 1000;
const MIN_CORRECT_POINTS = 400;

export function scoreQuizAnswer(input: {
  correct: boolean;
  elapsedMs: number;
  timerSeconds: number;
}): number {
  if (!input.correct) return 0;
  const limitMs = Math.max(1000, input.timerSeconds * 1000);
  const elapsed = Math.min(Math.max(0, input.elapsedMs), limitMs);
  const ratio = elapsed / limitMs;
  return Math.max(MIN_CORRECT_POINTS, Math.round(MAX_POINTS * (1 - ratio / 2)));
}

export function computeQuizLeaderboard(
  players: QuizPlayer[],
  answers: QuizAnswer[],
  sessionId: string
): QuizLeaderboardRow[] {
  const sessionPlayers = players.filter((player) => player.sessionId === sessionId);
  const sessionAnswers = answers.filter((answer) => answer.sessionId === sessionId);

  const rows = sessionPlayers.map((player) => {
    const theirs = sessionAnswers.filter((answer) => answer.ticketId === player.ticketId);
    const totalPoints = theirs.reduce((sum, answer) => sum + (answer.points || 0), 0);
    const correctCount = theirs.filter((answer) => answer.correct).length;
    const totalElapsedMs = theirs
      .filter((answer) => answer.correct)
      .reduce((sum, answer) => sum + (answer.elapsedMs || 0), 0);

    return {
      ticketId: player.ticketId,
      fullName: player.fullName,
      familyName: player.familyName,
      photoUrl: player.photoUrl,
      starMakerId: player.starMakerId,
      totalPoints,
      correctCount,
      totalElapsedMs,
      rank: 0,
    };
  });

  rows.sort((a, b) => {
    if (b.totalPoints !== a.totalPoints) return b.totalPoints - a.totalPoints;
    if (b.correctCount !== a.correctCount) return b.correctCount - a.correctCount;
    if (a.totalElapsedMs !== b.totalElapsedMs) return a.totalElapsedMs - b.totalElapsedMs;
    return a.fullName.localeCompare(b.fullName, 'bn');
  });

  return rows.map((row, index) => ({ ...row, rank: index + 1 }));
}

export function remainingQuestionMs(questionStartedAt: string | undefined, timerSeconds: number, now = Date.now()): number {
  if (!questionStartedAt) return timerSeconds * 1000;
  const started = new Date(questionStartedAt).getTime();
  if (Number.isNaN(started)) return 0;
  return Math.max(0, started + timerSeconds * 1000 - now);
}
