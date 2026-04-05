import { useMemo } from 'react';
import { Lock } from 'lucide-react';
import { useFlights } from '@/hooks/useFlights';
import { useFlightPools } from '@/hooks/useFlightPools';
import { canPlaceBet } from '@/lib/bets';
import FlightCard from '@/components/FlightCard';

export default function FlightsPage() {
  const { flights, loading } = useFlights();
  const pools = useFlightPools();

  // Find the index where closed flights begin
  const closedIndex = useMemo(
    () => flights.findIndex((f) => !canPlaceBet(f.departure.scheduled)),
    [flights]
  );
  const hasOpen = closedIndex !== 0;
  const hasClosed = closedIndex !== -1;

  return (
    <div>
      {/* Hero */}
      <div className="py-8 text-center">
        <h1 className="text-3xl font-black tracking-tight">
          Predict <span className="text-[#E6007E]">Fly</span><span className="text-[#3CA2C8]">Safair</span>
          <br />
          flight outcomes.
        </h1>
        <p className="mx-auto mt-2 max-w-xs text-sm text-[#94A3B8]">
          Pick a flight. Predict the outcome. Stake your R's.
        </p>
      </div>

      {/* Flight cards */}
      <div className="flex flex-col gap-3 pb-8">
        {loading ? (
          Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="h-32 animate-pulse rounded-xl bg-[#111827] border border-[#1E2D3D]"
            />
          ))
        ) : flights.length === 0 ? (
          <div className="py-12 text-center text-sm text-[#64748B]">
            No flights available right now.
          </div>
        ) : (
          <>
            {flights.map((flight, index) => (
              <div key={flight.id}>
                {/* Separator before the closed flights section */}
                {hasClosed && hasOpen && index === closedIndex && (
                  <div className="mb-3 flex items-center gap-2 pt-2">
                    <div className="h-px flex-1 bg-[#1E2D3D]" />
                    <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-[#64748B]">
                      <Lock className="h-3 w-3" /> Betting Closed
                    </span>
                    <div className="h-px flex-1 bg-[#1E2D3D]" />
                  </div>
                )}
                <FlightCard flight={flight} pool={pools.get(flight.id)} />
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
}
