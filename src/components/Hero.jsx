import {
  conditionSentence,
  convertTemp,
  formatLiveClock,
  formatLocalDate,
  formatLocalHour,
  formatTemp,
  formatUpdated,
  formatUtcOffset,
  formatVisibility,
  formatWindSpeed,
  precipitationLabel,
  tempAria,
} from "../lib/format";
import {
  ArrowUpRightIcon,
  DropIcon,
  HumidityIcon,
  PinIcon,
  RefreshIcon,
  VisibilityIcon,
  WeatherGlyph,
  WindIcon,
} from "./icons";

const quickStat =
  "flex items-center gap-2 rounded-[14px] border border-[var(--border)] bg-[var(--surface-soft)] px-3 py-2.5";
const quickStatIcon =
  "flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[var(--accent-soft)] text-[var(--accent)]";
const chip =
  "inline-flex items-center gap-1.5 rounded-full border border-[var(--border)] bg-[var(--surface-soft)] px-3 py-1.5 text-xs text-[var(--text-muted)]";

export default function Hero({
  data,
  unit,
  now,
  onRefresh,
  refreshing,
}) {
  const { current, place } = data;
  const clock = formatLiveClock(now, current.timezoneOffset);

  const wettest = data.hourly.reduce(
    (best, hour) => (!best || hour.pop > best.pop ? hour : best),
    null,
  );
  const rainingNow = current.weatherId >= 200 && current.weatherId < 600;
  let insight =
    data.hourly.length === 0
      ? "Hourly precipitation outlook is unavailable."
      : "No rain expected across the next 24 hours.";
  if (wettest && wettest.pop >= 0.25) {
    const when = formatLocalHour(wettest.dt, current.timezoneOffset);
    const chance = precipitationLabel(wettest.pop);
    insight = rainingNow
      ? `Rain continues, most likely again around ${when} · ${chance} chance.`
      : `Rain likely around ${when} · ${chance} chance.`;
  } else if (rainingNow) {
    insight = "Rain is falling now. Conditions should ease over the next few hours.";
  }

  return (
    <section
      className="relative overflow-hidden rounded-[28px] border border-[var(--border)] bg-[linear-gradient(135deg,rgba(12,24,48,0.92),rgba(8,16,32,0.72))] p-6 shadow-[0_24px_60px_-32px_rgba(0,0,0,0.78)] sm:p-8 lg:p-10"
      aria-labelledby="hero-city"
    >
      <div
        className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-[radial-gradient(circle,var(--glow-1),transparent_65%)] blur-2xl"
        aria-hidden="true"
      />

      <div className="relative grid gap-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
        <div className="space-y-5">
          <p className="flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-[var(--text-muted)]">
            <span
              className="h-2 w-2 animate-pulse rounded-full bg-[var(--accent)]"
              aria-hidden="true"
            />
            {conditionSentence(current.description)}
          </p>

          <div className="flex flex-wrap items-center gap-2">
            <PinIcon size={18} className="text-[var(--accent)]" />
            <h2
              id="hero-city"
              className="font-display text-3xl font-semibold tracking-tight text-[var(--text)] sm:text-4xl"
            >
              {place.name}
            </h2>
            {place.country ? (
              <span className="rounded-full border border-[var(--border)] px-2.5 py-0.5 text-[11px] uppercase tracking-wider text-[var(--text-muted)]">
                {place.country}
              </span>
            ) : null}
          </div>

          <p className="text-sm text-[var(--text-dim)]">
            {formatLocalDate(current.dt, current.timezoneOffset)}
            <span className="mx-1.5" aria-hidden="true">
              ·
            </span>
            <span className="text-[var(--text-muted)]">{clock}</span> local time
          </p>

          <div className="flex flex-wrap items-end gap-6">
            <div
              className="font-serif text-[clamp(4rem,12vw,7rem)] leading-[0.9] text-[var(--text)]"
              aria-label={tempAria(current.temp, unit)}
            >
              {Math.round(convertTemp(current.temp, unit))}
              <span className="align-top text-[0.38em] text-[var(--text-muted)]">
                °
              </span>
            </div>

            <div className="pb-2">
              <span className="block text-lg font-medium text-[var(--text)]">
                {current.main}
              </span>
              <span className="block text-sm text-[var(--text-muted)]">
                Feels like {formatTemp(current.feelsLike, unit)}
              </span>
              {place.state ? (
                <span className="block text-xs uppercase tracking-wider text-[var(--text-dim)]">
                  {place.state}
                </span>
              ) : null}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2.5 sm:gap-3">
            <div className={quickStat}>
              <span className={quickStatIcon}>
                <HumidityIcon size={15} />
              </span>
              <span className="min-w-0">
                <strong className="block text-sm font-semibold text-[var(--text)]">
                  {current.humidity}%
                </strong>
                <small className="block text-[11px] text-[var(--text-dim)]">
                  Humidity
                </small>
              </span>
            </div>
            <div className={quickStat}>
              <span className={quickStatIcon}>
                <WindIcon size={15} />
              </span>
              <span className="min-w-0">
                <strong className="block truncate text-sm font-semibold text-[var(--text)]">
                  {formatWindSpeed(current.windSpeed, unit)}
                </strong>
                <small className="block text-[11px] text-[var(--text-dim)]">
                  Wind
                </small>
              </span>
            </div>
            <div className={quickStat}>
              <span className={quickStatIcon}>
                <VisibilityIcon size={15} />
              </span>
              <span className="min-w-0">
                <strong className="block truncate text-sm font-semibold text-[var(--text)]">
                  {formatVisibility(current.visibility, unit)}
                </strong>
                <small className="block text-[11px] text-[var(--text-dim)]">
                  Visibility
                </small>
              </span>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <span className={chip}>
              <ArrowUpRightIcon size={14} />
              High {formatTemp(current.tempMax, unit)}
            </span>
            <span className={chip}>Low {formatTemp(current.tempMin, unit)}</span>
            <span className={chip}>
              <DropIcon size={14} />
              {current.clouds}% cloud
            </span>
          </div>

          <p className="flex items-start gap-2 text-sm text-[var(--text-muted)]">
            <span className="mt-0.5 shrink-0 text-[var(--accent)]" aria-hidden="true">
              <DropIcon size={14} />
            </span>
            {insight}
          </p>
        </div>

        <div
          className="relative mx-auto flex h-56 w-56 items-center justify-center sm:h-64 sm:w-64 lg:h-72 lg:w-72"
          aria-hidden="true"
        >
          <span className="absolute inset-0 rounded-full bg-[radial-gradient(circle,var(--glow-1),transparent_62%)] blur-xl" />
          <span className="absolute inset-4 rounded-full border border-[var(--border)]" />
          <span className="absolute inset-10 rounded-full border border-dashed border-[var(--border-strong)]" />
          <span className="absolute inset-16 rounded-full border border-[var(--border)]" />
          <WeatherGlyph
            code={current.icon}
            size={168}
            animated
            className="relative z-10 drop-shadow-[0_18px_30px_rgba(0,0,0,0.45)]"
          />
        </div>
      </div>

      <div className="relative mt-8 flex flex-wrap items-center gap-3 border-t border-[var(--border)] pt-4 text-xs text-[var(--text-dim)]">
        <span>{formatUpdated(data.fetchedAt, now)}</span>
        <span className="hidden sm:inline" aria-hidden="true">
          ·
        </span>
        <span>{formatUtcOffset(current.timezoneOffset)}</span>
        <button
          type="button"
          className="ml-auto inline-flex items-center gap-2 rounded-[12px] border border-[var(--border)] px-3 py-1.5 text-xs font-medium text-[var(--text-muted)] transition hover:border-[var(--border-strong)] hover:text-[var(--text)] disabled:cursor-not-allowed disabled:opacity-50"
          onClick={onRefresh}
          disabled={refreshing}
        >
          <RefreshIcon size={15} className={refreshing ? "animate-spin" : ""} />
          {refreshing ? "Refreshing" : "Refresh"}
        </button>
      </div>
    </section>
  );
}
