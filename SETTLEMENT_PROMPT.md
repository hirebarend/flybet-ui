# Bet Settlement System — Implementation Prompt

Implement a bet settlement system for the FlyBet background service. This system must determine bet outcomes after flights complete, and distribute winnings to users according to the pari-mutuel payout formula.

## Firestore Data Model

### `flights` collection
- Document ID: Flight IATA code (e.g., "FA416")
- Key fields:
  - `departure.scheduled` (Timestamp) — scheduled departure time
  - `departure.actual` (Timestamp | null) — actual departure time, null until departed
  - `arrival.scheduled` (Timestamp) — scheduled arrival time
  - `arrival.actual` (Timestamp | null) — actual arrival time, null until arrived
  - `status` (string) — stale status field, do NOT rely on this

### `users` collection
- Document ID: Firebase Auth UID
- Key fields:
  - `uid` (string)
  - `email` (string)
  - `balance` (number) — user's current balance in R (initially 1000)

### `bets` collection
- Document ID: auto-generated
- Fields:
  - `userId` (string) — the user who placed the bet
  - `flightId` (string) — references the flight document ID
  - `outcome` (string) — one of: `'onTimeDeparture'`, `'delayedDeparture'`, `'onTimeArrival'`, `'delayedArrival'`, `'cancelled'`, `'notCancelled'`
  - `amount` (number) — the stake: 50, 100, 250, or 500
  - `placedAt` (Timestamp) — when the bet was placed

## Settlement Timing Rules

Each of the three markets (departure, arrival, cancellation) is settled independently, and each has its own reference timestamp. The settlement eligibility timestamp is:

```
settlementTime = (actual ?? scheduled) + 3 hours
```

That is: use the **actual** time if it is available (non-null), otherwise fall back to the **scheduled** time. Settlement for that market may only proceed once `now >= settlementTime`.

Apply this rule per market:

- **Departure market**: Reference timestamp = `departure.actual` if non-null, else `departure.scheduled`. Settle only when `now >= referenceTimestamp + 3 hours`.
- **Arrival market**: Reference timestamp = `arrival.actual` if non-null, else `arrival.scheduled`. Settle only when `now >= referenceTimestamp + 3 hours`.
- **Cancellation market**: Reference timestamp = `arrival.actual` if non-null, else `arrival.scheduled`. If neither actual is available and the scheduled arrival has passed by more than 3 hours with no actual times recorded, treat the flight as cancelled. Settle only when `now >= referenceTimestamp + 3 hours`.

This guarantees that:
- Bets are never settled prematurely, even if actual times arrive early in Firestore.
- If a flight departs or arrives early, the earlier actual time is used, but settlement still waits the full 3-hour buffer.
- If only scheduled times are known (e.g., no actual data), settlement still proceeds 3 hours after the scheduled time.

## Bet Categories and Outcome Determination

Each flight has three independent betting markets. Each market has exactly two opposing sides. Determine the winning outcome for each market as follows:

### 1. Departure Market
- **Outcomes**: `onTimeDeparture` vs `delayedDeparture`
- **Rule**: If `departure.actual` is more than 15 minutes after `departure.scheduled`, the winning outcome is `delayedDeparture`. Otherwise, the winning outcome is `onTimeDeparture`.
- **If `departure.actual` is null** (no actual departure data available by settlement time): treat as `delayedDeparture`.

### 2. Arrival Market
- **Outcomes**: `onTimeArrival` vs `delayedArrival`
- **Rule**: If `arrival.actual` is more than 15 minutes after `arrival.scheduled`, the winning outcome is `delayedArrival`. Otherwise, the winning outcome is `onTimeArrival`.
- **If `arrival.actual` is null** (no actual arrival data available by settlement time): treat as `delayedArrival`.

### 3. Cancellation Market
- **Outcomes**: `cancelled` vs `notCancelled`
- **Rule**: If neither `departure.actual` nor `arrival.actual` is available 3 hours after `arrival.scheduled`, treat the flight as `cancelled`. Otherwise, treat as `notCancelled`.

## Payout Formula (Pari-Mutuel)

For each market independently:

1. **Identify winners and losers**: Based on the actual flight outcome, one side wins and the other loses.
2. **Calculate pools**:
   - `Total Winning Stakes` = sum of all `amount` values for bets on the winning outcome
   - `Total Losing Stakes` = sum of all `amount` values for bets on the losing outcome
3. **Calculate each winner's payout**:
   ```
   Payout = Winner's Stake + (Winner's Stake / Total Winning Stakes) × Total Losing Stakes
   ```
   Each winning user receives their original stake back plus their proportional share of the losing pool. Bigger stakes get a proportionally bigger share of the payout.
4. **Losers**: Lose their entire stake (already deducted at bet placement time, so no further action needed for losers).
5. **Edge case — no losers**: If all bets are on the winning side (Total Losing Stakes = 0), each winner simply gets their original stake back (payout = stake).
6. **Edge case — no winners**: If all bets are on the losing side (Total Winning Stakes = 0), no payouts are made. All stakes are lost.
7. **Edge case — no bets**: If a market has no bets at all, skip it.

## Settlement Process

For each market on each flight, once `now >= settlementTime`:

1. **Check if already settled**: Add a `settled` map field to the flight document (e.g., `settled.departure`, `settled.arrival`, `settled.cancellation`) to track which markets have been settled. Skip markets already marked settled to prevent double payouts.
2. **Query all bets** for the flight: `where('flightId', '==', flightId)`.
3. **Group bets by market**: Departure bets (`onTimeDeparture`/`delayedDeparture`), Arrival bets (`onTimeArrival`/`delayedArrival`), Cancellation bets (`cancelled`/`notCancelled`).
4. **Determine the winning outcome** for each market using the rules above.
5. **Calculate payouts** for each winning user using the pari-mutuel formula.
6. **Execute payouts in a Firestore transaction** (or batched transactions if needed):
   - Credit each winning user's `balance` by their payout amount.
   - Mark each bet as settled (add a `settled: true` field and a `payout` field with the amount credited to the bet document).
   - Mark the market as settled on the flight document (e.g., set `settled.departure = true`).
7. **Round payouts** to the nearest whole number (balances are integers representing R).

## Important Implementation Notes

- Use Firestore transactions or batched writes for atomicity — never credit a balance without also marking the bet as settled.
- Balance was already deducted when the user placed the bet, so you only need to ADD the payout to the winner's balance. Do NOT deduct anything from losers — their stake was already taken.
- The 15-minute threshold for on-time vs delayed is: `actualTime - scheduledTime > 15 minutes` means delayed.
- Each market (departure, arrival, cancellation) is settled independently — a user could win the departure bet but lose the arrival bet on the same flight.
- Deleted bets (cancelled by user before betting closed) no longer exist in Firestore, so they will not appear in queries and can be ignored.
- Betting closes 6 hours before `departure.scheduled`. No new bets can be placed after this point (enforced by the frontend and Firestore security rules).
