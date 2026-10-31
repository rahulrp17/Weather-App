import { BrandMark, LocationIcon } from "./icons";
import SearchBar from "./SearchBar";

const iconButton =
  "flex h-11 w-11 items-center justify-center rounded-[14px] border border-[var(--border)] bg-[var(--surface-soft)] text-[var(--text-muted)] transition hover:border-[var(--border-strong)] hover:text-[var(--text)] disabled:cursor-not-allowed disabled:opacity-50";

export default function Header({
  query,
  onQueryChange,
  onSubmit,
  onSelect,
  recents,
  onClearRecents,
  onLocate,
  locating,
  unit,
  onUnitChange,
  busy,
  searchRef,
  notFoundMessage,
}) {
  const unitBase =
    "rounded-[10px] px-3 py-1.5 text-sm transition disabled:cursor-not-allowed";
  const unitActive =
    "bg-[var(--accent)] font-semibold text-[#04121f] shadow-[0_6px_18px_-8px_var(--accent)]";
  const unitIdle = "font-medium text-[var(--text-muted)] hover:text-[var(--text)]";

  return (
    <header className="sticky top-0 z-30 border-b border-[var(--border)] bg-[rgba(5,9,20,0.78)] backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-[1240px] flex-col gap-4 px-4 py-4 sm:px-6 lg:flex-row lg:items-center lg:gap-6 lg:px-8">
        <div className="flex items-center gap-3">
          <BrandMark size={38} className="shrink-0" />
          <div className="leading-tight">
            <h1 className="font-display text-xl font-semibold tracking-tight text-[var(--text)]">
              Aeris
            </h1>
            <span className="text-[11px] uppercase tracking-[0.18em] text-[var(--text-dim)]">
              Weather intelligence
            </span>
          </div>
        </div>

        <SearchBar
          value={query}
          onChange={onQueryChange}
          onSubmit={onSubmit}
          onSelect={onSelect}
          recents={recents}
          onClearRecents={onClearRecents}
          busy={busy}
          inputRef={searchRef}
          notFoundMessage={notFoundMessage}
        />

        <div className="flex items-center gap-2 lg:ml-auto">
          <button
            type="button"
            className={`${iconButton} h-9! w-9! text-white! hover:bg-gray-700! rounded-full! shadow-none! bg-gray-800! p-1!  `}
            onClick={onLocate}
            disabled={locating}
            aria-label="Use my current location"
            title="Use my current location"
            aria-busy={locating}
          >
            {locating ? (
              <span
                className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"
                aria-hidden="true"
              />
            ) : (
              <LocationIcon size={20} />
            )}
          </button>

          <div
            className="flex items-center gap-4 rounded-[14px]  p-1"
            role="group"
            aria-label="Temperature unit"
          >
            <button
              type="button"
              className={`${unitBase} text-white! bg-gray-800! p-2! pr-3! hover:bg-gray-700! rounded-full! shadow-none! ${unit === "c" ? unitActive : unitIdle}`}
              aria-pressed={unit === "c"}
              onClick={() => onUnitChange("c")}
            >
              °C
            </button>
            <button
              type="button"
              className={`${unitBase} text-white! bg-gray-800! p-2! pr-3! hover:bg-gray-700! rounded-full! shadow-none! ${unit === "f" ? unitActive : unitIdle}`}
              aria-pressed={unit === "f"}
              onClick={() => onUnitChange("f")}
            >
              °F
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
