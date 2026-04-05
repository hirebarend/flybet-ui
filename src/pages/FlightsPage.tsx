import { useFlights } from '@/hooks/useFlights';
import FlightCard from '@/components/FlightCard';

export default function FlightsPage() {
  const { flights, loading } = useFlights();

  return (
    <div>
      {/* Hero */}
      <div className="py-8 text-center">
        <h1 className="text-3xl font-black tracking-tight">
          Predict <span className="text-[#E6007E]">FlySafair</span>
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
          flights.map((flight) => (
            <FlightCard key={flight.id} flight={flight} />
          ))
        )}
      </div>
    </div>
  );
}
