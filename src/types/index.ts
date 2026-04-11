export interface Flight {
  id: string;
  flight: string;
  airline: {
    iata: string;
  };
  departure: {
    airport: { code: string };
    scheduled: string;
    actual: string | null;
  };
  arrival: {
    airport: { code: string };
    scheduled: string;
    actual: string | null;
  };
  aircraft: {
    model: string | null;
  };
  cancelled: boolean;
}

/** Helper to get display flight number like "FA 416" */
export function getFlightNumber(flight: Flight): string {
  return `${flight.airline.iata} ${flight.flight}`;
}

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string | null;
  balance: number;
  createdAt: Date;
}

export type BetOutcome =
  | 'onTimeDeparture'
  | 'delayedDeparture'
  | 'onTimeArrival'
  | 'delayedArrival'
  | 'cancelled'
  | 'notCancelled';

export interface Bet {
  id: string; // Firestore document ID
  userId: string;
  flight_id: string;
  outcome: BetOutcome;
  amount: number;
  settled: boolean;
  payout: number;
}

export const STAKE_OPTIONS = [50, 100, 250, 500] as const;
export type StakeAmount = typeof STAKE_OPTIONS[number];

export const AIRPORT_NAMES: Record<string, string> = {
  JNB: 'Johannesburg',
  CPT: 'Cape Town',
  DUR: 'Durban',
  HLA: 'Lanseria',
  ELS: 'East London',
  PLZ: 'Port Elizabeth',
  GRJ: 'George',
  BFN: 'Bloemfontein',
  MQP: 'Nelspruit',
  VFA: 'Victoria Falls',
};
