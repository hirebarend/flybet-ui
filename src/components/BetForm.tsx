import { useState } from 'react';
import { STAKE_OPTIONS, type BetOutcome, type StakeAmount } from '@/types';
import { placeBet, canPlaceBet } from '@/lib/bets';

export interface BetOption {
  outcome: BetOutcome;
  label: string;
}

interface BetFormProps {
  userId: string;
  flightId: string;
  scheduledDeparture: string;
  balance: number;
  category: string;
  icon: string;
  options: [BetOption, BetOption];
  onBetPlaced: () => void;
}

const OUTCOME_COLORS: Record<BetOutcome, string> = {
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
  category,
  icon,
  options,
  onBetPlaced,
}: BetFormProps) {
  const [selectedOption, setSelectedOption] = useState<BetOutcome | null>(null);
  const [placing, setPlacing] = useState<StakeAmount | null>(null);
  const [error, setError] = useState<string | null>(null);

  const bettingOpen = canPlaceBet(scheduledDeparture);
  const color = selectedOption ? OUTCOME_COLORS[selectedOption] : '#64748B';

  const handleChipClick = async (amount: StakeAmount) => {
    if (!selectedOption) return;

    setPlacing(amount);
    setError(null);

    try {
      await placeBet(userId, flightId, selectedOption, amount);
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
        <span className="text-base">{icon}</span>
        <span className="text-sm font-semibold text-[#F1F5F9]">{category}</span>
      </div>

      {!bettingOpen ? (
        <p className="text-xs text-[#64748B]">
          Betting is closed for this flight.
        </p>
      ) : (
        <>
          {/* Position toggle */}
          <div className="mb-3 flex gap-2">
            {options.map((opt) => {
              const isSelected = selectedOption === opt.outcome;
              const optColor = OUTCOME_COLORS[opt.outcome];
              return (
                <button
                  key={opt.outcome}
                  onClick={() => {
                    setSelectedOption(opt.outcome);
                    setError(null);
                  }}
                  disabled={placing !== null}
                  className={`flex-1 rounded-lg border px-3 py-2 text-xs font-semibold transition ${
                    isSelected
                      ? ''
                      : 'border-[#1E2D3D] text-[#94A3B8] hover:border-[#2A3F55] hover:text-[#F1F5F9]'
                  }`}
                  style={
                    isSelected
                      ? { borderColor: optColor, backgroundColor: `${optColor}15`, color: optColor }
                      : undefined
                  }
                >
                  {opt.label}
                </button>
              );
            })}
          </div>

          {/* Stake chips */}
          <div className="flex gap-2">
            {STAKE_OPTIONS.map((amount) => (
              <button
                key={amount}
                onClick={() => handleChipClick(amount)}
                disabled={!selectedOption || balance < amount || placing !== null}
                className={`flex-1 rounded-lg border px-2 py-1.5 font-mono text-xs transition ${
                  placing === amount
                    ? 'animate-pulse'
                    : !selectedOption || balance < amount
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

          {!selectedOption && (
            <p className="mt-2 text-[10px] text-[#64748B]">
              Select your position above to place a bet
            </p>
          )}

          {error && (
            <p className="mt-2 text-xs text-[#EF4444]">{error}</p>
          )}
        </>
      )}
    </div>
  );
}
