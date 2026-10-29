import { localDateKey } from "./weather";

const timeFormatter = new Intl.DateTimeFormat("en-US", {
  hour: "numeric",
  minute: "2-digit",
  hour12: true,
  timeZone: "UTC",
});

const hourFormatter = new Intl.DateTimeFormat("en-US", {
  hour: "numeric",
  hour12: true,
  timeZone: "UTC",
});

const weekdayFormatter = new Intl.DateTimeFormat("en-US", {
  weekday: "short",
  timeZone: "UTC",
});

const weekdayLongFormatter = new Intl.DateTimeFormat("en-US", {
  weekday: "long",
  timeZone: "UTC",
});

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  weekday: "long",
  month: "long",
  day: "numeric",
  timeZone: "UTC",
});

const shortDateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  timeZone: "UTC",
});

function pseudoLocalDate(timestamp, offsetSeconds = 0) {
  return new Date((timestamp + offsetSeconds) * 1000);
}

export function convertTemp(celsius, unit) {
  if (unit === "f") return (celsius * 9) / 5 + 32;
  return celsius;
}

export function formatTemp(celsius, unit) {
  if (!Number.isFinite(celsius)) return "—";
  return `${Math.round(convertTemp(celsius, unit))}°`;
}

export function tempAria(celsius, unit) {
  if (!Number.isFinite(celsius)) return "Temperature unavailable";
  const value = Math.round(convertTemp(celsius, unit));
  return `${value} degrees ${unit === "f" ? "Fahrenheit" : "Celsius"}`;
}

export function formatTempPair(low, high, unit) {
  if (!Number.isFinite(low) || !Number.isFinite(high)) return "—";
  return `${Math.round(convertTemp(low, unit))}° / ${Math.round(
    convertTemp(high, unit),
  )}°`;
}

export function formatWindSpeed(metersPerSecond, unit) {
  if (!Number.isFinite(metersPerSecond)) return "—";
  if (unit === "f") return `${Math.round(metersPerSecond * 2.23694)} mph`;
  return `${Math.round(metersPerSecond * 3.6)} km/h`;
}

export function formatVisibility(meters, unit) {
  if (!Number.isFinite(meters)) return "—";
  if (unit === "f") {
    const miles = meters / 1609.344;
    return `${miles >= 10 ? Math.round(miles) : miles.toFixed(1)} mi`;
  }
  const km = meters / 1000;
  return `${km >= 10 ? Math.round(km) : km.toFixed(1)} km`;
}

export function visibilityNote(meters) {
  if (!Number.isFinite(meters)) return "Not reported";
  if (meters >= 10000) return "Crystal clear";
  if (meters >= 6000) return "Clear distance";
  if (meters >= 3000) return "Moderate haze";
  if (meters >= 1000) return "Low visibility";
  return "Very low visibility";
}

export function formatLocalTime(timestamp, offsetSeconds, use24Hour = false) {
  if (!Number.isFinite(timestamp)) return "—";
  const date = pseudoLocalDate(timestamp, offsetSeconds);
  if (use24Hour) {
    return `${String(date.getUTCHours()).padStart(2, "0")}:${String(
      date.getUTCMinutes(),
    ).padStart(2, "0")}`;
  }
  return timeFormatter.format(date);
}

export function formatLocalHour(timestamp, offsetSeconds) {
  if (!Number.isFinite(timestamp)) return "—";
  return hourFormatter.format(pseudoLocalDate(timestamp, offsetSeconds));
}

export function formatLocalDate(timestamp, offsetSeconds) {
  if (!Number.isFinite(timestamp)) return "—";
  return dateFormatter.format(pseudoLocalDate(timestamp, offsetSeconds));
}

export function formatWeekday(timestamp, offsetSeconds, long = false) {
  if (!Number.isFinite(timestamp)) return "—";
  const formatter = long ? weekdayLongFormatter : weekdayFormatter;
  return formatter.format(pseudoLocalDate(timestamp, offsetSeconds));
}

export function formatShortDate(timestamp, offsetSeconds) {
  if (!Number.isFinite(timestamp)) return "—";
  return shortDateFormatter.format(pseudoLocalDate(timestamp, offsetSeconds));
}

export function dayLabel(row, currentDt, offsetSeconds) {
  const todayKey = localDateKey(currentDt, offsetSeconds);
  const tomorrowKey = localDateKey(currentDt + 86400, offsetSeconds);
  if (row.key === todayKey) return "Today";
  if (row.key === tomorrowKey) return "Tomorrow";
  return formatWeekday(row.dt, offsetSeconds);
}

export function formatLiveClock(nowMillis, offsetSeconds) {
  const fakeUtc = Math.floor(nowMillis / 1000) + offsetSeconds;
  return formatLocalTime(fakeUtc, 0);
}

export function formatUpdated(fetchedAt, nowMillis) {
  if (!fetchedAt) return "Awaiting update";
  const minutes = Math.max(0, Math.floor((nowMillis - fetchedAt) / 60000));
  if (minutes < 1) return "Updated just now";
  if (minutes === 1) return "Updated 1 min ago";
  if (minutes < 60) return `Updated ${minutes} min ago`;
  const hours = Math.floor(minutes / 60);
  return `Updated ${hours} hr${hours === 1 ? "" : "s"} ago`;
}

export function windDirection(degrees) {
  if (!Number.isFinite(degrees)) return "—";
  const directions = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
  const index = Math.round(degrees / 45) % 8;
  return directions[index];
}

export function windArrowRotation(degrees) {
  if (!Number.isFinite(degrees)) return 0;
  return degrees + 180;
}

export function daylightDuration(sunrise, sunset) {
  if (!Number.isFinite(sunrise) || !Number.isFinite(sunset) || sunset <= sunrise) {
    return "—";
  }
  const totalMinutes = Math.round((sunset - sunrise) / 60);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return `${hours}h ${String(minutes).padStart(2, "0")}m`;
}

export function precipitationLabel(pop) {
  if (!Number.isFinite(pop) || pop <= 0) return "0%";
  return `${Math.round(pop * 100)}%`;
}

export function humidityNote(humidity) {
  if (!Number.isFinite(humidity)) return "Not reported";
  if (humidity >= 80) return "Very humid";
  if (humidity >= 60) return "Comfortable moisture";
  if (humidity >= 35) return "Pleasant";
  return "Dry air";
}

export function pressureNote(pressure) {
  if (!Number.isFinite(pressure)) return "Not reported";
  if (pressure >= 1020) return "High pressure";
  if (pressure <= 1000) return "Low pressure";
  return "Stable pressure";
}

export function formatUtcOffset(offsetSeconds) {
  if (!Number.isFinite(offsetSeconds)) return "UTC";
  const sign = offsetSeconds < 0 ? "−" : "+";
  const absolute = Math.abs(offsetSeconds);
  const hours = Math.floor(absolute / 3600);
  const minutes = Math.floor((absolute % 3600) / 60);
  return `UTC${sign}${String(hours).padStart(2, "0")}:${String(minutes).padStart(
    2,
    "0",
  )}`;
}

export function unitSymbol(unit) {
  return unit === "f" ? "°F" : "°C";
}

export function unitWord(unit) {
  return unit === "f" ? "Fahrenheit" : "Celsius";
}

export function conditionSentence(description) {
  if (!description) return "Conditions unavailable";
  const clean = description.trim();
  return clean.charAt(0).toUpperCase() + clean.slice(1);
}
