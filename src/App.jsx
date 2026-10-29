import { useCallback, useEffect, useRef, useState } from "react";
import Header from "./components/Header";
import Hero from "./components/Hero";
import HourlyForecast from "./components/HourlyForecast";
import DailyForecast from "./components/DailyForecast";
import DetailsGrid from "./components/DetailsGrid";
import SunCard from "./components/SunCard";
import {
  ErrorBanner,
  ErrorState,
  NotFoundState,
  WeatherSkeleton,
} from "./components/States";
import { getWeatherByCity, getWeatherByCoords } from "./lib/weather";
import { convertTemp, unitWord } from "./lib/format";

const STORAGE = {
  unit: "aeris:unit",
  recents: "aeris:recents",
  place: "aeris:last-place",
};

const FALLBACK_CITY = "Chennai";

function readStorage(key, fallback) {
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function writeStorage(key, value) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* Storage can be unavailable in private modes; the app still works. */
  }
}

function validPlace(place) {
  return (
    place &&
    typeof place.name === "string" &&
    Number.isFinite(place.lat) &&
    Number.isFinite(place.lon)
  );
}

function recentId(place) {
  return `${place.lat.toFixed(3)},${place.lon.toFixed(3)}`;
}

function geolocationMessage(error) {
  if (!error) return "Your location could not be detected.";
  if (error.code === 1) {
    return "Location permission was denied. Enable it in your browser or search for a city instead.";
  }
  if (error.code === 2) {
    return "Your location is currently unavailable. Please search for a city instead.";
  }
  if (error.code === 3) {
    return "Finding your location took too long. Please try again or search for a city.";
  }
  return "Your location could not be detected. Please search for a city instead.";
}

export default function App() {
  const initialPlaceRef = useRef(readStorage(STORAGE.place, null));
  const initialPlace = validPlace(initialPlaceRef.current)
    ? initialPlaceRef.current
    : null;

  const [data, setData] = useState(null);
  const dataRef = useRef(null);
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState("");
  const [banner, setBanner] = useState("");
  const [failedQuery, setFailedQuery] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [locating, setLocating] = useState(false);
  const [query, setQuery] = useState(initialPlace?.name || FALLBACK_CITY);
  const [[unit], setUnitState] = useState(() => {
    const saved = readStorage(STORAGE.unit, "c");
    return saved === "f" ? "f" : "c";
  });
  const [recents, setRecents] = useState(() => {
    const saved = readStorage(STORAGE.recents, []);
    return Array.isArray(saved) ? saved.filter(validPlace).slice(0, 5) : [];
  });
  const [now, setNow] = useState(() => Date.now());
  const [announcement, setAnnouncement] = useState("");

  const searchRef = useRef(null);
  const abortRef = useRef(null);
  const lastRequestRef = useRef(null);

  const setUnit = useCallback((next) => {
    setUnitState(next);
    try {
      window.localStorage.setItem(STORAGE.unit, JSON.stringify(next));
    } catch {
      /* Ignore storage failures. */
    }
  }, []);

  const addRecent = useCallback((place) => {
    if (!validPlace(place)) return;
    const entry = {
      id: recentId(place),
      name: place.name,
      state: place.state || "",
      country: place.country || "",
      lat: place.lat,
      lon: place.lon,
    };

    setRecents((previous) => {
      const next = [
        entry,
        ...previous.filter((item) => item.id !== entry.id),
      ].slice(0, 5);
      writeStorage(STORAGE.recents, next);
      return next;
    });
  }, []);

  const cleartRecents = useCallback(() => {
    setRecents([]);
    writeStorage(STORAGE.recents, []);
  }, []);

  const loadWeather = useCallback(
    async (request, mode = "search") => {
      if (!request || (!request.city && !request.place)) return;

      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;
      lastRequestRef.current = request;

      if (mode === "search" || !dataRef.current) {
        setStatus("loading");
      } else {
        setRefreshing(true);
      }
      setError("");
      setBanner("");
      setFailedQuery("");

      try {
        const result = request.place
          ? await getWeatherByCoords(
              request.place.lat,
              request.place.lon,
              controller.signal,
              request.place,
            )
          : await getWeatherByCity(request.city, controller.signal);

        if (controller.signal.aborted) return;

        dataRef.current = result;
        setData(result);
        setStatus("ready");
        setQuery(result.place.name);
        setNow(Date.now());
        addRecent(result.place);
        writeStorage(STORAGE.place, {
          name: result.place.name,
          state: result.place.state,
          country: result.place.country,
          lat: result.place.lat,
          lon: result.place.lon,
        });
        setAnnouncement(
          `Weather updated for ${result.place.name}: ${Math.round(
            convertTemp(result.current.temp, unit),
          )} degrees ${unitWord(unit)}, ${result.current.description}.`,
        );
      } catch (caught) {
        if (caught.name === "AbortError") return;

        if (mode === "refresh" && dataRef.current) {
          setBanner(caught.message);
          return;
        }

        setStatus(caught.code === "not-found" ? "not-found" : "error");
        setError(caught.message);
        setFailedQuery(
          request.city ||
            request.place?.name ||
            request.place?.state ||
            "that location",
        );
      } finally {
        if (!controller.signal.aborted) setRefreshing(false);
      }
    },
    [addRecent, unit],
  );

  useEffect(() => {
    if (initialPlace) {
      loadWeather({ place: initialPlace }, "search");
    } else {
      loadWeather({ city: FALLBACK_CITY }, "search");
    }
    return () => abortRef.current?.abort();
    // The initial location is intentionally read once.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const interval = window.setInterval(() => setNow(Date.now()), 30000);
    return () => window.clearInterval(interval);
  }, []);

  useEffect(() => {
    if (data?.current?.theme) {
      document.documentElement.dataset.theme = data.current.theme;
    }
    document.title = data
      ? `Aeris — Weather in ${data.place.name}`
      : "Aeris — Premium weather";
  }, [data]);

  useEffect(() => {
    function handleShortcut(event) {
      if (event.key !== "/" || event.defaultPrevented) return;
      const tag = document.activeElement?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;
      event.preventDefault();
      searchRef.current?.focus();
    }
    window.addEventListener("keydown", handleShortcut);
    return () => window.removeEventListener("keydown", handleShortcut);
  }, []);

  function handleSelect(place) {
    setQuery(place.name);
    loadWeather({ place }, "search");
  }

  function handleSubmit(city) {
    const trimmed = city.trim();
    if (!trimmed) {
      searchRef.current?.focus();
      return;
    }
    loadWeather({ city: trimmed }, "search");
  }

  function handleRefresh() {
    const request = lastRequestRef.current;
    if (request) {
      loadWeather(request, "refresh");
      return;
    }
    if (data) {
      loadWeather(
        { place: { ...data.place, lat: data.place.lat, lon: data.place.lon } },
        "refresh",
      );
    }
  }

  function handleRetry() {
    const request = lastRequestRef.current;
    if (request) {
      loadWeather(request, "search");
      return;
    }
    loadWeather({ city: FALLBACK_CITY }, "search");
  }

  function handleSearchAgain() {
    if (data) setStatus("ready");
    searchRef.current?.focus();
    searchRef.current?.select();
  }

  function handleLocate() {
    if (!navigator.geolocation) {
      setBanner("Geolocation is not supported by this browser.");
      return;
    }

    setLocating(true);
    setBanner("");

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocating(false);
        loadWeather(
          {
            place: {
              name: "Current location",
              lat: position.coords.latitude,
              lon: position.coords.longitude,
            },
          },
          "search",
        );
      },
      (geoError) => {
        setLocating(false);
        setBanner(geolocationMessage(geoError));
      },
      { enableHighAccuracy: false, timeout: 12000, maximumAge: 300000 },
    );
  }

  const busy = status === "loading" || refreshing;

  return (
    <div className="min-h-dvh bg-[var(--bg-0)] font-sans text-[var(--text)]">
      <a
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-[14px] focus:bg-[var(--accent)] focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-[#04121f]"
        href="#main"
      >
        Skip to weather
      </a>

      <Header
        query={query}
        onQueryChange={setQuery}
        onSubmit={handleSubmit}
        onSelect={handleSelect}
        recents={recents}
        onClearRecents={cleartRecents}
        onLocate={handleLocate}
        locating={locating}
        unit={unit}
        onUnitChange={setUnit}
        busy={busy}
        searchRef={searchRef}
        notFoundMessage={
          status === "not-found"
            ? `No weather data found for “${failedQuery}”.`
            : ""
        }
      />

      <main
        id="main"
        className="mx-auto flex w-full max-w-[1240px] flex-col gap-5 px-4 pb-16 pt-6 sm:px-6 lg:px-8"
      >
        {banner && data ? (
          <ErrorBanner
            message={banner}
            onRetry={handleRefresh}
            onDismiss={() => setBanner("")}
          />
        ) : null}

        {status === "loading" ? <WeatherSkeleton /> : null}

        {status === "error" ? (
          <ErrorState message={error} onRetry={handleRetry} />
        ) : null}

        {status === "not-found" ? (
          <NotFoundState
            query={failedQuery}
            onSearchAgain={handleSearchAgain}
          />
        ) : null}

        {status === "ready" && data ? (
          <>
            <Hero
              data={data}
              unit={unit}
              now={now}
              onRefresh={handleRefresh}
              refreshing={refreshing}
            />

            <HourlyForecast
              hourly={data.hourly}
              unit={unit}
              timezoneOffset={data.current.timezoneOffset}
            />

            <div className="grid gap-5 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
              <DailyForecast
                daily={data.daily}
                unit={unit}
                currentDt={data.current.dt}
                timezoneOffset={data.current.timezoneOffset}
              />
              <DetailsGrid current={data.current} unit={unit} />
            </div>

            <SunCard
              current={data.current}
              timezoneOffset={data.current.timezoneOffset}
            />

            {!data.forecastAvailable ? (
              <p className="text-center text-sm text-[var(--text-dim)]">
                Extended forecast data is temporarily unavailable for this
                location. Current conditions are still live.
              </p>
            ) : null}
          </>
        ) : null}

        <p className="sr-only" role="status" aria-live="polite">
          {announcement}
        </p>
      </main>

      <footer className="mx-auto flex w-full max-w-[1240px] flex-col gap-2 border-t border-[var(--border)] px-4 py-8 text-sm text-[var(--text-dim)] sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
        <p>
          Weather data from{" "}
          <a href="https://openweathermap.org/" target="_blank" rel="noreferrer">
            OpenWeather
          </a>
          . Forecasts use the provider&apos;s 3-hour resolution.
        </p>
        <p>
          Designed by <strong>RP17</strong>
        </p>
      </footer>
    </div>
  );
}
