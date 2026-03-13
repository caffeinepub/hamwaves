import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────
type ConnectionStatus =
  | "idle"
  | "connecting"
  | "connected"
  | "reconnecting"
  | "error"
  | "disconnected";
type ColorTheme = "blue" | "orange" | "white" | "grey" | "invert";
type RadioModel = "uvk5" | "uvk1v3";
type Language = "en" | "fr";

const THEME_COLORS: Record<
  Exclude<ColorTheme, "invert">,
  { fg: string; bg: string }
> = {
  blue: { fg: "#7ec8e3", bg: "#0d1b2a" },
  orange: { fg: "#ff8c00", bg: "#0a0300" },
  white: { fg: "#e8e8e8", bg: "#0a0a0a" },
  grey: { fg: "#aaaaaa", bg: "#050505" },
};

const LABELS = {
  en: {
    connect: "▶ Connect",
    disconnect: "■ Disconnect",
    keypad: "⌨ Keypad",
    help: "? Help",
    screenshot: "📷 Save PNG",
    theme: "Theme",
    model: "Model",
    zoom: "Zoom",
    ready: "READY",
    connecting: "Connecting…",
    connected: "Connected · F4HWN",
    reconnecting: "Reconnecting…",
    error: "Error",
    disconnected: "Disconnected",
    noPort: "No port selected. Choose your UV-K5/UV-K1 serial port.",
    permDenied: "Serial permission denied. Allow port access in browser.",
    fwMismatch: "Incompatible firmware. Install F4HWN v4.x+.",
    connLost: "Connection lost – retrying…",
    helpTitle: "How to Use – UV-K5 & UV-K1 V3 Live Mirror",
    uvk5Label: "UV-K5",
    uvk1v3Label: "UV-K1 V3",
  },
  fr: {
    connect: "▶ Connecter",
    disconnect: "■ Déconnecter",
    keypad: "⌨ Clavier",
    help: "? Aide",
    screenshot: "📷 Capture PNG",
    theme: "Thème",
    model: "Modèle",
    zoom: "Zoom",
    ready: "PRÊT",
    connecting: "Connexion…",
    connected: "Connecté · F4HWN",
    reconnecting: "Reconnexion…",
    error: "Erreur",
    disconnected: "Déconnecté",
    noPort: "Aucun port sélectionné. Choisissez votre port UV-K5/UV-K1.",
    permDenied: "Permission refusée. Autorisez l'accès au port série.",
    fwMismatch: "Firmware incompatible. Installez F4HWN v4.x+.",
    connLost: "Connexion perdue – nouvelle tentative…",
    helpTitle: "Mode d'emploi – UV-K5 & UV-K1 V3 Live Mirror",
    uvk5Label: "UV-K5",
    uvk1v3Label: "UV-K1 V3",
  },
};

// ─── Elite Viewer Component ───────────────────────────────────────────────────
function EliteUVK5Viewer() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const framebufferRef = useRef<Uint8Array>(new Uint8Array(1024));
  const portRef = useRef<any>(null);
  const readerRef = useRef<any>(null);
  const reconnectAttemptsRef = useRef(0);
  const frameCountRef = useRef(0);
  const lastFpsTimeRef = useRef(performance.now());
  const firmwareVersionRef = useRef("");

  const [status, setStatus] = useState<ConnectionStatus>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [fps, setFps] = useState(0);
  const [pixelScale, setPixelScale] = useState(10);
  const [colorTheme, setColorTheme] = useState<ColorTheme>("blue");
  const [radioModel, setRadioModel] = useState<RadioModel>("uvk5");
  const [language, setLanguage] = useState<Language>("en");
  const [showKeypad, setShowKeypad] = useState(false);
  const [framebuffer, setFramebuffer] = useState<Uint8Array>(
    new Uint8Array(1024),
  );
  const [firmwareVer, setFirmwareVer] = useState("");

  const L = LABELS[language];
  const isConnected = status === "connected";
  const maxReconnectAttempts = 5;

  // Keep framebuffer ref in sync
  useEffect(() => {
    framebufferRef.current = framebuffer;
  }, [framebuffer]);

  // ── Canvas render ──────────────────────────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const W = 128 * pixelScale;
    const H = 64 * pixelScale;
    canvas.width = W;
    canvas.height = H;

    // Resolve theme colors
    let fgColor: string;
    let bgColor: string;
    if (colorTheme === "invert") {
      fgColor = THEME_COLORS.blue.bg;
      bgColor = THEME_COLORS.blue.fg;
    } else {
      fgColor = THEME_COLORS[colorTheme].fg;
      bgColor = THEME_COLORS[colorTheme].bg;
    }

    // Fill background
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, W, H);

    if (isConnected) {
      // Draw live framebuffer pixels
      const fb = framebuffer;
      ctx.fillStyle = fgColor;
      for (let byteIdx = 0; byteIdx < 1024; byteIdx++) {
        const byte = fb[byteIdx];
        if (byte === 0) continue;
        for (let bit = 0; bit < 8; bit++) {
          if (byte & (0x80 >> bit)) {
            const pixelIdx = byteIdx * 8 + bit;
            const px = pixelIdx % 128;
            const py = Math.floor(pixelIdx / 128);
            if (py < 64) {
              ctx.fillRect(
                px * pixelScale,
                py * pixelScale,
                pixelScale,
                pixelScale,
              );
            }
          }
        }
      }
    } else {
      // Placeholder display
      const modelLabel = radioModel === "uvk5" ? "UV-K5" : "UV-K1 V3";
      ctx.fillStyle = fgColor;
      ctx.font = `bold ${Math.max(12, pixelScale * 2)}px monospace`;
      ctx.textAlign = "center";
      ctx.fillText(modelLabel, W / 2, H / 2 - pixelScale * 4);
      ctx.font = `${Math.max(8, pixelScale)}px monospace`;
      ctx.fillText("F4HWN READY", W / 2, H / 2);
      ctx.fillText("◄ 145.500 FM ►", W / 2, H / 2 + pixelScale * 2.5);
    }

    // Scanline overlay
    ctx.fillStyle = fgColor;
    ctx.globalAlpha = 0.06;
    for (let y = 0; y < H; y += pixelScale * 2) {
      ctx.fillRect(0, y, W, pixelScale * 0.5);
    }
    ctx.globalAlpha = 1.0;
  }, [framebuffer, colorTheme, pixelScale, isConnected, radioModel]);

  // ── Framebuffer parser + read loop ────────────────────────────────────────
  const readLoop = useCallback(async (port: any) => {
    const reader = port.readable.getReader();
    readerRef.current = reader;
    const buf = new Uint8Array(16 * 1024);
    let bufLen = 0;

    try {
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        // Manage circular buffer
        if (bufLen + value.length > buf.length) {
          const keep = Math.min(bufLen, 4096);
          buf.copyWithin(0, bufLen - keep);
          bufLen = keep;
        }
        buf.set(value, bufLen);
        bufLen += value.length;

        let i = 0;
        while (i < bufLen - 4) {
          // Scan for AA55 header
          if (buf[i] !== 0xaa || buf[i + 1] !== 0x55) {
            i++;
            continue;
          }
          const type = buf[i + 2];
          const size = (buf[i + 3] << 8) | buf[i + 4];
          const dataStart = i + 5;

          if (type === 0x01) {
            // Full frame: 1024 bytes
            if (bufLen - dataStart < 1024) break;
            const newFb = new Uint8Array(1024);
            newFb.set(buf.subarray(dataStart, dataStart + 1024));
            framebufferRef.current = newFb;
            setFramebuffer(newFb);
            i = dataStart + 1024;
          } else if (type === 0x02) {
            // Diff blocks: each block = 1 index byte + 8 data bytes
            if (bufLen - dataStart < size) break;
            const blocks = Math.floor(size / 9);
            const fb = framebufferRef.current.slice();
            for (let b = 0; b < blocks; b++) {
              const idx = buf[dataStart + b * 9];
              for (let d = 0; d < 8; d++) {
                const pos = idx * 8 + d;
                if (pos < 1024) {
                  fb[pos] = buf[dataStart + b * 9 + 1 + d];
                }
              }
            }
            framebufferRef.current = fb;
            setFramebuffer(fb);
            i = dataStart + size;
          } else if (type === 0x03) {
            // Firmware info string (null-terminated)
            if (bufLen - dataStart < size) break;
            const strBytes = buf.subarray(dataStart, dataStart + size);
            const nullIdx = strBytes.indexOf(0);
            const verStr = new TextDecoder().decode(
              strBytes.subarray(0, nullIdx >= 0 ? nullIdx : size),
            );
            firmwareVersionRef.current = verStr;
            setFirmwareVer(verStr);
            i = dataStart + size;
          } else {
            i++;
            continue;
          }

          // Update FPS
          frameCountRef.current++;
          const now = performance.now();
          if (now - lastFpsTimeRef.current >= 1000) {
            setFps(frameCountRef.current);
            frameCountRef.current = 0;
            lastFpsTimeRef.current = now;
          }
        }

        if (i > 0) {
          buf.copyWithin(0, i);
          bufLen -= i;
        }
      }
    } catch (e: any) {
      // Handle connection loss with auto-reconnect
      if (reconnectAttemptsRef.current < maxReconnectAttempts) {
        setStatus("reconnecting");
        setErrorMsg(
          `Connection lost – retrying… (${reconnectAttemptsRef.current + 1}/${maxReconnectAttempts})`,
        );
        reconnectAttemptsRef.current++;
        setTimeout(() => connectToRadio(true), 3000);
      } else {
        setErrorMsg(`Connection lost – ${e?.message ?? "Unknown error"}`);
        setStatus("error");
      }
    } finally {
      try {
        reader.releaseLock();
      } catch (_) {
        /* ignore */
      }
      readerRef.current = null;
    }
  }, []);

  // ── Connect ────────────────────────────────────────────────────────────────
  const connectToRadio = useCallback(
    async (autoReconnect = false) => {
      if (!("serial" in navigator)) {
        setErrorMsg("Web Serial API not supported. Use Chrome or Edge.");
        setStatus("error");
        return;
      }
      if (!autoReconnect) {
        reconnectAttemptsRef.current = 0;
      }
      setStatus("connecting");
      setErrorMsg("");
      try {
        let port: any;
        if (autoReconnect && portRef.current) {
          port = portRef.current;
        } else {
          port = await (navigator as any).serial.requestPort();
          portRef.current = port;
        }
        if (!port.readable) {
          await port.open({ baudRate: 115200 });
        }
        setStatus("connected");
        reconnectAttemptsRef.current = 0;
        frameCountRef.current = 0;
        lastFpsTimeRef.current = performance.now();
        readLoop(port);
      } catch (e: any) {
        if (
          e.name === "NotFoundError" ||
          e.message?.includes("No port selected")
        ) {
          setErrorMsg(L.noPort);
        } else if (e.name === "NotAllowedError") {
          setErrorMsg(L.permDenied);
        } else if (
          e.message?.includes("firmware") ||
          e.message?.includes("not compatible")
        ) {
          setErrorMsg(L.fwMismatch);
        } else {
          setErrorMsg(`Connection failed: ${e?.message ?? "Unknown error"}`);
        }
        setStatus("error");
      }
    },
    [readLoop, L],
  );

  // ── Disconnect ─────────────────────────────────────────────────────────────
  const disconnect = useCallback(async () => {
    reconnectAttemptsRef.current = maxReconnectAttempts; // prevent auto-reconnect
    try {
      if (readerRef.current) {
        await readerRef.current.cancel();
      }
    } catch (_) {
      /* ignore */
    }
    try {
      if (portRef.current) {
        await portRef.current.close();
        portRef.current = null;
      }
    } catch (_) {
      /* ignore */
    }
    setStatus("disconnected");
    setFps(0);
    setFirmwareVer("");
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      reconnectAttemptsRef.current = maxReconnectAttempts;
      if (readerRef.current) readerRef.current.cancel().catch(() => {});
      if (portRef.current) portRef.current.close().catch(() => {});
    };
  }, []);

  // ── Screenshot ─────────────────────────────────────────────────────────────
  const takeScreenshot = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const url = canvas.toDataURL("image/png");
    const a = document.createElement("a");
    a.href = url;
    a.download = `uv-k5-mirror-${Date.now()}.png`;
    a.click();
  }, []);

  // ── Status display ─────────────────────────────────────────────────────────
  const statusInfo: Record<
    ConnectionStatus,
    { color: string; label: string; dotAnim?: boolean }
  > = {
    idle: { color: "#666", label: L.ready },
    connecting: { color: "#f59e0b", label: L.connecting, dotAnim: true },
    connected: {
      color: "#22c55e",
      label: firmwareVer ? `${L.connected} v${firmwareVer}` : L.connected,
      dotAnim: true,
    },
    reconnecting: {
      color: "#f59e0b",
      label: `${L.reconnecting} (${reconnectAttemptsRef.current}/${maxReconnectAttempts})`,
      dotAnim: true,
    },
    error: { color: "#ef4444", label: errorMsg || L.error },
    disconnected: { color: "#555", label: L.disconnected },
  };

  const si = statusInfo[status];
  const W = 128 * pixelScale;
  const H = 64 * pixelScale;

  const keypadCells: { id: string; label: string }[] = [
    { id: "kp-ptt", label: "PTT" },
    { id: "kp-menu", label: "MENU" },
    { id: "kp-exit", label: "EXIT" },
    { id: "kp-r1c0", label: "" },
    { id: "kp-up", label: "▲" },
    { id: "kp-r1c2", label: "" },
    { id: "kp-left", label: "◄" },
    { id: "kp-down", label: "▼" },
    { id: "kp-right", label: "►" },
    { id: "kp-f1", label: "F1" },
    { id: "kp-ab", label: "A/B" },
    { id: "kp-f2", label: "F2" },
    { id: "kp-1", label: "1" },
    { id: "kp-2", label: "2" },
    { id: "kp-3", label: "3" },
    { id: "kp-4", label: "4" },
    { id: "kp-5", label: "5" },
    { id: "kp-6", label: "6" },
    { id: "kp-7", label: "7" },
    { id: "kp-8", label: "8" },
    { id: "kp-9", label: "9" },
    { id: "kp-star", label: "*" },
    { id: "kp-0", label: "0" },
    { id: "kp-hash", label: "#" },
  ];

  return (
    <div
      style={{
        background: "#05080f",
        border: "1px solid #00f0ff22",
        borderRadius: 12,
        overflow: "hidden",
      }}
    >
      {/* ── Glass Control Bar ── */}
      <div
        style={{
          background: "rgba(5,15,30,0.85)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          borderBottom: "1px solid #00f0ff22",
          padding: "12px 20px",
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          gap: 10,
        }}
      >
        {/* Model selector */}
        <div
          style={{
            display: "flex",
            gap: 4,
            background: "rgba(0,0,0,0.4)",
            borderRadius: 8,
            padding: 3,
          }}
        >
          {(["uvk5", "uvk1v3"] as RadioModel[]).map((m) => (
            <button
              type="button"
              key={m}
              data-ocid={`uvk5mirror.model_${m}.radio`}
              onClick={() => setRadioModel(m)}
              style={{
                padding: "5px 12px",
                borderRadius: 5,
                border: "none",
                fontSize: 12,
                fontWeight: 700,
                cursor: "pointer",
                transition: "all 0.15s",
                background: radioModel === m ? "#00f0ff" : "transparent",
                color: radioModel === m ? "#0a0a0a" : "#888",
                letterSpacing: "0.03em",
              }}
            >
              {m === "uvk5" ? L.uvk5Label : L.uvk1v3Label}
            </button>
          ))}
        </div>

        <div
          style={{ width: 1, height: 24, background: "#00f0ff22" }}
          aria-hidden
        />

        {/* Connect / Disconnect */}
        {!isConnected ? (
          <button
            type="button"
            data-ocid="uvk5mirror.connect_button"
            onClick={() => connectToRadio()}
            disabled={status === "connecting" || status === "reconnecting"}
            style={ctrlBtn(
              "#00f0ff",
              status === "connecting" || status === "reconnecting",
            )}
          >
            {status === "connecting" || status === "reconnecting"
              ? L.connecting
              : L.connect}
          </button>
        ) : (
          <button
            type="button"
            data-ocid="uvk5mirror.disconnect_button"
            onClick={disconnect}
            style={ctrlBtn("#ef4444")}
          >
            {L.disconnect}
          </button>
        )}

        {/* Keypad toggle */}
        <button
          type="button"
          data-ocid="uvk5mirror.keypad_toggle"
          onClick={() => setShowKeypad((v) => !v)}
          style={{
            ...ctrlBtn("#a855f7"),
            background: showKeypad ? "rgba(168,85,247,0.15)" : "transparent",
          }}
        >
          {L.keypad}
        </button>

        <div style={{ flex: 1, minWidth: 8 }} aria-hidden />

        {/* Help */}
        <Dialog>
          <DialogTrigger asChild>
            <button
              type="button"
              data-ocid="uvk5mirror.help_button"
              style={ctrlBtn("#00f0ff88")}
            >
              {L.help}
            </button>
          </DialogTrigger>
          <DialogContent
            style={{
              background: "#0c1520",
              border: "1px solid #00f0ff33",
              color: "#e0e0e0",
              maxWidth: 560,
            }}
          >
            <DialogHeader>
              <DialogTitle style={{ color: "#00f0ff", fontSize: 16 }}>
                {L.helpTitle}
              </DialogTitle>
            </DialogHeader>
            <div style={{ fontSize: 13, lineHeight: 1.7, color: "#ccc" }}>
              <p style={{ marginBottom: 12 }}>
                <strong style={{ color: "#00f0ff" }}>Requirements:</strong>
                <br />• Chrome or Edge browser (Firefox not supported)
                <br />• HTTPS or localhost
                <br />• F4HWN custom firmware v4.x+ on your radio
                <br />• USB programming cable (CP210x or CH340)
              </p>
              <p style={{ marginBottom: 12 }}>
                <strong style={{ color: "#00f0ff" }}>Protocol:</strong>
                <br />• Header: AA 55
                <br />• Type 0x01: full frame (1024 bytes, 128×64 1bpp)
                <br />• Type 0x02: diff blocks (index + 8 bytes per block)
                <br />• Type 0x03: firmware version string
              </p>
              <p style={{ marginBottom: 12 }}>
                <strong style={{ color: "#22c55e" }}>🔒 RX-only:</strong> No
                data is written to the radio. Completely safe.
              </p>
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                <a
                  href="https://github.com/armel/uv-k1-k5v3-firmware-custom"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    color: "#00f0ff",
                    fontSize: 13,
                    borderBottom: "1px solid #00f0ff55",
                    textDecoration: "none",
                  }}
                >
                  F4HWN GitHub ↗
                </a>
                <a
                  href="https://armel.github.io/k5viewer/"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    color: "#00f0ff",
                    fontSize: 13,
                    borderBottom: "1px solid #00f0ff55",
                    textDecoration: "none",
                  }}
                >
                  Official K5 Viewer ↗
                </a>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Language toggle */}
        <div
          style={{
            display: "flex",
            gap: 2,
            background: "rgba(0,0,0,0.4)",
            borderRadius: 6,
            padding: 2,
          }}
        >
          {(["en", "fr"] as Language[]).map((lng) => (
            <button
              type="button"
              key={lng}
              data-ocid="uvk5mirror.language_select"
              onClick={() => setLanguage(lng)}
              style={{
                padding: "4px 9px",
                borderRadius: 4,
                border: "none",
                fontSize: 11,
                fontWeight: 700,
                cursor: "pointer",
                background: language === lng ? "#00f0ff22" : "transparent",
                color: language === lng ? "#00f0ff" : "#666",
                letterSpacing: "0.05em",
                textTransform: "uppercase",
              }}
            >
              {lng}
            </button>
          ))}
        </div>

        {/* Theme dropdown */}
        <select
          data-ocid="uvk5mirror.theme_select"
          value={colorTheme}
          onChange={(e) => setColorTheme(e.target.value as ColorTheme)}
          style={{
            background: "rgba(0,0,0,0.6)",
            border: "1px solid #00f0ff33",
            color: "#00f0ff",
            borderRadius: 5,
            padding: "5px 8px",
            fontSize: 12,
            cursor: "pointer",
            outline: "none",
          }}
        >
          <option value="blue">Blue LCD</option>
          <option value="orange">Orange LCD</option>
          <option value="white">White LCD</option>
          <option value="grey">Grey LCD</option>
          <option value="invert">Invert</option>
        </select>

        {/* Status badge */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 7,
            padding: "5px 12px",
            background: `${si.color}18`,
            border: `1px solid ${si.color}44`,
            borderRadius: 20,
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: "0.04em",
            color: si.color,
            whiteSpace: "nowrap",
            maxWidth: 220,
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
          data-ocid={
            status === "error"
              ? "uvk5mirror.error_state"
              : status === "connected"
                ? "uvk5mirror.success_state"
                : status === "connecting" || status === "reconnecting"
                  ? "uvk5mirror.loading_state"
                  : undefined
          }
        >
          <span
            style={{
              width: 7,
              height: 7,
              borderRadius: "50%",
              background: si.color,
              flexShrink: 0,
              boxShadow: si.dotAnim ? `0 0 8px ${si.color}` : "none",
              animation: si.dotAnim
                ? "neon-pulse 1.5s ease-in-out infinite"
                : "none",
            }}
          />
          <span style={{ overflow: "hidden", textOverflow: "ellipsis" }}>
            {si.label}
          </span>
        </div>
      </div>

      {/* ── Main viewer area ── */}
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          flexWrap: "wrap",
          gap: 20,
          padding: "20px",
          alignItems: "flex-start",
          justifyContent: "center",
        }}
      >
        {/* Canvas column */}
        <div style={{ flex: "1 1 auto", minWidth: 0 }}>
          {/* Canvas */}
          <div
            style={{
              position: "relative",
              display: "inline-block",
              maxWidth: "100%",
            }}
          >
            <div
              style={{
                borderRadius: 8,
                border: "2px solid #00f0ff",
                boxShadow:
                  "0 0 40px #00f0ff55, 0 0 80px #00f0ff18, inset 0 0 20px #00183022",
                overflow: "hidden",
                background: "#0d1b2a",
                position: "relative",
                maxWidth: "100%",
              }}
            >
              <canvas
                ref={canvasRef}
                width={W}
                height={H}
                data-ocid="uvk5mirror.canvas_target"
                style={{
                  display: "block",
                  width: "100%",
                  maxWidth: W,
                  imageRendering: "pixelated",
                }}
              />
              {/* FPS counter */}
              <div
                style={{
                  position: "absolute",
                  top: 6,
                  left: 8,
                  fontSize: 11,
                  color: "#22c55e",
                  fontFamily: "monospace",
                  background: "rgba(0,0,0,0.65)",
                  padding: "2px 7px",
                  borderRadius: 4,
                  letterSpacing: "0.05em",
                  pointerEvents: "none",
                }}
              >
                {fps} FPS
              </div>
              {/* Scanline overlay using CSS for zero canvas perf cost */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  backgroundImage:
                    "repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.08) 3px, rgba(0,0,0,0.08) 4px)",
                  pointerEvents: "none",
                  borderRadius: 6,
                }}
              />
            </div>
          </div>

          {/* Zoom + screenshot controls */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              marginTop: 12,
              flexWrap: "wrap",
            }}
          >
            <span style={{ color: "#555", fontSize: 12 }}>{L.zoom}:</span>
            <button
              type="button"
              data-ocid="uvk5mirror.scale_minus_button"
              onClick={() => setPixelScale((s) => Math.max(6, s - 1))}
              style={smallBtn}
            >
              −
            </button>
            <span
              style={{
                minWidth: 36,
                textAlign: "center",
                color: "#00f0ff",
                fontWeight: 700,
                fontFamily: "monospace",
                fontSize: 13,
              }}
            >
              {pixelScale}×
            </span>
            <button
              type="button"
              data-ocid="uvk5mirror.scale_plus_button"
              onClick={() => setPixelScale((s) => Math.min(16, s + 1))}
              style={smallBtn}
            >
              +
            </button>
            <div style={{ flex: 1 }} />
            <button
              type="button"
              data-ocid="uvk5mirror.screenshot_button"
              onClick={takeScreenshot}
              style={{
                ...smallBtn,
                padding: "5px 14px",
                fontSize: 12,
                color: "#a855f7",
                borderColor: "#a855f755",
                boxShadow: "0 0 8px #a855f733",
              }}
            >
              {L.screenshot}
            </button>
          </div>

          {/* Error message */}
          {status === "error" && errorMsg && (
            <div
              style={{
                marginTop: 10,
                padding: "8px 12px",
                background: "#1a0505",
                border: "1px solid #ef444466",
                borderRadius: 6,
                fontSize: 12,
                color: "#ef4444",
              }}
            >
              ⚠ {errorMsg}
            </div>
          )}
        </div>

        {/* Keypad overlay */}
        {showKeypad && (
          <div
            style={{
              background: "rgba(5,15,30,0.7)",
              border: "1px solid #a855f755",
              backdropFilter: "blur(8px)",
              WebkitBackdropFilter: "blur(8px)",
              borderRadius: 10,
              padding: 14,
              width: 160,
              flexShrink: 0,
            }}
          >
            <div
              style={{
                fontSize: 10,
                color: "#a855f7",
                textAlign: "center",
                marginBottom: 10,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                fontWeight: 700,
              }}
            >
              Keypad
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: 4,
              }}
            >
              {keypadCells.map(({ id, label }) => (
                <div
                  key={id}
                  style={{
                    background:
                      label === "" ? "transparent" : "rgba(0,240,255,0.05)",
                    border:
                      label === ""
                        ? "1px solid transparent"
                        : "1px solid #00f0ff22",
                    borderRadius: 5,
                    padding: label === "" ? 0 : "7px 4px",
                    textAlign: "center",
                    fontSize: 12,
                    color: "#888",
                    transition: "all 0.15s",
                    minHeight: label === "" ? 0 : 28,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                  onMouseEnter={(e) => {
                    if (label === "") return;
                    const el = e.currentTarget as HTMLDivElement;
                    el.style.background = "rgba(0,240,255,0.15)";
                    el.style.borderColor = "#00f0ff";
                    el.style.color = "#00f0ff";
                    el.style.boxShadow = "0 0 10px #00f0ff44";
                  }}
                  onMouseLeave={(e) => {
                    if (label === "") return;
                    const el = e.currentTarget as HTMLDivElement;
                    el.style.background = "rgba(0,240,255,0.05)";
                    el.style.borderColor = "#00f0ff22";
                    el.style.color = "#888";
                    el.style.boxShadow = "none";
                  }}
                >
                  {label}
                </div>
              ))}
            </div>
            <div
              style={{
                marginTop: 10,
                fontSize: 10,
                color: "#444",
                textAlign: "center",
                lineHeight: 1.4,
              }}
            >
              Visual reference only
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Shared mini styles ────────────────────────────────────────────────────────
const smallBtn: React.CSSProperties = {
  padding: "5px 10px",
  background: "transparent",
  border: "1px solid #00f0ff55",
  color: "#00f0ff",
  borderRadius: 5,
  fontWeight: 700,
  fontSize: 13,
  cursor: "pointer",
  boxShadow: "0 0 6px #00f0ff22",
  transition: "all 0.15s",
};

function ctrlBtn(accentColor: string, disabled = false): React.CSSProperties {
  return {
    padding: "6px 14px",
    background: "transparent",
    border: `1px solid ${accentColor}`,
    color: accentColor,
    borderRadius: 6,
    fontWeight: 700,
    fontSize: 12,
    cursor: disabled ? "not-allowed" : "pointer",
    boxShadow: `0 0 8px ${accentColor}33`,
    transition: "all 0.15s",
    opacity: disabled ? 0.5 : 1,
    whiteSpace: "nowrap" as const,
    letterSpacing: "0.02em",
  };
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function UVK5LiveMirror() {
  useEffect(() => {
    document.title =
      "UV-K5 & UV-K1 V3 Live LCD Mirror Browser – F4HWN WebSerial Viewer 2026 | HamWaves";
    const setMeta = (name: string, content: string) => {
      let el = document.querySelector(
        `meta[name="${name}"]`,
      ) as HTMLMetaElement | null;
      if (!el) {
        el = document.createElement("meta");
        el.name = name;
        document.head.appendChild(el);
      }
      el.content = content;
    };
    setMeta(
      "description",
      "Real-time mirror Quansheng UV-K5 and UV-K1 V3 screen in browser using Web Serial API + F4HWN firmware – elite LCD emulation for scanning, no app install.",
    );
    return () => {
      document.title = "HamWaves";
    };
  }, []);

  const steps = [
    {
      num: 1,
      title: "Flash F4HWN Firmware (v4.x+)",
      desc: "Install the F4HWN custom firmware onto your UV-K5 or UV-K1 (V3). This enables the live LCD mirror protocol over USB serial.",
      link: {
        label: "F4HWN GitHub ↗",
        href: "https://github.com/armel/uv-k1-k5v3-firmware-custom",
      },
    },
    {
      num: 2,
      title: "Connect via USB Programming Cable",
      desc: "Use a Quansheng-compatible USB programming cable (CP210x or CH340 chip). Connect to the radio's speaker/mic port. Power on.",
      link: null,
    },
    {
      num: 3,
      title: "Open in Chrome or Edge (HTTPS / localhost)",
      desc: "Web Serial API requires a secure context. Firefox is not supported. On mobile, USB OTG support is limited — desktop Chrome recommended.",
      link: null,
    },
    {
      num: 4,
      title: "Click Connect, Select Your Port",
      desc: "Press ▶ Connect in the viewer below. A browser port picker dialog appears — select your UV-K5 or UV-K1 V3 serial port.",
      link: null,
    },
    {
      num: 5,
      title: "Watch Your LCD Mirror Live!",
      desc: "The radio display appears in real-time. Use zoom, theme, screenshot, and the keypad overlay for a full monitoring experience.",
      link: null,
    },
  ];

  const linkCards = [
    {
      label: "← UV-K5 Review",
      href: "/equipment-reviews/quansheng-uv-k5" as const,
      external: false,
      desc: "Full Quansheng UV-K5 review, firmware comparison & RX tips",
    },
    {
      label: "F4HWN GitHub ↗",
      href: "https://github.com/armel/uv-k1-k5v3-firmware-custom",
      external: true,
      desc: "Official F4HWN custom firmware source code and releases",
    },
    {
      label: "Official K5 Viewer ↗",
      href: "https://armel.github.io/k5viewer/",
      external: true,
      desc: "Armel/F4HWN's official web-based UV-K5 screen viewer (v1.5)",
    },
  ];

  return (
    <main
      style={{
        background: "#0a0a0a",
        minHeight: "100vh",
        color: "#e0e0e0",
        fontFamily: "Inter, sans-serif",
      }}
    >
      {/* ── Hero ── */}
      <section
        style={{
          position: "relative",
          overflow: "hidden",
          paddingBottom: "2.5rem",
        }}
      >
        {/* Animated bg */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            opacity: 0.1,
            pointerEvents: "none",
          }}
        >
          <svg
            width="100%"
            height="100%"
            viewBox="0 0 1440 420"
            preserveAspectRatio="xMidYMid slice"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <defs>
              <radialGradient id="heroGlow" cx="50%" cy="40%" r="60%">
                <stop offset="0%" stopColor="#00f0ff" stopOpacity="0.35" />
                <stop offset="100%" stopColor="#0a0a0a" stopOpacity="0" />
              </radialGradient>
            </defs>
            <rect width="1440" height="420" fill="url(#heroGlow)" />
            {[0, 50, 100, 150, 200].map((off, i) => (
              <ellipse
                key={off}
                cx="720"
                cy="210"
                rx={220 + off * 2.5}
                ry={90 + off * 0.6}
                fill="none"
                stroke="#00f0ff"
                strokeWidth="0.8"
                opacity={0.45 - i * 0.08}
              >
                <animateTransform
                  attributeName="transform"
                  type="scale"
                  values="1;1.035;1"
                  dur={`${3.5 + i * 0.4}s`}
                  repeatCount="indefinite"
                  additive="sum"
                />
              </ellipse>
            ))}
          </svg>
        </div>

        <div
          style={{
            position: "relative",
            maxWidth: 900,
            margin: "0 auto",
            padding: "0 1.5rem",
          }}
        >
          {/* Breadcrumb */}
          <div className="pt-28 md:pt-32 flex flex-wrap gap-3 mb-6">
            <Link
              to="/equipment-reviews/quansheng-uv-k5"
              data-ocid="uvk5mirror.link"
              style={navBtn}
            >
              ← UV-K5 Review
            </Link>
            <Link
              to="/equipment-reviews"
              data-ocid="uvk5mirror.link"
              style={navBtn}
            >
              ← All Reviews
            </Link>
          </div>

          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 7,
                padding: "4px 14px",
                border: "1px solid #00f0ff44",
                borderRadius: 20,
                fontSize: 11,
                color: "#00f0ff",
                fontWeight: 700,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                background: "#00f0ff0a",
                marginBottom: "1.1rem",
              }}
            >
              <span
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  background: "#00f0ff",
                  display: "inline-block",
                  animation: "neon-pulse 2s ease-in-out infinite",
                }}
              />
              WebSerial + Canvas · UV-K5 &amp; UV-K1 V3
            </span>
          </motion.div>

          {/* H1 */}
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            style={{
              fontSize: "clamp(1.7rem, 3.8vw, 2.8rem)",
              fontWeight: 800,
              lineHeight: 1.15,
              color: "#ffffff",
              marginBottom: "1rem",
              WebkitTextStroke: "0.5px #000",
            }}
          >
            Live LCD Mirror –{" "}
            <span style={{ color: "#00f0ff" }}>UV-K5 &amp; UV-K1 V3</span>{" "}
            Viewer
            <br />
            <span
              style={{ fontSize: "0.62em", color: "#aaa", fontWeight: 500 }}
            >
              WebSerial + Canvas
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            style={{
              fontSize: 15,
              color: "#999",
              maxWidth: 680,
              lineHeight: 1.7,
              marginBottom: "2rem",
            }}
          >
            Connect your UV-K5 or UV-K1 (V3) via USB programming cable and
            mirror the exact radio LCD in real-time right in your browser –{" "}
            <strong style={{ color: "#e0e0e0" }}>no desktop app needed.</strong>{" "}
            Perfect for scanning demos, spectrum analyzer view, and big-screen
            monitoring.
          </motion.p>

          {/* Warning box */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            style={{
              border: "1px solid #f59e0b88",
              background: "rgba(245,158,11,0.06)",
              borderRadius: 8,
              padding: "12px 16px",
              fontSize: 13,
              color: "#fbbf24",
              lineHeight: 1.65,
              display: "flex",
              gap: 10,
              alignItems: "flex-start",
            }}
          >
            <span style={{ fontSize: 16, flexShrink: 0 }}>⚠️</span>
            <span>
              <strong>Chrome/Edge only</strong> (Web Serial API). RX-only safe.
              No data written to radio. Mobile USB OTG may not work —{" "}
              <strong>desktop Chrome recommended</strong>.
            </span>
          </motion.div>
        </div>
      </section>

      {/* ── Setup Steps ── */}
      <section
        style={{ maxWidth: 900, margin: "0 auto", padding: "0 1.5rem 3rem" }}
      >
        <motion.h2
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          style={{
            fontSize: "clamp(1.2rem, 2.5vw, 1.6rem)",
            fontWeight: 700,
            color: "#fff",
            marginBottom: "1.25rem",
            WebkitTextStroke: "0.5px #000",
          }}
        >
          Setup Guide
        </motion.h2>

        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {steps.map((step, i) => (
            <motion.div
              key={step.num}
              initial={{ opacity: 0, x: -14 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.06 }}
              style={{
                display: "flex",
                gap: 14,
                background: "#0e0e0e",
                border: "1px solid #00f0ff18",
                borderRadius: 8,
                padding: "14px 16px",
              }}
            >
              <div
                style={{
                  width: 28,
                  height: 28,
                  flexShrink: 0,
                  borderRadius: "50%",
                  border: "2px solid #00f0ff",
                  color: "#00f0ff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: 800,
                  fontSize: 13,
                  fontFamily: "monospace",
                }}
              >
                {step.num}
              </div>
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    fontWeight: 700,
                    color: "#e0e0e0",
                    marginBottom: 4,
                    fontSize: 14,
                  }}
                >
                  {step.title}
                </div>
                <div style={{ fontSize: 13, color: "#777", lineHeight: 1.6 }}>
                  {step.desc}
                </div>
                {step.link && (
                  <a
                    href={step.link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: "inline-block",
                      marginTop: 8,
                      fontSize: 12,
                      color: "#00f0ff",
                      textDecoration: "none",
                      borderBottom: "1px solid #00f0ff44",
                    }}
                  >
                    {step.link.label}
                  </a>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Elite Viewer ── */}
      <section
        style={{ maxWidth: 1200, margin: "0 auto", padding: "0 1.5rem 3.5rem" }}
      >
        <motion.h2
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          style={{
            fontSize: "clamp(1.2rem, 2.5vw, 1.6rem)",
            fontWeight: 700,
            color: "#fff",
            marginBottom: "1.25rem",
            WebkitTextStroke: "0.5px #000",
          }}
        >
          Live LCD Mirror Viewer
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <EliteUVK5Viewer />
        </motion.div>
      </section>

      {/* ── Links ── */}
      <section
        style={{ maxWidth: 900, margin: "0 auto", padding: "0 1.5rem 5rem" }}
      >
        <motion.h2
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          style={{
            fontSize: "1.3rem",
            fontWeight: 700,
            color: "#fff",
            marginBottom: "1.1rem",
            WebkitTextStroke: "0.5px #000",
          }}
        >
          Related Resources
        </motion.h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
            gap: 14,
          }}
        >
          {linkCards.map((card, ci) => (
            <motion.div
              key={card.href}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: ci * 0.07 }}
            >
              {card.external ? (
                <a
                  href={card.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={resCard}
                  onMouseEnter={(e) => resCardHover(e as any, true)}
                  onMouseLeave={(e) => resCardHover(e as any, false)}
                >
                  <div
                    style={{
                      fontWeight: 700,
                      color: "#00f0ff",
                      fontSize: 14,
                      marginBottom: 6,
                    }}
                  >
                    {card.label}
                  </div>
                  <div style={{ fontSize: 12, color: "#555", lineHeight: 1.5 }}>
                    {card.desc}
                  </div>
                </a>
              ) : (
                <Link
                  to={card.href as "/equipment-reviews/quansheng-uv-k5"}
                  style={resCard}
                  onMouseEnter={(e) => resCardHover(e as any, true)}
                  onMouseLeave={(e) => resCardHover(e as any, false)}
                >
                  <div
                    style={{
                      fontWeight: 700,
                      color: "#00f0ff",
                      fontSize: 14,
                      marginBottom: 6,
                    }}
                  >
                    {card.label}
                  </div>
                  <div style={{ fontSize: 12, color: "#555", lineHeight: 1.5 }}>
                    {card.desc}
                  </div>
                </Link>
              )}
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Footer ── */}
      <footer
        style={{
          borderTop: "1px solid #1a1a1a",
          padding: "1.5rem",
          textAlign: "center",
          fontSize: 12,
          color: "#444",
        }}
      >
        © {new Date().getFullYear()}. Built with love using{" "}
        <a
          href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`}
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "#00f0ff", textDecoration: "none" }}
        >
          caffeine.ai
        </a>
      </footer>
    </main>
  );
}

// ── Style constants ───────────────────────────────────────────────────────────
const navBtn: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  padding: "7px 16px",
  background: "transparent",
  border: "1px solid #00f0ff55",
  color: "#00f0ff",
  borderRadius: 6,
  fontWeight: 600,
  fontSize: 12,
  textDecoration: "none",
  boxShadow: "0 0 6px #00f0ff22",
  transition: "all 0.15s",
  letterSpacing: "0.02em",
};

const resCard: React.CSSProperties = {
  display: "block",
  background: "#0e0e0e",
  border: "1px solid #00f0ff22",
  borderRadius: 8,
  padding: "14px 16px",
  textDecoration: "none",
  transition: "border-color 0.15s, box-shadow 0.15s",
  height: "100%",
};

const resCardHover = (e: React.MouseEvent<HTMLElement>, enter: boolean) => {
  const el = e.currentTarget as HTMLElement;
  el.style.borderColor = enter ? "#00f0ff66" : "#00f0ff22";
  el.style.boxShadow = enter ? "0 0 20px #00f0ff18" : "none";
};
