import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

interface AuthGateProps {
  onSubmitEmail: (email: string) => Promise<void>;
  onClose: () => void;
}

export default function AuthGate({ onSubmitEmail, onClose }: AuthGateProps) {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    
    setSending(true);
    setError(null);
    try {
      await onSubmitEmail(email.trim());
      setSent(true);
    } catch {
      setError('Failed to send sign-in link. Please try again.');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
      <Card className="w-full max-w-sm border-[#1E2D3D] bg-[#111827]">
        <CardHeader>
          <CardTitle className="text-lg">
            {sent ? '✉️ Check your email' : '🔐 Sign in to place bets'}
          </CardTitle>
          <CardDescription>
            {sent
              ? `We sent a sign-in link to ${email}. Click the link to continue.`
              : 'Enter your email to receive a magic sign-in link.'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!sent ? (
            <form onSubmit={handleSubmit} className="space-y-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
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
                  disabled={sending || !email.trim()}
                  className="flex-1 bg-[#E6007E] text-white hover:bg-[#E6007E]/90"
                >
                  {sending ? 'Sending...' : 'Send link'}
                </Button>
              </div>
            </form>
          ) : (
            <Button
              variant="ghost"
              onClick={onClose}
              className="w-full"
            >
              Close
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
