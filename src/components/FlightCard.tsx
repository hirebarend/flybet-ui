import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import type { Flight } from '@/types';
import { AIRPORT_NAMES, getFlightNumber } from '@/types';
import { computeFlightStatus, getStatusStyle } from '@/lib/flight-status';

function formatTime(dateStr: string) {
  return new Date(dateStr).toLocaleTimeString('en-ZA', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
}

function StatusBadge({ flight }: { flight: Flight }) {
  const status = computeFlightStatus(flight);
  return (
    <span
      className={`rounded-md border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${getStatusStyle(status)}`}
    >
      {status}
    </span>
  );
}

export default function FlightCard({ flight }: { flight: Flight }) {
  const navigate = useNavigate();
  const depCode = flight.departure.airport.code;
  const arrCode = flight.arrival.airport.code;

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
        <StatusBadge flight={flight} />
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
          <div className="mt-1 font-mono text-xs text-[#94A3B8]">
            {formatTime(flight.departure.scheduled)}
          </div>
        </div>

        {/* Route line */}
        <div className="relative flex flex-1 items-center">
          <div className="h-[2px] w-full bg-[#1E2D3D]">
            <div className="absolute left-0 top-1/2 h-1.5 w-1.5 -translate-y-1/2 rounded-full border-2 border-[#2A3F55] bg-[#111827]" />
            <div className="absolute right-0 top-1/2 h-1.5 w-1.5 -translate-y-1/2 rounded-full border-2 border-[#2A3F55] bg-[#111827]" />
          </div>
          <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-xs text-[#E6007E]">
            ✈
          </span>
        </div>

        <div className="text-center">
          <div className="font-mono text-xl font-bold text-[#F1F5F9]">
            {arrCode}
          </div>
          <div className="text-[10px] text-[#64748B]">
            {AIRPORT_NAMES[arrCode] || arrCode}
          </div>
          <div className="mt-1 font-mono text-xs text-[#94A3B8]">
            {formatTime(flight.arrival.scheduled)}
          </div>
        </div>
      </div>
    </Card>
  );
}
