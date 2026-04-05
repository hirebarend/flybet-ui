import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'

const docsLinks = [
  {
    href: 'https://vite.dev/',
    label: 'Explore Vite',
    icon: <img className="h-[18px]" src={viteLogo} alt="" />,
  },
  {
    href: 'https://react.dev/',
    label: 'Learn React',
    icon: <img className="h-[18px]" src={reactLogo} alt="" />,
  },
]

const socialLinks = [
  { href: 'https://github.com/vitejs/vite', icon: 'github-icon', label: 'GitHub' },
  { href: 'https://chat.vite.dev/', icon: 'discord-icon', label: 'Discord' },
  { href: 'https://x.com/vite_js', icon: 'x-icon', label: 'X.com' },
  { href: 'https://bsky.app/profile/vite.dev', icon: 'bluesky-icon', label: 'Bluesky' },
]

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="min-h-svh bg-page text-copy">
      <div className="mx-auto flex min-h-svh w-full max-w-[1126px] flex-col border-x border-app-border bg-transparent">
        <main className="flex flex-1 flex-col">
          <section className="flex flex-1 flex-col items-center justify-center gap-8 px-6 py-16 text-center md:gap-6 md:px-10 md:py-20">
            <div className="hero-stack">
              <img
                src={heroImg}
                className="hero-base"
                width="170"
                height="179"
                alt=""
              />
              <img src={reactLogo} className="hero-react" alt="React logo" />
              <img src={viteLogo} className="hero-vite" alt="Vite logo" />
            </div>

            <div className="max-w-2xl space-y-4">
              <p className="mx-auto inline-flex rounded-full border border-app-accent/20 bg-app-accent/10 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.28em] text-app-accent">
                Vite + React 19 + Tailwind CSS 4
              </p>
              <h1 className="font-display text-5xl font-medium tracking-[-0.08em] text-app-heading md:text-7xl">
                Get started
              </h1>
              <p className="mx-auto max-w-xl text-base leading-7 md:text-lg">
                Edit{' '}
                <code className="rounded-md bg-app-muted px-2 py-1 font-mono text-[0.95em] text-app-heading">
                  src/App.tsx
                </code>{' '}
                and save to test{' '}
                <code className="rounded-md bg-app-muted px-2 py-1 font-mono text-[0.95em] text-app-heading">
                  HMR
                </code>{' '}
                with Tailwind utilities now available throughout the app.
              </p>
            </div>

            <button
              className="inline-flex items-center justify-center rounded-xl border border-app-accent/20 bg-app-accent/10 px-4 py-2 font-mono text-sm text-app-accent transition hover:border-app-accent/40 hover:bg-app-accent/15 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-app-accent"
              onClick={() => setCount((count) => count + 1)}
            >
              Count is {count}
            </button>
          </section>

          <div className="ticks" />

          <section className="grid border-t border-app-border md:grid-cols-2">
            <div className="border-b border-app-border px-6 py-8 text-left md:border-b-0 md:border-r md:px-8">
              <svg
                className="mb-4 h-[22px] w-[22px]"
                role="presentation"
                aria-hidden="true"
              >
                <use href="/icons.svg#documentation-icon"></use>
              </svg>
              <h2 className="mb-2 font-display text-2xl font-medium tracking-[-0.03em] text-app-heading">
                Documentation
              </h2>
              <p className="text-sm leading-6 md:text-base">
                Your questions, answered.
              </p>
              <ul className="mt-8 flex flex-wrap gap-3 md:mt-6">
                {docsLinks.map((link) => (
                  <li key={link.href} className="max-md:flex-1">
                    <a
                      className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-app-border bg-app-surface px-4 py-2.5 text-sm font-medium text-app-heading transition hover:-translate-y-0.5 hover:border-app-accent/30 hover:shadow-[0_18px_30px_-18px_rgba(8,6,13,0.35)]"
                      href={link.href}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {link.icon}
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div
              id="social"
              className="px-6 py-8 text-left md:px-8"
            >
              <svg
                className="mb-4 h-[22px] w-[22px]"
                role="presentation"
                aria-hidden="true"
              >
                <use href="/icons.svg#social-icon"></use>
              </svg>
              <h2 className="mb-2 font-display text-2xl font-medium tracking-[-0.03em] text-app-heading">
                Connect with us
              </h2>
              <p className="text-sm leading-6 md:text-base">
                Join the Vite community.
              </p>
              <ul className="mt-8 grid gap-3 sm:grid-cols-2">
                {socialLinks.map((link) => (
                  <li key={link.href}>
                    <a
                      className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-app-border bg-app-surface px-4 py-2.5 text-sm font-medium text-app-heading transition hover:-translate-y-0.5 hover:border-app-accent/30 hover:shadow-[0_18px_30px_-18px_rgba(8,6,13,0.35)]"
                      href={link.href}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <svg
                        className="social-icon h-[18px] w-[18px]"
                        role="presentation"
                        aria-hidden="true"
                      >
                        <use href={`/icons.svg#${link.icon}`}></use>
                      </svg>
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          <div className="ticks" />
          <div className="h-16 border-t border-app-border md:h-24" />
        </main>
      </div>
    </div>
  )
}

export default App
