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
type ThemeName = "Grey" | "Orange" | "Blue" | "White" | "Invert";
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
};

const KEY_CODES: Record<string, number> = {
  PTT: 0x01,
  MENU: 0x02,
  UP: 0x03,
  DOWN: 0x04,
  LEFT: 0x05,
  RIGHT: 0x06,
  EXIT: 0x07,
  F1: 0x08,
  F2: 0x09,
  "0": 0x0a,
  "1": 0x0b,
  "2": 0x0c,
  "3": 0x0d,
  "4": 0x0e,
  "5": 0x0f,
  "6": 0x10,
  "7": 0x11,
  "8": 0x12,
  "9": 0x13,
  "*": 0x14,
  "#": 0x15,
  "A/B": 0x16,
  CALL: 0x17,
};

const KEY_LABELS_EN: Record<string, string> = {
  PTT: "PTT",
  MENU: "MENU",
  EXIT: "EXIT",
  UP: "▲",
  DOWN: "▼",
  LEFT: "◄",
  RIGHT: "►",
  F1: "F1",
  F2: "F2",
  "A/B": "A/B",
  CALL: "CALL",
};

const KEY_LABELS_FR: Record<string, string> = {
  PTT: "PTT",
  MENU: "MENU",
  EXIT: "RET",
  UP: "▲",
  DOWN: "▼",
  LEFT: "◄",
  RIGHT: "►",
  F1: "F1",
  F2: "F2",
  "A/B": "A/B",
  CALL: "APPEL",
};

const KEYPAD_ROWS = [
  [{ id: "PTT", span: 3 }],
  [{ id: "F1" }, { id: "UP" }, { id: "F2" }],
  [{ id: "LEFT" }, { id: "MENU" }, { id: "RIGHT" }],
  [{ id: "A/B" }, { id: "DOWN" }, { id: "EXIT" }],
  [{ id: "1" }, { id: "2" }, { id: "3" }],
  [{ id: "4" }, { id: "5" }, { id: "6" }],
  [{ id: "7" }, { id: "8" }, { id: "9" }],
  [{ id: "*" }, { id: "0" }, { id: "#" }],
] as Array<Array<{ id: string; span?: number }>>;

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
    label: "Sending key...",
    color: "#00f0ff",
    frLabel: "Envoi touche...",
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
  error: { label: "Error", color: "#ff4444", frLabel: "Erreur" },
};

// ── KeypadBtn ─────────────────────────────────────────────────────────────────
interface KeypadBtnProps {
  keyId: string;
  span?: number;
  lang: Lang;
  disabled: boolean;
  onSendKey: (keyId: string, isLong: boolean) => void;
}

function KeypadBtn({ keyId, span, lang, disabled, onSendKey }: KeypadBtnProps) {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const longFiredRef = useRef(false);
  const [pressed, setPressed] = useState(false);
  const labels = lang === "fr" ? KEY_LABELS_FR : KEY_LABELS_EN;
  const displayLabel = labels[keyId] ?? keyId;
  const isPTT = keyId === "PTT";
  const isNav = ["UP", "DOWN", "LEFT", "RIGHT"].includes(keyId);
  const isAccent = ["MENU", "EXIT", "F1", "F2"].includes(keyId);
  const isDigit = /^[0-9*#]$/.test(keyId);

  const handlePointerDown = () => {
    if (disabled) return;
    setPressed(true);
    longFiredRef.current = false;
    timerRef.current = setTimeout(() => {
      longFiredRef.current = true;
      onSendKey(keyId, true);
    }, 500);
  };
  const handlePointerUp = () => {
    setPressed(false);
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    if (!longFiredRef.current && !disabled) onSendKey(keyId, false);
  };
  const handlePointerLeave = () => {
    setPressed(false);
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  let baseStyle =
    "select-none rounded border text-xs font-bold tracking-wider transition-all duration-150 cursor-pointer flex items-center justify-center ";
  if (isPTT)
    baseStyle +=
      "py-2 border-orange-500/60 bg-orange-900/40 text-orange-300 hover:border-orange-400 hover:shadow-[0_0_10px_rgba(249,115,22,0.4)] ";
  else if (isAccent)
    baseStyle +=
      "py-1.5 border-[#00f0ff44] bg-[#0a1628] text-[#00f0ff] hover:border-[#00f0ff] hover:shadow-[0_0_8px_#00f0ff55] ";
  else if (isNav)
    baseStyle +=
      "py-1.5 border-[#a855f733] bg-[#0a0f1e] text-[#a855f7] hover:border-[#a855f7] hover:shadow-[0_0_8px_#a855f755] ";
  else if (isDigit)
    baseStyle +=
      "py-1.5 border-[#ffffff18] bg-[#0d1117] text-[#aaa] hover:border-[#ffffff44] hover:text-white ";
  else
    baseStyle +=
      "py-1.5 border-[#00f0ff33] bg-[#0a1628] text-[#00f0ff99] hover:border-[#00f0ff88] ";
  if (pressed) baseStyle += "brightness-75 scale-95 ";
  if (disabled) baseStyle += "opacity-40 cursor-not-allowed ";

  return (
    <button
      type="button"
      className={baseStyle}
      style={span ? { gridColumn: `span ${span}` } : {}}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerLeave}
      disabled={disabled}
      aria-label={`Key ${keyId}`}
    >
      {displayLabel}
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

  const W = 128;
  const H = 64;
  const BAUD = 38400;

  // ── Override manifest + register viewer SW ──────────────────────────────
  useEffect(() => {
    // Swap manifest to viewer-specific one
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

    // Update theme-color
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

    // Register viewer service worker
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/viewer-sw.js").catch(() => {});
      navigator.serviceWorker.addEventListener("message", (e) => {
        if (e.data?.type === "VIEWER_PWA_INSTALLED") {
          setShowInstalledToast(true);
          setTimeout(() => setShowInstalledToast(false), 4000);
        }
      });
    }

    // Install prompt
    const handler = (e: Event) => {
      e.preventDefault();
      setInstallPrompt(e);
    };
    window.addEventListener("beforeinstallprompt", handler);

    // Detect standalone/PWA mode
    const checkPWA = () => {
      const standalone =
        window.matchMedia("(display-mode: standalone)").matches ||
        (window.navigator as unknown as { standalone?: boolean }).standalone ===
          true;
      setIsPWA(standalone);
    };
    checkPWA();

    // appinstalled event
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

  const setStatusSafe = useCallback((s: Status) => {
    statusRef.current = s;
    setStatus(s);
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
      if (!writerRef.current || statusRef.current !== "connected") return;
      const code = KEY_CODES[keyId];
      if (code === undefined) return;
      const typeB = isLong ? 0x81 : 0x01;
      try {
        setStatusSafe("sending");
        await writerRef.current.write(
          new Uint8Array([0xaa, 0x55, typeB, code]),
        );
        setTimeout(() => {
          if (statusRef.current === "sending") setStatusSafe("connected");
        }, 400);
      } catch {
        setStatusSafe("connection_lost");
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

  return (
    <div
      style={{
        background: "#0a0a0a",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        fontFamily: "Inter, system-ui, sans-serif",
        color: "#e0e0e0",
        overflow: "hidden",
      }}
      data-ocid="viewer.page"
    >
      <style>{`
        @keyframes blink { 0%,100% { opacity: 1; } 50% { opacity: 0.3; } }
        @keyframes neonPulse { 0%,100% { box-shadow: 0 0 10px #00f0ff55; } 50% { box-shadow: 0 0 20px #00f0ffaa, 0 0 40px #00f0ff44; } }
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
            boxShadow: "0 0 32px rgba(0,240,255,0.4)",
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
          background: "#080d15",
          borderBottom: "1px solid rgba(0,240,255,0.15)",
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
            border: `1px solid ${isConnected ? "rgba(0,240,255,0.3)" : "#00f0ff"}`,
            color: isConnected ? "rgba(0,240,255,0.5)" : "#00f0ff",
            background: isConnected
              ? "rgba(0,240,255,0.05)"
              : "rgba(0,240,255,0.1)",
            boxShadow: isConnected ? "none" : "0 0 10px rgba(0,240,255,0.3)",
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
            border: `1px solid ${showKeypad ? "#00f0ff" : "rgba(0,240,255,0.2)"}`,
            color: showKeypad ? "#00f0ff" : "rgba(0,240,255,0.5)",
            background: showKeypad ? "rgba(0,240,255,0.1)" : "transparent",
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
            border: "1px solid rgba(0,240,255,0.2)",
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
                color: lang === l ? "#00f0ff" : "#555",
                border: "none",
              }}
            >
              {l.toUpperCase()}
            </button>
          ))}
        </div>

        {/* Theme */}
        <div
          style={{
            display: "flex",
            borderRadius: 8,
            overflow: "hidden",
            border: "1px solid rgba(0,240,255,0.2)",
          }}
        >
          {(Object.keys(THEMES) as ThemeName[]).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTheme(t)}
              style={{
                padding: "6px 8px",
                fontSize: "0.65rem",
                fontWeight: 600,
                cursor: "pointer",
                background:
                  theme === t ? "rgba(0,240,255,0.15)" : "transparent",
                color: theme === t ? "#00f0ff" : "#555",
                border: "none",
              }}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Model */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "6px 10px",
            borderRadius: 8,
            border: "1px solid rgba(0,240,255,0.2)",
            background: "rgba(0,240,255,0.03)",
          }}
          data-ocid="viewer.model.radio"
        >
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
                style={{ accentColor: "#00f0ff" }}
              />
              <span
                style={{
                  fontSize: "0.7rem",
                  fontWeight: 600,
                  color: model === m ? "#00f0ff" : "#666",
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
            style={{
              width: 28,
              height: 28,
              borderRadius: 8,
              border: "1px solid rgba(0,240,255,0.2)",
              color: "#00f0ff",
              background: "transparent",
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
              border: "1px solid rgba(0,240,255,0.2)",
              color: "#00f0ff",
              background: "transparent",
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
            border: "1px solid rgba(168,85,247,0.4)",
            color: "#a855f7",
            background: "rgba(168,85,247,0.06)",
            fontSize: "0.75rem",
            fontWeight: 600,
            cursor: "pointer",
          }}
          data-ocid="viewer.screenshot_button"
        >
          <Camera size={12} />
          {lang === "fr" ? "Capture" : "Screenshot"}
        </button>

        {/* Installed as App badge – shown when running as PWA */}
        {isPWA && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              padding: "6px 12px",
              borderRadius: 8,
              border: "1px solid rgba(0,240,255,0.6)",
              color: "#00f0ff",
              background: "rgba(0,240,255,0.08)",
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
              border: "1px solid #00f0ff",
              color: "#00f0ff",
              background: "rgba(0,240,255,0.1)",
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
            border: `1px solid ${sc.color}33`,
            color: sc.color,
            background: `${sc.color}11`,
            fontSize: "0.7rem",
            fontFamily: "monospace",
            whiteSpace: "nowrap",
          }}
          data-ocid="viewer.status_panel"
        >
          <span
            style={{
              width: 7,
              height: 7,
              borderRadius: "50%",
              background: sc.color,
              boxShadow: `0 0 5px ${sc.color}`,
              flexShrink: 0,
              animation:
                status === "connected" || status === "reconnecting"
                  ? "blink 1.5s infinite"
                  : "none",
            }}
          />
          {lang === "fr" ? sc.frLabel : sc.label}
          {status === "reconnecting" &&
            reconnectCountdown > 0 &&
            ` (${reconnectCountdown}s)`}
        </div>

        {/* FPS */}
        <div
          style={{
            fontSize: "0.65rem",
            fontFamily: "monospace",
            color: "rgba(0,240,255,0.4)",
            whiteSpace: "nowrap",
          }}
        >
          {fps} FPS
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
              border: THEMES[theme].glow
                ? "1px solid rgba(0,200,255,0.4)"
                : "1px solid rgba(0,240,255,0.15)",
              borderRadius: 4,
              boxShadow: THEMES[theme].glow
                ? "0 0 40px 10px rgba(0,100,200,0.35), 0 0 80px 20px rgba(0,60,140,0.15), inset 0 0 20px rgba(0,100,200,0.1)"
                : "0 0 20px rgba(0,0,0,0.5)",
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
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            style={{
              width: 200,
              background: "rgba(8,13,21,0.95)",
              borderLeft: "1px solid rgba(0,240,255,0.15)",
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
            <div
              style={{
                fontSize: "0.6rem",
                textAlign: "center",
                fontFamily: "monospace",
                color: "rgba(255,255,255,0.2)",
              }}
            >
              {model}
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
              {KEYPAD_ROWS.map((row) => (
                <div
                  key={row.map((r) => r.id).join("-")}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(3, 1fr)",
                    gap: 5,
                  }}
                >
                  {row.map(({ id, span }) => (
                    <KeypadBtn
                      key={id}
                      keyId={id}
                      span={span}
                      lang={lang}
                      disabled={!isConnected}
                      onSendKey={sendKey}
                    />
                  ))}
                </div>
              ))}
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

      {/* ── Footer bar ──────────────────────────────────────────────────── */}
      <div
        style={{
          background: "#080d15",
          borderTop: "1px solid rgba(0,240,255,0.08)",
          padding: "6px 16px",
          display: "flex",
          alignItems: "center",
          gap: 16,
          fontSize: "0.65rem",
          color: "#444",
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
