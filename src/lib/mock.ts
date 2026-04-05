import type { Flight, Bet, BetOutcome, UserProfile, StakeAmount } from '@/types';

export const USE_MOCKS = import.meta.env.VITE_USE_MOCKS === 'true';

// --- Mock Flights ---

const MOCK_FLIGHTS_RAW = [
  {"flightNumber":"FA 212","departureAirport":"JNB","arrivalAirport":"CPT","scheduledDeparture":"2026-04-06 11:30+02:00","scheduledArrival":"2026-04-05 13:50+02:00","actualDeparture":"2026-04-05 13:50+02:00","actualArrival":"2026-04-05 15:55+02:00","status":"Delayed"},
  {"flightNumber":"FA 731","departureAirport":"GRJ","arrivalAirport":"JNB","scheduledDeparture":"2026-04-05 12:10+02:00","scheduledArrival":"2026-04-05 14:00+02:00","actualDeparture":"2026-04-05 12:10+02:00","actualArrival":"2026-04-05 14:00+02:00","status":"Expected"},
  {"flightNumber":"FA 290","departureAirport":"JNB","arrivalAirport":"CPT","scheduledDeparture":"2026-04-05 12:15+02:00","scheduledArrival":"2026-04-05 14:35+02:00","actualDeparture":"2026-04-05 12:15+02:00","actualArrival":"2026-04-05 14:35+02:00","status":"Boarding"},
  {"flightNumber":"FA 242","departureAirport":"JNB","arrivalAirport":"ELS","scheduledDeparture":"2026-04-05 12:15+02:00","scheduledArrival":"2026-04-05 13:50+02:00","actualDeparture":"2026-04-05 12:15+02:00","actualArrival":"2026-04-05 13:50+02:00","status":"Expected"},
  {"flightNumber":"FA 634","departureAirport":"CPT","arrivalAirport":"MQP","scheduledDeparture":"2026-04-05 12:15+02:00","scheduledArrival":"2026-04-05 14:45+02:00","actualDeparture":"2026-04-05 12:15+02:00","actualArrival":null,"status":"Expected"},
  {"flightNumber":"FA 650","departureAirport":"JNB","arrivalAirport":"GRJ","scheduledDeparture":"2026-04-05 12:35+02:00","scheduledArrival":"2026-04-05 14:35+02:00","actualDeparture":"2026-04-05 12:35+02:00","actualArrival":"2026-04-05 14:35+02:00","status":"Boarding"},
  {"flightNumber":"FA 182","departureAirport":"CPT","arrivalAirport":"DUR","scheduledDeparture":"2026-04-05 12:40+02:00","scheduledArrival":"2026-04-05 14:45+02:00","actualDeparture":"2026-04-05 12:40+02:00","actualArrival":"2026-04-05 14:45+02:00","status":"Boarding"},
  {"flightNumber":"FA 375","departureAirport":"JNB","arrivalAirport":"PLZ","scheduledDeparture":"2026-04-05 12:50+02:00","scheduledArrival":"2026-04-05 14:35+02:00","actualDeparture":"2026-04-05 12:50+02:00","actualArrival":"2026-04-05 14:35+02:00","status":"Expected"},
  {"flightNumber":"FA 824","departureAirport":"JNB","arrivalAirport":"VFA","scheduledDeparture":"2026-04-05 12:50+02:00","scheduledArrival":"2026-04-05 14:35+02:00","actualDeparture":"2026-04-05 12:50+02:00","actualArrival":null,"status":"Expected"},
  {"flightNumber":"FA 842","departureAirport":"CPT","arrivalAirport":"BFN","scheduledDeparture":"2026-04-05 12:50+02:00","scheduledArrival":"2026-04-05 14:25+02:00","actualDeparture":"2026-04-05 12:50+02:00","actualArrival":"2026-04-05 14:25+02:00","status":"Expected"},
  {"flightNumber":"FA 401","departureAirport":"JNB","arrivalAirport":"DUR","scheduledDeparture":"2026-04-05 12:55+02:00","scheduledArrival":"2026-04-05 14:10+02:00","actualDeparture":"2026-04-05 12:55+02:00","actualArrival":"2026-04-05 14:10+02:00","status":"Expected"},
  {"flightNumber":"FA 211","departureAirport":"CPT","arrivalAirport":"JNB","scheduledDeparture":"2026-04-05 12:55+02:00","scheduledArrival":"2026-04-05 15:00+02:00","actualDeparture":"2026-04-05 12:55+02:00","actualArrival":"2026-04-05 15:00+02:00","status":"Expected"},
  {"flightNumber":"FA 357","departureAirport":"GRJ","arrivalAirport":"HLA","scheduledDeparture":"2026-04-05 12:55+02:00","scheduledArrival":"2026-04-05 14:55+02:00","actualDeparture":"2026-04-05 12:55+02:00","actualArrival":null,"status":"Expected"},
  {"flightNumber":"FA 801","departureAirport":"CPT","arrivalAirport":"JNB","scheduledDeparture":"2026-04-05 13:10+02:00","scheduledArrival":"2026-04-05 15:20+02:00","actualDeparture":"2026-04-05 13:10+02:00","actualArrival":"2026-04-05 15:20+02:00","status":"Expected"},
  {"flightNumber":"FA 144","departureAirport":"CPT","arrivalAirport":"ELS","scheduledDeparture":"2026-04-05 13:20+02:00","scheduledArrival":"2026-04-05 14:55+02:00","actualDeparture":"2026-04-05 13:20+02:00","actualArrival":"2026-04-05 14:55+02:00","status":"Expected"},
];

function flightId(fn: string): string {
  return fn.replace(/\s+/g, '-').toLowerCase();
}

export const MOCK_FLIGHTS: Flight[] = MOCK_FLIGHTS_RAW.map((f) => ({
  id: flightId(f.flightNumber),
  flightNumber: f.flightNumber,
  departureAirport: f.departureAirport,
  arrivalAirport: f.arrivalAirport,
  scheduledDeparture: f.scheduledDeparture,
  scheduledArrival: f.scheduledArrival,
  actualDeparture: f.actualDeparture,
  actualArrival: f.actualArrival,
  status: f.status,
}));

// --- Mock User State ---

const MOCK_USER_ID = 'mock-user-001';

export const MOCK_USER_PROFILE: UserProfile = {
  uid: MOCK_USER_ID,
  email: 'tester@flybet.co.za',
  displayName: 'Test Pilot',
  balance: 1000,
  createdAt: new Date(),
};

// In-memory state
let _mockBalance = MOCK_USER_PROFILE.balance;
let _mockBets: Bet[] = [];
let _nextBetId = 1;

type Listener = () => void;
const _listeners = new Set<Listener>();

function notify() {
  _listeners.forEach((fn) => fn());
}

export function subscribeMockState(listener: Listener): () => void {
  _listeners.add(listener);
  return () => _listeners.delete(listener);
}

export function getMockBalance(): number {
  return _mockBalance;
}

export function getMockBets(flightId?: string): Bet[] {
  if (flightId) return _mockBets.filter((b) => b.flightId === flightId);
  return [..._mockBets];
}

export function mockPlaceBet(
  flightId: string,
  outcome: BetOutcome,
  amount: StakeAmount
): string {
  if (_mockBalance < amount) throw new Error('Insufficient balance');

  const id = `mock-bet-${_nextBetId++}`;
  _mockBalance -= amount;
  _mockBets.push({
    id,
    userId: MOCK_USER_ID,
    flightId,
    outcome,
    amount,
    placedAt: new Date(),
  });
  notify();
  return id;
}

export function mockCancelBet(betId: string): void {
  const idx = _mockBets.findIndex((b) => b.id === betId);
  if (idx === -1) throw new Error('Bet not found');
  _mockBalance += _mockBets[idx].amount;
  _mockBets.splice(idx, 1);
  notify();
}

// --- Mock Leaderboard ---

export const MOCK_LEADERBOARD: UserProfile[] = [
  { uid: MOCK_USER_ID, email: 'tester@flybet.co.za', displayName: 'Test Pilot', balance: 1000, createdAt: new Date() },
  { uid: 'mock-2', email: 'sipho@example.com', displayName: 'Sipho M.', balance: 2450, createdAt: new Date() },
  { uid: 'mock-3', email: 'anele@example.com', displayName: 'Anele K.', balance: 1820, createdAt: new Date() },
  { uid: 'mock-4', email: 'zinhle@example.com', displayName: 'Zinhle D.', balance: 1540, createdAt: new Date() },
  { uid: 'mock-5', email: 'thabo@example.com', displayName: 'Thabo N.', balance: 1290, createdAt: new Date() },
  { uid: 'mock-6', email: 'lerato@example.com', displayName: 'Lerato P.', balance: 980, createdAt: new Date() },
  { uid: 'mock-7', email: 'busi@example.com', displayName: 'Busi V.', balance: 760, createdAt: new Date() },
  { uid: 'mock-8', email: 'john@example.com', displayName: 'John S.', balance: 550, createdAt: new Date() },
].sort((a, b) => b.balance - a.balance);

export function getMockLeaderboard(): UserProfile[] {
  // Update the mock user's balance in the leaderboard
  return MOCK_LEADERBOARD.map((u) =>
    u.uid === MOCK_USER_ID ? { ...u, balance: _mockBalance } : u
  ).sort((a, b) => b.balance - a.balance);
}
