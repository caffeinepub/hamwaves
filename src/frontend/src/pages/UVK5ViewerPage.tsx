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
  | "White Crisp"
  | "Galaxy Dream"
  | "Midnight Purple"
  | "Ocean Depth"
  | "Retro CRT Green"
  | "Blood Moon"
  | "Ham Hacker"
  | "Radar Ops";
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
  stars?: boolean;
  strongScanlines?: boolean;
  hamHacker?: boolean;
  radarOps?: boolean;
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
  "Galaxy Dream": {
    fg: "#89cff0",
    bg: "#000000",
    glow: true,
    gradient: ["#000000", "#000a1a"],
    stars: true,
  },
  "Midnight Purple": {
    fg: "#c084fc",
    bg: "#1a0033",
    glow: true,
    gradient: ["#1a0033", "#2d0052"],
  },
  "Ocean Depth": {
    fg: "#00ffff",
    bg: "#001f3f",
    glow: true,
    gradient: ["#001f3f", "#003366"],
  },
  "Retro CRT Green": {
    fg: "#00ff41",
    bg: "#000000",
    glow: true,
    gradient: ["#000000", "#001a00"],
    strongScanlines: true,
  },
  "Blood Moon": {
    fg: "#ff004d",
    bg: "#2a0000",
    glow: true,
    gradient: ["#2a0000", "#450000"],
  },
  "Ham Hacker": {
    fg: "#b87333",
    bg: "#0a1a08",
    glow: true,
    gradient: ["#0a1a08", "#0d2208"],
    hamHacker: true,
  },
  "Radar Ops": {
    fg: "#00ff41",
    bg: "#001a00",
    glow: true,
    gradient: ["#001a00", "#003300"],
    radarOps: true,
    strongScanlines: false,
  },
};

interface CyberThemeConfig {
  accent: string;
  accentGlow: string;
  accentDim: string;
}
const CYBER_THEMES: Record<CyberThemeName, CyberThemeConfig> = {
  "Cyber Neon": {
    accent: "#00f0ff",
    accentGlow: "rgba(0,240,255,0.4)",
    accentDim: "rgba(0,240,255,0.15)",
  },
  "Bunker Dark": {
    accent: "#4a5568",
    accentGlow: "rgba(74,85,104,0.4)",
    accentDim: "rgba(74,85,104,0.15)",
  },
  "Classic Blue": {
    accent: "#3b82f6",
    accentGlow: "rgba(59,130,246,0.4)",
    accentDim: "rgba(59,130,246,0.15)",
  },
  "Purple Plasma": {
    accent: "#a855f7",
    accentGlow: "rgba(168,85,247,0.4)",
    accentDim: "rgba(168,85,247,0.15)",
  },
  "Green Matrix": {
    accent: "#22c55e",
    accentGlow: "rgba(34,197,94,0.4)",
    accentDim: "rgba(34,197,94,0.15)",
  },
  "Amber Terminal": {
    accent: "#f59e0b",
    accentGlow: "rgba(245,158,11,0.4)",
    accentDim: "rgba(245,158,11,0.15)",
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
  SIDE1: 0x12,
  SIDE2: 0x13,
  SIDE3: 0x14,
  CALL: 0x07,
};

// Key codes for UV-K1 (F4HWN Fusion v5.2.0)
// UV-K1 key codes – base codes from F4HWN Fusion firmware keyboard.h
// Short press: type 0x03 + code; Long press: type 0x04 + code (vcp.c protocol)
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
  SIDE1: 0x12,
  SIDE2: 0x13,
  SIDE3: 0x14,
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
  SIDE1: "PF1",
  SIDE2: "PF2",
  SIDE3: "PF3",
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

// ── KeypadBtn ─────────────────────────────────────────────────────────────────
interface KeypadBtnProps {
  keyId: string;
  lang: Lang;
  disabled: boolean;
  onSendKey: (keyId: string, isLong: boolean) => void;
  codeMap: Record<string, number>;
}

function KeypadBtn({
  keyId,
  lang,
  disabled,
  onSendKey,
  codeMap,
}: KeypadBtnProps) {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const repeatRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const longFiredRef = useRef(false);
  const [pressed, setPressed] = useState(false);
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

  // Detect UV-K1 split-label buttons (have a space: "1 Band", "* Scan", "# Lock", "0 FM", etc.)
  const spaceIdx = displayLabel.indexOf(" ");
  const isSplitLabel = spaceIdx !== -1 && !isPTT && !isNav && !isAccent;
  const splitPrimary = isSplitLabel ? displayLabel.slice(0, spaceIdx) : null;
  const splitSecondary = isSplitLabel ? displayLabel.slice(spaceIdx + 1) : null;

  const isDigit =
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
    // 450ms = 45 polls × 10ms (SERIAL_KEY_LONG_POLLS × poll cycle)
    timerRef.current = setTimeout(() => {
      longFiredRef.current = true;
      onSendKey(keyId, true); // first long send
      // keep sending long every 100ms while held
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
        onSendKey(keyId, false); // quick release → short press
      }
    }
  };
  const handlePointerLeave = () => {
    setPressed(false);
    stopRepeat();
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  let baseStyle =
    "select-none rounded border text-xs font-bold tracking-wider transition-all duration-150 cursor-pointer flex items-center justify-center ";
  if (isPTT)
    baseStyle +=
      "py-2 border-orange-500/60 bg-orange-900/40 text-orange-300 hover:border-orange-400 hover:shadow-[0_0_6px_rgba(249,115,22,0.15)] ";
  else if (isAccent)
    baseStyle +=
      "py-1.5 border-[rgba(0,240,255,0.22)] bg-[rgba(0,240,255,0.10)] text-[#f0faff] hover:bg-[rgba(0,240,255,0.18)] hover:border-[rgba(0,240,255,0.50)] ";
  else if (isNav)
    baseStyle +=
      "py-1.5 border-[rgba(0,240,255,0.22)] bg-[rgba(0,240,255,0.10)] text-[#f0faff] hover:bg-[rgba(0,240,255,0.18)] hover:border-[rgba(0,240,255,0.50)] ";
  else if (isDigit)
    baseStyle +=
      "py-1.5 border-[rgba(0,240,255,0.22)] bg-[rgba(0,240,255,0.10)] text-[#f0faff] hover:bg-[rgba(0,240,255,0.18)] hover:border-[rgba(0,240,255,0.50)] ";
  else
    baseStyle +=
      "py-1.5 border-[rgba(0,240,255,0.22)] bg-[rgba(0,240,255,0.10)] text-[#f0faff] hover:bg-[rgba(0,240,255,0.18)] hover:border-[rgba(0,240,255,0.50)] ";
  if (pressed) baseStyle += "scale-95 border-[rgba(0,240,255,0.60)] ";
  if (disabled) baseStyle += "opacity-40 cursor-not-allowed ";

  const shortCode = codeMap[keyId] ?? 0;
  return (
    <button
      type="button"
      className={baseStyle}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerLeave}
      disabled={disabled}
      aria-label={`Key ${keyId}`}
      title={`${keyId} · short: AA 55 03 ${shortCode.toString(16).padStart(2, "0")} · long: AA 55 04 ${shortCode.toString(16).padStart(2, "0")}`}
    >
      {isSplitLabel ? (
        <span
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            lineHeight: 1,
            gap: 1,
          }}
        >
          <span
            style={{
              fontSize: "1rem",
              fontWeight: 800,
              color: "#fff",
              lineHeight: 1,
            }}
          >
            {splitPrimary}
          </span>
          <span
            style={{
              fontSize: "0.52rem",
              color: "rgba(240,250,255,0.6)",
              fontWeight: 500,
              lineHeight: 1,
              textAlign: "center",
            }}
          >
            {splitSecondary}
          </span>
        </span>
      ) : (
        displayLabel
      )}
    </button>
  );
}

// ── Side Button (PF1 / PF2 / PF3) ────────────────────────────────────────────
function SideBtn({
  keyId,
  label,
  disabled,
  onSendKey,
  small = false,
}: {
  keyId: string;
  label: string;
  disabled: boolean;
  onSendKey: (keyId: string, isLong: boolean) => void;
  small?: boolean;
}) {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const repeatRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const longFiredRef = useRef(false);
  const [holding, setHolding] = useState(false);

  const size = small ? 32 : 40;

  function cancel() {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    if (repeatRef.current) {
      clearInterval(repeatRef.current);
      repeatRef.current = null;
    }
    longFiredRef.current = false;
    setHolding(false);
  }

  function onDown(e: React.PointerEvent) {
    e.preventDefault();
    if (disabled) return;
    longFiredRef.current = false;
    timerRef.current = setTimeout(() => {
      longFiredRef.current = true;
      setHolding(true);
      onSendKey(keyId, true);
      repeatRef.current = setInterval(() => onSendKey(keyId, true), 100);
    }, 450);
  }

  function onUp(e: React.PointerEvent) {
    e.preventDefault();
    if (!longFiredRef.current && timerRef.current) {
      cancel();
      onSendKey(keyId, false);
    } else {
      cancel();
    }
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 2,
      }}
    >
      <button
        onPointerDown={onDown}
        onPointerUp={onUp}
        onPointerLeave={cancel}
        onPointerCancel={cancel}
        disabled={disabled}
        style={{
          width: size,
          height: size,
          borderRadius: "50%",
          background: holding ? "rgba(0,240,255,0.22)" : "rgba(0,240,255,0.10)",
          border: `1px solid rgba(0,240,255,${holding ? "0.55" : "0.30"})`,
          backdropFilter: "blur(10px) saturate(130%) brightness(105%)",
          WebkitBackdropFilter: "blur(10px) saturate(130%) brightness(105%)",
          cursor: disabled ? "not-allowed" : "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transition: "transform 0.12s ease, background 0.12s ease",
          transform: holding ? "scale(1.08)" : undefined,
          outline: "none",
          padding: 0,
          boxSizing: "border-box",
          opacity: disabled ? 0.35 : 1,
          flexShrink: 0,
          userSelect: "none",
          touchAction: "none",
        }}
        onMouseEnter={(e) => {
          if (!disabled)
            (e.currentTarget as HTMLButtonElement).style.transform =
              "scale(1.04)";
        }}
        onMouseLeave={(e) => {
          if (!holding)
            (e.currentTarget as HTMLButtonElement).style.transform = "scale(1)";
        }}
        type="button"
        title={label}
      >
        <span
          style={{
            width: small ? 8 : 10,
            height: small ? 8 : 10,
            borderRadius: "50%",
            background: disabled ? "rgba(0,240,255,0.3)" : "#00f0ff",
            display: "block",
            boxShadow: disabled ? "none" : "0 0 4px rgba(0,240,255,0.6)",
          }}
        />
      </button>
      <span
        style={{
          fontSize: "0.52rem",
          color: "rgba(0,240,255,0.55)",
          fontWeight: 600,
          letterSpacing: "0.05em",
          lineHeight: 1,
          userSelect: "none",
        }}
      >
        {label}
      </span>
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function UVK5ViewerPage() {
  const [status, setStatus] = useState<Status>("ready");
  const [theme, setTheme] = useState<ThemeName>(() => {
    const saved = localStorage.getItem("uvk5-lcd-theme") as ThemeName | null;
    return saved && (THEMES as Record<string, ThemeColors>)[saved]
      ? saved
      : "Blue";
  });
  const [model, setModel] = useState<ModelName>(() => {
    const saved = localStorage.getItem("uvk5-radio-model") as ModelName | null;
    return saved === "UV-K1 V3" ? "UV-K1 V3" : "UV-K5";
  });
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
  const [isFullScreen, setIsFullScreen] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const scanlineCanvasRef = useRef<HTMLCanvasElement>(null);
  const starsCanvasRef = useRef<HTMLCanvasElement>(null);
  const starsAnimRef = useRef<number | null>(null);
  const radarAnimRef = useRef<number | null>(null);
  const radarAngleRef = useRef<number>(0);
  const starsDataRef = useRef<
    {
      x: number;
      y: number;
      r: number;
      alpha: number;
      speed: number;
      dir: number;
    }[]
  >([]);
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

  // Keep modelRef in sync with model state
  useEffect(() => {
    modelRef.current = model;
  }, [model]);

  const W = 128;
  const H = 64;
  const BAUD = 38400;

  // Derive keypad rows and code map from selected model
  const keypadRows: KeypadRowGroup[] =
    model === "UV-K1 V3" ? KEYPAD_ROWS_UVK1 : KEYPAD_ROWS_UVK5;
  // Build code map for tooltip display in KeyButton
  const activeCodeMap: Record<string, number> =
    model === "UV-K1 V3" ? KEY_CODES_UVK1 : KEY_CODES_UVK5;

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

    // Pick up any prompt captured before React mounted
    const w = window as unknown as { __viewerInstallPrompt?: Event | null };
    if (w.__viewerInstallPrompt) {
      setInstallPrompt(w.__viewerInstallPrompt);
      w.__viewerInstallPrompt = null;
    }

    const handler = (e: Event) => {
      e.preventDefault();
      setInstallPrompt(e);
    };
    window.addEventListener("beforeinstallprompt", handler);
    // Also listen for our custom early-capture event
    const readyHandler = () => {
      const ww = window as unknown as { __viewerInstallPrompt?: Event | null };
      if (ww.__viewerInstallPrompt) {
        setInstallPrompt(ww.__viewerInstallPrompt);
        ww.__viewerInstallPrompt = null;
      }
    };
    window.addEventListener("viewerinstallready", readyHandler);

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
      window.removeEventListener("viewerinstallready", readyHandler);
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

  // ── Fullscreen change listener ──────────────────────────────────────────
  useEffect(() => {
    const handleFsChange = () => {
      setIsFullScreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFsChange);
    return () =>
      document.removeEventListener("fullscreenchange", handleFsChange);
  }, []);

  const toggleFullScreen = () => {
    if (!document.fullscreenEnabled) {
      alert("Full screen not supported in this browser");
      return;
    }
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };
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
    // Ham Hacker: circuit board pattern + CPU die
    if (t.hamHacker) {
      const ctx2 = canvas.getContext("2d")!;
      ctx2.save();
      ctx2.globalAlpha = 0.18;
      ctx2.strokeStyle = "#1a4d1a";
      ctx2.lineWidth = 1.5;
      const step = pw * 8;
      for (let yy = step; yy < ch; yy += step) {
        ctx2.beginPath();
        ctx2.moveTo(0, yy);
        ctx2.lineTo(cw, yy);
        ctx2.stroke();
      }
      for (let xx = step; xx < cw; xx += step) {
        ctx2.beginPath();
        ctx2.moveTo(xx, 0);
        ctx2.lineTo(xx, ch);
        ctx2.stroke();
      }
      ctx2.fillStyle = "#2a6b2a";
      ctx2.globalAlpha = 0.25;
      for (let yy = step; yy < ch; yy += step) {
        for (let xx = step; xx < cw; xx += step) {
          ctx2.beginPath();
          ctx2.arc(xx, yy, 2.5, 0, Math.PI * 2);
          ctx2.fill();
        }
      }
      const cpuX = cw / 2;
      const cpuY = ch / 2;
      const cpuSize = pw * 6;
      ctx2.globalAlpha = 0.5;
      ctx2.fillStyle = "#2a1a08";
      ctx2.strokeStyle = "#d4a017";
      ctx2.lineWidth = 1.5;
      ctx2.fillRect(cpuX - cpuSize, cpuY - cpuSize, cpuSize * 2, cpuSize * 2);
      ctx2.strokeRect(cpuX - cpuSize, cpuY - cpuSize, cpuSize * 2, cpuSize * 2);
      ctx2.globalAlpha = 0.6;
      ctx2.fillStyle = "#b87333";
      const innerSize = cpuSize * 0.6;
      ctx2.fillRect(
        cpuX - innerSize,
        cpuY - innerSize,
        innerSize * 2,
        innerSize * 2,
      );
      ctx2.fillStyle = "#d4a017";
      ctx2.globalAlpha = 0.5;
      const pinCount = 4;
      const pinW = 2;
      const pinH = 4;
      const pinSpacing = (cpuSize * 1.6) / (pinCount + 1);
      for (let i = 1; i <= pinCount; i++) {
        const pinOffset = -cpuSize + i * pinSpacing;
        ctx2.fillRect(
          cpuX + pinOffset - pinW / 2,
          cpuY - cpuSize - pinH,
          pinW,
          pinH,
        );
        ctx2.fillRect(cpuX + pinOffset - pinW / 2, cpuY + cpuSize, pinW, pinH);
        ctx2.fillRect(
          cpuX - cpuSize - pinH,
          cpuY + pinOffset - pinW / 2,
          pinH,
          pinW,
        );
        ctx2.fillRect(cpuX + cpuSize, cpuY + pinOffset - pinW / 2, pinH, pinW);
      }
      ctx2.globalAlpha = 0.06;
      const radGrad = ctx2.createRadialGradient(
        cpuX,
        cpuY,
        0,
        cpuX,
        cpuY,
        cw * 0.6,
      );
      radGrad.addColorStop(0, "#ffaa00");
      radGrad.addColorStop(1, "transparent");
      ctx2.fillStyle = radGrad;
      ctx2.fillRect(0, 0, cw, ch);
      ctx2.restore();
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
        ctx.fillStyle = THEMES[theme]?.strongScanlines
          ? "rgba(0,0,0,0.22)"
          : theme === "Ham Hacker"
            ? "rgba(184,115,51,0.07)"
            : theme === "Radar Ops"
              ? "rgba(0,80,0,0.15)"
              : "rgba(0,0,0,0.08)";
        ctx.fillRect(0, row * scale, W * scale, scale);
      }
    }
  }, [scale, theme]);

  // ── Galaxy Dream Stars ───────────────────────────────────────────────────
  useEffect(() => {
    const starsCanvas = starsCanvasRef.current;
    if (!starsCanvas) return;
    const ctx = starsCanvas.getContext("2d");
    if (!ctx) return;
    if (starsAnimRef.current) {
      cancelAnimationFrame(starsAnimRef.current);
      starsAnimRef.current = null;
    }
    if (radarAnimRef.current) {
      cancelAnimationFrame(radarAnimRef.current);
      radarAnimRef.current = null;
    }
    if (!THEMES[theme]?.stars) {
      ctx.clearRect(0, 0, starsCanvas.width, starsCanvas.height);
      starsDataRef.current = [];
      return;
    }
    const cw = W * scale;
    const ch = H * scale;
    starsCanvas.width = cw;
    starsCanvas.height = ch;
    starsDataRef.current = Array.from({ length: 60 }, () => ({
      x: Math.random() * cw,
      y: Math.random() * ch,
      r: Math.random() * 1.2 + 0.3,
      alpha: Math.random(),
      speed: Math.random() * 0.008 + 0.003,
      dir: Math.random() > 0.5 ? 1 : -1,
    }));
    const animate = () => {
      ctx.clearRect(0, 0, cw, ch);
      for (const s of starsDataRef.current) {
        s.alpha += s.speed * s.dir;
        if (s.alpha >= 1) {
          s.alpha = 1;
          s.dir = -1;
        }
        if (s.alpha <= 0) {
          s.alpha = 0;
          s.dir = 1;
        }
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${s.alpha.toFixed(3)})`;
        ctx.fill();
      }
      starsAnimRef.current = requestAnimationFrame(animate);
    };
    animate();
    return () => {
      if (starsAnimRef.current) cancelAnimationFrame(starsAnimRef.current);
    };
  }, [theme, scale]);

  // ── Radar Ops Animation ─────────────────────────────────────────────────
  useEffect(() => {
    const starsCanvas = starsCanvasRef.current;
    if (!starsCanvas) return;
    const ctx = starsCanvas.getContext("2d");
    if (!ctx) return;
    if (radarAnimRef.current) {
      cancelAnimationFrame(radarAnimRef.current);
      radarAnimRef.current = null;
    }
    if (!THEMES[theme]?.radarOps) {
      ctx.clearRect(0, 0, starsCanvas.width, starsCanvas.height);
      return;
    }
    const cw = W * scale;
    const ch = H * scale;
    starsCanvas.width = cw;
    starsCanvas.height = ch;
    const cx = cw / 2;
    const cy = ch / 2;
    const maxR = Math.sqrt(cx * cx + cy * cy);
    let lastTime = 0;
    const SPEED = 0.4; // radians per second
    const blips = Array.from({ length: 4 }, () => ({
      x: cx + (Math.random() - 0.5) * cw * 0.6,
      y: cy + (Math.random() - 0.5) * ch * 0.6,
      alpha: Math.random() * 0.5 + 0.2,
    }));
    const gridStep = Math.min(cw, ch) / 6;
    const animate = (ts: number) => {
      const dt = lastTime ? (ts - lastTime) / 1000 : 0;
      lastTime = ts;
      radarAngleRef.current =
        (radarAngleRef.current + SPEED * dt) % (Math.PI * 2);
      ctx.clearRect(0, 0, cw, ch);

      // Grid lines
      ctx.save();
      ctx.strokeStyle = "rgba(0,180,40,0.12)";
      ctx.lineWidth = 0.5;
      for (let x = 0; x < cw; x += gridStep) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, ch);
        ctx.stroke();
      }
      for (let y = 0; y < ch; y += gridStep) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(cw, y);
        ctx.stroke();
      }
      // Concentric range circles
      for (let r = gridStep; r < maxR; r += gridStep) {
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.stroke();
      }
      ctx.restore();

      // Sweep trail (wedge segments)
      const sweepLen = Math.PI * 0.5;
      for (let i = 0; i < 28; i++) {
        const trailAlpha = (i / 28) * 0.16;
        const startA = radarAngleRef.current - sweepLen * (1 - i / 28);
        const endA = radarAngleRef.current - sweepLen * (1 - (i + 1) / 28);
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.arc(cx, cy, maxR, startA, endA);
        ctx.closePath();
        ctx.fillStyle = `rgba(0,255,65,${trailAlpha.toFixed(3)})`;
        ctx.fill();
      }

      // Leading line
      ctx.save();
      ctx.strokeStyle = "rgba(0,255,65,0.85)";
      ctx.lineWidth = 1.5;
      ctx.shadowColor = "#00ff41";
      ctx.shadowBlur = 4;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(
        cx + Math.cos(radarAngleRef.current) * maxR,
        cy + Math.sin(radarAngleRef.current) * maxR,
      );
      ctx.stroke();
      ctx.restore();

      // Pulsing scope circle
      const pulse = 0.35 + 0.25 * Math.sin(ts * 0.003);
      ctx.save();
      ctx.strokeStyle = `rgba(0,255,65,${pulse.toFixed(2)})`;
      ctx.lineWidth = 1;
      ctx.shadowColor = "#00ff41";
      ctx.shadowBlur = 5;
      ctx.beginPath();
      ctx.arc(cx, cy, gridStep * 0.3, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();

      // Blips
      for (const b of blips) {
        ctx.save();
        ctx.fillStyle = `rgba(0,255,65,${(b.alpha * 0.8).toFixed(2)})`;
        ctx.shadowColor = "#00ff41";
        ctx.shadowBlur = 5;
        ctx.beginPath();
        ctx.arc(b.x, b.y, 2.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      radarAnimRef.current = requestAnimationFrame(animate);
    };
    animate(0);
    return () => {
      if (radarAnimRef.current) cancelAnimationFrame(radarAnimRef.current);
    };
  }, [theme, scale]);

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
      // Allow sends when connected OR sending (don't block digit entry between keystrokes)
      if (!writerRef.current) return;
      const st = statusRef.current;
      if (st !== "connected" && st !== "sending") return;
      // Block PTT remote send (firmware: KEY_PTT blocked to avoid stuck transmit)
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
      // F4HWN Fusion v5.2.0 vcp.c protocol:
      // KEYBOARD_InjectKey:     AA 55 03 keyCode
      // KEYBOARD_InjectKeyLong: AA 55 04 keyCode
      const isSideBtn =
        keyId === "SIDE1" || keyId === "SIDE2" || keyId === "SIDE3";
      const typebyte = isLong ? 0x04 : 0x03;
      // For side buttons: long press uses code | 0x80 (e.g. 0x12 → 0x92)
      const sendCode = isSideBtn && isLong ? baseCode | 0x80 : baseCode;
      if (!isSideBtn) {
        console.log(
          `Sending key: ${displayLabel} (code: 0x${baseCode.toString(16)}, type: 0x0${typebyte}, ${isLong ? "long" : "short"})`,
        );
      }

      // ── Frequency digit tracking ──────────────────────────────────────────
      // Digit keys: track what user is typing for "Typing frequency: 145.600"
      const isDigitKey =
        /^[0-9]$/.test(keyId) ||
        /^\d /.test(keyId) || // UV-K1 split labels like "1 Band"
        keyId === "0 FM";
      let statusMsg: string;
      if (isDigitKey && !isLong) {
        // Extract the numeric character from the key id
        const digit = keyId[0];
        freqDigitsRef.current += digit;
        // Cancel any pending reset timer
        if (freqTimerRef.current) {
          clearTimeout(freqTimerRef.current);
          freqTimerRef.current = null;
        }
        // Reset digit buffer 3s after last digit (real radio times out similarly)
        freqTimerRef.current = setTimeout(() => {
          freqDigitsRef.current = "";
          freqTimerRef.current = null;
          if (statusRef.current === "sending") setStatusSafe("connected");
        }, 3000);
        statusMsg = `Typing frequency: ${freqDigitsRef.current}`;
      } else if (keyId === "EXIT" || keyId === "MENU") {
        // Clear freq buffer on EXIT / MENU
        freqDigitsRef.current = "";
        if (freqTimerRef.current) {
          clearTimeout(freqTimerRef.current);
          freqTimerRef.current = null;
        }
        statusMsg = isLong
          ? `Long press active – holding ${displayLabel}`
          : `Short press – ${displayLabel}`;
      } else if (isSideBtn) {
        const codeHex = `0x${sendCode.toString(16).padStart(2, "0")}`;
        statusMsg = isLong
          ? `Sent ${displayLabel} long (code ${codeHex})`
          : `Sent ${displayLabel} short (code ${codeHex})`;
      } else {
        statusMsg = isLong
          ? `Long press active – holding ${displayLabel}`
          : `Short press detected – ${displayLabel}`;
      }

      try {
        setStatusSafe("sending", statusMsg);
        const packet = new Uint8Array([0xaa, 0x55, typebyte, sendCode]);
        if (isSideBtn) {
          console.log(
            `Side button sent: packet=${Array.from(packet)
              .map((b) => b.toString(16).padStart(2, "0"))
              .join(" ")} (${isLong ? "long" : "short"})`,
          );
        }
        await writerRef.current.write(packet);
        // Only auto-clear status for non-digit keys
        if (!isDigitKey || isLong) {
          setTimeout(() => {
            if (statusRef.current === "sending") setStatusSafe("connected");
          }, 2000);
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

  return (
    <div
      data-ocid="viewer.page"
      style={
        {
          background: "#000000",
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          fontFamily: "Inter, system-ui, sans-serif",
          color: "#f0faff",
          overflow: "hidden",
          "--accent": CYBER_THEMES[cyberTheme].accent,
          "--accent-glow": CYBER_THEMES[cyberTheme].accentGlow,
          "--accent-dim": CYBER_THEMES[cyberTheme].accentDim,
        } as React.CSSProperties
      }
    >
      <style>{`
        @keyframes blink { 0%,100% { opacity: 1; } 50% { opacity: 0.3; } }
        @keyframes neonPulse { 0%, 100% { box-shadow: 0 0 6px rgba(0,240,255,0.15); } 50%       { box-shadow: 0 0 6px rgba(0,240,255,0.15); } }
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
            background: "rgba(0,20,20,0.97)",
            border: "1.5px solid #00f0ff",
            borderRadius: 12,
            padding: "14px 28px",
            color: "#00f0ff",
            fontWeight: 700,
            fontSize: "0.9rem",
            boxShadow: "0 0 6px rgba(0,240,255,0.15)",
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
      <div
        style={{
          background:
            "linear-gradient(to bottom right, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 100%), rgba(10, 10, 20, 0.32)",
          backdropFilter: "blur(14px) saturate(160%) brightness(112%)",
          borderBottom: "1px solid rgba(0, 240, 255, 0.22)",
          padding: "8px 16px",
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          gap: 8,
          flexShrink: 0,
        }}
        data-ocid="viewer.top_bar"
      >
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
              color: "#00f0ff",
              fontWeight: 800,
              fontSize: "0.8rem",
              letterSpacing: "0.08em",
              whiteSpace: "nowrap",
            }}
          >
            UV-K5 MIRROR
          </span>
          <span
            style={{
              color: "#333",
              fontSize: "0.65rem",
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
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            padding: "6px 14px",
            borderRadius: 8,
            border: `1px solid ${isConnected ? "rgba(0,240,255,0.20)" : "rgba(0,240,255,0.30)"}`,
            color: isConnected ? "rgba(224,247,255,0.4)" : "#f0faff",
            background: isConnected
              ? "rgba(0,240,255,0.05)"
              : "rgba(0,240,255,0.10)",
            fontSize: "0.75rem",
            fontWeight: 700,
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
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            padding: "6px 14px",
            borderRadius: 8,
            border: `1px solid ${isConnected ? "rgba(255,80,80,0.7)" : "rgba(255,80,80,0.2)"}`,
            color: isConnected ? "#ff6060" : "rgba(255,96,96,0.35)",
            background: "rgba(255,60,60,0.05)",
            fontSize: "0.75rem",
            fontWeight: 700,
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
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            padding: "6px 10px",
            borderRadius: 8,
            border: `1px solid ${showKeypad ? "rgba(0,240,255,0.50)" : "rgba(0,240,255,0.30)"}`,
            color: showKeypad ? "#f0faff" : "rgba(224,247,255,0.5)",
            background: showKeypad
              ? "rgba(0,240,255,0.18)"
              : "rgba(0,240,255,0.10)",
            fontSize: "0.75rem",
            fontWeight: 700,
            cursor: "pointer",
          }}
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
            border: "1px solid rgba(0,240,255,0.30)",
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
                background: lang === l ? "rgba(0,240,255,0.15)" : "transparent",
                color: lang === l ? "#f0faff" : "rgba(224,247,255,0.3)",
                border: "none",
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
              fontSize: "0.6rem",
              color: "rgba(0,240,255,0.4)",
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
              background: "rgba(10, 10, 20, 0.42)",
              border: "1px solid rgba(0, 240, 255, 0.22)",
              borderRadius: 6,
              color: "#f0faff",
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
              fontSize: "0.6rem",
              color: "rgba(0,240,255,0.4)",
              fontWeight: 700,
              letterSpacing: "0.1em",
              whiteSpace: "nowrap",
            }}
          >
            LCD
          </span>
          <select
            value={theme}
            onChange={(e) => {
              const t = e.target.value as ThemeName;
              setTheme(t);
              localStorage.setItem("uvk5-lcd-theme", t);
            }}
            style={{
              background: "rgba(10, 10, 20, 0.42)",
              border: "1px solid rgba(0, 240, 255, 0.22)",
              borderRadius: 6,
              color: "#f0faff",
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
                {t === "Galaxy Dream"
                  ? "✦ Galaxy Dream"
                  : t === "Ham Hacker"
                    ? "⚡ Ham Hacker"
                    : t === "Radar Ops"
                      ? "📡 Radar Ops"
                      : t}
              </option>
            ))}
          </select>
        </div>

        {/* Model selector */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            gap: 2,
          }}
        >
          <span
            style={{
              fontSize: "0.55rem",
              color: `${CYBER_THEMES[cyberTheme].accent}66`,
              fontWeight: 700,
              letterSpacing: "0.12em",
            }}
          >
            RADIO MODEL
          </span>
          <select
            value={model}
            onChange={(e) => {
              const m = e.target.value as ModelName;
              setModel(m);
              localStorage.setItem("uvk5-radio-model", m);
            }}
            style={{
              background: "rgba(10, 10, 20, 0.42)",
              border: "1px solid rgba(0, 240, 255, 0.22)",
              color: "#f0faff",
              borderRadius: 6,
              padding: "3px 6px",
              fontSize: "0.7rem",
              fontWeight: 700,
              cursor: "pointer",
              outline: "none",
              fontFamily: "inherit",
              backdropFilter: "blur(14px) saturate(160%) brightness(112%)",
              letterSpacing: "0.04em",
            }}
            data-ocid="viewer.radio_model.select"
          >
            {(["UV-K5", "UV-K1 V3"] as ModelName[]).map((m) => (
              <option
                key={m}
                value={m}
                style={{
                  background: "#0a0a14",
                  color: CYBER_THEMES[cyberTheme].accent,
                }}
              >
                {m}
              </option>
            ))}
          </select>
        </div>

        {/* Zoom */}
        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
          <button
            type="button"
            onClick={() => setScale((s) => Math.max(5, s - 1))}
            style={{
              width: 28,
              height: 28,
              borderRadius: 8,
              border: "1px solid rgba(0,240,255,0.30)",
              color: "#f0faff",
              background: "rgba(0,240,255,0.05)",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            data-ocid="viewer.zoom_out_button"
          >
            <Minus size={11} />
          </button>
          <span
            style={{
              fontSize: "0.7rem",
              fontFamily: "monospace",
              color: "#666",
              minWidth: 28,
              textAlign: "center",
            }}
          >
            {scale}×
          </span>
          <button
            type="button"
            onClick={() => setScale((s) => Math.min(16, s + 1))}
            style={{
              width: 28,
              height: 28,
              borderRadius: 8,
              border: "1px solid rgba(0,240,255,0.30)",
              color: "#f0faff",
              background: "rgba(0,240,255,0.05)",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
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
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            padding: "6px 10px",
            borderRadius: 8,
            border: "1px solid rgba(0,240,255,0.30)",
            color: "#f0faff",
            background: "rgba(0,240,255,0.10)",
            fontSize: "0.75rem",
            fontWeight: 600,
            cursor: "pointer",
          }}
          data-ocid="viewer.screenshot_button"
        >
          <Camera size={12} />
          {lang === "fr" ? "Capture" : "Screenshot"}
        </button>

        {/* Help button */}
        <button
          type="button"
          onClick={() => setShowHelp(true)}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 30,
            height: 30,
            borderRadius: "50%",
            border: "1px solid rgba(0,240,255,0.30)",
            color: "#f0faff",
            background: "rgba(0,240,255,0.10)",
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

        {/* Full Screen button */}
        <button
          type="button"
          onClick={toggleFullScreen}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            padding: "6px 14px",
            borderRadius: 8,
            border: "1px solid rgba(0,240,255,0.30)",
            color: "#f0faff",
            background: "rgba(0,240,255,0.10)",
            backdropFilter: "blur(14px) saturate(160%) brightness(112%)",
            fontSize: "0.75rem",
            fontWeight: 700,
            cursor: "pointer",
            flexShrink: 0,
            transition: "all 0.2s",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.transform =
              "scale(1.015)";
            (e.currentTarget as HTMLButtonElement).style.background =
              "rgba(0,240,255,0.18)";
            (e.currentTarget as HTMLButtonElement).style.filter =
              "brightness(118%)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.transform = "scale(1)";
            (e.currentTarget as HTMLButtonElement).style.background =
              "rgba(0,240,255,0.10)";
            (e.currentTarget as HTMLButtonElement).style.filter = "";
          }}
          title={isFullScreen ? "Exit Full Screen" : "Enter Full Screen"}
          data-ocid="viewer.fullscreen_button"
        >
          {isFullScreen ? "Exit Full Screen" : "Full Screen"}
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
              border: "1px solid rgba(0,240,255,0.30)",
              color: "#f0faff",
              background:
                "linear-gradient(to bottom right, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 100%), rgba(10, 10, 20, 0.32)",
              backdropFilter: "blur(14px) saturate(160%) brightness(112%)",
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
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              padding: "6px 14px",
              borderRadius: 8,
              border: "1px solid rgba(0,240,255,0.30)",
              color: "#f0faff",
              background: "rgba(0,240,255,0.10)",
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
            border: "1px solid rgba(0, 240, 255, 0.22)",
            color: "#f0faff",
            background:
              "linear-gradient(to bottom right, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 100%), rgba(10, 10, 20, 0.32)",
            backdropFilter: "blur(14px) saturate(160%) brightness(112%)",
            fontSize: "0.7rem",
            fontFamily: "monospace",
            whiteSpace: "nowrap",
            fontWeight: 600,
            textShadow: "0 1px 2px rgba(0,0,0,0.8)",
          }}
          data-ocid="viewer.status_panel"
        >
          <span
            style={{
              width: 7,
              height: 7,
              borderRadius: "50%",
              background: sc.color,
              boxShadow: `0 0 3px ${sc.color}55`,
              flexShrink: 0,
              animation:
                status === "connected" || status === "reconnecting"
                  ? "blink 1.5s infinite"
                  : "none",
            }}
          />
          {statusLabel}
          {status === "reconnecting" &&
            reconnectCountdown > 0 &&
            ` (${reconnectCountdown}s)`}
        </div>

        {/* FPS */}
        <div
          style={{
            fontSize: "0.65rem",
            fontFamily: "monospace",
            color: "#f0faff",
            opacity: 0.7,
            fontWeight: 500,
            textShadow: "0 1px 2px rgba(0,0,0,0.8)",
            whiteSpace: "nowrap",
            minWidth: "4rem",
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
            background: "rgba(255,60,60,0.08)",
            border: "none",
            borderBottom: "1px solid rgba(255,60,60,0.3)",
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
            padding: 16,
            gap: 12,
          }}
          data-ocid="viewer.canvas_target"
        >
          {/* Canvas container */}
          <div
            style={{
              position: "relative",
              lineHeight: 0,
              border: "1px solid rgba(0, 240, 255, 0.18)",
              borderRadius: 4,
              boxShadow: "0 0 4px rgba(0,240,255,0.12)",
              overflow: "auto",
              maxWidth: "100%",
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
              ref={starsCanvasRef}
              width={canvasW}
              height={canvasH}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                pointerEvents: "none",
                maxWidth: "100%",
                display: THEMES[theme]?.stars ? "block" : "none",
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
                color: "rgba(0,240,255,0.35)",
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
              { text: "F4HWN v5.2.0+", color: "#f0c040" },
              { text: "HTTPS required", color: "#888" },
            ].map((w) => (
              <span
                key={w.text}
                style={{
                  fontSize: "0.65rem",
                  fontWeight: 600,
                  color: w.color,
                  padding: "2px 8px",
                  border: `1px solid ${w.color}44`,
                  borderRadius: 999,
                  background: `${w.color}0a`,
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
              width: model === "UV-K1 V3" ? 260 : 200,
              background:
                "linear-gradient(to bottom right, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 100%), rgba(10, 10, 20, 0.32)",
              backdropFilter: "blur(14px) saturate(160%) brightness(112%)",
              borderLeft: "1px solid rgba(0, 240, 255, 0.22)",
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
                fontSize: "0.65rem",
                fontWeight: 800,
                letterSpacing: "0.15em",
                color: "rgba(0,240,255,0.5)",
                textAlign: "center",
              }}
            >
              {lang === "fr" ? "CLAVIER RADIO" : "RADIO KEYPAD"}
            </div>
            {/* Model label with indicator */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 6,
                fontSize: "0.62rem",
                fontFamily: "monospace",
                color: "rgba(0,240,255,0.6)",
                background: "rgba(0,240,255,0.06)",
                border: "1px solid rgba(0,240,255,0.2)",
                borderRadius: 6,
                padding: "3px 8px",
              }}
            >
              <span
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  background: "#00f0ff",
                  display: "inline-block",
                  flexShrink: 0,
                }}
              />
              {model}
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
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
                    />
                  ))}
                </div>
              ))}
            </div>

            {/* ── Side Buttons (PF1 / PF2 / PF3) ──────────────────────────────── */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 6,
                marginTop: 4,
              }}
            >
              {/* Top row: SIDE1 (PF1) + SIDE2 (PF2) */}
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                {(["SIDE1", "SIDE2"] as const).map((sid) => (
                  <SideBtn
                    key={sid}
                    keyId={sid}
                    label={sid === "SIDE1" ? "PF1" : "PF2"}
                    disabled={!isConnected}
                    onSendKey={sendKey}
                  />
                ))}
              </div>
              {/* Bottom row: SIDE3 (PF3) */}
              <div>
                <SideBtn
                  keyId="SIDE3"
                  label="PF3"
                  disabled={!isConnected}
                  onSendKey={sendKey}
                  small
                />
              </div>
            </div>

            <div
              style={{
                fontSize: "0.6rem",
                textAlign: "center",
                color: "rgba(255,255,255,0.25)",
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
            background: "rgba(0,0,0,0.75)",
            backdropFilter: "blur(6px)",
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
              background: "rgba(10, 10, 20, 0.92)",
              backdropFilter: "blur(14px) saturate(160%) brightness(112%)",
              border: "1px solid rgba(0, 240, 255, 0.22)",
              borderRadius: 12,
              padding: 24,
              maxWidth: 560,
              width: "100%",
              maxHeight: "85vh",
              overflowY: "auto",
              color: "#f0faff",
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
              style={{
                position: "absolute",
                top: 12,
                right: 12,
                background: "none",
                border: "1px solid rgba(255,255,255,0.15)",
                color: "#888",
                borderRadius: "50%",
                width: 28,
                height: 28,
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
                color: "#00f0ff",
                fontSize: "1rem",
                fontWeight: 800,
                marginBottom: 16,
                marginTop: 0,
                paddingRight: 32,
              }}
            >
              How to Use the UV-K5 / UV-K1 Viewer
            </h2>

            <h3
              style={{
                color: "rgba(0,240,255,0.7)",
                fontSize: "0.75rem",
                fontWeight: 700,
                letterSpacing: "0.1em",
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
                marginBottom: 20,
                display: "flex",
                flexDirection: "column",
                gap: 8,
              }}
            >
              {[
                <span key="1">
                  Flash{" "}
                  <strong style={{ color: "#00f0ff" }}>
                    F4HWN Fusion v5.2.0
                  </strong>{" "}
                  firmware on your radio
                </span>,
                <span key="2">
                  Connect USB cable — UV-K5: 2-pin Kenwood cable | UV-K1: direct
                  USB-C
                </span>,
                <span key="3">
                  Select your model (<strong>UV-K5</strong> or{" "}
                  <strong>UV-K1 V3</strong>) in the top bar
                </span>,
                <span key="4">
                  Click <strong style={{ color: "#00f0ff" }}>Connect</strong>{" "}
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
                    lineHeight: 1.5,
                    color: "#c0c0c0",
                  }}
                >
                  {step}
                </li>
              ))}
            </ol>

            <h3
              style={{
                color: "rgba(255,100,100,0.8)",
                fontSize: "0.75rem",
                fontWeight: 700,
                letterSpacing: "0.1em",
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
                gap: 6,
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
                    lineHeight: 1.5,
                    color: "#a0a0a0",
                  }}
                >
                  {tip}
                </li>
              ))}
            </ul>

            <div
              style={{
                marginTop: 20,
                padding: "10px 14px",
                background: "rgba(0,240,255,0.04)",
                border: "1px solid rgba(0,240,255,0.12)",
                borderRadius: 8,
                fontSize: "0.72rem",
                color: "rgba(0,240,255,0.6)",
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
          background: "rgba(10, 10, 20, 0.5)",
          borderTop: "1px solid rgba(0, 240, 255, 0.15)",
          padding: "6px 16px",
          display: "flex",
          alignItems: "center",
          gap: 16,
          fontSize: "0.65rem",
          color: "rgba(224, 247, 255, 0.4)",
          flexShrink: 0,
          flexWrap: "wrap",
        }}
      >
        <span style={{ color: "rgba(0,240,255,0.3)", fontWeight: 700 }}>
          HamWaves
        </span>
        <span>UV-K5 / UV-K1 V3 Standalone Viewer</span>
        <a
          href="/equipment-reviews/uv-k5-live-mirror"
          style={{ color: "rgba(0,240,255,0.4)", textDecoration: "none" }}
        >
          Full guide ↗
        </a>
        <a
          href="https://github.com/armel/uv-k1-k5v3-firmware-custom"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "rgba(168,85,247,0.4)", textDecoration: "none" }}
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
