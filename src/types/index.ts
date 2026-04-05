export interface Flight {
  id: string;
  flight: {
    iataCode: string;
    number: string;
  };
  airline: {
    name: string;
  };
  departure: {
    airport: { code: string };
    scheduled: string;
    actual: string | null;
    terminal: string | null;
    gate: string | null;
  };
  arrival: {
    airport: { code: string };
    scheduled: string;
    actual: string | null;
    terminal: string | null;
  };
  status: string;
  aircraft: {
    model: string | null;
    registration: string | null;
  };
}

/** Helper to get display flight number like "FA 416" */
export function getFlightNumber(flight: Flight): string {
  return `${flight.flight.iataCode} ${flight.flight.number}`;
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
  flightId: string;
  outcome: BetOutcome;
  amount: number;
  placedAt: Date;
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
