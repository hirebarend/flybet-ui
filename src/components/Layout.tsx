import { useState } from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import AuthGate from '@/components/AuthGate';

export default function Layout() {
  const { user, userProfile, signInWithEmail, signOut } = useAuth();
  const [showAuth, setShowAuth] = useState(false);

  return (
    <div className="min-h-screen bg-[#0A0F1A] text-[#F1F5F9]">
      {/* Nav */}
      <nav className="sticky top-0 z-50 border-b border-[#1E2D3D] bg-[#0A0F1A]/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-[540px] items-center justify-between px-4 py-3">
          <NavLink to="/" className="flex items-center gap-2 text-lg font-bold tracking-tight">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#E6007E] text-sm shadow-[0_0_20px_rgba(230,0,126,0.3)]">
              ✈
            </div>
            <span>
              <span className="text-[#E6007E]">Fly</span>
              <span className="text-[#3CA2C8]">Bet</span>
            </span>
          </NavLink>

          <div className="flex items-center gap-2">
            <div className="flex gap-1">
              <NavLink
                to="/"
                end
                className={({ isActive }) =>
                  `rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                    isActive
                      ? 'bg-[#1A2332] text-[#F1F5F9]'
                      : 'text-[#64748B] hover:text-[#94A3B8]'
                  }`
                }
              >
                Flights
              </NavLink>
              <NavLink
                to="/leaderboard"
                className={({ isActive }) =>
                  `rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                    isActive
                      ? 'bg-[#1A2332] text-[#F1F5F9]'
                      : 'text-[#64748B] hover:text-[#94A3B8]'
                  }`
                }
              >
                Rank
              </NavLink>
            </div>

            {user && userProfile ? (
              <button
                onClick={signOut}
                className="flex items-center gap-1.5 rounded-lg border border-[#1E2D3D] bg-[#1A2332] px-3 py-1.5 font-mono text-xs text-[#22C55E] transition hover:border-[#22C55E]"
              >
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#22C55E]" />
                R {userProfile.balance.toLocaleString()}
              </button>
            ) : (
              <button
                onClick={() => setShowAuth(true)}
                className="rounded-lg bg-[#E6007E] px-3 py-1.5 text-xs font-medium text-white transition hover:bg-[#E6007E]/90"
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* Main content */}
      <main className="mx-auto max-w-[540px] px-4 pb-20">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="py-10 text-center text-xs text-[#64748B]">
        This is a satirical social experiment. All flights are real. The money is not.
      </footer>

      {/* Auth modal */}
      {showAuth && (
        <AuthGate
          onSubmitEmail={signInWithEmail}
          onClose={() => setShowAuth(false)}
        />
      )}
    </div>
  );
}
