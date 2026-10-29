import {
  dayLabel,
  formatShortDate,
  formatTemp,
  precipitationLabel,
} from "../lib/format";
import { DropIcon, WeatherGlyph } from "./icons";

const panel =
  "rounded-[28px] border border-[var(--border)] bg-[var(--surface)] p-5 shadow-[0_24px_60px_-32px_rgba(0,0,0,0.78)] backdrop-blur-xl sm:p-6";

export default function DailyForecast({ daily, unit, currentDt, timezoneOffset }) {
  const lows = daily.map((day) => day.min);
  const highs = daily.map((day) => day.max);
  const overallMin = daily.length ? Math.min(...lows) : 0;
  const overallMax = daily.length ? Math.max(...highs) : 1;
  const spread = Math.max(overallMax - overallMin, 1);
  const wettest = daily.reduce(
    (best, day) => (!best || day.pop > best.pop ? day : best),
    null,
  );

  return (
    <section className={panel} aria-labelledby="daily-heading">
      <header className="mb-2 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-[11px] uppercase tracking-[0.18em] text-[var(--text-dim)]">
            Five-day outlook
          </p>
          <h2
            id="daily-heading"
            className="font-display text-xl font-semibold text-[var(--text)]"
          >
            Daily forecast
          </h2>
        </div>
        <span className="text-xs text-[var(--text-dim)]">High / low</span>
      </header>

      {daily.length === 0 ? (
        <p className="py-8 text-center text-sm text-[var(--text-dim)]">
          Daily forecast data is unavailable for this location right now.
        </p>
      ) : (
        <ul className="divide-y divide-[var(--border)]">
          {daily.map((day) => {
            const label = dayLabel(day, currentDt, timezoneOffset);
            const chance = precipitationLabel(day.pop);
            const start = ((day.min - overallMin) / spread) * 100;
            const end = ((day.max - overallMin) / spread) * 100;

            return (
              <li
                className={`grid grid-cols-[minmax(56px,auto)_auto_minmax(0,1fr)_auto] items-center gap-3 py-3 ${
                  day.isToday ? "-mx-2 rounded-[12px] bg-[var(--accent-soft)] px-2" : ""
                }`}
                key={day.key}
                aria-label={`${label}, ${day.description || day.main}, low ${formatTemp(day.min, unit)}, high ${formatTemp(day.max, unit)}, ${chance} chance of precipitation`}
              >
                <div className="min-w-0">
                  <span className="block text-sm font-medium text-[var(--text)]">
                    {label}
                  </span>
                  <span className="block text-[11px] text-[var(--text-dim)]">
                    {formatShortDate(day.dt, timezoneOffset)}
                  </span>
                </div>

                <WeatherGlyph code={day.icon} size={40} />

                <div className="min-w-0">
                  <span className="block truncate text-sm text-[var(--text-muted)]">
                    {day.description}
                  </span>
                  <span
                    className={`inline-flex items-center gap-1 text-[11px] ${
                      day.pop >= 0.3
                        ? "text-[var(--rain)]"
                        : "text-[var(--text-dim)]"
                    }`}
                  >
                    <DropIcon size={12} />
                    {chance}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="w-9 text-right text-sm text-[var(--text-dim)]">
                    {formatTemp(day.min, unit)}
                  </span>
                  <span className="relative h-1.5 w-14 overflow-hidden rounded-full bg-[var(--border)] sm:w-20">
                    <span
                      className="absolute inset-y-0 rounded-full bg-[linear-gradient(90deg,var(--accent),var(--sun))]"
                      style={{ left: `${start}%`, right: `${100 - end}%` }}
                    />
                  </span>
                  <span className="w-9 text-sm font-medium text-[var(--text)]">
                    {formatTemp(day.max, unit)}
                  </span>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      {daily.length > 0 ? (
        <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-[var(--border)] pt-3 text-xs text-[var(--text-dim)]">
          <span className="inline-flex items-center gap-1.5">
            <DropIcon size={13} />
            {wettest && wettest.pop > 0
              ? `Wettest: ${dayLabel(wettest, currentDt, timezoneOffset)} · ${precipitationLabel(wettest.pop)}`
              : "No rain in the outlook"}
          </span>
          <span>
            Range {formatTemp(overallMin, unit)} – {formatTemp(overallMax, unit)}
          </span>
        </div>
      ) : null}
    </section>
  );
}
