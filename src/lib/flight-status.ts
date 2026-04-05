import type { Flight } from '@/types';

export type ComputedStatus = 'Scheduled' | 'In Flight' | 'Landed';

/**
 * Derives flight status from scheduled/actual times.
 * Uses actual time if available, otherwise scheduled.
 * - Departure in future → Scheduled
 * - Departed but not arrived → In Flight
 * - Departed and arrived → Landed
 */
export function computeFlightStatus(flight: Flight): ComputedStatus {
  const now = new Date();
  const depTime = new Date(flight.departure.actual ?? flight.departure.scheduled);
  const arrTime = new Date(flight.arrival.actual ?? flight.arrival.scheduled);

  if (depTime.getTime() > now.getTime()) return 'Scheduled';
  if (arrTime.getTime() > now.getTime()) return 'In Flight';
  return 'Landed';
}

export function getStatusStyle(status: ComputedStatus): string {
  const styles: Record<ComputedStatus, string> = {
    Scheduled: 'bg-[#3CA2C8]/10 text-[#3CA2C8] border-[#3CA2C8]/20',
    'In Flight': 'bg-[#E6007E]/10 text-[#E6007E] border-[#E6007E]/20',
    Landed: 'bg-[#22C55E]/10 text-[#22C55E] border-[#22C55E]/20',
  };
  return styles[status];
}
