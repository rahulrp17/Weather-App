import { useEffect, useRef, useState } from "react";
import { searchCities } from "../lib/weather";
import { ClockIcon, PinIcon, SearchIcon } from "./icons";

export default function SearchBar({
  value,
  onChange,
  onSubmit,
  onSelect,
  recents = [],
  onClearRecents,
  busy = false,
  inputRef,
  notFoundMessage = "",
}) {
  const ownRef = useRef(null);
  const inputEl = inputRef ?? ownRef;
  const wrapRef = useRef(null);
  const [suggestions, setSuggestions] = useState([]);
  const [suggestionsFor, setSuggestionsFor] = useState("");
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const [searching, setSearching] = useState(false);
  const [searchError, setSearchError] = useState("");

  const query = value.trim();
  const showingRecents = query.length < 2;
  const currentSuggestions =
    suggestionsFor === query ? suggestions : [];
  const items = showingRecents ? recents : currentSuggestions;
  const listOpen = open && (items.length > 0 || !showingRecents);

  useEffect(() => {
    const trimmed = value.trim();
    setActive(-1);

    if (trimmed.length < 2) {
      setSuggestions([]);
      setSuggestionsFor("");
      setSearching(false);
      setSearchError("");
      return undefined;
    }

    const controller = new AbortController();
    setSuggestions([]);
    setSuggestionsFor("");
    setSearching(true);

    const timer = window.setTimeout(async () => {
      try {
        const results = await searchCities(trimmed, controller.signal);
        setSuggestions(results);
        setSuggestionsFor(trimmed);
        setSearchError("");
      } catch (error) {
        if (error.name === "AbortError") return;
        setSuggestions([]);
        setSuggestionsFor(trimmed);
        setSearchError(error.message || "Could not load suggestions.");
      } finally {
        if (!controller.signal.aborted) setSearching(false);
      }
    }, 320);

    return () => {
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [value]);

  useEffect(() => {
    if (!open) return undefined;
    function handlePointerDown(event) {
      if (wrapRef.current && !wrapRef.current.contains(event.target)) {
        setOpen(false);
        setActive(-1);
      }
    }
    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, [open]);

  function commit(item) {
    if (!item) return;
    onSelect(item);
    setOpen(false);
    setActive(-1);
    inputEl.current?.blur();
  }

  function submit(event) {
    event.preventDefault();
    if (active >= 0 && items[active]) {
      commit(items[active]);
      return;
    }
    if (!query) {
      inputEl.current?.focus();
      return;
    }
    onSubmit(query);
    setOpen(false);
    setActive(-1);
    inputEl.current?.blur();
  }

  function handleKeyDown(event) {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setOpen(true);
      if (items.length > 0) {
        setActive((current) => (current + 1) % items.length);
      }
      return;
    }
    if (event.key === "ArrowUp") {
      event.preventDefault();
      setOpen(true);
      if (items.length > 0) {
        setActive((current) =>
          current <= 0 ? items.length - 1 : current - 1,
        );
      }
      return;
    }
    if (event.key === "Escape") {
      setOpen(false);
      setActive(-1);
      return;
    }
    if (event.key === "Enter") {
      submit(event);
    }
  }

  function clear() {
    onChange("");
    setSuggestions([]);
    setSuggestionsFor("");
    setSearching(false);
    setSearchError("");
    setActive(-1);
    setOpen(true);
    inputEl.current?.focus();
  }

  return (
    <div className="relative w-full lg:max-w-[520px]" ref={wrapRef}>
      <form
        className="flex items-center gap-2 rounded-[14px] border border-[var(--border)] bg-[var(--surface-soft)] px-3 py-1.5 transition focus-within:border-[var(--accent)] focus-within:shadow-[0_0_0_3px_var(--accent-soft)]"
        role="search"
        onSubmit={submit}
        autoComplete="off"
      >
        <SearchIcon size={19} className="shrink-0 text-[var(--text-dim)]" />
        <input
          ref={inputEl}
          type="text"
          className="h-9 min-w-0 flex-1 bg-transparent text-sm text-[var(--text)] outline-none placeholder:text-[var(--text-dim)]"
          placeholder="Search city or region"
          aria-label="Search for a city"
          role="combobox"
          aria-autocomplete="list"
          aria-expanded={listOpen}
          aria-controls="search-listbox"
          aria-activedescendant={
            active >= 0 ? `search-option-${active}` : undefined
          }
          value={value}
          onChange={(event) => {
            onChange(event.target.value);
            setActive(-1);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={handleKeyDown}
          spellCheck="false"
        />

        {value ? (
          <button
            type="button"
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[var(--text-dim)] transition hover:bg-white/10 hover:text-[var(--text)]"
            aria-label="Clear search"
            onClick={clear}
          >
            <span aria-hidden="true">×</span>
          </button>
        ) : null}

        <button
          type="submit"
          className="inline-flex shrink-0 items-center justify-center rounded-[10px] bg-[var(--accent)] px-3 py-1.5 text-sm font-semibold text-[#04121f] transition hover:bg-[var(--accent-strong)] disabled:cursor-not-allowed disabled:opacity-60"
          aria-label="Search weather"
          disabled={busy}
        >
          {busy ? (
            <span
              className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"
              aria-hidden="true"
            />
          ) : (
            "Search"
          )}
        </button>
      </form>

      {notFoundMessage ? (
        <p className="mt-2 text-sm text-[var(--danger)]" role="alert">
          {notFoundMessage}
        </p>
      ) : null}

      {listOpen ? (
        <div className="absolute left-0 right-0 top-[calc(100%+8px)] z-40 overflow-hidden rounded-[18px] border border-[var(--border)] bg-[var(--bg-2)] shadow-[0_24px_60px_-32px_rgba(0,0,0,0.78)]">
          <div className="flex items-center justify-between px-4 py-2 text-[11px] uppercase tracking-[0.16em] text-[var(--text-dim)]">
            <span>
              {showingRecents
                ? "Recent locations"
                : searching
                  ? "Searching…"
                  : "Matching locations"}
            </span>
            {showingRecents && recents.length > 0 ? (
              <button
                type="button"
                className="text-[var(--accent)] transition hover:underline"
                onClick={onClearRecents}
              >
                Clear
              </button>
            ) : null}
          </div>

          {items.length > 0 ? (
            <ul
              id="search-listbox"
              className="max-h-72 overflow-y-auto py-1"
              role="listbox"
              aria-label="Location suggestions"
            >
              {items.map((item, index) => (
                <li
                  key={item.id ?? `${item.name}-${item.lat}-${item.lon}`}
                  id={`search-option-${index}`}
                  role="option"
                  aria-selected={index === active}
                  className={`flex cursor-pointer items-center gap-3 px-4 py-2.5 transition ${
                    index === active
                      ? "bg-[var(--accent-soft)]"
                      : "hover:bg-white/5"
                  }`}
                  onMouseEnter={() => setActive(index)}
                  onMouseDown={(event) => event.preventDefault()}
                  onClick={() => commit(item)}
                >
                  <span className="shrink-0 text-[var(--text-dim)]" aria-hidden="true">
                    {showingRecents ? (
                      <ClockIcon size={17} />
                    ) : (
                      <PinIcon size={17} />
                    )}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-medium text-[var(--text)]">
                      {item.name}
                    </span>
                    <span className="block truncate text-xs text-[var(--text-dim)]">
                      {[item.state, item.country].filter(Boolean).join(", ") ||
                        "Location"}
                    </span>
                  </span>
                  {item.country ? (
                    <span className="shrink-0 rounded-full border border-[var(--border)] px-2 py-0.5 text-[10px] uppercase tracking-wider text-[var(--text-muted)]">
                      {item.country}
                    </span>
                  ) : null}
                </li>
              ))}
            </ul>
          ) : (
            <p className="px-4 py-6 text-center text-sm text-[var(--text-dim)]">
              {searching
                ? "Looking for matches…"
                : searchError || "No matching cities. Try a wider search."}
            </p>
          )}
        </div>
      ) : null}
    </div>
  );
}
