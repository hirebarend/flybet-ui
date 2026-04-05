import type { Flight } from '@/types';

export type ComputedStatus =
  | 'Scheduled'
  | 'Boarding'
  | 'Departed'
  | 'In Flight'
  | 'Landed'
  | 'Delayed'
  | 'Cancelled';

/**
 * Derives flight status from scheduled/actual times rather than
 * relying on the Firestore status field which may be stale.
 *
 * Important: actual departure/arrival times may be populated with
 * future estimates before the flight departs. A time is only treated
 * as evidence of departure/arrival when it is in the past.
 *
 * Logic:
 * - If actualDeparture is in the past and actualArrival is in the past → Landed (check if delayed)
 * - If actualDeparture is in the past but arrival hasn't occurred → In Flight (check if departure was delayed)
 * - If best-known departure time is in the past but flight hasn't departed → Delayed
 * - If best-known departure time is within 30 min → Boarding
 * - Otherwise → Scheduled
 */
export function computeFlightStatus(flight: Flight): ComputedStatus {
  const now = new Date();
  const scheduledDep = new Date(flight.departure.scheduled);
  const scheduledArr = new Date(flight.arrival.scheduled);
  const actualDep = flight.departure.actual ? new Date(flight.departure.actual) : null;
  const actualArr = flight.arrival.actual ? new Date(flight.arrival.actual) : null;

  // Only treat actual times as evidence of departure/arrival if they are in the past
  const hasDeparted = actualDep !== null && actualDep.getTime() <= now.getTime();
  const hasArrived = actualArr !== null && actualArr.getTime() <= now.getTime();

  // Flight has departed
  if (hasDeparted) {
    // Flight has also arrived
    if (hasArrived) {
      const arrivalDiffMs = actualArr!.getTime() - scheduledArr.getTime();
      // Delayed if arrived more than 15 min late
      if (arrivalDiffMs > 15 * 60 * 1000) return 'Delayed';
      return 'Landed';
    }

    // Departed but not yet arrived
    const depDiffMs = actualDep!.getTime() - scheduledDep.getTime();
    // If departed more than 15 min late, mark as delayed
    if (depDiffMs > 15 * 60 * 1000) return 'Delayed';
    return 'In Flight';
  }

  // Flight hasn't departed yet — use best available departure time
  const bestDep = actualDep || scheduledDep;
  const msUntilDep = bestDep.getTime() - now.getTime();

  // Departure time has passed but flight hasn't departed → delayed
  if (msUntilDep < 0) return 'Delayed';

  // Within 30 minutes of departure → boarding
  if (msUntilDep <= 30 * 60 * 1000) return 'Boarding';

  return 'Scheduled';
}

export function getStatusStyle(status: ComputedStatus): string {
  const styles: Record<ComputedStatus, string> = {
    Scheduled: 'bg-[#3CA2C8]/10 text-[#3CA2C8] border-[#3CA2C8]/20',
    Boarding: 'bg-[#E6007E]/10 text-[#E6007E] border-[#E6007E]/20',
    Departed: 'bg-[#3CA2C8]/10 text-[#3CA2C8] border-[#3CA2C8]/20',
    'In Flight': 'bg-[#3CA2C8]/10 text-[#3CA2C8] border-[#3CA2C8]/20',
    Landed: 'bg-[#22C55E]/10 text-[#22C55E] border-[#22C55E]/20',
    Delayed: 'bg-[#F59E0B]/10 text-[#F59E0B] border-[#F59E0B]/20',
    Cancelled: 'bg-[#EF4444]/15 text-[#EF4444] border-[#EF4444]/20',
  };
  return styles[status] || styles.Scheduled;
}
