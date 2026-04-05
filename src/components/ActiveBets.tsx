import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { cancelBet, canPlaceBet } from '@/lib/bets';
import type { Bet, BetOutcome } from '@/types';

const OUTCOME_LABELS: Record<BetOutcome, string> = {
  onTimeDeparture: 'On-Time Departure',
  delayedDeparture: 'Delayed Departure',
  onTimeArrival: 'On-Time Arrival',
  delayedArrival: 'Delayed Arrival',
  cancelled: 'Will Be Cancelled',
  notCancelled: 'Won\'t Be Cancelled',
};

const OUTCOME_COLORS: Record<BetOutcome, string> = {
  onTimeDeparture: '#22C55E',
  delayedDeparture: '#F59E0B',
  onTimeArrival: '#3CA2C8',
  delayedArrival: '#F59E0B',
  cancelled: '#EF4444',
  notCancelled: '#22C55E',
};

interface ActiveBetsProps {
  bets: Bet[];
  userId: string;
  scheduledDeparture: string;
}

export default function ActiveBets({ bets, userId, scheduledDeparture }: ActiveBetsProps) {
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  if (bets.length === 0) return null;

  const canCancel = canPlaceBet(scheduledDeparture);

  const handleCancel = async (bet: Bet) => {
    setCancellingId(bet.id);
    try {
      await cancelBet(bet.id, userId, bet.amount);
    } catch (err) {
      console.error('Failed to cancel bet:', err);
    } finally {
      setCancellingId(null);
    }
  };

  return (
    <div className="rounded-xl border border-[#1E2D3D] bg-[#111827] p-4">
      <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-[#64748B]">
        Your Bets
      </h3>
      <div className="flex flex-col gap-2">
        {bets.map((bet) => {
          const color = OUTCOME_COLORS[bet.outcome];
          return (
            <div
              key={bet.id}
              className="flex items-center justify-between rounded-lg border border-[#1E2D3D] bg-[#1A2332] px-3 py-2"
            >
              <div>
                <span
                  className="text-xs font-semibold"
                  style={{ color }}
                >
                  {OUTCOME_LABELS[bet.outcome]}
                </span>
                <span className="ml-2 font-mono text-xs text-[#F1F5F9]">
                  R{bet.amount}
                </span>
              </div>
              {canCancel && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleCancel(bet)}
                  disabled={cancellingId === bet.id}
                  className="text-[#EF4444] hover:bg-[#EF4444]/10 hover:text-[#EF4444]"
                >
                  {cancellingId === bet.id ? '...' : 'Cancel'}
                </Button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
