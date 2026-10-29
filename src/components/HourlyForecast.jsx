import { useEffect, useRef, useState } from "react";
import {
  formatLocalHour,
  formatTemp,
  formatWindSpeed,
  precipitationLabel,
} from "../lib/format";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  DropIcon,
  WeatherGlyph,
} from "./icons";

const panel =
  "rounded-[28px] border border-[var(--border)] bg-[var(--surface)] p-5 shadow-[0_24px_60px_-32px_rgba(0,0,0,0.78)] backdrop-blur-xl sm:p-6";
const control =
  "flex h-8 w-8 items-center justify-center rounded-[10px] border border-[var(--border)] text-[var(--text-muted)] transition hover:border-[var(--border-strong)] hover:text-[var(--text)] disabled:cursor-not-allowed disabled:opacity-40";

export default function HourlyForecast({ hourly, unit, timezoneOffset }) {
  const trackRef = useRef(null);
  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(false);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return undefined;

    function update() {
      setCanLeft(track.scrollLeft > 4);
      setCanRight(
        track.scrollLeft + track.clientWidth < track.scrollWidth - 4,
      );
    }

    update();
    track.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      track.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [hourly.length]);

  function scroll(direction) {
    const track = trackRef.current;
    if (!track) return;
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    track.scrollBy({
      left: direction * Math.min(340, track.clientWidth * 0.82),
      behavior: reduced ? "auto" : "smooth",
    });
  }

  return (
    <section className={panel} aria-labelledby="hourly-heading">
      <header className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-[11px] uppercase tracking-[0.18em] text-[var(--text-dim)]">
            Next 24 hours
          </p>
          <h2
            id="hourly-heading"
            className="font-display text-xl font-semibold text-[var(--text)]"
          >
            Hourly forecast
          </h2>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-[var(--text-dim)]">3-hour intervals</span>
          <div className="flex gap-1.5">
            <button
              type="button"
              className={control}
              onClick={() => scroll(-1)}
              disabled={!canLeft}
              aria-label="Scroll hourly forecast backward"
            >
              <ChevronLeftIcon size={18} />
            </button>
            <button
              type="button"
              className={control}
              onClick={() => scroll(1)}
              disabled={!canRight}
              aria-label="Scroll hourly forecast forward"
            >
              <ChevronRightIcon size={18} />
            </button>
          </div>
        </div>
      </header>

      {hourly.length === 0 ? (
        <p className="py-8 text-center text-sm text-[var(--text-dim)]">
          Hourly forecast data is unavailable for this location right now.
        </p>
      ) : (
        <ul
          className="flex gap-3 overflow-x-auto pb-2 [scrollbar-width:thin]"
          ref={trackRef}
          tabIndex={0}
          aria-label="Hourly weather forecast, scroll horizontally"
        >
          {hourly.map((hour, index) => {
            const chance = precipitationLabel(hour.pop);
            return (
              <li
                className={`flex min-w-[92px] flex-1 flex-col items-center gap-2 rounded-[16px] border px-3 py-4 text-center ${
                  index === 0
                    ? "border-[var(--accent-strong)] bg-[var(--accent-soft)]"
                    : "border-[var(--border)] bg-[var(--surface-soft)]"
                }`}
                key={hour.dt}
                aria-label={`${formatLocalHour(hour.dt, timezoneOffset)} — ${hour.description || hour.main}, ${formatTemp(hour.temp, unit)}, ${chance} chance of precipitation, wind ${formatWindSpeed(hour.windSpeed, unit)}`}
              >
                <span className="text-xs text-[var(--text-muted)]">
                  {formatLocalHour(hour.dt, timezoneOffset)}
                </span>
                <WeatherGlyph code={hour.icon} size={46} />
                <span className="text-sm font-semibold text-[var(--text)]">
                  {formatTemp(hour.temp, unit)}
                </span>
                <span
                  className={`inline-flex items-center gap-1 text-[11px] ${
                    hour.pop >= 0.3
                      ? "text-[var(--rain)]"
                      : "text-[var(--text-dim)]"
                  }`}
                >
                  <DropIcon size={12} />
                  {chance}
                </span>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
