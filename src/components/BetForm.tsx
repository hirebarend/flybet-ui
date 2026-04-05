import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { STAKE_OPTIONS, type BetOutcome, type StakeAmount } from '@/types';
import { placeBet, canPlaceBet } from '@/lib/bets';

interface BetFormProps {
  userId: string;
  flightId: string;
  scheduledDeparture: string;
  balance: number;
  outcome: BetOutcome;
  label: string;
  icon: string;
  onBetPlaced: () => void;
}

const OUTCOME_COLORS: Record<BetOutcome, string> = {
  onTimeDeparture: '#22C55E',
  onTimeArrival: '#3CA2C8',
  cancelled: '#EF4444',
};

export default function BetForm({
  userId,
  flightId,
  scheduledDeparture,
  balance,
  outcome,
  label,
  icon,
  onBetPlaced,
}: BetFormProps) {
  const [selectedAmount, setSelectedAmount] = useState<StakeAmount | null>(null);
  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const bettingOpen = canPlaceBet(scheduledDeparture);
  const color = OUTCOME_COLORS[outcome];

  const handlePlaceBet = async () => {
    if (!selectedAmount) return;
    setPlacing(true);
    setError(null);

    try {
      await placeBet(userId, flightId, outcome, selectedAmount);
      setSelectedAmount(null);
      onBetPlaced();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to place bet');
    } finally {
      setPlacing(false);
    }
  };

  return (
    <div className="rounded-xl border border-[#1E2D3D] bg-[#1A2332] p-4">
      <div className="mb-3 flex items-center gap-2">
        <span className="text-base">{icon}</span>
        <span className="text-sm font-semibold text-[#F1F5F9]">{label}</span>
      </div>

      {!bettingOpen ? (
        <p className="text-xs text-[#64748B]">
          Betting is closed for this flight.
        </p>
      ) : (
        <>
          <div className="flex gap-2">
            {STAKE_OPTIONS.map((amount) => (
              <button
                key={amount}
                onClick={() => setSelectedAmount(amount)}
                disabled={balance < amount}
                className={`flex-1 rounded-lg border px-2 py-1.5 font-mono text-xs transition ${
                  selectedAmount === amount
                    ? ''
                    : balance < amount
                    ? 'border-[#1E2D3D] text-[#64748B]/50 cursor-not-allowed'
                    : 'border-[#1E2D3D] text-[#94A3B8] hover:border-[#2A3F55] hover:text-[#F1F5F9]'
                }`}
                style={
                  selectedAmount === amount
                    ? { borderColor: color, backgroundColor: `${color}15`, color }
                    : undefined
                }
              >
                R{amount}
              </button>
            ))}
          </div>

          {error && (
            <p className="mt-2 text-xs text-[#EF4444]">{error}</p>
          )}

          {selectedAmount && (
            <Button
              onClick={handlePlaceBet}
              disabled={placing}
              className="mt-3 w-full text-white"
              style={{ backgroundColor: color }}
            >
              {placing ? 'Placing...' : `Bet R${selectedAmount} on ${label}`}
            </Button>
          )}
        </>
      )}
    </div>
  );
}
