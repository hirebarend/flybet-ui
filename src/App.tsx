import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from '@/components/Layout';
import FlightsPage from '@/pages/FlightsPage';
import FlightBetPage from '@/pages/FlightBetPage';
import LeaderboardPage from '@/pages/LeaderboardPage';
import AuthCallbackPage from '@/pages/AuthCallbackPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<FlightsPage />} />
          <Route path="/flight/:id" element={<FlightBetPage />} />
          <Route path="/leaderboard" element={<LeaderboardPage />} />
        </Route>
        <Route path="/auth/callback" element={<AuthCallbackPage />} />
      </Routes>
    </BrowserRouter>
  );
}
