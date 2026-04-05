import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import type { Flight } from '@/types';
import { AIRPORT_NAMES } from '@/types';

function formatTime(dateStr: string) {
  return new Date(dateStr).toLocaleTimeString('en-ZA', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    Expected: 'bg-[#3CA2C8]/10 text-[#3CA2C8] border-[#3CA2C8]/20',
    Delayed: 'bg-[#F59E0B]/10 text-[#F59E0B] border-[#F59E0B]/20',
    Cancelled: 'bg-[#EF4444]/15 text-[#EF4444] border-[#EF4444]/20',
    Landed: 'bg-[#22C55E]/10 text-[#22C55E] border-[#22C55E]/20',
    Boarding: 'bg-[#E6007E]/10 text-[#E6007E] border-[#E6007E]/20',
  };

  return (
    <span
      className={`rounded-md border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
        styles[status] || styles.Expected
      }`}
    >
      {status}
    </span>
  );
}

export default function FlightCard({ flight }: { flight: Flight }) {
  const navigate = useNavigate();

  return (
    <Card
      className="cursor-pointer border-[#1E2D3D] bg-[#111827] transition hover:-translate-y-0.5 hover:border-[#2A3F55] hover:shadow-[0_12px_40px_rgba(0,0,0,0.3)]"
      onClick={() => navigate(`/flight/${flight.id}`)}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-3 pb-1">
        <span className="font-mono text-sm font-bold text-[#F1F5F9]">
          {flight.flightNumber}
        </span>
        <StatusBadge status={flight.status} />
      </div>

      {/* Route */}
      <div className="flex items-center gap-3 px-4 pb-3">
        <div className="text-center">
          <div className="font-mono text-xl font-bold text-[#F1F5F9]">
            {flight.departureAirport}
          </div>
          <div className="text-[10px] text-[#64748B]">
            {AIRPORT_NAMES[flight.departureAirport] || flight.departureAirport}
          </div>
          <div className="mt-1 font-mono text-xs text-[#94A3B8]">
            {formatTime(flight.scheduledDeparture)}
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
            {flight.arrivalAirport}
          </div>
          <div className="text-[10px] text-[#64748B]">
            {AIRPORT_NAMES[flight.arrivalAirport] || flight.arrivalAirport}
          </div>
          <div className="mt-1 font-mono text-xs text-[#94A3B8]">
            {formatTime(flight.scheduledArrival)}
          </div>
        </div>
      </div>
    </Card>
  );
}
