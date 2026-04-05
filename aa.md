Before starting, review this prompt below, break it down into it's components that a architect and senior engineer would break it down into such as identiting the overall design, drawing up a design document, identifying the needed components, pages, how they would need to be created, etc. Unpack all the requirements and ask clarifying questions, similarly to how a software engineer would ask a product manager questions.

Break it down into subtasks which each get allocated to a subagents who has the responsoblity of a given role such as software engineer, product manager, designer, architect, etc.

This project is a new React project with tailwindcss configured.

## Product Brief

**One-liner:** A prediction market app where users bet on FlySafair flight outcomes — delays, on-time arrivals, and cancellations — using fictional currency.

**Inspiration:** bahn.bet (UX pattern: card-based, slider-driven, playful personality) meets Kalshi (prediction market mechanics: binary yes/no contracts, probability pricing in cents, pooled liquidity).

**Brand:** FlySafair's official palette — hot pink (#E6007E), sky blue (#3CA2C8), navy (#0E1A3A). Dark navy UI surfaces. Heart/location-pin logo mark. "Fly" in pink, "Bet" in blue.

## Main interaction flow of the app

1. When the user loads the main page, they see a list of all the flights for the next 24 hours. See below the JSON schema of the flights. They will see the same page regardless if they are authenticated or not.

```json
{"flightNumber":"FA 382","departureAirport":"JNB","arrivalAirport":"ELS","scheduledDeparture":"2026-04-05 15:00+02:00","scheduledArrival":"2026-04-05 16:35+02:00","actualDeparture":"2026-04-05 15:00+02:00","actualArrival":"2026-04-05 16:35+02:00","status":"Expected"}
{"flightNumber":"FA 353","departureAirport":"CPT","arrivalAirport":"HLA","scheduledDeparture":"2026-04-05 15:00+02:00","scheduledArrival":"2026-04-05 17:15+02:00","actualDeparture":"2026-04-05 15:00+02:00","actualArrival":null,"status":"Expected"}
```

2. When the user clicks on any of the flights they we'll experience one of the following flows
    - If the user is not authenticated, they will be asked to sign in using the passwordless sign in of firebase and then redirected back to the main page
    - If the user is authenticated, they will be shown the option to place bets. They can either predict if the flight will be depart on-time and arrive on-time or be completely cancelled. They can be on all three options if they like. The user can place any amount of any of these options. They should only be able to place or cancel their bet with in the 6 hours before departure. On-time means within 5 minutes of scheduled time. Bets can be placed up to 6 hours before the scheduled departure time.

3. When a user signs in for the first time, they get a balance of R1000 in fake money, they can then use this to place their bets.

4. On the main page, there's a butteon to show the ranking page, and this page will shown all the users in order of the highest balance. This will create a bit of competition where people would want to get to the top.



All of the data will be stored in Firebase Firestore and each user should only be able to make the updated they need to place the bets. There will be a background service running on a schedule that will push the flight data into a firebase collection which can only be read by the frontend and similiarly this background service will also assign the rewards based on the bets placed.

Here are some technical and design decisions.
- Only use tailwindcss and Shadcn.
- Add the Shadcn components when needed and don't modity the base component in the `ui` directory but rather apply tailwindcss classes where they are being used.
- Keep the structure of this project maintainable and readble. Dont add too many abstractions or layers.

Anaylse the reference_page.html. It's a prototype of the product. Only use it for inspiration. Don't use it outright as it's not accurate and functional in the way described above.