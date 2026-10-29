const API_BASE = "https://api.openweathermap.org";
const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;

export class WeatherError extends Error {
  constructor(message, code = "unknown", status = 0) {
    super(message);
    this.name = "WeatherError";
    this.code = code;
    this.status = status;
  }
}

function assertConfigured() {
  if (!API_KEY) {
    throw new WeatherError(
      "Weather service is not configured. Add VITE_OPENWEATHER_API_KEY to your environment.",
      "config",
    );
  }
}

async function request(path, params, signal) {
  assertConfigured();

  const url = new URL(path, API_BASE);
  Object.entries({ ...params, appid: API_KEY }).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      url.searchParams.set(key, value);
    }
  });

  let response;
  try {
    response = await fetch(url, { signal });
  } catch (error) {
    if (error.name === "AbortError") throw error;
    throw new WeatherError(
      "We couldn't reach the weather service. Check your connection and try again.",
      "network",
    );
  }

  let body = null;
  try {
    body = await response.json();
  } catch {
    body = null;
  }

  if (!response.ok) {
    if (response.status === 404) {
      throw new WeatherError(
        "We couldn't find that city. Check the spelling or try a nearby city.",
        "not-found",
        404,
      );
    }
    if (response.status === 401) {
      throw new WeatherError(
        "The weather service rejected the API key. Verify the deployment environment configuration.",
        "unauthorized",
        401,
      );
    }
    if (response.status === 429) {
      throw new WeatherError(
        "Weather requests are temporarily limited. Please wait a moment and try again.",
        "rate-limit",
        429,
      );
    }
    throw new WeatherError(
      body?.message || "The weather service returned an unexpected response.",
      "server",
      response.status,
    );
  }

  if (body && String(body.cod) === "404") {
    throw new WeatherError(
      "We couldn't find that city. Check the spelling or try a nearby city.",
      "not-found",
      404,
    );
  }

  return body;
}

function themeFor(weatherId, iconCode = "") {
  const isNight = iconCode.endsWith("n");
  if (weatherId >= 200 && weatherId < 300) return "thunder";
  if (weatherId >= 300 && weatherId < 400) return "drizzle";
  if (weatherId >= 500 && weatherId < 600) return "rain";
  if (weatherId >= 600 && weatherId < 700) return "snow";
  if (weatherId >= 700 && weatherId < 800) return "mist";
  if (weatherId === 800) return isNight ? "clear-night" : "clear-day";
  if (weatherId > 800) return "clouds";
  return "clouds";
}

function pad(value) {
  return String(value).padStart(2, "0");
}

export function localDateKey(timestamp, timezoneOffset = 0) {
  const date = new Date((timestamp + timezoneOffset) * 1000);
  return `${date.getUTCFullYear()}-${pad(date.getUTCMonth() + 1)}-${pad(date.getUTCDate())}`;
}

function localHourOf(timestamp, timezoneOffset = 0) {
  return new Date((timestamp + timezoneOffset) * 1000).getUTCHours();
}

function buildHourly(list, timezoneOffset, nowSeconds) {
  if (!Array.isArray(list)) return [];
  return list
    .filter((slot) => slot.dt >= nowSeconds - 60 * 60)
    .slice(0, 8)
    .map((slot) => ({
      dt: slot.dt,
      temp: slot.main.temp,
      feelsLike: slot.main.feels_like,
      pop: slot.pop ?? 0,
      humidity: slot.main.humidity,
      windSpeed: slot.wind?.speed ?? 0,
      windDeg: slot.wind?.deg ?? 0,
      weatherId: slot.weather?.[0]?.id ?? 800,
      main: slot.weather?.[0]?.main ?? "Clear",
      description: slot.weather?.[0]?.description ?? "",
      icon: slot.weather?.[0]?.icon ?? "01d",
      theme: themeFor(slot.weather?.[0]?.id ?? 800, slot.weather?.[0]?.icon),
    }));
}

function buildDaily(list, timezoneOffset, current, nowSeconds) {
  if (!Array.isArray(list)) return [];

  const buckets = new Map();
  for (const slot of list) {
    if (slot.dt < nowSeconds - 60 * 60) continue;
    const key = localDateKey(slot.dt, timezoneOffset);
    let bucket = buckets.get(key);
    if (!bucket) {
      bucket = {
        key,
        firstDt: slot.dt,
        min: Infinity,
        max: -Infinity,
        pop: 0,
        slots: [],
      };
      buckets.set(key, bucket);
    }
    bucket.min = Math.min(bucket.min, slot.main.temp);
    bucket.max = Math.max(bucket.max, slot.main.temp);
    bucket.pop = Math.max(bucket.pop, slot.pop ?? 0);
    bucket.slots.push(slot);
  }

  const todayKey = localDateKey(current.dt, timezoneOffset);
  const rows = [...buckets.values()]
    .sort((a, b) => a.firstDt - b.firstDt)
    .slice(0, 5)
    .map((bucket) => {
      const noon = bucket.slots.reduce((best, slot) => {
        const distance = Math.abs(localHourOf(slot.dt, timezoneOffset) - 12);
        const bestDistance = Math.abs(localHourOf(best.dt, timezoneOffset) - 12);
        return distance < bestDistance ? slot : best;
      }, bucket.slots[0]);

      const isToday = bucket.key === todayKey;
      const min = isToday
        ? Math.min(bucket.min, current.temp, current.tempMin)
        : bucket.min;
      const max = isToday
        ? Math.max(bucket.max, current.temp, current.tempMax)
        : bucket.max;

      return {
        key: bucket.key,
        dt: bucket.firstDt,
        isToday,
        min,
        max,
        pop: bucket.pop,
        weatherId: isToday ? current.weatherId : noon.weather?.[0]?.id ?? 800,
        main: isToday ? current.main : noon.weather?.[0]?.main ?? "Clear",
        description: isToday
          ? current.description
          : noon.weather?.[0]?.description ?? "",
        icon: isToday ? current.icon : noon.weather?.[0]?.icon ?? "01d",
        theme: themeFor(
          isToday ? current.weatherId : noon.weather?.[0]?.id ?? 800,
          isToday ? current.icon : noon.weather?.[0]?.icon,
        ),
      };
    });

  return rows;
}

function normalize(current, forecast, placeHint = {}) {
  if (!current || !current.main || !current.weather?.[0]) {
    throw new WeatherError(
      "The weather service returned incomplete data. Please try again.",
      "bad-payload",
    );
  }

  const timezoneOffset =
    current.timezone ?? forecast?.city?.timezone ?? placeHint.timezone ?? 0;
  const weather = current.weather[0];
  const nowSeconds = Math.floor(Date.now() / 1000);

  const hintedName =
    placeHint.name && placeHint.name !== "Current location"
      ? placeHint.name
      : "";

  const model = {
    place: {
      name: hintedName || current.name || placeHint.name || "Unknown location",
      country: current.sys?.country || placeHint.country || "",
      state: placeHint.state || "",
      lat: current.coord?.lat ?? placeHint.lat ?? 0,
      lon: current.coord?.lon ?? placeHint.lon ?? 0,
      timezone: timezoneOffset,
    },
    current: {
      dt: current.dt,
      timezoneOffset,
      temp: current.main.temp,
      feelsLike: current.main.feels_like,
      tempMin: current.main.temp_min,
      tempMax: current.main.temp_max,
      humidity: current.main.humidity,
      pressure: current.main.pressure,
      visibility: current.visibility,
      windSpeed: current.wind?.speed ?? 0,
      windGust: current.wind?.gust ?? null,
      windDeg: current.wind?.deg ?? 0,
      clouds: current.clouds?.all ?? 0,
      sunrise: current.sys?.sunrise,
      sunset: current.sys?.sunset,
      weatherId: weather.id,
      main: weather.main,
      description: weather.description,
      icon: weather.icon,
      theme: themeFor(weather.id, weather.icon),
    },
    hourly: buildHourly(forecast?.list, timezoneOffset, nowSeconds),
    daily: [],
    forecastAvailable: Boolean(forecast?.list?.length),
    fetchedAt: Date.now(),
  };

  model.daily = buildDaily(
    forecast?.list,
    timezoneOffset,
    model.current,
    nowSeconds,
  );

  return model;
}

export async function getWeatherByCity(city, signal) {
  const query = city?.trim();
  if (!query) {
    throw new WeatherError("Enter a city name to search.", "empty-query");
  }

  const [current, forecast] = await Promise.all([
    request("/data/2.5/weather", { q: query, units: "metric" }, signal),
    request("/data/2.5/forecast", { q: query, units: "metric" }, signal).catch(
      (error) => {
        if (error.name === "AbortError") throw error;
        return null;
      },
    ),
  ]);

  return normalize(current, forecast);
}

export async function getWeatherByCoords(lat, lon, signal, placeHint = {}) {
  if (!Number.isFinite(lat) || !Number.isFinite(lon)) {
    throw new WeatherError("That location could not be resolved.", "bad-coords");
  }

  const [current, forecast] = await Promise.all([
    request(
      "/data/2.5/weather",
      { lat, lon, units: "metric" },
      signal,
    ),
    request(
      "/data/2.5/forecast",
      { lat, lon, units: "metric" },
      signal,
    ).catch((error) => {
      if (error.name === "AbortError") throw error;
      return null;
    }),
  ]);

  return normalize(current, forecast, placeHint);
}

export async function searchCities(query, signal) {
  const trimmed = query?.trim();
  if (!trimmed || trimmed.length < 2) return [];
  assertConfigured();

  const results = await request(
    "/geo/1.0/direct",
    { q: trimmed, limit: 6 },
    signal,
  );

  if (!Array.isArray(results)) return [];

  const seen = new Set();
  return results
    .filter((item) => {
      const key = `${item.lat},${item.lon}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .map((item) => ({
      id: `${item.lat},${item.lon}`,
      name: item.name,
      state: item.state || "",
      country: item.country || "",
      lat: item.lat,
      lon: item.lon,
    }));
}
