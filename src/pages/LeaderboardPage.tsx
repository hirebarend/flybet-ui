import { useLeaderboard } from '@/hooks/useLeaderboard';
import { useAuth } from '@/hooks/useAuth';

export default function LeaderboardPage() {
  const { users, loading } = useLeaderboard();
  const { user } = useAuth();

  return (
    <div className="py-6">
      <h1 className="mb-6 text-center text-2xl font-black tracking-tight">
        🏆 Leaderboard
      </h1>

      {loading ? (
        <div className="flex flex-col gap-2">
          {Array.from({ length: 10 }).map((_, i) => (
            <div
              key={i}
              className="h-14 animate-pulse rounded-xl bg-[#111827] border border-[#1E2D3D]"
            />
          ))}
        </div>
      ) : users.length === 0 ? (
        <div className="py-12 text-center text-sm text-[#64748B]">
          No users yet. Be the first to sign up!
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {users.map((u, index) => {
            const isCurrentUser = user?.uid === u.uid;
            const rank = index + 1;
            const rankEmoji = rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : null;

            return (
              <div
                key={u.uid}
                className={`flex items-center gap-3 rounded-xl border px-4 py-3 ${
                  isCurrentUser
                    ? 'border-[#E6007E]/30 bg-[#E6007E]/5'
                    : 'border-[#1E2D3D] bg-[#111827]'
                }`}
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#1A2332] font-mono text-xs font-bold text-[#94A3B8]">
                  {rankEmoji || `#${rank}`}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="truncate text-sm font-medium text-[#F1F5F9]">
                    {u.displayName || u.email?.split('@')[0] || 'Anonymous'}
                    {isCurrentUser && (
                      <span className="ml-1.5 text-[10px] text-[#E6007E]">(you)</span>
                    )}
                  </div>
                </div>
                <div className="font-mono text-sm font-bold text-[#22C55E]">
                  R {u.balance.toLocaleString()}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
