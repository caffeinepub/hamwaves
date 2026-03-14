interface BeforeInstallPromptEvent extends Event {
  prompt(): void;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

declare global {
  interface Navigator {
    serial: {
      requestPort(options?: object): Promise<SerialPort>;
    };
  }
  interface SerialPort {
    open(options: { baudRate: number }): Promise<void>;
    close(): Promise<void>;
    readable: ReadableStream<Uint8Array>;
    writable: WritableStream<Uint8Array>;
  }
}

import {
  AlertTriangle,
  Camera,
  Download,
  Keyboard,
  Minus,
  Plus,
  Radio,
  Wifi,
  WifiOff,
} from "lucide-react";
import { motion } from "motion/react";
import type React from "react";
import { useCallback, useEffect, useRef, useState } from "react";

// ── Types ─────────────────────────────────────────────────────────────────────
type Status =
  | "ready"
  | "connecting"
  | "connected"
  | "sending"
  | "connection_lost"
  | "reconnecting"
  | "error";
type ThemeName =
  | "Grey"
  | "Orange"
  | "Blue"
  | "White"
  | "Invert"
  | "Green Phosphor"
  | "Purple Neon"
  | "Red Alert"
  | "Deep Blue"
  | "White Crisp";
type CyberThemeName =
  | "Cyber Neon"
  | "Bunker Dark"
  | "Classic Blue"
  | "Purple Plasma"
  | "Green Matrix"
  | "Amber Terminal";
type ModelName = "UV-K5" | "UV-K1 V3";
type Lang = "en" | "fr";

interface ThemeColors {
  fg: string;
  bg: string;
  glow: boolean;
  gradient?: [string, string];
}

const THEMES: Record<ThemeName, ThemeColors> = {
  Grey: { fg: "#000000", bg: "#9aabb8", glow: false },
  Orange: { fg: "#000000", bg: "#ff8800", glow: false },
  Blue: {
    fg: "#000000",
    bg: "#001a3d",
    glow: true,
    gradient: ["#001133", "#003366"],
  },
  White: { fg: "#000000", bg: "#ffffff", glow: false },
  Invert: { fg: "#00f0ff", bg: "#000000", glow: false },
  "Green Phosphor": {
    fg: "#00ff41",
    bg: "#001a00",
    glow: true,
    gradient: ["#001a00", "#003300"],
  },
  "Purple Neon": {
    fg: "#df00ff",
    bg: "#0d0013",
    glow: true,
    gradient: ["#0d0013", "#1a0026"],
  },
  "Red Alert": {
    fg: "#ff3333",
    bg: "#1a0000",
    glow: true,
    gradient: ["#1a0000", "#2d0000"],
  },
  "Deep Blue": {
    fg: "#1c86e4",
    bg: "#00002a",
    glow: true,
    gradient: ["#00002a", "#00004d"],
  },
  "White Crisp": { fg: "#000000", bg: "#f5f5f5", glow: false },
};

interface CyberThemeConfig {
  accent: string;
  accentGlow: string;
  accentDim: string;
  secondary: string;
  secondaryGlow: string;
  secondaryDim: string;
}
const CYBER_THEMES: Record<CyberThemeName, CyberThemeConfig> = {
  "Cyber Neon": {
    accent: "#00f0ff",
    accentGlow: "rgba(0,240,255,0.5)",
    accentDim: "rgba(0,240,255,0.15)",
    secondary: "#a855f7",
    secondaryGlow: "rgba(168,85,247,0.5)",
    secondaryDim: "rgba(168,85,247,0.15)",
  },
  "Bunker Dark": {
    accent: "#64748b",
    accentGlow: "rgba(100,116,139,0.5)",
    accentDim: "rgba(100,116,139,0.15)",
    secondary: "#94a3b8",
    secondaryGlow: "rgba(148,163,184,0.4)",
    secondaryDim: "rgba(148,163,184,0.12)",
  },
  "Classic Blue": {
    accent: "#3b82f6",
    accentGlow: "rgba(59,130,246,0.5)",
    accentDim: "rgba(59,130,246,0.15)",
    secondary: "#06b6d4",
    secondaryGlow: "rgba(6,182,212,0.5)",
    secondaryDim: "rgba(6,182,212,0.15)",
  },
  "Purple Plasma": {
    accent: "#a855f7",
    accentGlow: "rgba(168,85,247,0.5)",
    accentDim: "rgba(168,85,247,0.15)",
    secondary: "#ec4899",
    secondaryGlow: "rgba(236,72,153,0.5)",
    secondaryDim: "rgba(236,72,153,0.15)",
  },
  "Green Matrix": {
    accent: "#22c55e",
    accentGlow: "rgba(34,197,94,0.5)",
    accentDim: "rgba(34,197,94,0.15)",
    secondary: "#39ff14",
    secondaryGlow: "rgba(57,255,20,0.5)",
    secondaryDim: "rgba(57,255,20,0.15)",
  },
  "Amber Terminal": {
    accent: "#f59e0b",
    accentGlow: "rgba(245,158,11,0.5)",
    accentDim: "rgba(245,158,11,0.15)",
    secondary: "#ff6b35",
    secondaryGlow: "rgba(255,107,53,0.5)",
    secondaryDim: "rgba(255,107,53,0.15)",
  },
};

// Key codes for UV-K5 (F4HWN Fusion v5.2.0)
const KEY_CODES_UVK5: Record<string, number> = {
  PTT: 0x01,
  MENU: 0x02,
  "A/B": 0x03,
  UP: 0x04,
  DOWN: 0x05,
  EXIT: 0x06,
  BAND: 0x07,
  LEFT: 0x08,
  RIGHT: 0x09,
  "V/M": 0x0a,
  "0": 0x10,
  "1": 0x11,
  "2": 0x12,
  "3": 0x13,
  "4": 0x14,
  "5": 0x15,
  "6": 0x16,
  "7": 0x17,
  "8": 0x18,
  "9": 0x19,
  "*": 0x1a,
  "#": 0x1b,
  F1: 0x1c,
  F2: 0x1d,
  CALL: 0x07,
};

// Key codes for UV-K1 (F4HWN Fusion v5.2.0)
const KEY_CODES_UVK1: Record<string, number> = {
  MENU: 0x0a,
  LEFT: 0x0b,
  RIGHT: 0x0c,
  EXIT: 0x0d,
  "1 Band": 0x01,
  "2 A/B abc": 0x02,
  "3 V/M def": 0x03,
  "* Scan": 0x0e,
  "4 FC ghi": 0x04,
  "5 WX jkl": 0x05,
  "6 H/L mno": 0x06,
  "0 FM": 0x00,
  "7 VOX pqrs": 0x07,
  "8 R tuv": 0x08,
  "9 Call wxyz": 0x09,
  "# Lock / Function": 0x0f,
};

const KEY_LABELS_EN: Record<string, string> = {
  PTT: "PTT",
  MENU: "MENU",
  EXIT: "EXIT",
  UP: "▲",
  DOWN: "▼",
  LEFT: "←",
  RIGHT: "→",
  F1: "F1",
  F2: "F2",
  "A/B": "A/B",
  CALL: "CALL",
  BAND: "BAND",
  "V/M": "V/M",
  "1 Band": "1 Band",
  "2 A/B abc": "2 A/B abc",
  "3 V/M def": "3 V/M def",
  "* Scan": "* Scan",
  "4 FC ghi": "4 FC ghi",
  "5 WX jkl": "5 WX jkl",
  "6 H/L mno": "6 H/L mno",
  "7 VOX pqrs": "7 VOX pqrs",
  "8 R tuv": "8 R tuv",
  "9 Call wxyz": "9 Call wxyz",
  "0 FM": "0 FM",
  "# Lock": "# Lock",
  "# Lock / Function": "# Lock / Fn",
};

const KEY_LABELS_FR: Record<string, string> = {
  PTT: "PTT",
  MENU: "MENU",
  EXIT: "RET",
  UP: "▲",
  DOWN: "▼",
  LEFT: "←",
  RIGHT: "→",
  F1: "F1",
  F2: "F2",
  "A/B": "A/B",
  CALL: "APPEL",
  BAND: "BANDE",
  "V/M": "V/M",
  "1 Band": "1 Band",
  "2 A/B abc": "2 A/B abc",
  "3 V/M def": "3 V/M def",
  "* Scan": "* Scan",
  "4 FC ghi": "4 FC ghi",
  "5 WX jkl": "5 WX jkl",
  "6 H/L mno": "6 H/L mno",
  "7 VOX pqrs": "7 VOX pqrs",
  "8 R tuv": "8 R tuv",
  "9 Call wxyz": "9 Call wxyz",
  "0 FM": "0 FM",
  "# Lock": "# Verr",
};

// ── Keypad row types ──────────────────────────────────────────────────────────
type KeypadRowButtons = { id: string; span?: number }[];
interface KeypadRowGroup {
  cols: number;
  buttons: KeypadRowButtons;
}

// ── UV-K5 keypad layout (3 columns) ──────────────────────────────────────────
const KEYPAD_ROWS_UVK5: KeypadRowGroup[] = [
  { cols: 1, buttons: [{ id: "PTT" }] },
  { cols: 3, buttons: [{ id: "F1" }, { id: "UP" }, { id: "F2" }] },
  { cols: 3, buttons: [{ id: "LEFT" }, { id: "MENU" }, { id: "RIGHT" }] },
  { cols: 3, buttons: [{ id: "A/B" }, { id: "DOWN" }, { id: "EXIT" }] },
  { cols: 3, buttons: [{ id: "1" }, { id: "2" }, { id: "3" }] },
  { cols: 3, buttons: [{ id: "4" }, { id: "5" }, { id: "6" }] },
  { cols: 3, buttons: [{ id: "7" }, { id: "8" }, { id: "9" }] },
  { cols: 3, buttons: [{ id: "*" }, { id: "0" }, { id: "#" }] },
];

// ── UV-K1 V3 keypad layout – 4 rows × 4 columns ──────────────────────────────
const KEYPAD_ROWS_UVK1: KeypadRowGroup[] = [
  {
    cols: 4,
    buttons: [{ id: "MENU" }, { id: "LEFT" }, { id: "RIGHT" }, { id: "EXIT" }],
  },
  {
    cols: 4,
    buttons: [
      { id: "1 Band" },
      { id: "2 A/B abc" },
      { id: "3 V/M def" },
      { id: "* Scan" },
    ],
  },
  {
    cols: 4,
    buttons: [
      { id: "4 FC ghi" },
      { id: "5 WX jkl" },
      { id: "6 H/L mno" },
      { id: "0 FM" },
    ],
  },
  {
    cols: 4,
    buttons: [
      { id: "7 VOX pqrs" },
      { id: "8 R tuv" },
      { id: "9 Call wxyz" },
      { id: "# Lock / Function" },
    ],
  },
];

const STATUS_CONFIG: Record<
  Status,
  { label: string; color: string; frLabel: string }
> = {
  ready: { label: "F4HWN READY", color: "#888", frLabel: "F4HWN PRÊT" },
  connecting: {
    label: "Connecting...",
    color: "#f0c040",
    frLabel: "Connexion...",
  },
  connected: {
    label: "Connected – v5.2.0",
    color: "#00ff88",
    frLabel: "Connecté – v5.2.0",
  },
  sending: {
    label: "Sent – radio should respond",
    color: "#00ff88",
    frLabel: "Envoyé – radio devrait répondre",
  },
  connection_lost: {
    label: "Connection lost",
    color: "#ff4444",
    frLabel: "Connexion perdue",
  },
  reconnecting: {
    label: "Reconnecting...",
    color: "#f0c040",
    frLabel: "Reconnexion...",
  },
  error: { label: "Send failed", color: "#ff4444", frLabel: "Échec envoi" },
};

// ── Liquid Glass helper ───────────────────────────────────────────────────────
const liquidGlass = (
  borderColor = "rgba(0,240,255,0.4)",
  glowColor = "rgba(0,240,255,0.5)",
) =>
  ({
    backdropFilter: "blur(12px) saturate(180%) brightness(110%)",
    WebkitBackdropFilter: "blur(12px) saturate(180%) brightness(110%)",
    background:
      "linear-gradient(to bottom right, rgba(255,255,255,0.06), rgba(20,20,40,0.35))",
    border: `1px solid ${borderColor}`,
    boxShadow: `0 0 15px ${glowColor}, inset 0 1px 0 rgba(255,255,255,0.07)`,
  }) as React.CSSProperties;

// ── KeypadBtn ─────────────────────────────────────────────────────────────────
interface KeypadBtnProps {
  keyId: string;
  lang: Lang;
  disabled: boolean;
  onSendKey: (keyId: string, isLong: boolean) => void;
  codeMap: Record<string, number>;
  accent: string;
  secondary: string;
  secondaryGlow: string;
}

function KeypadBtn({
  keyId,
  lang,
  disabled,
  onSendKey,
  codeMap,
  accent,
  secondary,
  secondaryGlow,
}: KeypadBtnProps) {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const repeatRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const longFiredRef = useRef(false);
  const [pressed, setPressed] = useState(false);
  const [hovered, setHovered] = useState(false);
  const labels = lang === "fr" ? KEY_LABELS_FR : KEY_LABELS_EN;
  const displayLabel = labels[keyId] ?? keyId;
  const isPTT = keyId === "PTT";
  const isNav = ["UP", "DOWN", "LEFT", "RIGHT"].includes(keyId);
  const isAccent = [
    "MENU",
    "EXIT",
    "F1",
    "F2",
    "BAND",
    "V/M",
    "FC",
    "FUNCTION",
  ].includes(keyId);

  const spaceIdx = displayLabel.indexOf(" ");
  const isSplitLabel = spaceIdx !== -1 && !isPTT && !isNav && !isAccent;
  const splitPrimary = isSplitLabel ? displayLabel.slice(0, spaceIdx) : null;
  const splitSecondary = isSplitLabel ? displayLabel.slice(spaceIdx + 1) : null;

  const _isDigit =
    /^[0-9]$/.test(keyId) || ["*", "#"].includes(keyId) || isSplitLabel;

  const stopRepeat = () => {
    if (repeatRef.current) {
      clearInterval(repeatRef.current);
      repeatRef.current = null;
    }
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    if (disabled) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    setPressed(true);
    longFiredRef.current = false;
    timerRef.current = setTimeout(() => {
      longFiredRef.current = true;
      onSendKey(keyId, true);
      repeatRef.current = setInterval(() => {
        onSendKey(keyId, true);
      }, 100);
    }, 450);
  };
  const handlePointerUp = () => {
    setPressed(false);
    stopRepeat();
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
      if (!longFiredRef.current) {
        onSendKey(keyId, false);
      }
    }
  };
  const handlePointerLeave = () => {
    setPressed(false);
    setHovered(false);
    stopRepeat();
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  const shortCode = codeMap[keyId] ?? 0;

  // Per-type liquid glass base styles
  let borderColor: string;
  let glowColor: string;
  let textColor: string;
  let bgBase: string;

  if (isPTT) {
    borderColor = "rgba(249,115,22,0.5)";
    glowColor = "rgba(249,115,22,0.4)";
    textColor = "#fb923c";
    bgBase = "rgba(249,115,22,0.08)";
  } else if (isNav) {
    borderColor = `${secondary}66`;
    glowColor = secondaryGlow;
    textColor = secondary;
    bgBase = "rgba(20,20,40,0.3)";
  } else if (isAccent) {
    borderColor = `${accent}66`;
    glowColor = `${accent}80`;
    textColor = accent;
    bgBase = "rgba(20,20,40,0.3)";
  } else {
    // digit / split
    borderColor = `${secondary}44`;
    glowColor = `${secondary}66`;
    textColor = "#e0e0e0";
    bgBase = "rgba(20,20,40,0.25)";
  }

  const hoverBorderColor = isPTT
    ? "rgba(249,115,22,0.9)"
    : isNav
      ? secondary
      : accent;
  const hoverGlow = isPTT
    ? "rgba(249,115,22,0.6)"
    : isNav
      ? secondaryGlow
      : glowColor;

  const buttonStyle: React.CSSProperties = {
    position: "relative",
    overflow: "hidden",
    borderRadius: 8,
    border: `1px solid ${pressed ? hoverBorderColor : hovered ? hoverBorderColor : borderColor}`,
    color: textColor,
    background: pressed
      ? `linear-gradient(to bottom right, rgba(255,255,255,0.12), ${bgBase})`
      : hovered
        ? `linear-gradient(to bottom right, rgba(255,255,255,0.09), ${bgBase})`
        : `linear-gradient(to bottom right, rgba(255,255,255,0.05), ${bgBase})`,
    backdropFilter: "blur(12px) saturate(180%) brightness(110%)",
    WebkitBackdropFilter: "blur(12px) saturate(180%) brightness(110%)",
    boxShadow: pressed
      ? `0 0 20px ${hoverGlow}, inset 0 1px 0 rgba(255,255,255,0.15)`
      : hovered
        ? `0 0 15px ${hoverGlow}, inset 0 1px 0 rgba(255,255,255,0.1)`
        : `0 0 6px ${glowColor}55, inset 0 1px 0 rgba(255,255,255,0.05)`,
    transform: pressed
      ? "scale(0.95)"
      : hovered
        ? "scale(1.03) brightness(1.2)"
        : "scale(1)",
    transition: "all 0.12s ease",
    cursor: disabled ? "not-allowed" : "pointer",
    opacity: disabled ? 0.4 : 1,
    padding: isPTT ? "8px 0" : "6px 0",
    fontSize: "0.72rem",
    fontWeight: 700,
    letterSpacing: "0.04em",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    userSelect: "none",
    WebkitUserSelect: "none",
    filter: hovered && !pressed ? "brightness(1.2)" : "none",
  };

  return (
    <button
      type="button"
      style={buttonStyle}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerLeave}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      disabled={disabled}
      aria-label={`Key ${keyId}`}
      title={`${keyId} · short: AA 55 03 ${shortCode.toString(16).padStart(2, "0")} · long: AA 55 04 ${shortCode.toString(16).padStart(2, "0")}`}
      data-ocid={"viewer.keypad.button"}
    >
      {/* Inner highlight shimmer */}
      <span
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(to bottom right, rgba(255,255,255,0.08), transparent)",
          borderRadius: 7,
          pointerEvents: "none",
        }}
      />
      {isSplitLabel ? (
        <span
          style={{
            position: "relative",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            lineHeight: 1,
            gap: 2,
          }}
        >
          <span
            style={{
              fontSize: "0.95rem",
              fontWeight: 800,
              color: accent,
              lineHeight: 1,
              textShadow: `0 0 6px ${accent}88`,
            }}
          >
            {splitPrimary}
          </span>
          <span
            style={{
              fontSize: "0.5rem",
              color: secondary,
              fontWeight: 600,
              lineHeight: 1,
              textAlign: "center",
              textShadow: `0 0 5px ${secondaryGlow}`,
            }}
          >
            {splitSecondary}
          </span>
        </span>
      ) : (
        <span style={{ position: "relative" }}>{displayLabel}</span>
      )}
    </button>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function UVK5ViewerPage() {
  const [status, setStatus] = useState<Status>("ready");
  const [theme, setTheme] = useState<ThemeName>("Blue");
  const [model, setModel] = useState<ModelName>("UV-K5");
  const [lang, setLang] = useState<Lang>("en");
  const [scale, setScale] = useState(9);
  const [showKeypad, setShowKeypad] = useState(true);
  const [fps, setFps] = useState(0);
  const [reconnectCountdown, setReconnectCountdown] = useState(0);
  const [errorMsg, setErrorMsg] = useState("");
  const [installPrompt, setInstallPrompt] = useState<Event | null>(null);
  const [isPWA, setIsPWA] = useState(false);
  const [showInstalledToast, setShowInstalledToast] = useState(false);
  const [statusMsg, setStatusMsg] = useState("");
  const [cyberTheme, setCyberThemeState] =
    useState<CyberThemeName>("Cyber Neon");
  const [showHelp, setShowHelp] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const scanlineCanvasRef = useRef<HTMLCanvasElement>(null);
  const portRef = useRef<SerialPort | null>(null);
  const readerRef = useRef<ReadableStreamDefaultReader<Uint8Array> | null>(
    null,
  );
  const writerRef = useRef<WritableStreamDefaultWriter<Uint8Array> | null>(
    null,
  );
  const framebufferRef = useRef<Uint8Array>(new Uint8Array(1024));
  const reconnectTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const keepaliveTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const reconnectAttemptsRef = useRef(0);
  const frameCountRef = useRef(0);
  const fpsTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const readingRef = useRef(false);
  const statusRef = useRef<Status>("ready");
  const modelRef = useRef<ModelName>("UV-K5");
  const freqDigitsRef = useRef<string>("");
  const freqTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    modelRef.current = model;
  }, [model]);

  const W = 128;
  const H = 64;
  const BAUD = 38400;

  const keypadRows: KeypadRowGroup[] =
    model === "UV-K1 V3" ? KEYPAD_ROWS_UVK1 : KEYPAD_ROWS_UVK5;
  const activeCodeMap: Record<string, number> =
    model === "UV-K1 V3" ? KEY_CODES_UVK1 : KEY_CODES_UVK5;

  const ct = CYBER_THEMES[cyberTheme];

  // ── Override manifest + register viewer SW ──────────────────────────────
  useEffect(() => {
    let manifestLink = document.querySelector(
      'link[rel="manifest"]',
    ) as HTMLLinkElement | null;
    const prevHref = manifestLink?.href ?? "";
    if (!manifestLink) {
      manifestLink = document.createElement("link");
      manifestLink.rel = "manifest";
      document.head.appendChild(manifestLink);
    }
    manifestLink.href = "/viewer-manifest.json";

    let themeMeta = document.querySelector(
      'meta[name="theme-color"]',
    ) as HTMLMetaElement | null;
    const prevTheme = themeMeta?.content ?? "";
    if (!themeMeta) {
      themeMeta = document.createElement("meta");
      themeMeta.name = "theme-color";
      document.head.appendChild(themeMeta);
    }
    themeMeta.content = "#00f0ff";

    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/viewer-sw.js").catch(() => {});
      navigator.serviceWorker.addEventListener("message", (e) => {
        if (e.data?.type === "VIEWER_PWA_INSTALLED") {
          setShowInstalledToast(true);
          setTimeout(() => setShowInstalledToast(false), 4000);
        }
      });
    }

    const handler = (e: Event) => {
      e.preventDefault();
      setInstallPrompt(e);
    };
    window.addEventListener("beforeinstallprompt", handler);

    const checkPWA = () => {
      const standalone =
        window.matchMedia("(display-mode: standalone)").matches ||
        (window.navigator as unknown as { standalone?: boolean }).standalone ===
          true;
      setIsPWA(standalone);
    };
    checkPWA();

    const installedHandler = () => {
      console.log("Viewer PWA installed");
      setIsPWA(true);
    };
    window.addEventListener("appinstalled", installedHandler);

    return () => {
      if (manifestLink && prevHref) manifestLink.href = prevHref;
      if (themeMeta && prevTheme) themeMeta.content = prevTheme;
      window.removeEventListener("beforeinstallprompt", handler);
      window.removeEventListener("appinstalled", installedHandler);
    };
  }, []);

  // ── Cyber Theme persistence ──────────────────────────────────────────────
  useEffect(() => {
    const saved = localStorage.getItem(
      "uvk5-cyber-theme",
    ) as CyberThemeName | null;
    if (saved && CYBER_THEMES[saved]) setCyberThemeState(saved);
  }, []);

  const setCyberTheme = (t: CyberThemeName) => {
    setCyberThemeState(t);
    localStorage.setItem("uvk5-cyber-theme", t);
  };

  const setStatusSafe = useCallback((s: Status, msg = "") => {
    statusRef.current = s;
    setStatus(s);
    if (s === "sending" || s === "error") {
      setStatusMsg(msg);
    } else {
      setStatusMsg("");
    }
  }, []);

  // ── Render Frame ─────────────────────────────────────────────────────────
  const renderFrame = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const t = THEMES[theme];
    const pw = scale;
    const cw = W * pw;
    const ch = H * pw;
    if (t.gradient) {
      const grad = ctx.createLinearGradient(0, 0, 0, ch);
      grad.addColorStop(0, t.gradient[0]);
      grad.addColorStop(1, t.gradient[1]);
      ctx.fillStyle = grad;
    } else {
      ctx.fillStyle = t.bg;
    }
    ctx.fillRect(0, 0, cw, ch);
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.fillStyle = t.fg;
    const fb = framebufferRef.current;
    for (let y = 0; y < 64; y++) {
      for (let x = 0; x < 128; x++) {
        const bitIndex = y * 128 + x;
        const byteIdx = Math.floor(bitIndex / 8);
        const bitPos = bitIndex % 8;
        if (fb[byteIdx] & (1 << bitPos)) {
          ctx.fillRect(x * pw, y * pw, pw - 1, pw - 1);
        }
      }
    }
    frameCountRef.current++;
  }, [theme, scale]);

  // ── Scanlines ────────────────────────────────────────────────────────────
  useEffect(() => {
    const canvas = scanlineCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, W * scale, H * scale);
    for (let row = 0; row < H; row++) {
      if (row % 2 === 1) {
        ctx.fillStyle = "rgba(0,0,0,0.08)";
        ctx.fillRect(0, row * scale, W * scale, scale);
      }
    }
  }, [scale]);

  // ── FPS Counter ──────────────────────────────────────────────────────────
  useEffect(() => {
    fpsTimerRef.current = setInterval(() => {
      setFps(frameCountRef.current);
      frameCountRef.current = 0;
    }, 1000);
    return () => {
      if (fpsTimerRef.current) clearInterval(fpsTimerRef.current);
    };
  }, []);

  useEffect(() => {
    renderFrame();
  }, [renderFrame]);

  // ── Keepalive ────────────────────────────────────────────────────────────
  const startKeepalive = useCallback(() => {
    if (keepaliveTimerRef.current) clearInterval(keepaliveTimerRef.current);
    keepaliveTimerRef.current = setInterval(async () => {
      if (writerRef.current && statusRef.current === "connected") {
        try {
          await writerRef.current.write(
            new Uint8Array([0x55, 0xaa, 0x00, 0x00]),
          );
        } catch {}
      }
    }, 1000);
  }, []);

  const stopKeepalive = useCallback(() => {
    if (keepaliveTimerRef.current) {
      clearInterval(keepaliveTimerRef.current);
      keepaliveTimerRef.current = null;
    }
  }, []);

  // ── Read Loop ────────────────────────────────────────────────────────────
  const readLoop = useCallback(async () => {
    const reader = readerRef.current;
    if (!reader) return;
    readingRef.current = true;
    const buffer: number[] = [];
    const readBytes = async (n: number): Promise<Uint8Array> => {
      const out = new Uint8Array(n);
      let filled = 0;
      while (filled < n) {
        while (buffer.length === 0) {
          const { value, done } = await reader.read();
          if (done) throw new Error("Stream closed");
          if (value) for (const b of value) buffer.push(b);
        }
        out[filled++] = buffer.shift()!;
      }
      return out;
    };
    try {
      while (readingRef.current) {
        let b0 = 0;
        while (true) {
          const [b] = await readBytes(1);
          if (b0 === 0xaa && b === 0x55) break;
          b0 = b;
        }
        const [type] = await readBytes(1);
        const sizeBytes = await readBytes(2);
        const size = (sizeBytes[0] << 8) | sizeBytes[1];
        if (type === 0x01) {
          const frameData = await readBytes(Math.min(size, 1024));
          framebufferRef.current.set(frameData);
          renderFrame();
        } else if (type === 0x02) {
          const blockCount = Math.floor(size / 9);
          for (let i = 0; i < blockCount; i++) {
            const [idx] = await readBytes(1);
            const data = await readBytes(8);
            framebufferRef.current.set(data, idx * 8);
          }
          renderFrame();
        }
      }
    } catch {
      if (readingRef.current) {
        readingRef.current = false;
        stopKeepalive();
        setStatusSafe("connection_lost");
        scheduleReconnect();
      }
    }
  }, [renderFrame, stopKeepalive, setStatusSafe]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Reconnect ────────────────────────────────────────────────────────────
  const scheduleReconnect = useCallback(() => {
    if (reconnectAttemptsRef.current >= 5) {
      setStatusSafe("error");
      setErrorMsg("Max reconnect attempts reached. Check cable & firmware.");
      return;
    }
    reconnectAttemptsRef.current++;
    setStatusSafe("reconnecting");
    let countdown = 3;
    setReconnectCountdown(countdown);
    const interval = setInterval(() => {
      countdown--;
      setReconnectCountdown(countdown);
      if (countdown <= 0) clearInterval(interval);
    }, 1000);
    reconnectTimerRef.current = setTimeout(async () => {
      try {
        if (portRef.current) {
          readerRef.current = portRef.current.readable.getReader();
          writerRef.current = portRef.current.writable.getWriter();
          setStatusSafe("connected");
          startKeepalive();
          readLoop();
        } else scheduleReconnect();
      } catch {
        scheduleReconnect();
      }
    }, 3000);
  }, [readLoop, startKeepalive, setStatusSafe]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Connect ───────────────────────────────────────────────────────────────
  const connect = useCallback(async () => {
    if (!("serial" in navigator)) {
      setStatusSafe("error");
      setErrorMsg("Web Serial not supported. Use Chrome or Edge over HTTPS.");
      return;
    }
    setErrorMsg("");
    try {
      setStatusSafe("connecting");
      const port = await navigator.serial.requestPort();
      await port.open({ baudRate: BAUD });
      portRef.current = port;
      writerRef.current = port.writable.getWriter();
      readerRef.current = port.readable.getReader();
      reconnectAttemptsRef.current = 0;
      setStatusSafe("connected");
      startKeepalive();
      readLoop();
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      if (msg.toLowerCase().includes("no port"))
        setErrorMsg("No port selected.");
      else if (msg.toLowerCase().includes("permission"))
        setErrorMsg("Permission denied. Allow serial port access.");
      else setErrorMsg(`Connection failed: ${msg}`);
      setStatusSafe("ready");
    }
  }, [readLoop, startKeepalive, setStatusSafe]);

  // ── Disconnect ────────────────────────────────────────────────────────────
  const disconnect = useCallback(async () => {
    readingRef.current = false;
    stopKeepalive();
    if (reconnectTimerRef.current) clearTimeout(reconnectTimerRef.current);
    try {
      readerRef.current?.cancel();
      readerRef.current?.releaseLock();
      readerRef.current = null;
    } catch {}
    try {
      await writerRef.current?.close();
      writerRef.current = null;
    } catch {}
    try {
      await portRef.current?.close();
      portRef.current = null;
    } catch {}
    setStatusSafe("ready");
  }, [stopKeepalive, setStatusSafe]);

  // ── Send Key ──────────────────────────────────────────────────────────────
  const sendKey = useCallback(
    async (keyId: string, isLong: boolean) => {
      if (!writerRef.current) return;
      const st = statusRef.current;
      if (st !== "connected" && st !== "sending") return;
      if (keyId === "PTT") return;
      const isUVK1 = modelRef.current === "UV-K1 V3";
      const displayLabel = KEY_LABELS_EN[keyId] ?? keyId;
      let baseCode: number;
      if (isUVK1) {
        const c = KEY_CODES_UVK1[keyId];
        if (c === undefined) return;
        baseCode = c;
      } else {
        const c = KEY_CODES_UVK5[keyId];
        if (c === undefined) return;
        baseCode = c;
      }
      const typebyte = isLong ? 0x04 : 0x03;
      console.log(
        `Sending key: ${displayLabel} (code: 0x${baseCode.toString(16)}, type: 0x0${typebyte}, ${isLong ? "long" : "short"})`,
      );

      const isDigitKey =
        /^[0-9]$/.test(keyId) || /^\d /.test(keyId) || keyId === "0 FM";
      let statusMsg: string;
      if (isDigitKey && !isLong) {
        const digit = keyId[0];
        freqDigitsRef.current += digit;
        if (freqTimerRef.current) {
          clearTimeout(freqTimerRef.current);
          freqTimerRef.current = null;
        }
        freqTimerRef.current = setTimeout(() => {
          freqDigitsRef.current = "";
          freqTimerRef.current = null;
          if (statusRef.current === "sending") setStatusSafe("connected");
        }, 3000);
        statusMsg = `Typing frequency: ${freqDigitsRef.current}`;
      } else if (keyId === "EXIT" || keyId === "MENU") {
        freqDigitsRef.current = "";
        if (freqTimerRef.current) {
          clearTimeout(freqTimerRef.current);
          freqTimerRef.current = null;
        }
        statusMsg = isLong
          ? `Long press active – holding ${displayLabel}`
          : `Short press – ${displayLabel}`;
      } else {
        statusMsg = isLong
          ? `Long press active – holding ${displayLabel}`
          : `Short press detected – ${displayLabel}`;
      }

      try {
        setStatusSafe("sending", statusMsg);
        await writerRef.current.write(
          new Uint8Array([0xaa, 0x55, typebyte, baseCode]),
        );
        if (!isDigitKey || isLong) {
          setTimeout(() => {
            if (statusRef.current === "sending") setStatusSafe("connected");
          }, 1500);
        }
      } catch {
        setStatusSafe("error", "Send failed");
        console.error("Key send failed");
        stopKeepalive();
        scheduleReconnect();
      }
    },
    [setStatusSafe, stopKeepalive, scheduleReconnect],
  ); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Screenshot ────────────────────────────────────────────────────────────
  const takeScreenshot = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement("a");
    link.download = `uvk5-${model.replace(" ", "-")}-${Date.now()}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  // ── Cleanup ───────────────────────────────────────────────────────────────
  useEffect(() => {
    return () => {
      void disconnect();
      if (fpsTimerRef.current) clearInterval(fpsTimerRef.current);
    };
  }, [disconnect]);

  const isConnected = status === "connected" || status === "sending";
  const canvasW = W * scale;
  const canvasH = H * scale;
  const sc = STATUS_CONFIG[status];
  const statusLabel =
    (status === "sending" || status === "error") && statusMsg
      ? statusMsg
      : lang === "fr"
        ? sc.frLabel
        : sc.label;

  // Liquid glass style for top bar
  const topBarGlass: React.CSSProperties = {
    ...liquidGlass(`${ct.accent}40`, `${ct.accent}30`),
    background:
      "linear-gradient(to bottom right, rgba(255,255,255,0.05), rgba(8,13,25,0.7))",
    borderTop: "none",
    borderLeft: "none",
    borderRight: "none",
    borderBottom: `1px solid ${ct.accent}30`,
    padding: "8px 16px",
    display: "flex",
    flexWrap: "wrap",
    alignItems: "center",
    gap: 8,
    flexShrink: 0,
  };

  // Liquid glass style for control buttons
  const ctrlBtn = (
    active = false,
    colorOverride?: string,
  ): React.CSSProperties => {
    const c = colorOverride ?? ct.accent;
    return {
      display: "flex",
      alignItems: "center",
      gap: 6,
      padding: "6px 12px",
      borderRadius: 8,
      border: `1px solid ${active ? c : `${c}44`}`,
      color: active ? c : `${c}99`,
      background:
        "linear-gradient(to bottom right, rgba(255,255,255,0.06), rgba(20,20,40,0.4))",
      backdropFilter: "blur(12px) saturate(180%) brightness(110%)",
      WebkitBackdropFilter: "blur(12px) saturate(180%) brightness(110%)",
      boxShadow: active
        ? `0 0 14px ${c}55, inset 0 1px 0 rgba(255,255,255,0.1)`
        : `0 0 6px ${c}22, inset 0 1px 0 rgba(255,255,255,0.04)`,
      fontSize: "0.75rem",
      fontWeight: 700,
      cursor: "pointer",
      transition: "all 0.15s ease",
    };
  };

  return (
    <div
      data-ocid="viewer.page"
      style={
        {
          background: "#060810",
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          fontFamily: "Inter, system-ui, sans-serif",
          color: "#e0e0e0",
          overflow: "hidden",
          "--accent": ct.accent,
          "--accent-glow": ct.accentGlow,
          "--accent-dim": ct.accentDim,
          "--secondary": ct.secondary,
          "--secondary-glow": ct.secondaryGlow,
          "--secondary-dim": ct.secondaryDim,
        } as React.CSSProperties
      }
    >
      <style>{`
        @keyframes blink { 0%,100% { opacity: 1; } 50% { opacity: 0.3; } }
        @keyframes neonPulse {
          0%,100% { box-shadow: 0 0 10px var(--accent-glow), inset 0 1px 0 rgba(255,255,255,0.06); }
          50% { box-shadow: 0 0 24px var(--accent-glow), 0 0 48px var(--accent-dim), inset 0 1px 0 rgba(255,255,255,0.1); }
        }
        @keyframes glassShimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        .glass-btn:hover {
          transform: scale(1.03) !important;
          filter: brightness(1.2) !important;
        }
        .glass-btn:active { transform: scale(0.97) !important; }
      `}</style>

      {/* ── Installed Toast ─────────────────────────────────────────────── */}
      {showInstalledToast && (
        <div
          style={{
            position: "fixed",
            bottom: 24,
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 9999,
            ...liquidGlass(`${ct.accent}80`, `${ct.accent}60`),
            background:
              "linear-gradient(to bottom right, rgba(255,255,255,0.08), rgba(0,20,20,0.85))",
            borderRadius: 14,
            padding: "14px 28px",
            color: ct.accent,
            fontWeight: 700,
            fontSize: "0.9rem",
            display: "flex",
            alignItems: "center",
            gap: 10,
          }}
          data-ocid="viewer.installed_toast.toast"
        >
          <Radio size={16} />
          {lang === "fr"
            ? "Merci d'avoir installé l'app UV-K5 Viewer !"
            : "Thanks for installing UV-K5 Viewer!"}
        </div>
      )}

      {/* ── Top Bar ─────────────────────────────────────────────────────── */}
      <div style={topBarGlass} data-ocid="viewer.top_bar">
        {/* Brand */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            marginRight: 8,
          }}
        >
          <img
            src="/assets/generated/viewer-pwa-icon-192-transparent.dim_192x192.png"
            alt="UV-K5 Viewer"
            style={{ width: 24, height: 24, objectFit: "contain" }}
          />
          <span
            style={{
              color: ct.accent,
              fontWeight: 800,
              fontSize: "0.8rem",
              letterSpacing: "0.1em",
              whiteSpace: "nowrap",
              textShadow: `0 0 10px ${ct.accentGlow}`,
            }}
          >
            UV-K5 MIRROR
          </span>
          <span
            style={{
              color: `${ct.secondary}66`,
              fontSize: "0.6rem",
              fontFamily: "monospace",
            }}
          >
            v5.2.0
          </span>
        </div>

        {/* Connect */}
        <button
          type="button"
          onClick={connect}
          disabled={
            isConnected || status === "connecting" || status === "reconnecting"
          }
          className="glass-btn"
          style={{
            ...ctrlBtn(!isConnected),
            opacity: isConnected ? 0.45 : 1,
            cursor: isConnected ? "not-allowed" : "pointer",
            animation: isConnected ? "none" : "neonPulse 2.5s infinite",
          }}
          data-ocid="viewer.connect_button"
        >
          <Wifi size={12} />
          {lang === "fr" ? "Connecter" : "Connect"}
        </button>

        {/* Disconnect */}
        <button
          type="button"
          onClick={disconnect}
          disabled={!isConnected && status !== "reconnecting"}
          className="glass-btn"
          style={{
            ...ctrlBtn(isConnected, "#ff6060"),
            opacity: isConnected ? 1 : 0.35,
            cursor: isConnected ? "pointer" : "not-allowed",
          }}
          data-ocid="viewer.disconnect_button"
        >
          <WifiOff size={12} />
          {lang === "fr" ? "Déconn." : "Disconnect"}
        </button>

        {/* Keypad Toggle */}
        <button
          type="button"
          onClick={() => setShowKeypad((p) => !p)}
          className="glass-btn"
          style={ctrlBtn(showKeypad, ct.secondary)}
          data-ocid="viewer.keypad_toggle"
        >
          <Keyboard size={12} />
          {lang === "fr" ? "Clavier" : "Keypad"}
        </button>

        {/* Language */}
        <div
          style={{
            display: "flex",
            borderRadius: 8,
            overflow: "hidden",
            border: `1px solid ${ct.accent}33`,
            backdropFilter: "blur(12px) saturate(180%)",
            WebkitBackdropFilter: "blur(12px) saturate(180%)",
          }}
        >
          {(["en", "fr"] as Lang[]).map((l) => (
            <button
              key={l}
              type="button"
              onClick={() => setLang(l)}
              style={{
                padding: "6px 10px",
                fontSize: "0.65rem",
                fontWeight: 700,
                cursor: "pointer",
                background:
                  lang === l
                    ? `linear-gradient(to bottom right, ${ct.accentDim}, rgba(20,20,40,0.4))`
                    : "transparent",
                color: lang === l ? ct.accent : "#444",
                border: "none",
                transition: "all 0.15s",
              }}
            >
              {l.toUpperCase()}
            </button>
          ))}
        </div>

        {/* Cyber Theme selector */}
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span
            style={{
              fontSize: "0.58rem",
              color: `${ct.secondary}88`,
              fontWeight: 700,
              letterSpacing: "0.1em",
              whiteSpace: "nowrap",
            }}
          >
            CYBER
          </span>
          <select
            value={cyberTheme}
            onChange={(e) => setCyberTheme(e.target.value as CyberThemeName)}
            style={{
              ...liquidGlass(`${ct.secondary}44`, `${ct.secondary}33`),
              background: "rgba(10,10,30,0.6)",
              borderRadius: 6,
              color: ct.secondary,
              fontSize: "0.65rem",
              fontWeight: 700,
              padding: "4px 8px",
              cursor: "pointer",
              outline: "none",
            }}
            data-ocid="viewer.cyber_theme.select"
          >
            {(Object.keys(CYBER_THEMES) as CyberThemeName[]).map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>

        {/* LCD Theme selector */}
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span
            style={{
              fontSize: "0.58rem",
              color: `${ct.accent}88`,
              fontWeight: 700,
              letterSpacing: "0.1em",
              whiteSpace: "nowrap",
            }}
          >
            LCD
          </span>
          <select
            value={theme}
            onChange={(e) => setTheme(e.target.value as ThemeName)}
            style={{
              ...liquidGlass(`${ct.accent}44`, `${ct.accent}33`),
              background: "rgba(10,10,30,0.6)",
              borderRadius: 6,
              color: ct.accent,
              fontSize: "0.65rem",
              fontWeight: 700,
              padding: "4px 8px",
              cursor: "pointer",
              outline: "none",
            }}
            data-ocid="viewer.lcd_theme.select"
          >
            {(Object.keys(THEMES) as ThemeName[]).map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>

        {/* Model selector */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "6px 10px",
            borderRadius: 8,
            ...liquidGlass(`${ct.accent}33`, `${ct.accent}22`),
            background:
              "linear-gradient(to bottom right, rgba(255,255,255,0.04), rgba(20,20,40,0.35))",
          }}
          data-ocid="viewer.model.radio"
        >
          <span
            style={{
              fontSize: "0.58rem",
              color: `${ct.accent}66`,
              fontWeight: 700,
              letterSpacing: "0.1em",
            }}
          >
            MODEL
          </span>
          {(["UV-K5", "UV-K1 V3"] as ModelName[]).map((m) => (
            <label
              key={m}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 5,
                cursor: "pointer",
              }}
            >
              <input
                type="radio"
                name="viewer-model"
                value={m}
                checked={model === m}
                onChange={() => setModel(m)}
                style={{ accentColor: ct.accent }}
              />
              <span
                style={{
                  fontSize: "0.72rem",
                  fontWeight: 700,
                  color: model === m ? ct.accent : "#444",
                  transition: "color 0.15s",
                  textShadow: model === m ? `0 0 8px ${ct.accentGlow}` : "none",
                }}
              >
                {m}
              </span>
            </label>
          ))}
        </div>

        {/* Zoom */}
        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
          <button
            type="button"
            onClick={() => setScale((s) => Math.max(5, s - 1))}
            className="glass-btn"
            style={{
              width: 28,
              height: 28,
              borderRadius: 7,
              ...liquidGlass(`${ct.accent}33`, `${ct.accent}22`),
              background:
                "linear-gradient(to bottom right, rgba(255,255,255,0.06), rgba(20,20,40,0.4))",
              color: ct.accent,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "all 0.15s",
            }}
            data-ocid="viewer.zoom_out_button"
          >
            <Minus size={11} />
          </button>
          <span
            style={{
              fontSize: "0.7rem",
              fontFamily: "monospace",
              color: `${ct.secondary}88`,
              minWidth: 28,
              textAlign: "center",
            }}
          >
            {scale}×
          </span>
          <button
            type="button"
            onClick={() => setScale((s) => Math.min(16, s + 1))}
            className="glass-btn"
            style={{
              width: 28,
              height: 28,
              borderRadius: 7,
              ...liquidGlass(`${ct.accent}33`, `${ct.accent}22`),
              background:
                "linear-gradient(to bottom right, rgba(255,255,255,0.06), rgba(20,20,40,0.4))",
              color: ct.accent,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "all 0.15s",
            }}
            data-ocid="viewer.zoom_in_button"
          >
            <Plus size={11} />
          </button>
        </div>

        {/* Screenshot */}
        <button
          type="button"
          onClick={takeScreenshot}
          className="glass-btn"
          style={ctrlBtn(false, ct.secondary)}
          data-ocid="viewer.screenshot_button"
        >
          <Camera size={12} />
          {lang === "fr" ? "Capture" : "Screenshot"}
        </button>

        {/* Help button */}
        <button
          type="button"
          onClick={() => setShowHelp(true)}
          className="glass-btn"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 30,
            height: 30,
            borderRadius: "50%",
            ...liquidGlass(`${ct.accent}66`, `${ct.accent}44`),
            background:
              "linear-gradient(to bottom right, rgba(255,255,255,0.08), rgba(20,20,40,0.4))",
            color: ct.accent,
            fontSize: "0.85rem",
            fontWeight: 800,
            cursor: "pointer",
            flexShrink: 0,
            transition: "all 0.2s",
          }}
          title="Help"
          data-ocid="viewer.help.open_modal_button"
        >
          ?
        </button>

        {/* Installed as App badge */}
        {isPWA && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              padding: "6px 12px",
              borderRadius: 8,
              ...liquidGlass(`${ct.accent}88`, ct.accentGlow),
              background:
                "linear-gradient(to bottom right, rgba(255,255,255,0.06), rgba(0,240,255,0.06))",
              color: ct.accent,
              fontSize: "0.72rem",
              fontWeight: 700,
            }}
            data-ocid="viewer.installed_as_app.success_state"
          >
            <Radio size={12} />
            {lang === "fr" ? "Installé comme app" : "Installed as App"}
          </div>
        )}

        {/* Install Viewer App */}
        {!isPWA && installPrompt && (
          <button
            type="button"
            onClick={async () => {
              const prompt = installPrompt as BeforeInstallPromptEvent;
              prompt.prompt();
              await prompt.userChoice;
              setInstallPrompt(null);
            }}
            className="glass-btn"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              padding: "6px 14px",
              borderRadius: 8,
              ...liquidGlass(`${ct.accent}aa`, ct.accentGlow),
              background:
                "linear-gradient(to bottom right, rgba(255,255,255,0.08), rgba(20,20,40,0.4))",
              color: ct.accent,
              fontSize: "0.75rem",
              fontWeight: 700,
              cursor: "pointer",
              animation: "neonPulse 2s infinite",
            }}
            data-ocid="viewer.install_button"
          >
            <Download size={12} />
            {lang === "fr" ? "Installer l'app" : "Install Viewer App"}
          </button>
        )}

        {/* Status badge */}
        <div
          style={{
            marginLeft: "auto",
            display: "flex",
            alignItems: "center",
            gap: 6,
            padding: "6px 12px",
            borderRadius: 8,
            ...liquidGlass(`${sc.color}44`, `${sc.color}33`),
            background: `linear-gradient(to bottom right, rgba(255,255,255,0.05), ${sc.color}0d)`,
            color: sc.color,
            fontSize: "0.7rem",
            fontFamily: "monospace",
            whiteSpace: "nowrap",
            minWidth: 180,
          }}
          data-ocid="viewer.status_panel"
        >
          <span
            style={{
              width: 7,
              height: 7,
              borderRadius: "50%",
              background: sc.color,
              boxShadow: `0 0 7px ${sc.color}`,
              flexShrink: 0,
              animation:
                status === "connected" || status === "reconnecting"
                  ? "blink 1.5s infinite"
                  : "none",
            }}
          />
          <span style={{ flex: 1 }}>
            {statusLabel}
            {status === "reconnecting" &&
              reconnectCountdown > 0 &&
              ` (${reconnectCountdown}s)`}
          </span>
        </div>

        {/* FPS */}
        <div
          style={{
            fontSize: "0.65rem",
            fontFamily: "monospace",
            color: `${ct.secondary}66`,
            whiteSpace: "nowrap",
            minWidth: "4.5rem",
            textAlign: "right",
          }}
        >
          <span
            style={{
              display: "inline-block",
              minWidth: "2.5ch",
              textAlign: "right",
            }}
          >
            {fps}
          </span>{" "}
          FPS
        </div>
      </div>

      {/* Error bar */}
      {errorMsg && (
        <div
          style={{
            ...liquidGlass("rgba(255,60,60,0.4)", "rgba(255,60,60,0.3)"),
            background:
              "linear-gradient(to right, rgba(255,60,60,0.08), rgba(20,0,0,0.4))",
            color: "#ff8080",
            padding: "6px 16px",
            fontSize: "0.75rem",
            display: "flex",
            alignItems: "center",
            gap: 8,
            flexShrink: 0,
          }}
          data-ocid="viewer.error_state"
        >
          <AlertTriangle size={13} />
          {errorMsg}
          <button
            type="button"
            onClick={() => setErrorMsg("")}
            style={{
              marginLeft: "auto",
              background: "none",
              border: "none",
              color: "#ff8080",
              cursor: "pointer",
              fontSize: "1rem",
            }}
          >
            ×
          </button>
        </div>
      )}

      {/* ── Main Viewer Area ─────────────────────────────────────────────── */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "row",
          alignItems: "stretch",
          overflow: "auto",
          minHeight: 0,
        }}
      >
        {/* Canvas area */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: 20,
            gap: 14,
          }}
          data-ocid="viewer.canvas_target"
        >
          {/* Canvas container with liquid glass frame */}
          <div
            style={{
              position: "relative",
              lineHeight: 0,
              border: THEMES[theme].glow
                ? `1px solid ${ct.accent}66`
                : `1px solid ${ct.accent}22`,
              borderRadius: 8,
              boxShadow: THEMES[theme].glow
                ? `0 0 50px 12px ${ct.accent}22, 0 0 100px 24px ${ct.accent}0a, inset 0 0 24px ${ct.accent}0f, 0 0 15px ${ct.accentGlow}`
                : `0 0 20px rgba(0,0,0,0.6), 0 0 6px ${ct.accent}11`,
              overflow: "auto",
              maxWidth: "100%",
              background:
                "linear-gradient(to bottom right, rgba(255,255,255,0.03), rgba(0,0,0,0.2))",
            }}
          >
            <canvas
              ref={canvasRef}
              width={canvasW}
              height={canvasH}
              style={{
                display: "block",
                maxWidth: "100%",
                imageRendering: "pixelated",
              }}
            />
            <canvas
              ref={scanlineCanvasRef}
              width={canvasW}
              height={canvasH}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                pointerEvents: "none",
                maxWidth: "100%",
              }}
            />
          </div>

          {!isConnected && (
            <div
              style={{
                color: `${ct.accent}55`,
                fontSize: "0.8rem",
                textAlign: "center",
              }}
            >
              <Radio size={14} style={{ display: "inline", marginRight: 6 }} />
              {lang === "fr"
                ? "Connectez votre radio pour voir le LCD en direct"
                : "Connect your radio to see the live LCD mirror"}
            </div>
          )}

          {/* Quick warnings */}
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 6,
              justifyContent: "center",
            }}
          >
            {[
              { text: "Chrome/Edge only", color: "#f0c040" },
              { text: "F4HWN v5.2.0+", color: ct.secondary },
              { text: "HTTPS required", color: "#666" },
            ].map((w) => (
              <span
                key={w.text}
                style={{
                  fontSize: "0.65rem",
                  fontWeight: 600,
                  color: w.color,
                  padding: "3px 10px",
                  border: `1px solid ${w.color}44`,
                  borderRadius: 999,
                  background: `linear-gradient(to right, ${w.color}0a, transparent)`,
                  backdropFilter: "blur(8px)",
                }}
              >
                {w.text}
              </span>
            ))}
          </div>
        </div>

        {/* ── Keypad Panel ─────────────────────────────────────────────── */}
        {showKeypad && (
          <motion.div
            key={model}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.2 }}
            style={{
              width: model === "UV-K1 V3" ? 264 : 204,
              ...liquidGlass(`${ct.accent}22`, `${ct.accent}18`),
              background:
                "linear-gradient(to bottom right, rgba(255,255,255,0.03), rgba(8,10,22,0.8))",
              borderTop: "none",
              borderBottom: "none",
              borderRight: "none",
              borderLeft: `1px solid ${ct.accent}22`,
              padding: 12,
              display: "flex",
              flexDirection: "column",
              gap: 8,
              flexShrink: 0,
              overflowY: "auto",
            }}
            data-ocid="viewer.keypad.panel"
          >
            <div
              style={{
                fontSize: "0.63rem",
                fontWeight: 800,
                letterSpacing: "0.15em",
                color: `${ct.accent}88`,
                textAlign: "center",
                textShadow: `0 0 8px ${ct.accentGlow}`,
              }}
            >
              {lang === "fr" ? "CLAVIER RADIO" : "RADIO KEYPAD"}
            </div>

            {/* Model label */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 6,
                fontSize: "0.62rem",
                fontFamily: "monospace",
                color: ct.secondary,
                ...liquidGlass(`${ct.secondary}44`, `${ct.secondary}33`),
                background: `linear-gradient(to right, ${ct.secondaryDim}, transparent)`,
                borderRadius: 6,
                padding: "3px 8px",
              }}
            >
              <span
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  background: ct.secondary,
                  boxShadow: `0 0 6px ${ct.secondaryGlow}`,
                  display: "inline-block",
                  flexShrink: 0,
                }}
              />
              {model}
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
              {keypadRows.map((rowGroup) => (
                <div
                  key={rowGroup.buttons.map((r) => r.id).join("-")}
                  style={
                    rowGroup.cols === 1
                      ? { display: "flex" }
                      : {
                          display: "grid",
                          gridTemplateColumns: `repeat(${rowGroup.cols}, 1fr)`,
                          gap: 4,
                        }
                  }
                >
                  {rowGroup.buttons.map(({ id }) => (
                    <KeypadBtn
                      key={id}
                      keyId={id}
                      lang={lang}
                      disabled={!isConnected}
                      onSendKey={sendKey}
                      codeMap={activeCodeMap}
                      accent={ct.accent}
                      secondary={ct.secondary}
                      secondaryGlow={ct.secondaryGlow}
                    />
                  ))}
                </div>
              ))}
            </div>

            <div
              style={{
                fontSize: "0.58rem",
                textAlign: "center",
                color: `${ct.secondary}55`,
                marginTop: 4,
              }}
            >
              {lang === "fr"
                ? "Clic = court · Maintenir = long"
                : "Click = short · Hold = long"}
            </div>
          </motion.div>
        )}
      </div>

      {/* ── Help Modal ──────────────────────────────────────────────────── */}
      {showHelp && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9998,
            background: "rgba(0,0,0,0.6)",
            backdropFilter: "blur(16px) saturate(160%)",
            WebkitBackdropFilter: "blur(16px) saturate(160%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 16,
          }}
          onClick={() => setShowHelp(false)}
          onKeyUp={(e) => e.key === "Escape" && setShowHelp(false)}
          data-ocid="viewer.help.dialog"
        >
          <div
            style={{
              ...liquidGlass(`${ct.accent}55`, `${ct.accent}33`),
              background:
                "linear-gradient(135deg, rgba(255,255,255,0.07) 0%, rgba(10,12,30,0.92) 60%, rgba(20,20,40,0.95) 100%)",
              borderRadius: 16,
              padding: 28,
              maxWidth: 580,
              width: "100%",
              maxHeight: "85vh",
              overflowY: "auto",
              color: "#e0e0e0",
              fontFamily: "Inter, system-ui, sans-serif",
              position: "relative",
            }}
            onClick={(e) => e.stopPropagation()}
            onKeyDown={(e) => e.stopPropagation()}
          >
            {/* Close */}
            <button
              type="button"
              onClick={() => setShowHelp(false)}
              className="glass-btn"
              style={{
                position: "absolute",
                top: 14,
                right: 14,
                ...liquidGlass(
                  "rgba(255,255,255,0.2)",
                  "rgba(255,255,255,0.1)",
                ),
                background: "rgba(255,255,255,0.06)",
                color: "#aaa",
                borderRadius: "50%",
                width: 30,
                height: 30,
                cursor: "pointer",
                fontSize: "1rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
              data-ocid="viewer.help.close_button"
            >
              ×
            </button>

            <h2
              style={{
                color: ct.accent,
                fontSize: "1rem",
                fontWeight: 800,
                marginBottom: 18,
                marginTop: 0,
                paddingRight: 36,
                textShadow: `0 0 12px ${ct.accentGlow}`,
              }}
            >
              How to Use the UV-K5 / UV-K1 Viewer
            </h2>

            <h3
              style={{
                color: ct.secondary,
                fontSize: "0.72rem",
                fontWeight: 700,
                letterSpacing: "0.12em",
                marginBottom: 10,
                marginTop: 0,
              }}
            >
              SETUP STEPS
            </h3>
            <ol
              style={{
                paddingLeft: 20,
                margin: 0,
                marginBottom: 22,
                display: "flex",
                flexDirection: "column",
                gap: 9,
              }}
            >
              {[
                <span key="1">
                  Flash{" "}
                  <strong style={{ color: ct.accent }}>
                    F4HWN Fusion v5.2.0
                  </strong>{" "}
                  firmware on your radio
                </span>,
                <span key="2">
                  Connect USB cable — UV-K5: 2-pin Kenwood cable | UV-K1: direct
                  USB-C
                </span>,
                <span key="3">
                  Select your model (
                  <strong style={{ color: ct.secondary }}>UV-K5</strong> or{" "}
                  <strong style={{ color: ct.secondary }}>UV-K1 V3</strong>) in
                  the top bar
                </span>,
                <span key="4">
                  Click <strong style={{ color: ct.accent }}>Connect</strong>{" "}
                  and choose your serial port from the browser dialog
                </span>,
                <span key="5">The LCD mirror will appear live on screen</span>,
                <span key="6">
                  Use the keypad for remote control —{" "}
                  <strong>short press</strong> = quick tap,{" "}
                  <strong>hold 450ms</strong> = long press
                </span>,
                <span key="7">
                  Type frequencies directly using digit keys (no timeout — just
                  tap 1-4-5-6-0-0)
                </span>,
                <span key="8">
                  Click <strong>Screenshot</strong> to save the current screen
                  as PNG
                </span>,
              ].map((step) => (
                <li
                  key={(step as React.ReactElement).key}
                  style={{
                    fontSize: "0.8rem",
                    lineHeight: 1.55,
                    color: "#c0c0c0",
                  }}
                >
                  {step}
                </li>
              ))}
            </ol>

            <h3
              style={{
                color: "#ff7070",
                fontSize: "0.72rem",
                fontWeight: 700,
                letterSpacing: "0.12em",
                marginBottom: 10,
                marginTop: 0,
              }}
            >
              TROUBLESHOOTING
            </h3>
            <ul
              style={{
                paddingLeft: 20,
                margin: 0,
                display: "flex",
                flexDirection: "column",
                gap: 7,
              }}
            >
              {[
                "Chrome or Edge browser required (Web Serial API not available in Firefox/Safari)",
                "Must be on HTTPS or localhost for Web Serial to work",
                "If no port appears, try unplugging and reconnecting the cable, then click Connect again",
                "If the display is blank after connecting, click Disconnect then Connect again",
                "PTT button is disabled for safety — use the radio physically for transmit",
                "If reconnect fails 5× in a row, check cable and ensure F4HWN firmware is running",
              ].map((tip) => (
                <li
                  key={tip.slice(0, 30)}
                  style={{
                    fontSize: "0.78rem",
                    lineHeight: 1.55,
                    color: "#909090",
                  }}
                >
                  {tip}
                </li>
              ))}
            </ul>

            <div
              style={{
                marginTop: 22,
                padding: "10px 14px",
                ...liquidGlass(`${ct.accent}33`, `${ct.accent}22`),
                background: `linear-gradient(to right, ${ct.accentDim}, transparent)`,
                borderRadius: 8,
                fontSize: "0.7rem",
                color: `${ct.accent}99`,
                fontFamily: "monospace",
              }}
            >
              Protocol: AA55 header · 38400 baud · type 01 = full frame · type
              02 = diff · keepalive 55AA0000 every 1s
            </div>
          </div>
        </div>
      )}

      {/* ── Footer bar ──────────────────────────────────────────────────── */}
      <div
        style={{
          ...liquidGlass(`${ct.accent}18`, `${ct.accent}10`),
          background:
            "linear-gradient(to right, rgba(255,255,255,0.02), rgba(8,10,22,0.7))",
          borderTop: `1px solid ${ct.accent}18`,
          borderBottom: "none",
          borderLeft: "none",
          borderRight: "none",
          padding: "6px 16px",
          display: "flex",
          alignItems: "center",
          gap: 16,
          fontSize: "0.65rem",
          color: "#333",
          flexShrink: 0,
          flexWrap: "wrap",
        }}
      >
        <span style={{ color: `${ct.accent}55`, fontWeight: 700 }}>
          HamWaves
        </span>
        <span>UV-K5 / UV-K1 V3 Standalone Viewer</span>
        <a
          href="/equipment-reviews/uv-k5-live-mirror"
          style={{ color: `${ct.accent}66`, textDecoration: "none" }}
        >
          Full guide ↗
        </a>
        <a
          href="https://github.com/armel/uv-k1-k5v3-firmware-custom"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: `${ct.secondary}66`, textDecoration: "none" }}
        >
          F4HWN GitHub ↗
        </a>
        <span style={{ marginLeft: "auto", fontFamily: "monospace" }}>
          Baud: 38400 · AA55 protocol
        </span>
      </div>
    </div>
  );
}
