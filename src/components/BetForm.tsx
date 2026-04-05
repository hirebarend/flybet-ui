import { useState, type ReactNode } from 'react';
import { STAKE_OPTIONS, type BetOutcome, type StakeAmount } from '@/types';
import { placeBet, canPlaceBet } from '@/lib/bets';

export interface BetSide {
  outcome: BetOutcome;
  label: string;
}

interface BetFormProps {
  userId: string;
  flightId: string;
  scheduledDeparture: string;
  balance: number;
  sides: [BetSide, BetSide];
  categoryLabel: string;
  icon: ReactNode;
  accentColor: string;
  onBetPlaced: () => void;
}

const SIDE_COLORS: Record<BetOutcome, string> = {
  onTimeDeparture: '#22C55E',
  delayedDeparture: '#F59E0B',
  onTimeArrival: '#3CA2C8',
  delayedArrival: '#F59E0B',
  cancelled: '#EF4444',
  notCancelled: '#22C55E',
};

export default function BetForm({
  userId,
  flightId,
  scheduledDeparture,
  balance,
  sides,
  categoryLabel,
  icon,
  onBetPlaced,
}: BetFormProps) {
  const [selectedSide, setSelectedSide] = useState<0 | 1>(0);
  const [placing, setPlacing] = useState<StakeAmount | null>(null);
  const [error, setError] = useState<string | null>(null);

  const bettingOpen = canPlaceBet(scheduledDeparture);
  const activeOutcome = sides[selectedSide].outcome;
  const color = SIDE_COLORS[activeOutcome];

  const handleChipClick = async (amount: StakeAmount) => {
    setPlacing(amount);
    setError(null);

    try {
      await placeBet(userId, flightId, activeOutcome, amount);
      onBetPlaced();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to place bet');
    } finally {
      setPlacing(null);
    }
  };

  return (
    <div className="rounded-xl border border-[#1E2D3D] bg-[#1A2332] p-4">
      <div className="mb-3 flex items-center gap-2">
        <span className="text-[#F1F5F9]">{icon}</span>
        <span className="text-sm font-semibold text-[#F1F5F9]">{categoryLabel}</span>
      </div>

      {!bettingOpen ? (
        <p className="text-xs text-[#64748B]">
          Betting is closed for this flight.
        </p>
      ) : (
        <>
          {/* Segmented toggle */}
          <div className="mb-3 flex rounded-lg border border-[#1E2D3D] bg-[#111827] p-0.5">
            {sides.map((side, idx) => {
              const isActive = selectedSide === idx;
              const sideColor = SIDE_COLORS[side.outcome];
              return (
                <button
                  key={side.outcome}
                  onClick={() => setSelectedSide(idx as 0 | 1)}
                  className={`flex-1 rounded-md px-3 py-1.5 text-xs font-semibold transition ${
                    isActive
                      ? ''
                      : 'text-[#64748B] hover:text-[#94A3B8]'
                  }`}
                  style={
                    isActive
                      ? { backgroundColor: `${sideColor}20`, color: sideColor }
                      : undefined
                  }
                >
                  {side.label}
                </button>
              );
            })}
          </div>

          <div className="flex gap-2">
            {STAKE_OPTIONS.map((amount) => (
              <button
                key={amount}
                onClick={() => handleChipClick(amount)}
                disabled={balance < amount || placing !== null}
                className={`flex-1 rounded-lg border px-2 py-1.5 font-mono text-xs transition ${
                  placing === amount
                    ? 'animate-pulse'
                    : balance < amount
                    ? 'border-[#1E2D3D] text-[#64748B]/50 cursor-not-allowed'
                    : 'border-[#1E2D3D] text-[#94A3B8] hover:border-[#2A3F55] hover:text-[#F1F5F9]'
                }`}
                style={
                  placing === amount
                    ? { borderColor: color, backgroundColor: `${color}15`, color }
                    : undefined
                }
              >
                {placing === amount ? '...' : `R${amount}`}
              </button>
            ))}
          </div>

          {error && (
            <p className="mt-2 text-xs text-[#EF4444]">{error}</p>
          )}
        </>
      )}
    </div>
  );
}
