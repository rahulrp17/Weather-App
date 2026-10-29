import {
  formatTemp,
  formatVisibility,
  formatWindSpeed,
  humidityNote,
  pressureNote,
  visibilityNote,
  windArrowRotation,
  windDirection,
} from "../lib/format";
import {
  CloudsIcon,
  CompassArrow,
  HumidityIcon,
  PressureIcon,
  ThermometerIcon,
  VisibilityIcon,
  WindIcon,
} from "./icons";

const panel =
  "rounded-[28px] border border-[var(--border)] bg-[var(--surface)] p-5 shadow-[0_24px_60px_-32px_rgba(0,0,0,0.78)] backdrop-blur-xl sm:p-6";
const metric =
  "flex flex-col gap-1 rounded-[16px] border border-[var(--border)] bg-[var(--surface-soft)] p-4";
const metricIcon =
  "flex h-9 w-9 items-center justify-center rounded-full bg-[var(--accent-soft)] text-[var(--accent)]";
const metricLabel =
  "text-[11px] uppercase tracking-[0.14em] text-[var(--text-dim)]";
const metricValue = "text-lg font-semibold text-[var(--text)]";
const metricNote = "text-xs text-[var(--text-dim)]";
const meter = "mt-1 h-1.5 w-full overflow-hidden rounded-full bg-[var(--border)]";
const meterFill = "block h-full rounded-full bg-[var(--accent)]";

export default function DetailsGrid({ current, unit }) {
  const gust =
    Number.isFinite(current.windGust) && current.windGust > 0
      ? `Gusts ${formatWindSpeed(current.windGust, unit)}`
      : "Steady airflow";

  return (
    <section className={panel} aria-labelledby="details-heading">
      <header className="mb-4">
        <p className="text-[11px] uppercase tracking-[0.18em] text-[var(--text-dim)]">
          At a glance
        </p>
        <h2
          id="details-heading"
          className="font-display text-xl font-semibold text-[var(--text)]"
        >
          Weather details
        </h2>
      </header>

      <div className="grid grid-cols-2 gap-3">
        <article className={metric}>
          <span className={metricIcon}>
            <ThermometerIcon size={19} />
          </span>
          <span className={metricLabel}>Feels like</span>
          <strong className={metricValue}>
            {formatTemp(current.feelsLike, unit)}
          </strong>
          <span className={metricNote}>Perceived temperature</span>
        </article>

        <article className={metric}>
          <span className={metricIcon}>
            <HumidityIcon size={19} />
          </span>
          <span className={metricLabel}>Humidity</span>
          <strong className={metricValue}>{current.humidity}%</strong>
          <span className={metricNote}>{humidityNote(current.humidity)}</span>
          <span className={meter} aria-hidden="true">
            <span
              className={meterFill}
              style={{ width: `${Math.min(current.humidity, 100)}%` }}
            />
          </span>
        </article>

        <article className={metric}>
          <span className={metricIcon}>
            <WindIcon size={19} />
          </span>
          <span className={metricLabel}>Wind</span>
          <strong className={`${metricValue} flex items-center gap-1.5`}>
            <CompassArrow
              rotation={windArrowRotation(current.windDeg)}
              size={17}
              className="text-[var(--accent)]"
            />
            {formatWindSpeed(current.windSpeed, unit)}
          </strong>
          <span className={metricNote}>
            {windDirection(current.windDeg)} · {gust}
          </span>
        </article>

        <article className={metric}>
          <span className={metricIcon}>
            <VisibilityIcon size={19} />
          </span>
          <span className={metricLabel}>Visibility</span>
          <strong className={metricValue}>
            {formatVisibility(current.visibility, unit)}
          </strong>
          <span className={metricNote}>
            {visibilityNote(current.visibility)}
          </span>
          <span className={meter} aria-hidden="true">
            <span
              className={meterFill}
              style={{
                width: `${Math.min((current.visibility / 10000) * 100, 100)}%`,
              }}
            />
          </span>
        </article>

        <article className={metric}>
          <span className={metricIcon}>
            <PressureIcon size={19} />
          </span>
          <span className={metricLabel}>Pressure</span>
          <strong className={metricValue}>{current.pressure} hPa</strong>
          <span className={metricNote}>{pressureNote(current.pressure)}</span>
        </article>

        <article className={metric}>
          <span className={metricIcon}>
            <CloudsIcon size={19} />
          </span>
          <span className={metricLabel}>Cloud cover</span>
          <strong className={metricValue}>{current.clouds}%</strong>
          <span className={metricNote}>
            {current.clouds >= 85
              ? "Fully overcast"
              : current.clouds >= 50
                ? "Mostly cloudy"
                : current.clouds >= 20
                  ? "Partly cloudy"
                  : "Mostly clear"}
          </span>
          <span className={meter} aria-hidden="true">
            <span className={meterFill} style={{ width: `${current.clouds}%` }} />
          </span>
        </article>
      </div>
    </section>
  );
}
