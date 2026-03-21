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

import { Link } from "@tanstack/react-router";
import {
  AlertTriangle,
  Camera,
  ChevronLeft,
  ExternalLink,
  Github,
  Keyboard,
  Minus,
  Plus,
  Radio,
  RefreshCw,
  Usb,
  Wifi,
  WifiOff,
  ZapOff,
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
  gradient?: [string, string]; // [top, bottom] for LCD gradient
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

// F4HWN Fusion v5.2.0 key codes (approximate from K5Viewer source)
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
    label: "Connected – F4HWN v5.2.0",
    color: "#00ff88",
    frLabel: "Connecté – F4HWN v5.2.0",
  },
  sending: {
    label: "Sending key...",
    color: "#00f0ff",
    frLabel: "Envoi touche...",
  },
  connection_lost: {
    label: "Connection lost – retry?",
    color: "#ff4444",
    frLabel: "Connexion perdue – réessayer ?",
  },
  reconnecting: {
    label: "Reconnecting...",
    color: "#f0c040",
    frLabel: "Reconnexion...",
  },
  error: {
    label: "Incompatible firmware",
    color: "#ff4444",
    frLabel: "Firmware incompatible",
  },
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
    if (!longFiredRef.current && !disabled) {
      onSendKey(keyId, false);
    }
  };

  const handlePointerLeave = () => {
    setPressed(false);
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  let baseStyle =
    "select-none rounded-md border text-sm font-bold tracking-wider transition-all duration-150 cursor-pointer flex items-center justify-center ";

  if (isPTT) {
    baseStyle +=
      "py-3 text-base border-orange-500/60 bg-orange-900/40 text-orange-300 hover:border-orange-400 hover:shadow-[0_0_12px_rgba(249,115,22,0.5)] ";
  } else if (isAccent) {
    baseStyle +=
      "py-2 border-[#00f0ff44] bg-[#0a1628] text-[#00f0ff] hover:border-[#00f0ff] hover:shadow-[0_0_10px_#00f0ff55] ";
  } else if (isNav) {
    baseStyle +=
      "py-2 border-[#a855f733] bg-[#0a0f1e] text-[#a855f7] hover:border-[#a855f7] hover:shadow-[0_0_10px_#a855f755] ";
  } else if (isDigit) {
    baseStyle +=
      "py-2 border-[#ffffff18] bg-[#0d1117] text-[#aaa] hover:border-[#ffffff44] hover:text-white ";
  } else {
    baseStyle +=
      "py-2 border-[#00f0ff33] bg-[#0a1628] text-[#00f0ff99] hover:border-[#00f0ff88] ";
  }

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

// ── Main Component ─────────────────────────────────────────────────────────────
export default function UVK5LiveMirror() {
  const [status, setStatus] = useState<Status>("ready");
  const [theme, setTheme] = useState<ThemeName>("Blue");
  const [model, setModel] = useState<ModelName>("UV-K5");
  const [lang, setLang] = useState<Lang>("en");
  const [scale, setScale] = useState(10);
  const [showKeypad, setShowKeypad] = useState(true);
  const [showHelp, setShowHelp] = useState(false);
  const [fps, setFps] = useState(0);
  const [reconnectCountdown, setReconnectCountdown] = useState(0);
  const [errorMsg, setErrorMsg] = useState("");
  const [installPrompt, setInstallPrompt] = useState<Event | null>(null);
  const [_swRegistered, setSwRegistered] = useState(false);

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

  // Keep statusRef in sync so async callbacks can read latest value
  const setStatusSafe = useCallback((s: Status) => {
    statusRef.current = s;
    setStatus(s);
  }, []);

  // ── Render Frame ──────────────────────────────────────────────────────────
  const renderFrame = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const t = THEMES[theme];
    const pw = scale;
    const cw = W * pw;
    const ch = H * pw;

    // Background: gradient for Blue theme, flat otherwise
    if (t.gradient) {
      const grad = ctx.createLinearGradient(0, 0, 0, ch);
      grad.addColorStop(0, t.gradient[0]);
      grad.addColorStop(1, t.gradient[1]);
      ctx.fillStyle = grad;
    } else {
      ctx.fillStyle = t.bg;
    }
    ctx.fillRect(0, 0, cw, ch);

    // Pixels – no mirror, no flip. Exact left-to-right, top-to-bottom like physical radio LCD.
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.translate(0, 0);
    ctx.scale(1, 1);
    ctx.fillStyle = t.fg;
    const fb = framebufferRef.current;
    for (let y = 0; y < 64; y++) {
      for (let x = 0; x < 128; x++) {
        const bitIndex = y * 128 + x;
        const byteIdx = Math.floor(bitIndex / 8);
        const bitPos = bitIndex % 8; // LSB-first, matches Python K5Viewer get_bit()
        if (fb[byteIdx] & (1 << bitPos)) {
          ctx.fillRect(x * pw, y * pw, pw - 1, pw - 1);
        }
      }
    }

    frameCountRef.current++;
  }, [theme, scale]);

  // ── Draw Scanlines (opacity 0.08) ─────────────────────────────────────────
  // Clear stale flip preferences so permanent orientation fix always applies
  // ── PWA: Service Worker + Install Prompt ─────────────────────────────────
  useEffect(() => {
    // Register service worker
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js")
        .then(() => setSwRegistered(true))
        .catch(() => {});
    }
    // Listen for PWA install prompt
    const handler = (e: Event) => {
      e.preventDefault();
      setInstallPrompt(e);
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

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

  // ── FPS Counter ───────────────────────────────────────────────────────────
  useEffect(() => {
    fpsTimerRef.current = setInterval(() => {
      setFps(frameCountRef.current);
      frameCountRef.current = 0;
    }, 1000);
    return () => {
      if (fpsTimerRef.current) clearInterval(fpsTimerRef.current);
    };
  }, []);

  // Re-render on theme/scale change
  useEffect(() => {
    renderFrame();
  }, [renderFrame]);

  // ── Keepalive ─────────────────────────────────────────────────────────────
  const startKeepalive = useCallback(() => {
    if (keepaliveTimerRef.current) clearInterval(keepaliveTimerRef.current);
    keepaliveTimerRef.current = setInterval(async () => {
      if (writerRef.current && statusRef.current === "connected") {
        try {
          // F4HWN keepalive: 55 AA 00 00
          await writerRef.current.write(
            new Uint8Array([0x55, 0xaa, 0x00, 0x00]),
          );
        } catch {
          // ignore keepalive write errors
        }
      }
    }, 1000);
  }, []);

  const stopKeepalive = useCallback(() => {
    if (keepaliveTimerRef.current) {
      clearInterval(keepaliveTimerRef.current);
      keepaliveTimerRef.current = null;
    }
  }, []);

  // ── Serial Read Loop ──────────────────────────────────────────────────────
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
        // Sync to AA 55 header
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
          // Full 1024-byte framebuffer
          const frameData = await readBytes(Math.min(size, 1024));
          framebufferRef.current.set(frameData);
          renderFrame();
        } else if (type === 0x02) {
          // Diff blocks: each block = 1-byte index + 8 bytes data
          const blockCount = Math.floor(size / 9);
          for (let i = 0; i < blockCount; i++) {
            const [idx] = await readBytes(1);
            const data = await readBytes(8);
            framebufferRef.current.set(data, idx * 8);
          }
          renderFrame();
        }
        // Ignore unknown types gracefully
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
          const reader = portRef.current.readable.getReader();
          readerRef.current = reader;
          const writer = portRef.current.writable.getWriter();
          writerRef.current = writer;
          setStatusSafe("connected");
          startKeepalive();
          readLoop();
        } else {
          scheduleReconnect();
        }
      } catch {
        scheduleReconnect();
      }
    }, 3000);
  }, [readLoop, startKeepalive, setStatusSafe]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Connect ───────────────────────────────────────────────────────────────
  const connect = useCallback(async () => {
    if (!("serial" in navigator)) {
      setStatusSafe("error");
      setErrorMsg(
        "Web Serial not supported. Use Chrome or Edge browser over HTTPS.",
      );
      return;
    }
    setErrorMsg("");
    try {
      setStatusSafe("connecting");
      const port = await navigator.serial.requestPort();
      await port.open({ baudRate: BAUD });
      portRef.current = port;

      const writer = port.writable.getWriter();
      writerRef.current = writer;

      const reader = port.readable.getReader();
      readerRef.current = reader;

      reconnectAttemptsRef.current = 0;
      setStatusSafe("connected");
      startKeepalive();
      readLoop();
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      if (msg.toLowerCase().includes("no port")) {
        setErrorMsg("No port selected. Please choose a serial port.");
      } else if (msg.toLowerCase().includes("permission")) {
        setErrorMsg(
          "Permission denied. Allow serial port access in browser settings.",
        );
      } else {
        setErrorMsg(`Connection failed: ${msg}`);
      }
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
      // F4HWN key packet: AA 55 [01=short|81=long] [keycode]
      const typeB = isLong ? 0x81 : 0x01;
      const packet = new Uint8Array([0xaa, 0x55, typeB, code]);
      try {
        setStatusSafe("sending");
        await writerRef.current.write(packet);
        setTimeout(() => {
          if (statusRef.current === "sending") setStatusSafe("connected");
        }, 400);
      } catch {
        setStatusSafe("connection_lost");
        stopKeepalive();
        scheduleReconnect();
      }
    },
    [setStatusSafe, stopKeepalive, scheduleReconnect], // eslint-disable-line react-hooks/exhaustive-deps
  );

  // ── Screenshot ────────────────────────────────────────────────────────────
  const takeScreenshot = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement("a");
    link.download = `uvk5-mirror-${model.replace(" ", "-")}-${Date.now()}.png`;
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
      className="min-h-screen"
      style={{
        background: "#0a0a0a",
        color: "#e0e0e0",
        fontFamily: "Inter, sans-serif",
      }}
    >
      <title>
        UV-K5 &amp; UV-K1 V3 Live Mirror + Remote Control – F4HWN Fusion v5.2.0
        Browser Viewer | HamWaves
      </title>
      <meta
        name="description"
        content="Real-time LCD mirror and remote keypad control for Quansheng UV-K5 / UV-K1 V3 using WebSerial + F4HWN Fusion v5.2.0 – elite emulation, USB-C support."
      />

      {/* Navbar Spacer */}
      <div className="pt-24" />

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="px-4 md:px-8 max-w-7xl mx-auto mb-8">
        <Link
          to="/equipment-reviews"
          className="inline-flex items-center gap-2 text-sm mb-6 transition-colors hover:opacity-80"
          style={{ color: "#00f0ff" }}
          data-ocid="mirror.back_link"
        >
          <ChevronLeft size={16} />
          Back to All Reviews
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1
            className="text-3xl md:text-5xl font-black mb-4 leading-tight"
            style={{
              WebkitTextStroke: "1px #00f0ff",
              color: "transparent",
              letterSpacing: "-0.02em",
            }}
          >
            UV-K5 &amp; UV-K1 V3 – Elite Live Mirror
            <br />
            <span style={{ WebkitTextStroke: "1px #a855f7" }}>
              + Remote Control (F4HWN Fusion v5.2.0)
            </span>
          </h1>
          <p
            className="text-base md:text-lg mb-6 max-w-3xl"
            style={{ color: "#aaa" }}
          >
            Mirror and remotely control your UV-K5 or UV-K1 V3 LCD in the
            browser – live display + virtual keypad. F4HWN Fusion v5.2.0
            compatible, USB-C support, no app needed!
          </p>

          {/* Warning badges */}
          <div className="flex flex-wrap gap-3 mb-2">
            {[
              {
                icon: <AlertTriangle size={14} />,
                text: "Chrome / Edge only – Web Serial API",
              },
              {
                icon: <Radio size={14} />,
                text: "F4HWN Fusion v5.2.0+ required",
              },
              {
                icon: <ZapOff size={14} />,
                text: "No config written – key emulation only",
              },
              {
                icon: <Usb size={14} />,
                text: "UV-K5 (Kenwood 2-pin cable) · UV-K1 V3 (direct USB-C – no adapter)",
              },
            ].map((w) => (
              <span
                key={w.text}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold border"
                style={{
                  background: "rgba(255,140,0,0.08)",
                  borderColor: "rgba(255,140,0,0.4)",
                  color: "#f0c040",
                }}
              >
                {w.icon} {w.text}
              </span>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ── Setup Instructions ────────────────────────────────────────────── */}
      <section className="px-4 md:px-8 max-w-7xl mx-auto mb-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="rounded-xl p-5 border"
          style={{
            background: "rgba(10,20,40,0.7)",
            backdropFilter: "blur(12px)",
            borderColor: "rgba(0,240,255,0.15)",
          }}
        >
          <h2 className="text-base font-bold mb-4" style={{ color: "#00f0ff" }}>
            {lang === "fr" ? "Configuration rapide" : "Quick Setup"}
          </h2>
          <ol className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {(lang === "fr"
              ? [
                  "Flashez F4HWN Fusion v5.2.0 sur votre UV-K5 ou UV-K1 V3",
                  "UV-K5 : câble USB Kenwood 2 broches. UV-K1 V3 : câble USB-C direct (pas d'adaptateur)",
                  "Ouvrez cette page dans Chrome ou Edge (HTTPS requis)",
                  "Sélectionnez votre modèle (UV-K5 ou UV-K1 V3) dans la barre",
                  "Cliquez sur Connecter et choisissez le port série",
                  "L'écran se miroir en direct – utilisez le clavier pour contrôler la radio",
                ]
              : [
                  "Flash F4HWN Fusion v5.2.0 firmware to your UV-K5 or UV-K1 V3",
                  "UV-K5: use 2-pin Kenwood USB cable. UV-K1 V3: direct USB-C data cable – no adapter needed",
                  "Open in Chrome or Edge over HTTPS (Web Serial API required)",
                  "Select your model (UV-K5 or UV-K1 V3) in the control bar",
                  "Click Connect and select your radio's serial port",
                  "Radio LCD mirrors live – use the keypad to remotely control your radio",
                ]
            ).map((step, i) => (
              <li
                key={step}
                className="flex items-start gap-3 text-sm"
                style={{ color: "#ccc" }}
              >
                <span
                  className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold mt-0.5"
                  style={{
                    background: "rgba(0,240,255,0.15)",
                    color: "#00f0ff",
                    border: "1px solid rgba(0,240,255,0.3)",
                  }}
                >
                  {i + 1}
                </span>
                {step}
              </li>
            ))}
          </ol>
        </motion.div>
      </section>

      {/* ── Error message ─────────────────────────────────────────────────── */}
      {errorMsg && (
        <section className="px-4 md:px-8 max-w-7xl mx-auto mb-4">
          <div
            className="rounded-xl px-5 py-3 border text-sm flex items-center gap-3"
            style={{
              background: "rgba(255,60,60,0.08)",
              borderColor: "rgba(255,60,60,0.4)",
              color: "#ff8080",
            }}
            data-ocid="mirror.error_state"
          >
            <AlertTriangle size={16} />
            {errorMsg}
          </div>
        </section>
      )}

      {/* ── Viewer Area ──────────────────────────────────────────────────── */}
      <section
        className="px-2 md:px-8 max-w-7xl mx-auto mb-10"
        style={{
          background: "#090e1a",
          borderRadius: 16,
          padding: 20,
          border: "1px solid rgba(0,240,255,0.1)",
        }}
      >
        {/* ── Control Bar ─────────────────────────────────────────────────── */}
        <div
          className="flex flex-wrap items-center gap-2 p-3 rounded-xl mb-6 border"
          style={{
            background: "#0d1117",
            borderColor: "rgba(0,240,255,0.2)",
            backdropFilter: "blur(8px)",
          }}
        >
          {/* Logo */}
          <img
            src="/assets/uploads/gemini-2.5-flash-image_create_a_more_refined_version_of_the_image_provided_for_as_reference_does_not_ne-0-1--1.jpg"
            alt="HamWaves"
            style={{
              height: 32,
              width: 32,
              objectFit: "contain",
              borderRadius: 4,
              flexShrink: 0,
            }}
          />
          {/* Connect */}
          <button
            type="button"
            onClick={connect}
            disabled={
              isConnected ||
              status === "connecting" ||
              status === "reconnecting"
            }
            className="flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-semibold transition-all"
            style={{
              borderColor: isConnected ? "rgba(0,240,255,0.3)" : "#00f0ff",
              color: isConnected ? "rgba(0,240,255,0.5)" : "#00f0ff",
              background: isConnected
                ? "rgba(0,240,255,0.05)"
                : "rgba(0,240,255,0.1)",
              boxShadow: isConnected ? "none" : "0 0 12px rgba(0,240,255,0.3)",
            }}
            data-ocid="mirror.connect_button"
          >
            <Wifi size={14} />
            {lang === "fr" ? "Connecter" : "Connect"}
          </button>

          {/* Disconnect */}
          <button
            type="button"
            onClick={disconnect}
            disabled={!isConnected && status !== "reconnecting"}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-semibold transition-all"
            style={{
              borderColor: isConnected
                ? "rgba(255,80,80,0.7)"
                : "rgba(255,80,80,0.2)",
              color: isConnected ? "#ff6060" : "rgba(255,96,96,0.4)",
              background: "rgba(255,60,60,0.05)",
            }}
            data-ocid="mirror.disconnect_button"
          >
            <WifiOff size={14} />
            {lang === "fr" ? "Déconnecter" : "Disconnect"}
          </button>

          {/* Keypad Toggle */}
          <button
            type="button"
            onClick={() => setShowKeypad((p) => !p)}
            className="flex items-center gap-2 px-3 py-2 rounded-lg border text-sm font-semibold transition-all"
            style={{
              borderColor: showKeypad ? "#00f0ff" : "rgba(0,240,255,0.2)",
              color: showKeypad ? "#00f0ff" : "rgba(0,240,255,0.5)",
              background: showKeypad ? "rgba(0,240,255,0.1)" : "transparent",
            }}
            data-ocid="mirror.keypad_toggle"
          >
            <Keyboard size={14} />
            {lang === "fr" ? "Clavier" : "Keypad"}
          </button>

          {/* Help */}
          <button
            type="button"
            onClick={() => setShowHelp((p) => !p)}
            className="px-3 py-2 rounded-lg border text-sm font-semibold transition-all"
            style={{
              borderColor: showHelp ? "#a855f7" : "rgba(168,85,247,0.2)",
              color: showHelp ? "#a855f7" : "rgba(168,85,247,0.5)",
              background: showHelp ? "rgba(168,85,247,0.1)" : "transparent",
            }}
            data-ocid="mirror.help_toggle"
          >
            {lang === "fr" ? "Aide" : "Help"}
          </button>

          {/* Language */}
          <div
            className="flex rounded-lg overflow-hidden border"
            style={{ borderColor: "rgba(0,240,255,0.2)" }}
          >
            {(["en", "fr"] as Lang[]).map((l) => (
              <button
                key={l}
                type="button"
                onClick={() => setLang(l)}
                className="px-3 py-2 text-xs font-bold transition-all"
                style={{
                  background:
                    lang === l ? "rgba(0,240,255,0.15)" : "transparent",
                  color: lang === l ? "#00f0ff" : "#666",
                }}
              >
                {l.toUpperCase()}
              </button>
            ))}
          </div>

          {/* Theme */}
          <div
            className="flex rounded-lg overflow-hidden border"
            style={{ borderColor: "rgba(0,240,255,0.2)" }}
          >
            {(Object.keys(THEMES) as ThemeName[]).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTheme(t)}
                className="px-2.5 py-2 text-xs font-semibold transition-all"
                style={{
                  background:
                    theme === t ? "rgba(0,240,255,0.15)" : "transparent",
                  color: theme === t ? "#00f0ff" : "#666",
                }}
              >
                {t}
              </button>
            ))}
          </div>

          {/* Model */}
          <div
            className="flex items-center gap-3 px-3 py-2 rounded-lg border"
            style={{
              borderColor: "rgba(0,240,255,0.2)",
              background: "rgba(0,240,255,0.03)",
            }}
            data-ocid="mirror.model.radio"
          >
            {(["UV-K5", "UV-K1 V3"] as ModelName[]).map((m) => (
              <label
                key={m}
                className="flex items-center gap-1.5 cursor-pointer"
              >
                <input
                  type="radio"
                  name="model"
                  value={m}
                  checked={model === m}
                  onChange={() => setModel(m)}
                  className="accent-[#00f0ff]"
                />
                <span
                  className="text-xs font-semibold"
                  style={{ color: model === m ? "#00f0ff" : "#888" }}
                >
                  {m}
                </span>
              </label>
            ))}
          </div>

          {/* Zoom */}
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setScale((s) => Math.max(6, s - 1))}
              className="w-8 h-8 rounded-lg border flex items-center justify-center transition-all hover:border-[#00f0ff]"
              style={{ borderColor: "rgba(0,240,255,0.2)", color: "#00f0ff" }}
              data-ocid="mirror.zoom_out_button"
            >
              <Minus size={14} />
            </button>
            <span className="text-xs font-mono px-2" style={{ color: "#888" }}>
              {scale}×
            </span>
            <button
              type="button"
              onClick={() => setScale((s) => Math.min(16, s + 1))}
              className="w-8 h-8 rounded-lg border flex items-center justify-center transition-all hover:border-[#00f0ff]"
              style={{ borderColor: "rgba(0,240,255,0.2)", color: "#00f0ff" }}
              data-ocid="mirror.zoom_in_button"
            >
              <Plus size={14} />
            </button>
          </div>

          {/* Screenshot */}
          <button
            type="button"
            onClick={takeScreenshot}
            className="flex items-center gap-2 px-3 py-2 rounded-lg border text-sm font-semibold transition-all hover:shadow-[0_0_10px_#a855f755]"
            style={{
              borderColor: "rgba(168,85,247,0.4)",
              color: "#a855f7",
              background: "rgba(168,85,247,0.05)",
            }}
            data-ocid="mirror.screenshot_button"
          >
            <Camera size={14} />
            {lang === "fr" ? "Capture" : "Screenshot"}
          </button>

          {/* Install PWA button */}
          {installPrompt && (
            <button
              type="button"
              onClick={async () => {
                const prompt = installPrompt as BeforeInstallPromptEvent;
                prompt.prompt();
                await prompt.userChoice;
                setInstallPrompt(null);
              }}
              className="flex items-center gap-2 px-3 py-2 rounded-lg border text-sm font-semibold transition-all"
              style={{
                borderColor: "#00f0ff",
                color: "#00f0ff",
                background: "rgba(0,240,255,0.08)",
                boxShadow: "0 0 12px rgba(0,240,255,0.3)",
                animation: "neonPulse 2s infinite",
              }}
              data-ocid="mirror.install_button"
            >
              <span style={{ fontSize: "1rem" }}>⬇</span>
              Install as App
            </button>
          )}

          {/* Status badge – right side */}
          <div
            className="ml-auto flex items-center gap-2 px-3 py-2 rounded-lg border text-xs font-mono whitespace-nowrap"
            style={{
              borderColor: `${sc.color}33`,
              color: sc.color,
              background: `${sc.color}11`,
            }}
            data-ocid="mirror.status_panel"
          >
            <span
              className="w-2 h-2 rounded-full flex-shrink-0"
              style={{
                background: sc.color,
                boxShadow: `0 0 6px ${sc.color}`,
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
        </div>

        {/* Help panel */}
        {showHelp && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="rounded-xl p-4 border mb-6 text-sm"
            style={{
              background: "rgba(168,85,247,0.06)",
              borderColor: "rgba(168,85,247,0.3)",
              color: "#ccc",
            }}
          >
            <p className="font-bold mb-2" style={{ color: "#a855f7" }}>
              {lang === "fr" ? "Aide & Protocole" : "Help & Protocol"}
            </p>
            <ul className="space-y-1 list-disc list-inside">
              <li>
                <span style={{ color: "#00f0ff" }}>Baud:</span> {BAUD} (F4HWN
                Fusion v5.2.0)
              </li>
              <li>
                <span style={{ color: "#00f0ff" }}>Header:</span> AA 55
              </li>
              <li>
                <span style={{ color: "#00f0ff" }}>Type 01:</span> Full frame –
                1024 bytes
              </li>
              <li>
                <span style={{ color: "#00f0ff" }}>Type 02:</span> Diff –
                packets of (1-byte index + 8 bytes); size field = total bytes
              </li>
              <li>
                <span style={{ color: "#00f0ff" }}>Keepalive TX:</span> 55 AA 00
                00 every 1s
              </li>
              <li>
                <span style={{ color: "#00f0ff" }}>Key TX:</span> AA 55
                [01=short | 81=long] [keycode]
              </li>
              <li>
                <span style={{ color: "#00f0ff" }}>UV-K1 V3 cable:</span>
                direct USB-C data cable – no adapter needed
              </li>
            </ul>
          </motion.div>
        )}

        {/* ── Canvas + Keypad ──────────────────────────────────────────────── */}
        <div className="flex flex-col lg:flex-row gap-6 items-start justify-center">
          {/* LCD Canvas */}
          <div className="flex-1 flex flex-col items-center w-full">
            {/* FPS */}
            <div
              className="self-start mb-2 font-mono text-xs"
              style={{ color: "rgba(0,240,255,0.5)" }}
            >
              {fps} FPS
            </div>

            {/* Canvas container */}
            <div
              className="relative overflow-auto max-w-full"
              style={{
                border: THEMES[theme].glow
                  ? "1px solid rgba(0,200,255,0.4)"
                  : "1px solid rgba(0,240,255,0.15)",
                borderRadius: 4,
                boxShadow: THEMES[theme].glow
                  ? "0 0 40px 10px rgba(0,100,200,0.35), 0 0 80px 20px rgba(0,60,140,0.15), inset 0 0 20px rgba(0,100,200,0.1)"
                  : "0 0 20px rgba(0,0,0,0.5)",
                lineHeight: 0,
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
                data-ocid="mirror.canvas_target"
              />
              {/* Scanline overlay */}
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
                className="mt-4 text-center text-sm px-4"
                style={{ color: "rgba(0,240,255,0.4)" }}
              >
                {lang === "fr"
                  ? "Connectez votre radio pour voir l'écran LCD en direct"
                  : "Connect your radio to see the live LCD mirror"}
              </div>
            )}
          </div>

          {/* Keypad Panel */}
          {showKeypad && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="rounded-xl p-4 border flex-shrink-0"
              style={{
                width: 224,
                background: "rgba(10,20,40,0.85)",
                backdropFilter: "blur(14px)",
                borderColor: "rgba(0,240,255,0.25)",
                boxShadow: "0 0 24px rgba(0,240,255,0.06)",
              }}
            >
              <div
                className="text-xs font-bold mb-3 tracking-widest text-center"
                style={{ color: "rgba(0,240,255,0.6)" }}
              >
                {lang === "fr" ? "CLAVIER RADIO" : "RADIO KEYPAD"}
              </div>
              <div
                className="text-xs text-center mb-3 font-mono"
                style={{ color: "rgba(255,255,255,0.25)" }}
              >
                {model}
              </div>

              <div className="flex flex-col gap-1.5">
                {KEYPAD_ROWS.map((row) => (
                  <div
                    key={row.map((r) => r.id).join("-")}
                    className="grid gap-1.5"
                    style={{ gridTemplateColumns: "repeat(3, 1fr)" }}
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
                className="mt-3 text-center text-xs"
                style={{ color: "rgba(255,255,255,0.3)" }}
              >
                {lang === "fr"
                  ? "Clic = court · Maintenir = long"
                  : "Click = short · Hold = long press"}
              </div>
            </motion.div>
          )}
        </div>

        {/* Mobile OTG warning */}
        <div
          className="mt-4 text-center text-xs md:hidden"
          style={{ color: "rgba(255,200,0,0.6)" }}
        >
          <AlertTriangle size={12} className="inline mr-1" />
          USB OTG has limited Web Serial support on mobile. UV-K1 V3 USB-C is
          best tested on desktop.
        </div>
      </section>

      {/* ── Info / Warnings ──────────────────────────────────────────────── */}
      <section className="px-4 md:px-8 max-w-5xl mx-auto mb-12">
        <div className="grid md:grid-cols-2 gap-6">
          {/* Warnings */}
          <div
            className="rounded-xl p-5 border"
            style={{
              background: "rgba(10,20,40,0.6)",
              borderColor: "rgba(0,240,255,0.1)",
            }}
          >
            <h3 className="font-bold mb-4 text-sm" style={{ color: "#f0c040" }}>
              ⚠ {lang === "fr" ? "Avertissements" : "Warnings"}
            </h3>
            <ul className="space-y-3 text-sm" style={{ color: "#bbb" }}>
              {[
                "Chrome/Edge only. Web Serial not available in Firefox/Safari.",
                "RX/TX via remote control – transmit legally, ensure you are licensed.",
                "No radio config is written – key press emulation only.",
                "HTTPS required for Web Serial API.",
                "UV-K1 V3: use direct USB-C data cable. UV-K5: 2-pin Kenwood programming cable.",
              ].map((w) => (
                <li key={w} className="flex items-start gap-2">
                  <span style={{ color: "#f0c040" }}>▸</span>
                  {w}
                </li>
              ))}
            </ul>
          </div>

          {/* Protocol */}
          <div
            className="rounded-xl p-5 border"
            style={{
              background: "rgba(10,20,40,0.6)",
              borderColor: "rgba(0,240,255,0.1)",
            }}
          >
            <h3 className="font-bold mb-4 text-sm" style={{ color: "#00f0ff" }}>
              📡 F4HWN Fusion v5.2.0 Protocol
            </h3>
            <ul className="space-y-2 text-sm" style={{ color: "#bbb" }}>
              <li>
                <span style={{ color: "#00f0ff" }}>Baud:</span> {BAUD}
              </li>
              <li>
                <span style={{ color: "#00f0ff" }}>Header:</span> AA 55
              </li>
              <li>
                <span style={{ color: "#00f0ff" }}>Type 01:</span> Full frame –
                1024 bytes framebuffer
              </li>
              <li>
                <span style={{ color: "#00f0ff" }}>Type 02:</span> Diff –
                (size/9) blocks × (1-byte index + 8 bytes data)
              </li>
              <li>
                <span style={{ color: "#00f0ff" }}>Keepalive TX:</span> 55 AA 00
                00 every ~1s
              </li>
              <li>
                <span style={{ color: "#00f0ff" }}>Key TX:</span> AA 55
                [01=short | 81=long] [keycode]
              </li>
              <li>
                <span style={{ color: "#00f0ff" }}>LCD:</span> 128×64 px, 1-bit
                packed MSB-first
              </li>
            </ul>
          </div>
        </div>

        {/* Links */}
        <div
          className="mt-6 rounded-xl p-5 border flex flex-wrap gap-4"
          style={{
            background: "rgba(10,20,40,0.6)",
            borderColor: "rgba(0,240,255,0.1)",
          }}
        >
          <h3 className="w-full font-bold text-sm" style={{ color: "#00f0ff" }}>
            🔗 {lang === "fr" ? "Liens utiles" : "Useful Links"}
          </h3>
          <Link
            to="/equipment-reviews/quansheng-uv-k5"
            className="flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-semibold transition-all hover:shadow-[0_0_10px_#00f0ff44]"
            style={{ borderColor: "rgba(0,240,255,0.3)", color: "#00f0ff" }}
          >
            <Radio size={14} /> Back to UV-K5 Review
          </Link>
          <a
            href="https://github.com/armel/uv-k1-k5v3-firmware-custom"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-semibold transition-all hover:shadow-[0_0_10px_#a855f744]"
            style={{ borderColor: "rgba(168,85,247,0.3)", color: "#a855f7" }}
          >
            <Github size={14} /> F4HWN Firmware GitHub
          </a>
          <a
            href="https://armel.github.io/k5viewer/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-semibold transition-all hover:shadow-[0_0_10px_#a855f744]"
            style={{ borderColor: "rgba(168,85,247,0.3)", color: "#a855f7" }}
          >
            <ExternalLink size={14} /> Official K5Viewer
          </a>
        </div>
      </section>

      {/* ── Subscribe CTA ────────────────────────────────────────────────── */}
      <section className="px-4 md:px-8 max-w-3xl mx-auto mb-16 text-center">
        <div
          className="rounded-2xl p-8 border"
          style={{
            background: "rgba(10,20,40,0.6)",
            borderColor: "rgba(0,240,255,0.15)",
          }}
        >
          <h3 className="text-xl font-bold mb-2" style={{ color: "#e0e0e0" }}>
            {lang === "fr"
              ? "Besoin d'aide pour démarrer ?"
              : "Need help getting started?"}
          </h3>
          <p className="text-sm mb-5" style={{ color: "#888" }}>
            {lang === "fr"
              ? "Abonnez-vous à HamWaves pour des guides débutants, des tests d'équipements et des conseils radio !"
              : "Subscribe to HamWaves for beginner guides, equipment tests, and radio tips!"}
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <a
              href="https://www.youtube.com/@dmtoozer"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all hover:shadow-[0_0_20px_rgba(0,240,255,0.35)]"
              style={{
                background: "rgba(0,240,255,0.1)",
                border: "1px solid #00f0ff",
                color: "#00f0ff",
                boxShadow: "0 0 16px rgba(0,240,255,0.2)",
              }}
            >
              Subscribe to HamWaves →
            </a>
            <a
              href="https://github.com/armel/uv-k1-k5v3-firmware-custom"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm transition-all hover:shadow-[0_0_16px_rgba(168,85,247,0.3)]"
              style={{
                background: "rgba(168,85,247,0.08)",
                border: "1px solid rgba(168,85,247,0.4)",
                color: "#a855f7",
              }}
            >
              <RefreshCw size={14} /> F4HWN v5.2.0 Firmware
            </a>
          </div>
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────────────────────────── */}
      <footer
        className="py-8 text-center text-xs border-t"
        style={{ borderColor: "rgba(255,255,255,0.05)", color: "#555" }}
      >
        © {new Date().getFullYear()}.{" "}
        <a
          href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "#00f0ff" }}
        >
          Built with love using caffeine.ai
        </a>
      </footer>

      <style>{`
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
        @keyframes neonPulse {
          0%, 100% { box-shadow: 0 0 12px rgba(0,240,255,0.3); }
          50% { box-shadow: 0 0 24px rgba(0,240,255,0.7), 0 0 40px rgba(0,240,255,0.3); }
        }
      `}</style>
    </div>
  );
}
