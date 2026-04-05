import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { computeFlightStatus, getStatusStyle } from '@/lib/flight-status';
import { useAuth } from '@/hooks/useAuth';
import { useUserBets } from '@/hooks/useUserBets';
import { normaliseFlight } from '@/hooks/useFlights';
import { canPlaceBet } from '@/lib/bets';
import AuthGate from '@/components/AuthGate';
import BetForm from '@/components/BetForm';
import ActiveBets from '@/components/ActiveBets';
import { AIRPORT_NAMES, getFlightNumber } from '@/types';
import type { Flight } from '@/types';

function formatTime(dateStr: string) {
  return new Date(dateStr).toLocaleTimeString('en-ZA', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-ZA', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  });
}

export default function FlightBetPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, userProfile, signIn, signUp } = useAuth();
  const { bets, loading: betsLoading } = useUserBets(user?.uid, id);
  const [flight, setFlight] = useState<Flight | null>(null);
  const [loading, setLoading] = useState(true);
  const [showAuth, setShowAuth] = useState(false);

  useEffect(() => {
    if (!id) return;

    const unsub = onSnapshot(doc(db, 'flights', id), (snap) => {
      if (snap.exists()) {
        setFlight({ id: snap.id, ...normaliseFlight(snap.data()) } as Flight);
      }
      setLoading(false);
    });
    return () => unsub();
  }, [id]);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#3CA2C8] border-t-transparent" />
      </div>
    );
  }

  if (!flight) {
    return (
      <div className="py-20 text-center">
        <p className="text-[#64748B]">Flight not found.</p>
        <button onClick={() => navigate('/')} className="mt-2 text-sm text-[#3CA2C8] hover:underline">
          Back to flights
        </button>
      </div>
    );
  }

  const bettingOpen = canPlaceBet(flight.departure.scheduled);

  const depCode = flight.departure.airport.code;
  const arrCode = flight.arrival.airport.code;

  return (
    <div className="py-6">
      {/* Back button */}
      <button
        onClick={() => navigate('/')}
        className="mb-4 flex items-center gap-1 text-sm text-[#64748B] hover:text-[#94A3B8]"
      >
        ← Back to flights
      </button>

      {/* Flight header */}
      <div className="mb-6 rounded-xl border border-[#1E2D3D] bg-[#111827] p-5">
        <div className="mb-4 flex items-center justify-between">
          <span className="font-mono text-lg font-bold">{getFlightNumber(flight)}</span>
          <span className="text-xs text-[#64748B]">{formatDate(flight.departure.scheduled)}</span>
        </div>

        {/* Route visualization */}
        <div className="flex items-center gap-4">
          <div className="text-center">
            <div className="font-mono text-2xl font-bold">{depCode}</div>
            <div className="text-[10px] text-[#64748B]">
              {AIRPORT_NAMES[depCode] || depCode}
            </div>
            <div className="mt-1 font-mono text-sm text-[#94A3B8]">
              {formatTime(flight.departure.scheduled)}
            </div>
          </div>

          <div className="relative flex flex-1 items-center">
            <div className="h-[2px] w-full bg-[#1E2D3D]" />
            <div className="absolute left-0 top-1/2 h-2 w-2 -translate-y-1/2 rounded-full border-2 border-[#2A3F55] bg-[#111827]" />
            <div className="absolute right-0 top-1/2 h-2 w-2 -translate-y-1/2 rounded-full border-2 border-[#2A3F55] bg-[#111827]" />
            <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-sm text-[#E6007E]">
              ✈
            </span>
          </div>

          <div className="text-center">
            <div className="font-mono text-2xl font-bold">{arrCode}</div>
            <div className="text-[10px] text-[#64748B]">
              {AIRPORT_NAMES[arrCode] || arrCode}
            </div>
            <div className="mt-1 font-mono text-sm text-[#94A3B8]">
              {formatTime(flight.arrival.scheduled)}
            </div>
          </div>
        </div>

        {/* Status */}
        <div className="mt-4 flex items-center justify-between border-t border-[#1E2D3D] pt-3">
          <span className="text-xs text-[#64748B]">Status</span>
          {(() => {
            const status = computeFlightStatus(flight);
            return (
              <span className={`rounded-md border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${getStatusStyle(status)}`}>
                {status}
              </span>
            );
          })()}
        </div>
        {flight.departure.actual && (
          <div className="flex items-center justify-between pt-1">
            <span className="text-xs text-[#64748B]">Actual Departure</span>
            <span className="font-mono text-xs text-[#94A3B8]">{formatTime(flight.departure.actual)}</span>
          </div>
        )}
        {flight.arrival.actual && (
          <div className="flex items-center justify-between pt-1">
            <span className="text-xs text-[#64748B]">Actual Arrival</span>
            <span className="font-mono text-xs text-[#94A3B8]">{formatTime(flight.arrival.actual)}</span>
          </div>
        )}
        {flight.departure.gate && (
          <div className="flex items-center justify-between pt-1">
            <span className="text-xs text-[#64748B]">Gate</span>
            <span className="font-mono text-xs text-[#94A3B8]">{flight.departure.gate}</span>
          </div>
        )}
        {flight.aircraft.model && (
          <div className="flex items-center justify-between pt-1">
            <span className="text-xs text-[#64748B]">Aircraft</span>
            <span className="text-xs text-[#94A3B8]">{flight.aircraft.model}</span>
          </div>
        )}
      </div>

      {/* Betting section */}
      {!user ? (
        <div className="rounded-xl border border-[#1E2D3D] bg-[#111827] p-6 text-center">
          <p className="mb-3 text-sm text-[#94A3B8]">Sign in to place bets on this flight</p>
          <button
            onClick={() => {
              window.localStorage.setItem('redirectAfterSignIn', `/flight/${flight.id}`);
              setShowAuth(true);
            }}
            className="rounded-lg bg-[#E6007E] px-5 py-2 text-sm font-medium text-white transition hover:bg-[#E6007E]/90"
          >
            Sign In to Bet
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {!bettingOpen && (
            <div className="rounded-lg bg-[#F59E0B]/10 px-3 py-2 text-center text-xs text-[#F59E0B]">
              Betting is {new Date(flight.departure.scheduled) > new Date() ? 'closed (less than 6 hours before departure)' : 'closed for this flight'}
            </div>
          )}

          {/* Active bets */}
          {!betsLoading && bets.length > 0 && (
            <ActiveBets
              bets={bets}
              userId={user.uid}
              scheduledDeparture={flight.departure.scheduled}
            />
          )}

          {/* Bet forms */}
          <BetForm
            userId={user.uid}
            flightId={flight.id}
            scheduledDeparture={flight.departure.scheduled}
            balance={userProfile?.balance ?? 0}
            outcome="onTimeDeparture"
            label="On-Time Departure"
            icon="🛫"
            onBetPlaced={() => {}}
          />
          <BetForm
            userId={user.uid}
            flightId={flight.id}
            scheduledDeparture={flight.departure.scheduled}
            balance={userProfile?.balance ?? 0}
            outcome="onTimeArrival"
            label="On-Time Arrival"
            icon="🛬"
            onBetPlaced={() => {}}
          />
          <BetForm
            userId={user.uid}
            flightId={flight.id}
            scheduledDeparture={flight.departure.scheduled}
            balance={userProfile?.balance ?? 0}
            outcome="cancelled"
            label="Cancelled"
            icon="❌"
            onBetPlaced={() => {}}
          />
        </div>
      )}

      {/* Auth modal */}
      {showAuth && (
        <AuthGate
          onSignIn={signIn}
          onSignUp={signUp}
          onClose={() => setShowAuth(false)}
        />
      )}
    </div>
  );
}
