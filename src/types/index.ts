export interface Flight {
  id: string; // Firestore document ID
  flightNumber: string;
  departureAirport: string;
  arrivalAirport: string;
  scheduledDeparture: string;
  scheduledArrival: string;
  actualDeparture: string | null;
  actualArrival: string | null;
  status: string;
}

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string | null;
  balance: number;
  createdAt: Date;
}

export type BetOutcome = 'onTimeDeparture' | 'onTimeArrival' | 'cancelled';

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
