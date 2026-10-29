import { useId } from "react";
import {
  daylightDuration,
  formatLocalTime,
} from "../lib/format";
import { SunriseIcon, SunsetIcon } from "./icons";

const PLOT = { width: 1000, height: 180, centerX: 500, horizonY: 160 };
const ARC = { radiusX: 460, radiusY: 130 };

const panel =
  "rounded-[28px] border border-[var(--border)] bg-[var(--surface)] p-5 shadow-[0_24px_60px_-32px_rgba(0,0,0,0.78)] backdrop-blur-xl sm:p-6";

export default function SunCard({ current, timezoneOffset }) {
  const gradientId = `sunPath-${useId().replace(/[^a-zA-Z0-9]/g, "")}`;
  const nowSeconds = Date.now() / 1000;
  const span = current.sunset - current.sunrise;
  const progress =
    Number.isFinite(span) && span > 0
      ? Math.min(Math.max((nowSeconds - current.sunrise) / span, 0), 1)
      : 0;
  const isDaylight =
    Number.isFinite(current.sunrise) &&
    Number.isFinite(current.sunset) &&
    nowSeconds >= current.sunrise &&
    nowSeconds <= current.sunset;

  const solarNoon = (current.sunrise + current.sunset) / 2;
  const angle = Math.PI * (1 - progress);
  const sunX = PLOT.centerX + ARC.radiusX * Math.cos(angle);
  const sunY = PLOT.horizonY - ARC.radiusY * Math.sin(angle);
  const sunLeft = (sunX / PLOT.width) * 100;
  const sunTop = (sunY / PLOT.height) * 100;
  const dropHeight = ((PLOT.horizonY - sunY) / PLOT.height) * 100;

  return (
    <section className={panel} aria-labelledby="sun-heading">
      <header className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-[11px] uppercase tracking-[0.18em] text-[var(--text-dim)]">
            Daylight
          </p>
          <h2
            id="sun-heading"
            className="font-display text-xl font-semibold text-[var(--text)]"
          >
            Sun path
          </h2>
        </div>
        <p className="text-xs text-[var(--text-dim)]">
          <strong className="text-[var(--text)]">
            {daylightDuration(current.sunrise, current.sunset)}
          </strong>{" "}
          of daylight
          <span aria-hidden="true"> · </span>
          {isDaylight ? "sun is up" : "night"}
        </p>
      </header>

      <div className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 sm:gap-6">
        <div className="flex items-center gap-2 text-[var(--text-muted)]">
          <SunriseIcon size={18} className="text-[var(--sun)]" />
          <span className="leading-tight">
            <strong className="block text-sm text-[var(--text)]">
              {formatLocalTime(current.sunrise, timezoneOffset)}
            </strong>
            <small className="block text-[11px] text-[var(--text-dim)]">
              Sunrise
            </small>
          </span>
        </div>

        <div className="relative h-28 sm:h-32" aria-hidden="true">
          <svg
            className="absolute inset-0 h-full w-full"
            viewBox={`0 0 ${PLOT.width} ${PLOT.height}`}
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                <stop stopColor="var(--accent)" stopOpacity=".18" />
                <stop offset="1" stopColor="var(--accent)" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path
              d={`M40 ${PLOT.horizonY} A${ARC.radiusX} ${ARC.radiusY} 0 0 1 960 ${PLOT.horizonY} L960 ${PLOT.height} L40 ${PLOT.height} Z`}
              fill={`url(#${gradientId})`}
            />
            <path
              d={`M40 ${PLOT.horizonY} A${ARC.radiusX} ${ARC.radiusY} 0 0 1 960 ${PLOT.horizonY}`}
              fill="none"
              stroke="var(--border-strong)"
              strokeWidth="1.4"
              strokeDasharray="3 7"
            />
            <path
              d={`M0 ${PLOT.horizonY} H${PLOT.width}`}
              stroke="var(--border)"
              strokeWidth="1"
            />
          </svg>

          {isDaylight ? (
            <>
              <span
                className="absolute w-px -translate-x-1/2 bg-[linear-gradient(to_bottom,rgba(255,211,122,0.55),transparent)]"
                style={{
                  left: `${sunLeft}%`,
                  top: `${sunTop}%`,
                  height: `${dropHeight}%`,
                }}
              />
              <span
                className="absolute h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--sun)] shadow-[0_0_18px_rgba(255,211,122,0.75)]"
                style={{ left: `${sunLeft}%`, top: `${sunTop}%` }}
              />
            </>
          ) : null}
          <span className="absolute bottom-0 left-1/2 -translate-x-1/2 whitespace-nowrap text-[11px] text-[var(--text-dim)]">
            Solar noon{" "}
            <strong className="text-[var(--text-muted)]">
              {formatLocalTime(solarNoon, timezoneOffset)}
            </strong>
          </span>
        </div>

        <div className="flex items-center gap-2 text-right text-[var(--text-muted)]">
          <span className="leading-tight">
            <strong className="block text-sm text-[var(--text)]">
              {formatLocalTime(current.sunset, timezoneOffset)}
            </strong>
            <small className="block text-[11px] text-[var(--text-dim)]">
              Sunset
            </small>
          </span>
          <SunsetIcon size={18} className="text-[var(--sun)]" />
        </div>
      </div>
    </section>
  );
}
