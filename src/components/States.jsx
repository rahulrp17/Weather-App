import { AlertIcon, CloudOffIcon, RefreshIcon } from "./icons";

const statePanel =
  "mx-auto flex max-w-xl flex-col items-center gap-3 rounded-[28px] border border-[var(--border)] bg-[var(--surface)] p-8 text-center shadow-[0_24px_60px_-32px_rgba(0,0,0,0.78)] backdrop-blur-xl";
const stateIcon =
  "flex h-16 w-16 items-center justify-center rounded-full";
const primaryButton =
  "mt-2 inline-flex items-center gap-2 rounded-[12px] bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-[#04121f] transition hover:bg-[var(--accent-strong)]";
const eyebrow =
  "text-[11px] uppercase tracking-[0.18em] text-[var(--text-dim)]";

export function NotFoundState({ query, onSearchAgain }) {
  return (
    <section className={statePanel} role="status">
      <span className={`${stateIcon} bg-white/5 text-[var(--text-muted)]`}>
        <CloudOffIcon size={40} />
      </span>
      <p className={eyebrow}>No weather found</p>
      <h2 className="font-display text-2xl font-semibold text-[var(--text)]">
        {query ? `We couldn't find “${query}”` : "That location is unavailable"}
      </h2>
      <p className="text-sm text-[var(--text-muted)]">
        Double-check the spelling, or search for a nearby city or region. Recent
        locations are available from the search field.
      </p>
      <button type="button" className={primaryButton} onClick={onSearchAgain}>
        Try another search
      </button>
    </section>
  );
}

export function ErrorState({ message, onRetry }) {
  return (
    <section className={statePanel} role="alert">
      <span className={`${stateIcon} bg-[rgba(255,155,155,0.12)] text-[var(--danger)]`}>
        <AlertIcon size={40} />
      </span>
      <p className={eyebrow}>Weather unavailable</p>
      <h2 className="font-display text-2xl font-semibold text-[var(--text)]">
        We hit turbulence
      </h2>
      <p className="text-sm text-[var(--text-muted)]">
        {message ||
          "The weather service could not be reached. Check your connection and try again."}
      </p>
      <button type="button" className={primaryButton} onClick={onRetry}>
        <RefreshIcon size={16} />
        Try again
      </button>
    </section>
  );
}

export function ErrorBanner({ message, onRetry, onDismiss }) {
  return (
    <div
      className="flex flex-wrap items-center gap-3 rounded-[16px] border border-[rgba(255,155,155,0.35)] bg-[rgba(255,155,155,0.08)] px-4 py-3 text-sm text-[var(--danger)]"
      role="alert"
    >
      <span className="shrink-0" aria-hidden="true">
        <AlertIcon size={18} />
      </span>
      <p className="min-w-0 flex-1">{message}</p>
      <div className="ml-auto flex items-center gap-2">
        <button
          type="button"
          className="rounded-[10px] border border-[rgba(255,155,155,0.4)] px-3 py-1 text-xs font-semibold text-[var(--danger)] transition hover:bg-[rgba(255,155,155,0.12)]"
          onClick={onRetry}
        >
          Retry
        </button>
        <button
          type="button"
          className="flex h-7 w-7 items-center justify-center rounded-full text-[var(--danger)] transition hover:bg-[rgba(255,155,155,0.15)]"
          onClick={onDismiss}
          aria-label="Dismiss weather error"
        >
          ×
        </button>
      </div>
    </div>
  );
}

export function WeatherSkeleton() {
  const block = "block rounded-[10px] bg-white/5 animate-pulse";
  return (
    <div className="flex flex-col gap-5" role="status" aria-live="polite">
      <span className="sr-only">Loading weather data…</span>

      <div className="rounded-[28px] border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[0_24px_60px_-32px_rgba(0,0,0,0.78)] backdrop-blur-xl sm:p-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex w-full max-w-md flex-col gap-3">
            <span className={`${block} h-3 w-28`} />
            <span className={`${block} h-9 w-52`} />
            <span className={`${block} h-4 w-64`} />
            <span className={`${block} h-20 w-40`} />
            <span className={`${block} h-4 w-56`} />
          </div>
          <span className={`${block} h-40 w-40 shrink-0 self-center rounded-full`} />
        </div>
      </div>

      <div className="rounded-[28px] border border-[var(--border)] bg-[var(--surface)] p-5 shadow-[0_24px_60px_-32px_rgba(0,0,0,0.78)] backdrop-blur-xl sm:p-6">
        <span className={`${block} mb-4 h-3 w-28`} />
        <div className="flex gap-3 overflow-hidden">
          {Array.from({ length: 7 }).map((_, index) => (
            <span
              className={`${block} h-32 min-w-[92px] flex-1 rounded-[16px]`}
              key={index}
            />
          ))}
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
        <div className="rounded-[28px] border border-[var(--border)] bg-[var(--surface)] p-5 shadow-[0_24px_60px_-32px_rgba(0,0,0,0.78)] backdrop-blur-xl sm:p-6">
          <span className={`${block} mb-4 h-3 w-28`} />
          {Array.from({ length: 5 }).map((_, index) => (
            <span className={`${block} mb-3 h-10 w-full`} key={index} />
          ))}
        </div>
        <div className="rounded-[28px] border border-[var(--border)] bg-[var(--surface)] p-5 shadow-[0_24px_60px_-32px_rgba(0,0,0,0.78)] backdrop-blur-xl sm:p-6">
          <span className={`${block} mb-4 h-3 w-28`} />
          <div className="grid grid-cols-2 gap-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <span className={`${block} h-24 w-full rounded-[16px]`} key={index} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
