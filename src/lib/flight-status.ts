import type { Flight } from '@/types';
import { canPlaceBet } from '@/lib/bets';

export type BettingStatus = 'Open' | 'Closed' | 'Settled';

export function computeBettingStatus(flight: Flight): BettingStatus {
  if (flight.cancelled || flight.departure.actual !== null || flight.arrival.actual !== null) {
    return 'Settled';
  }

  if (canPlaceBet(flight.departure.scheduled)) {
    return 'Open';
  }

  return 'Closed';
}

export function getBettingStatusStyle(status: BettingStatus): string {
  const styles: Record<BettingStatus, string> = {
    Open: 'bg-[#22C55E]/10 text-[#22C55E] border-[#22C55E]/20',
    Closed: 'bg-[#F59E0B]/10 text-[#F59E0B] border-[#F59E0B]/20',
    Settled: 'bg-[#3CA2C8]/10 text-[#3CA2C8] border-[#3CA2C8]/20',
  };

  return styles[status];
}
