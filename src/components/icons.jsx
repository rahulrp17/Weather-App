import { useId } from "react";

function Svg({ children, size = 24, className = "", title, ...props }) {
  const labelled = Boolean(title);
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role={labelled ? "img" : undefined}
      aria-hidden={labelled ? undefined : "true"}
      focusable="false"
      {...props}
    >
      {labelled ? <title>{title}</title> : null}
      {children}
    </svg>
  );
}

export function BrandMark({ size = 36, className = "" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      <rect width="40" height="40" rx="12" fill="url(#aerisMark)" />
      <path
        d="M11 24.5a5.5 5.5 0 0 1 5.5-5.5h.4a7.2 7.2 0 0 1 13.8 1.7A4.65 4.65 0 0 1 29.7 30H16.4A5.4 5.4 0 0 1 11 24.5Z"
        fill="white"
        fillOpacity="0.92"
      />
      <circle cx="16.6" cy="13.6" r="4.6" fill="#ffd37a" />
      <path
        d="M16.6 6.6v2M16.6 18.6v2M9.6 13.6h2M23.6 13.6h-2M11.9 8.9l1.4 1.4M21.3 8.9l-1.4 1.4"
        stroke="#ffd37a"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <defs>
        <linearGradient id="aerisMark" x1="4" y1="2" x2="36" y2="40">
          <stop stopColor="#123a63" />
          <stop offset="1" stopColor="#0b1b33" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export function SearchIcon(props) {
  return (
    <Svg {...props}>
      <circle cx="11" cy="11" r="6.25" stroke="currentColor" strokeWidth="1.8" />
      <path
        d="m16 16 4 4"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </Svg>
  );
}

export function LocationIcon(props) {
  return (
    <Svg {...props}>
      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.7" />
      <path
        d="M12 3v2.2M12 18.8V21M3 12h2.2M18.8 12H21"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
      <circle cx="12" cy="12" r="7.4" stroke="currentColor" strokeWidth="1.4" opacity=".55" />
    </Svg>
  );
}

export function PinIcon(props) {
  return (
    <Svg {...props}>
      <path
        d="M12 21s6.3-5.4 6.3-10.3A6.3 6.3 0 0 0 5.7 10.7C5.7 15.6 12 21 12 21Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="10.5" r="2.25" stroke="currentColor" strokeWidth="1.6" />
    </Svg>
  );
}

export function ClockIcon(props) {
  return (
    <Svg {...props}>
      <circle cx="12" cy="12" r="8.25" stroke="currentColor" strokeWidth="1.6" />
      <path
        d="M12 7.6V12l2.9 1.9"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </Svg>
  );
}

export function ChevronLeftIcon(props) {
  return (
    <Svg {...props}>
      <path
        d="m14.5 6.5-5 5.5 5 5.5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export function ChevronRightIcon(props) {
  return (
    <Svg {...props}>
      <path
        d="m9.5 6.5 5 5.5-5 5.5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export function DropIcon(props) {
  return (
    <Svg {...props}>
      <path
        d="M12 3.5c3.1 3.7 5.2 6.5 5.2 9A5.2 5.2 0 0 1 6.8 12.5c0-2.5 2.1-5.3 5.2-9Z"
        stroke="currentColor"
        strokeWidth="1.55"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export function ThermometerIcon(props) {
  return (
    <Svg {...props}>
      <path
        d="M10 13.6V5.9a2 2 0 1 1 4 0v7.7a4.4 4.4 0 1 1-4 0Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path d="M12 9.5v5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <circle cx="12" cy="16.6" r="1.6" fill="currentColor" />
    </Svg>
  );
}

export function HumidityIcon(props) {
  return (
    <Svg {...props}>
      <path
        d="M12 3.2c3.4 4.1 5.6 7.1 5.6 9.6a5.6 5.6 0 0 1-11.2 0c0-2.5 2.2-5.5 5.6-9.6Z"
        stroke="currentColor"
        strokeWidth="1.55"
      />
      <path
        d="M9.4 13.2a2.8 2.8 0 0 0 2.6 2.8"
        stroke="currentColor"
        strokeWidth="1.55"
        strokeLinecap="round"
      />
    </Svg>
  );
}

export function WindIcon(props) {
  return (
    <Svg {...props}>
      <path
        d="M3.5 8.5h9.2a2.3 2.3 0 1 0-2.3-2.3M3.5 12h14.1a2.2 2.2 0 1 1-2.2 2.2M3.5 15.5h6.2a2 2 0 1 1-2 2"
        stroke="currentColor"
        strokeWidth="1.55"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export function CloudsIcon(props) {
  return (
    <Svg {...props}>
      <path
        d="M6.8 18.4h10.4a3.5 3.5 0 0 0 .7-6.9 5.6 5.6 0 0 0-10.7-1.4A4.2 4.2 0 0 0 6.8 18.4Z"
        stroke="currentColor"
        strokeWidth="1.55"
        strokeLinejoin="round"
      />
      <path
        d="M14.8 18.4h3.1M9 21.2h7.2"
        stroke="currentColor"
        strokeWidth="1.55"
        strokeLinecap="round"
        opacity=".55"
      />
    </Svg>
  );
}

export function VisibilityIcon(props) {
  return (
    <Svg {...props}>
      <path
        d="M2.8 12s3.3-5.4 9.2-5.4S21.2 12 21.2 12s-3.3 5.4-9.2 5.4S2.8 12 2.8 12Z"
        stroke="currentColor"
        strokeWidth="1.55"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="12" r="2.55" stroke="currentColor" strokeWidth="1.55" />
    </Svg>
  );
}

export function PressureIcon(props) {
  return (
    <Svg {...props}>
      <path
        d="M4.4 16.9a8.4 8.4 0 1 1 15.2 0"
        stroke="currentColor"
        strokeWidth="1.55"
        strokeLinecap="round"
      />
      <path
        d="m12 13.2 3.1-3.4"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
      <circle cx="12" cy="13.6" r="1.4" fill="currentColor" />
      <path d="M4.4 17h15.2" stroke="currentColor" strokeWidth="1.55" strokeLinecap="round" />
    </Svg>
  );
}

export function SunriseIcon(props) {
  return (
    <Svg {...props}>
      <path
        d="M3 18.5h18M6.3 15.3a5.7 5.7 0 0 1 11.4 0"
        stroke="currentColor"
        strokeWidth="1.55"
        strokeLinecap="round"
      />
      <path
        d="M12 4.2v3M5.4 7.2l2 2M18.6 7.2l-2 2M2.6 12.2h2M19.4 12.2h2"
        stroke="currentColor"
        strokeWidth="1.55"
        strokeLinecap="round"
      />
    </Svg>
  );
}

export function SunsetIcon(props) {
  return (
    <Svg {...props}>
      <path
        d="M3 18.5h18M6.3 15.3a5.7 5.7 0 0 1 11.4 0"
        stroke="currentColor"
        strokeWidth="1.55"
        strokeLinecap="round"
      />
      <path
        d="M12 3.5v4M5.4 7.2l2 2M18.6 7.2l-2 2M2.6 12.2h2M19.4 12.2h2"
        stroke="currentColor"
        strokeWidth="1.55"
        strokeLinecap="round"
      />
      <path d="m9.7 10.2 2.3 2.4 2.3-2.4" stroke="currentColor" strokeWidth="1.55" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

export function RefreshIcon(props) {
  return (
    <Svg {...props}>
      <path
        d="M19.2 12a7.2 7.2 0 1 1-2.2-5.2"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
      <path
        d="M19.4 4.2v4.2h-4.2"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export function AlertIcon(props) {
  return (
    <Svg {...props}>
      <path
        d="M12 4.2 21 19.5H3L12 4.2Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path d="M12 9.2v4.7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <circle cx="12" cy="16.8" r="1" fill="currentColor" />
    </Svg>
  );
}

export function GaugeIcon(props) {
  return <PressureIcon {...props} />;
}

export function CloudOffIcon(props) {
  return (
    <Svg {...props}>
      <path
        d="M6.6 18.4h10.2a3.4 3.4 0 0 0 .9-6.7 5.4 5.4 0 0 0-1.9-3.2M8.9 8.3a5.4 5.4 0 0 0-2.3 8.1"
        stroke="currentColor"
        strokeWidth="1.55"
        strokeLinecap="round"
      />
      <path d="m3.5 3.5 17 17" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </Svg>
  );
}

export function ArrowUpRightIcon(props) {
  return (
    <Svg {...props}>
      <path
        d="M7 17 17 7M8.5 7H17v8.5"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export function CompassArrow({ rotation = 0, size = 20, className = "" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      className={className}
      style={{ transform: `rotate(${rotation}deg)` }}
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M12 3.5 16 15l-4-2-4 2 4-11.5Z"
        fill="currentColor"
        fillOpacity=".92"
      />
    </svg>
  );
}

function glyphType(code = "") {
  const prefix = String(code).slice(0, 2);
  const night = String(code).endsWith("n");
  switch (prefix) {
    case "01":
      return night ? "clear-night" : "clear-day";
    case "02":
      return night ? "partly-night" : "partly";
    case "03":
    case "04":
      return "clouds";
    case "09":
      return "drizzle";
    case "10":
      return "rain";
    case "11":
      return "thunder";
    case "13":
      return "snow";
    case "50":
      return "mist";
    default:
      return "clouds";
  }
}

function Cloud({ uid, x = 0, y = 0, scale = 1, tone = "light" }) {
  const fill = tone === "dark" ? `url(#cloudDark-${uid})` : `url(#cloudLight-${uid})`;
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      <path
        className="wx-cloud"
        d="M23 77.5C14 77.5 7.5 71.2 7.5 63.2C7.5 55.4 13.5 49 22 48.1C24.4 32.4 36.8 21 51.2 21C65.6 21 77.5 31.5 80.1 45.4C90 46.7 100 52.9 100 62.2C100 70.8 93.2 77.5 84.5 77.5C77 77.5 70.5 76.2 62 77.1C54 78 47.5 79.2 39 78.4C33.4 77.9 28.1 77.5 23 77.5Z"
        fill={fill}
      />
      <path
        d="M22 72.4c16.5 3.1 43.2 2.1 64.4-2.2"
        stroke="#5f7da4"
        strokeOpacity=".3"
        strokeWidth="2.2"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M33 62.8a11 11 0 0 1 2-20.2 17.5 17.5 0 0 1 32.3-2.9"
        stroke="white"
        strokeOpacity=".34"
        strokeWidth="2.4"
        strokeLinecap="round"
        fill="none"
      />
    </g>
  );
}

export function WeatherGlyph({
  code = "01d",
  size = 48,
  className = "",
  animated = false,
  title,
}) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, "");
  const type = glyphType(code);
  const detailed = size >= 120;
  const classes = ["weather-glyph", animated ? "is-animated" : "", className]
    .filter(Boolean)
    .join(" ");

  const celestial =
    type === "clear-night" || type === "partly-night" ? (
      <g className="wx-moon">
        <path
          d="M73 20a25 25 0 1 0 26 34.5A28.5 28.5 0 0 1 73 20Z"
          fill={`url(#moon-${uid})`}
        />
        <circle cx="84" cy="29" r="1.7" fill="#f5f9ff" opacity=".9" />
        <circle cx="93" cy="40" r="1.15" fill="#f5f9ff" opacity=".7" />
        <circle cx="72" cy="34" r="1" fill="#f5f9ff" opacity=".6" />
      </g>
    ) : (
      <g className="wx-sun">
        <circle cx="57" cy="42" r="23" fill={`url(#sunHalo-${uid})`} opacity=".55" />
        <g
          className="wx-ray"
          stroke="#ffd37a"
          strokeWidth={detailed ? 2.6 : 3.4}
          strokeLinecap="round"
        >
          <path d="M57 6v8" />
          <path d="M57 70v8" />
          <path d="M21 42h8" />
          <path d="M85 42h8" />
          <path d="m31.6 16.6 5.7 5.7" />
          <path d="m76.7 61.7 5.7 5.7" />
          <path d="m82.4 16.6-5.7 5.7" />
          <path d="m37.3 61.7-5.7 5.7" />
        </g>
        <circle cx="57" cy="42" r="16.5" fill={`url(#sunCore-${uid})`} />
      </g>
    );

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      className={classes}
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : "true"}
      focusable="false"
    >
      {title ? <title>{title}</title> : null}
      <defs>
        <linearGradient id={`sunCore-${uid}`} x1="45" y1="29" x2="66" y2="56">
          <stop stopColor="#ffe9a8" />
          <stop offset="1" stopColor="#ffb84d" />
        </linearGradient>
        <radialGradient id={`sunHalo-${uid}`}>
          <stop stopColor="#ffd37a" stopOpacity=".8" />
          <stop offset="1" stopColor="#ffd37a" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`moon-${uid}`} x1="70" y1="18" x2="96" y2="56">
          <stop stopColor="#eef3ff" />
          <stop offset="1" stopColor="#aebcf4" />
        </linearGradient>
        <linearGradient id={`cloudLight-${uid}`} x1="30" y1="40" x2="78" y2="84">
          <stop stopColor="#eaf3ff" />
          <stop offset="1" stopColor="#a9c0de" />
        </linearGradient>
        <linearGradient id={`cloudDark-${uid}`} x1="36" y1="46" x2="82" y2="88">
          <stop stopColor="#c3d4ea" />
          <stop offset="1" stopColor="#8199bb" />
        </linearGradient>
      </defs>

      {type === "clear-day" && celestial}
      {type === "clear-night" && (
        <>
          <g opacity=".9">
            <circle cx="24" cy="26" r="1.7" fill="#dbe6ff" />
            <circle cx="94" cy="22" r="1.2" fill="#dbe6ff" />
            <circle cx="101" cy="72" r="1.6" fill="#dbe6ff" />
            <circle cx="18" cy="82" r="1.2" fill="#dbe6ff" />
          </g>
          {celestial}
        </>
      )}
      {type === "partly" && (
        <>
          {celestial}
          <Cloud uid={uid} x={-2} y={18} scale={0.94} />
        </>
      )}
      {type === "partly-night" && (
        <>
          {celestial}
          <Cloud uid={uid} x={-2} y={18} scale={0.94} tone="dark" />
        </>
      )}
      {type === "clouds" && (
        <>
          <Cloud uid={uid} x={-14} y={-4} scale={0.62} tone="dark" />
          <Cloud uid={uid} x={-2} y={20} scale={0.98} />
        </>
      )}
      {type === "rain" && (
        <>
          <Cloud uid={uid} x={-2} y={2} scale={0.98} tone="dark" />
          <g
            className="wx-rain"
            stroke="#7fc8ff"
            strokeWidth={detailed ? 2.3 : 4}
            strokeLinecap="round"
          >
            {detailed ? (
              <>
                <path className="wx-drop wx-drop-1" d="M30 87v10" />
                <path className="wx-drop wx-drop-2" d="M46 92v8" />
                <path className="wx-drop wx-drop-3" d="M62 88v9" />
                <path className="wx-drop wx-drop-4" d="M78 92v8" />
                <path className="wx-drop wx-drop-5" d="M94 87v10" />
              </>
            ) : (
              <>
                <path className="wx-drop wx-drop-1" d="M39 88v9" />
                <path className="wx-drop wx-drop-2" d="M58 91v9" />
                <path className="wx-drop wx-drop-3" d="M77 88v9" />
              </>
            )}
          </g>
        </>
      )}
      {type === "drizzle" && (
        <>
          <Cloud uid={uid} x={-2} y={4} scale={0.94} tone="dark" />
          <g className="wx-rain" stroke="#9bd7ff" strokeWidth="3.2" strokeLinecap="round">
            <path className="wx-drop wx-drop-1" d="M44 87v5" />
            <path className="wx-drop wx-drop-2" d="M60 91v5" />
            <path className="wx-drop wx-drop-3" d="M76 87v5" />
          </g>
        </>
      )}
      {type === "thunder" && (
        <>
          <Cloud uid={uid} x={-2} y={2} scale={0.98} tone="dark" />
          <path
            className="wx-bolt"
            d="M63 74 49 94h10l-4 13 17-20H61l6-13h-4Z"
            fill={`url(#bolt-${uid})`}
            stroke="#ffd37a"
            strokeWidth="1"
            strokeLinejoin="round"
          />
          <g stroke="#7fc8ff" strokeWidth="3.4" strokeLinecap="round">
            <path d="M39 87v6" opacity=".8" />
            <path d="M84 87v6" opacity=".8" />
          </g>
          <defs>
            <linearGradient id={`bolt-${uid}`} x1="54" y1="74" x2="66" y2="104">
              <stop stopColor="#ffe9a8" />
              <stop offset="1" stopColor="#ffb84d" />
            </linearGradient>
          </defs>
        </>
      )}
      {type === "snow" && (
        <>
          <Cloud uid={uid} x={-2} y={2} scale={0.98} tone="dark" />
          <g className="wx-snow" fill="#e4f6ff">
            <circle className="wx-flake wx-flake-1" cx="42" cy="90" r="3" />
            <circle className="wx-flake wx-flake-2" cx="61" cy="94" r="2.4" />
            <circle className="wx-flake wx-flake-3" cx="80" cy="89" r="3.1" />
          </g>
        </>
      )}
      {type === "mist" && (
        <>
          <Cloud uid={uid} x={-2} y={-2} scale={0.94} tone="dark" />
          <g stroke="#c4d4ea" strokeWidth="4" strokeLinecap="round" opacity=".75">
            <path d="M28 86h44" />
            <path d="M42 97h50" />
            <path d="M30 108h38" />
          </g>
        </>
      )}
    </svg>
  );
}
