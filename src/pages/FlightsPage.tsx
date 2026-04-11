import { useMemo, useState } from 'react';
import { useFlights } from '@/hooks/useFlights';
import { useFlightPools } from '@/hooks/useFlightPools';
import { computeBettingStatus } from '@/lib/flight-status';
import FlightCard from '@/components/FlightCard';

export default function FlightsPage() {
  const { flights, loading } = useFlights();
  const pools = useFlightPools();
  const [activeTab, setActiveTab] = useState<'all' | 'open'>('all');

  const filteredFlights = useMemo(
    () =>
      activeTab === 'open'
        ? flights.filter((flight) => computeBettingStatus(flight) === 'Open')
        : flights,
    [activeTab, flights]
  );

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

      <div className="mb-4 flex rounded-xl border border-[#1E2D3D] bg-[#111827] p-1">
        <button
          onClick={() => setActiveTab('all')}
          className={`flex-1 rounded-lg px-3 py-2 text-xs font-bold uppercase tracking-wider transition ${
            activeTab === 'all'
              ? 'bg-[#E6007E]/10 text-[#E6007E]'
              : 'text-[#64748B] hover:text-[#94A3B8]'
          }`}
        >
          All Flights
        </button>
        <button
          onClick={() => setActiveTab('open')}
          className={`flex-1 rounded-lg px-3 py-2 text-xs font-bold uppercase tracking-wider transition ${
            activeTab === 'open'
              ? 'bg-[#22C55E]/10 text-[#22C55E]'
              : 'text-[#64748B] hover:text-[#94A3B8]'
          }`}
        >
          Open Flights
        </button>
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
        ) : filteredFlights.length === 0 ? (
          <div className="py-12 text-center text-sm text-[#64748B]">
            {activeTab === 'open' ? 'No open flights right now.' : 'No flights available right now.'}
          </div>
        ) : (
          <>
            {filteredFlights.map((flight) => (
              <div key={flight.id}>
                <FlightCard flight={flight} pool={pools.get(flight.id)} />
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
}
