import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

type AuthMode = 'signIn' | 'signUp';

interface AuthGateProps {
  onSignIn: (email: string, password: string) => Promise<void>;
  onSignUp: (email: string, password: string) => Promise<void>;
  onClose: () => void;
}

export default function AuthGate({ onSignIn, onSignUp, onClose }: AuthGateProps) {
  const [mode, setMode] = useState<AuthMode>('signIn');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) return;
    
    setLoading(true);
    setError(null);
    try {
      if (mode === 'signUp') {
        await onSignUp(email.trim(), password);
      } else {
        await onSignIn(email.trim(), password);
      }
      onClose();
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Authentication failed';
      if (msg.includes('email-already-in-use')) {
        setError('An account with this email already exists. Try signing in.');
      } else if (msg.includes('invalid-credential') || msg.includes('wrong-password')) {
        setError('Invalid email or password.');
      } else if (msg.includes('weak-password')) {
        setError('Password must be at least 6 characters.');
      } else {
        setError(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
      <Card className="w-full max-w-sm border-[#1E2D3D] bg-[#111827]">
        <CardHeader>
          <CardTitle className="text-lg">
            {mode === 'signIn' ? '🔐 Sign In' : '🚀 Create Account'}
          </CardTitle>
          <CardDescription>
            {mode === 'signIn'
              ? 'Sign in to place bets on flights.'
              : 'Create an account to start with R1,000.'}
          </CardDescription>

          {/* Tabs */}
          <div className="mt-2 flex gap-1 rounded-lg bg-[#0A0F1A] p-1">
            <button
              type="button"
              onClick={() => { setMode('signIn'); setError(null); }}
              className={`flex-1 rounded-md px-3 py-1.5 text-xs font-medium transition ${
                mode === 'signIn'
                  ? 'bg-[#1A2332] text-[#F1F5F9]'
                  : 'text-[#64748B] hover:text-[#94A3B8]'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => { setMode('signUp'); setError(null); }}
              className={`flex-1 rounded-md px-3 py-1.5 text-xs font-medium transition ${
                mode === 'signUp'
                  ? 'bg-[#1A2332] text-[#F1F5F9]'
                  : 'text-[#64748B] hover:text-[#94A3B8]'
              }`}
            >
              Sign Up
            </button>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-3">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              className="w-full rounded-lg border border-[#1E2D3D] bg-[#0A0F1A] px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-[#3CA2C8] focus:outline-none focus:ring-1 focus:ring-[#3CA2C8]"
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
              minLength={6}
              className="w-full rounded-lg border border-[#1E2D3D] bg-[#0A0F1A] px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-[#3CA2C8] focus:outline-none focus:ring-1 focus:ring-[#3CA2C8]"
            />
            {error && <p className="text-xs text-red-400">{error}</p>}
            <div className="flex gap-2">
              <Button
                type="button"
                variant="ghost"
                onClick={onClose}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={loading || !email.trim() || !password}
                className="flex-1 bg-[#E6007E] text-white hover:bg-[#E6007E]/90"
              >
                {loading ? '...' : mode === 'signIn' ? 'Sign In' : 'Sign Up'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
