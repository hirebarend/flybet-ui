import { useNavigate } from 'react-router-dom';
import { Plane, Users, Coins } from 'lucide-react';
import { Card } from '@/components/ui/card';
import type { Flight } from '@/types';
import { AIRPORT_NAMES, getFlightNumber } from '@/types';
import { computeBettingStatus, getBettingStatusStyle } from '@/lib/flight-status';
import { getFlightLegTimeDisplay } from '@/lib/flight-times';
import { getBasePool } from '@/lib/utils';
import type { FlightPool } from '@/hooks/useFlightPools';

interface FlightCardProps {
  flight: Flight;
  pool?: FlightPool;
}

export default function FlightCard({ flight, pool }: FlightCardProps) {
  const navigate = useNavigate();
  const depCode = flight.departure.airport.code;
  const arrCode = flight.arrival.airport.code;
  const bettingStatus = computeBettingStatus(flight);
  const departureDisplay = getFlightLegTimeDisplay(
    flight.departure.scheduled,
    bettingStatus === 'Settled' ? flight.departure.actual : null
  );
  const arrivalDisplay = getFlightLegTimeDisplay(
    flight.arrival.scheduled,
    bettingStatus === 'Settled' ? flight.arrival.actual : null
  );
  const { basePool, baseStakers } = getBasePool(flight.id);
  const totalPool = basePool + (pool?.totalPool ?? 0);
  const totalStakers = baseStakers + (pool?.stakerCount ?? 0);

  return (
    <Card
      className="cursor-pointer border-[#1E2D3D] bg-[#111827] transition hover:-translate-y-0.5 hover:border-[#2A3F55] hover:shadow-[0_12px_40px_rgba(0,0,0,0.3)]"
      onClick={() => navigate(`/flight/${flight.id}`)}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-3 pb-1">
        <span className="font-mono text-sm font-bold text-[#F1F5F9]">
          {getFlightNumber(flight)}
        </span>
        <span
          className={`rounded-md border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${getBettingStatusStyle(bettingStatus)}`}
        >
          {bettingStatus}
        </span>
      </div>

      {/* Route */}
      <div className="flex items-center gap-3 px-4 pb-3">
        <div className="text-center">
          <div className="font-mono text-xl font-bold text-[#F1F5F9]">
            {depCode}
          </div>
          <div className="text-[10px] text-[#64748B]">
            {AIRPORT_NAMES[depCode] || depCode}
          </div>
          <div className="mt-1 flex items-center justify-center gap-1 font-mono text-xs">
            <span className="text-[#94A3B8]">{departureDisplay.timeLabel}</span>
            {departureDisplay.deltaLabel && (
              <span className={`font-bold ${departureDisplay.deltaClassName}`}>
                {departureDisplay.deltaLabel}
              </span>
            )}
          </div>
        </div>

        {/* Route line */}
        <div className="relative flex flex-1 items-center">
          <div className="h-[2px] w-full bg-[#1E2D3D]">
            <div className="absolute left-0 top-1/2 h-1.5 w-1.5 -translate-y-1/2 rounded-full border-2 border-[#2A3F55] bg-[#111827]" />
            <div className="absolute right-0 top-1/2 h-1.5 w-1.5 -translate-y-1/2 rounded-full border-2 border-[#2A3F55] bg-[#111827]" />
          </div>
          <Plane
            className="absolute left-1/2 top-1/2 h-3.5 w-3.5 text-[#E6007E]"
            style={{ transform: 'translate(-50%, -50%) rotate(45deg)' }}
          />
        </div>

        <div className="text-center">
          <div className="font-mono text-xl font-bold text-[#F1F5F9]">
            {arrCode}
          </div>
          <div className="text-[10px] text-[#64748B]">
            {AIRPORT_NAMES[arrCode] || arrCode}
          </div>
          <div className="mt-1 flex items-center justify-center gap-1 font-mono text-xs">
            <span className="text-[#94A3B8]">{arrivalDisplay.timeLabel}</span>
            {arrivalDisplay.deltaLabel && (
              <span className={`font-bold ${arrivalDisplay.deltaClassName}`}>
                {arrivalDisplay.deltaLabel}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Pool stats */}
      <div className="flex items-center justify-center gap-4 border-t border-[#1E2D3D] px-4 py-2">
        <span className="flex items-center gap-1 text-xs text-[#94A3B8]">
          <Coins className="h-3 w-3 text-[#E6007E]" />
          <span className="font-mono font-medium text-[#F1F5F9]">
            R {totalPool.toLocaleString()}
          </span>
          <span className="text-[#64748B]">pooled</span>
        </span>
        <span className="text-[#1E2D3D]">·</span>
        <span className="flex items-center gap-1 text-xs text-[#94A3B8]">
          <Users className="h-3 w-3 text-[#3CA2C8]" />
          <span className="font-mono font-medium text-[#F1F5F9]">
            {totalStakers.toLocaleString()}
          </span>
          <span className="text-[#64748B]">{totalStakers === 1 ? 'staker' : 'stakers'}</span>
        </span>
      </div>
    </Card>
  );
}
