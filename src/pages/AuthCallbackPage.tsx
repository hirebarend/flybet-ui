import { useEffect, useState } from 'react';
import { isSignInWithEmailLink, signInWithEmailLink } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { auth } from '@/lib/firebase';

export default function AuthCallbackPage() {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const completeSignIn = async () => {
      if (!isSignInWithEmailLink(auth, window.location.href)) {
        setError('Invalid sign-in link.');
        return;
      }

      let email = window.localStorage.getItem('emailForSignIn');
      if (!email) {
        email = window.prompt('Please provide your email for confirmation');
      }

      if (!email) {
        setError('Email is required to complete sign-in.');
        return;
      }

      try {
        await signInWithEmailLink(auth, email, window.location.href);
        window.localStorage.removeItem('emailForSignIn');
        // Redirect to the page they were trying to access, or home
        const redirectTo = window.localStorage.getItem('redirectAfterSignIn') || '/';
        window.localStorage.removeItem('redirectAfterSignIn');
        navigate(redirectTo);
      } catch (err) {
        setError('Failed to sign in. The link may have expired.');
        console.error(err);
      }
    };

    completeSignIn();
  }, [navigate]);

  if (error) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-4">
        <div className="text-center">
          <p className="text-lg text-red-400">{error}</p>
          <button
            onClick={() => navigate('/')}
            className="mt-4 text-sm text-[#3CA2C8] hover:underline"
          >
            Go back to flights
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4">
      <div className="text-center">
        <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-[#3CA2C8] border-t-transparent" />
        <p className="text-muted-foreground">Completing sign-in...</p>
      </div>
    </div>
  );
}
