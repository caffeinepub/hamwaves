import { Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────
type ConnectionStatus =
  | "idle"
  | "connecting"
  | "connected"
  | "error"
  | "disconnected";
type ColorTheme = "white" | "orange" | "blue" | "grey";

const THEME_COLORS: Record<ColorTheme, { fg: string; bg: string }> = {
  white: { fg: "#e0e0e0", bg: "#000000" },
  orange: { fg: "#ff8c00", bg: "#0a0000" },
  blue: { fg: "#00f0ff", bg: "#000a0a" },
  grey: { fg: "#aaaaaa", bg: "#050505" },
};

// ─── Sub-component: UV-K5 Mirror Viewer ───────────────────────────────────────
function UVK5MirrorViewer() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const framebufferRef = useRef<Uint8Array>(new Uint8Array(1024));
  const portRef = useRef<any>(null);

  const [connected, setConnected] = useState(false);
  const [status, setStatus] = useState<ConnectionStatus>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [fps, setFps] = useState(0);
  const [pixelScale, setPixelScale] = useState(8);
  const [colorTheme, setColorTheme] = useState<ColorTheme>("blue");
  const [inverted, setInverted] = useState(false);
  const [framebuffer, setFramebuffer] = useState<Uint8Array>(
    new Uint8Array(1024),
  );

  // Keep ref in sync
  useEffect(() => {
    framebufferRef.current = framebuffer;
  }, [framebuffer]);

  // ── Render canvas ──────────────────────────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const theme = THEME_COLORS[colorTheme];
    const fgColor = inverted ? theme.bg : theme.fg;
    const bgColor = inverted ? theme.fg : theme.bg;

    canvas.width = 128 * pixelScale;
    canvas.height = 64 * pixelScale;

    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const fb = framebuffer;
    for (let byteIdx = 0; byteIdx < 1024; byteIdx++) {
      const byte = fb[byteIdx];
      for (let bit = 0; bit < 8; bit++) {
        const pixelIdx = byteIdx * 8 + bit;
        const px = pixelIdx % 128;
        const py = Math.floor(pixelIdx / 128);
        if (byte & (0x80 >> bit)) {
          ctx.fillStyle = fgColor;
          ctx.fillRect(
            px * pixelScale,
            py * pixelScale,
            pixelScale,
            pixelScale,
          );
        }
      }
    }

    // If not connected, draw a placeholder UV-K5 style pattern
    if (!connected) {
      ctx.fillStyle = fgColor;
      ctx.font = `bold ${pixelScale * 2}px monospace`;
      ctx.textAlign = "center";
      ctx.fillText(
        "UV-K5",
        canvas.width / 2,
        canvas.height / 2 - pixelScale * 3,
      );
      ctx.font = `${pixelScale}px monospace`;
      ctx.fillText(
        "F4HWN READY",
        canvas.width / 2,
        canvas.height / 2 + pixelScale,
      );
      ctx.fillText(
        "◄  145.500 FM  ►",
        canvas.width / 2,
        canvas.height / 2 + pixelScale * 3,
      );
      // Scanlines
      ctx.globalAlpha = 0.05;
      ctx.fillStyle = fgColor;
      for (let y = 0; y < canvas.height; y += pixelScale * 2) {
        ctx.fillRect(0, y, canvas.width, pixelScale);
      }
      ctx.globalAlpha = 1.0;
    }
  }, [framebuffer, colorTheme, inverted, pixelScale, connected]);

  // ── Read loop ──────────────────────────────────────────────────────────────
  const readLoop = useCallback(async (port: any) => {
    const reader = port.readable.getReader();
    const buf = new Uint8Array(8192);
    let bufLen = 0;
    let lastFrameTime = performance.now();
    let frameCount = 0;

    try {
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        if (bufLen + value.length > buf.length) {
          buf.copyWithin(0, bufLen - 2048);
          bufLen = 2048;
        }
        buf.set(value, bufLen);
        bufLen += value.length;

        let i = 0;
        while (i < bufLen - 5) {
          if (buf[i] !== 0xaa || buf[i + 1] !== 0x55) {
            i++;
            continue;
          }
          const type = buf[i + 2];
          const size = (buf[i + 3] << 8) | buf[i + 4];
          const frameStart = i + 5;

          if (type === 0x01) {
            if (bufLen - frameStart < 1024) break;
            const newFb = new Uint8Array(1024);
            newFb.set(buf.subarray(frameStart, frameStart + 1024));
            setFramebuffer(newFb);
            i = frameStart + 1024;
            frameCount++;
          } else if (type === 0x02) {
            const blocks = Math.floor(size / 9);
            if (bufLen - frameStart < size) break;
            const fb = framebufferRef.current.slice();
            for (let b = 0; b < blocks; b++) {
              const idx = buf[frameStart + b * 9];
              for (let d = 0; d < 8; d++) {
                if (idx * 8 + d < 1024) {
                  fb[idx * 8 + d] = buf[frameStart + b * 9 + 1 + d];
                }
              }
            }
            setFramebuffer(fb);
            i = frameStart + size;
            frameCount++;
          } else {
            i++;
          }

          const now = performance.now();
          if (now - lastFrameTime >= 1000) {
            setFps(frameCount);
            frameCount = 0;
            lastFrameTime = now;
          }
        }

        if (i > 0) {
          buf.copyWithin(0, i);
          bufLen -= i;
        }
      }
    } catch (e: any) {
      setErrorMsg(`Connection lost: ${e?.message ?? "Unknown error"}`);
      setStatus("error");
      setConnected(false);
    } finally {
      reader.releaseLock();
    }
  }, []);

  // ── Connect ────────────────────────────────────────────────────────────────
  const connectToRadio = useCallback(async () => {
    if (!("serial" in navigator)) {
      setErrorMsg("Web Serial API not supported. Use Chrome or Edge.");
      setStatus("error");
      return;
    }
    setStatus("connecting");
    setErrorMsg("");
    try {
      const port = await (navigator as any).serial.requestPort();
      await port.open({ baudRate: 115200 });
      portRef.current = port;
      setConnected(true);
      setStatus("connected");
      readLoop(port);
    } catch (e: any) {
      if (
        e.name === "NotFoundError" ||
        e.message?.includes("No port selected")
      ) {
        setErrorMsg(
          "No port selected. Click 'Connect' and choose your UV-K5 port.",
        );
      } else if (
        e.message?.includes("firmware") ||
        e.message?.includes("not compatible")
      ) {
        setErrorMsg(
          "Firmware not compatible. Ensure F4HWN v4.x+ is installed.",
        );
      } else {
        setErrorMsg(`Connection failed: ${e?.message ?? "Unknown error"}`);
      }
      setStatus("error");
    }
  }, [readLoop]);

  // ── Disconnect ─────────────────────────────────────────────────────────────
  const disconnect = useCallback(async () => {
    try {
      if (portRef.current) {
        await portRef.current.close();
        portRef.current = null;
      }
    } catch (_) {
      /* ignore */
    }
    setConnected(false);
    setStatus("disconnected");
    setFps(0);
  }, []);

  // ── Screenshot ─────────────────────────────────────────────────────────────
  const takeScreenshot = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const url = canvas.toDataURL("image/png");
    const a = document.createElement("a");
    a.href = url;
    a.download = `uv-k5-screen-${Date.now()}.png`;
    a.click();
  }, []);

  const statusColors: Record<ConnectionStatus, string> = {
    idle: "#888",
    connecting: "#f59e0b",
    connected: "#00ff41",
    error: "#ef4444",
    disconnected: "#888",
  };

  const statusLabels: Record<ConnectionStatus, string> = {
    idle: "Idle – ready to connect",
    connecting: "Connecting…",
    connected: "Connected – live mirror active",
    error: errorMsg || "Error",
    disconnected: "Disconnected",
  };

  const canvasWidth = 128 * pixelScale;
  const canvasHeight = 64 * pixelScale;

  return (
    <div className="flex flex-col items-center gap-6">
      {/* Canvas container */}
      <div
        className="relative"
        style={{
          width: canvasWidth,
          maxWidth: "100%",
          borderRadius: 8,
          border: "2px solid #00f0ff",
          boxShadow: "0 0 24px #00f0ff55, 0 0 48px #00f0ff22",
          overflow: "hidden",
          background: "#000",
        }}
      >
        <canvas
          ref={canvasRef}
          width={canvasWidth}
          height={canvasHeight}
          style={{
            display: "block",
            width: "100%",
            imageRendering: "pixelated",
          }}
          data-ocid="uvk5mirror.canvas_target"
        />
        {/* FPS overlay */}
        {connected && (
          <div
            style={{
              position: "absolute",
              top: 6,
              right: 10,
              fontSize: 11,
              color: "#00ff41",
              fontFamily: "monospace",
              background: "rgba(0,0,0,0.6)",
              padding: "2px 6px",
              borderRadius: 4,
            }}
          >
            {fps} fps
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="flex flex-col gap-4 w-full max-w-xl">
        {/* Row 1: Connect/Disconnect */}
        <div className="flex gap-3 justify-center">
          {!connected ? (
            <button
              type="button"
              data-ocid="uvk5mirror.connect_button"
              onClick={connectToRadio}
              disabled={status === "connecting"}
              style={{
                padding: "10px 28px",
                background: "transparent",
                border: "2px solid #00f0ff",
                color: "#00f0ff",
                borderRadius: 6,
                fontWeight: 700,
                fontSize: 15,
                cursor: status === "connecting" ? "not-allowed" : "pointer",
                boxShadow: "0 0 12px #00f0ff55",
                transition: "box-shadow 0.2s, background 0.2s",
                opacity: status === "connecting" ? 0.6 : 1,
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.boxShadow =
                  "0 0 24px #00f0ffaa";
                (e.currentTarget as HTMLButtonElement).style.background =
                  "#00f0ff18";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.boxShadow =
                  "0 0 12px #00f0ff55";
                (e.currentTarget as HTMLButtonElement).style.background =
                  "transparent";
              }}
            >
              {status === "connecting" ? "Connecting…" : "▶ Connect to UV-K5"}
            </button>
          ) : (
            <button
              type="button"
              data-ocid="uvk5mirror.disconnect_button"
              onClick={disconnect}
              style={{
                padding: "10px 28px",
                background: "transparent",
                border: "2px solid #ef4444",
                color: "#ef4444",
                borderRadius: 6,
                fontWeight: 700,
                fontSize: 15,
                cursor: "pointer",
                boxShadow: "0 0 12px #ef444455",
                transition: "box-shadow 0.2s, background 0.2s",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.boxShadow =
                  "0 0 24px #ef4444aa";
                (e.currentTarget as HTMLButtonElement).style.background =
                  "#ef444418";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.boxShadow =
                  "0 0 12px #ef444455";
                (e.currentTarget as HTMLButtonElement).style.background =
                  "transparent";
              }}
            >
              ■ Disconnect
            </button>
          )}
        </div>

        {/* Row 2: Pixel Scale */}
        <div className="flex items-center justify-center gap-3">
          <span style={{ color: "#888", fontSize: 13 }}>Pixel Scale:</span>
          <button
            type="button"
            data-ocid="uvk5mirror.scale_minus_button"
            onClick={() => setPixelScale((s) => Math.max(4, s - 1))}
            style={btnStyle}
            onMouseEnter={btnHoverIn}
            onMouseLeave={btnHoverOut}
          >
            −
          </button>
          <span
            style={{
              minWidth: 40,
              textAlign: "center",
              color: "#00f0ff",
              fontWeight: 700,
              fontFamily: "monospace",
              fontSize: 15,
            }}
          >
            {pixelScale}×
          </span>
          <button
            type="button"
            data-ocid="uvk5mirror.scale_plus_button"
            onClick={() => setPixelScale((s) => Math.min(12, s + 1))}
            style={btnStyle}
            onMouseEnter={btnHoverIn}
            onMouseLeave={btnHoverOut}
          >
            +
          </button>
        </div>

        {/* Row 3: Color Theme */}
        <div className="flex items-center justify-center gap-2 flex-wrap">
          <span style={{ color: "#888", fontSize: 13 }}>Theme:</span>
          {(["white", "orange", "blue", "grey"] as ColorTheme[]).map(
            (theme) => (
              <button
                type="button"
                key={theme}
                data-ocid={`uvk5mirror.${theme}_theme.toggle`}
                onClick={() => setColorTheme(theme)}
                style={{
                  padding: "6px 14px",
                  background:
                    colorTheme === theme
                      ? `${THEME_COLORS[theme].fg}22`
                      : "transparent",
                  border: `2px solid ${THEME_COLORS[theme].fg}`,
                  color: THEME_COLORS[theme].fg,
                  borderRadius: 5,
                  fontWeight: colorTheme === theme ? 700 : 400,
                  fontSize: 13,
                  cursor: "pointer",
                  boxShadow:
                    colorTheme === theme
                      ? `0 0 10px ${THEME_COLORS[theme].fg}66`
                      : "none",
                  transition: "all 0.2s",
                  textTransform: "capitalize",
                }}
              >
                {theme}
              </button>
            ),
          )}
        </div>

        {/* Row 4: Invert + Screenshot */}
        <div className="flex gap-3 justify-center">
          <button
            type="button"
            data-ocid="uvk5mirror.invert_button"
            onClick={() => setInverted((v) => !v)}
            style={{
              ...btnStyle,
              background: inverted ? "#00f0ff22" : "transparent",
              boxShadow: inverted ? "0 0 12px #00f0ff55" : "none",
            }}
            onMouseEnter={btnHoverIn}
            onMouseLeave={btnHoverOut}
          >
            ⊞ Invert
          </button>
          <button
            type="button"
            data-ocid="uvk5mirror.screenshot_button"
            onClick={takeScreenshot}
            style={btnStyle}
            onMouseEnter={btnHoverIn}
            onMouseLeave={btnHoverOut}
          >
            📷 Screenshot
          </button>
        </div>

        {/* Status bar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "8px 14px",
            background: "#111",
            border: `1px solid ${statusColors[status]}44`,
            borderRadius: 6,
            fontSize: 13,
          }}
        >
          <span
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: statusColors[status],
              flexShrink: 0,
              boxShadow: `0 0 6px ${statusColors[status]}`,
            }}
          />
          <span
            style={{ color: statusColors[status] }}
            data-ocid={
              status === "error"
                ? "uvk5mirror.error_state"
                : status === "connected"
                  ? "uvk5mirror.success_state"
                  : undefined
            }
          >
            {statusLabels[status]}
          </span>
        </div>
      </div>
    </div>
  );
}

// ── Small button style helpers (no React state in callbacks) ──────────────────
const btnStyle: React.CSSProperties = {
  padding: "6px 16px",
  background: "transparent",
  border: "2px solid #00f0ff",
  color: "#00f0ff",
  borderRadius: 5,
  fontWeight: 600,
  fontSize: 13,
  cursor: "pointer",
  boxShadow: "0 0 8px #00f0ff33",
  transition: "box-shadow 0.2s, background 0.2s",
};

const btnHoverIn = (e: React.MouseEvent<HTMLButtonElement>) => {
  e.currentTarget.style.boxShadow = "0 0 18px #00f0ffaa";
  e.currentTarget.style.background = "#00f0ff18";
};

const btnHoverOut = (e: React.MouseEvent<HTMLButtonElement>) => {
  e.currentTarget.style.boxShadow = "0 0 8px #00f0ff33";
  e.currentTarget.style.background = "transparent";
};

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function UVK5LiveMirror() {
  useEffect(() => {
    document.title =
      "UV-K5 Live Screen Mirror Browser – F4HWN WebSerial Guide 2026 | HamWaves";
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
      "Mirror Quansheng UV-K5 LCD live in browser using Web Serial API + F4HWN firmware – real-time display for scanning, no desktop app needed.",
    );
    return () => {
      document.title = "HamWaves";
    };
  }, []);

  const steps = [
    {
      num: 1,
      title: "Install F4HWN Firmware (v4.x+)",
      desc: "Flash the F4HWN custom firmware onto your Quansheng UV-K5. This firmware includes the live screen mirror protocol over USB serial.",
      link: {
        label: "F4HWN GitHub ↗",
        href: "https://github.com/armel/uv-k1-k5v3-firmware-custom",
      },
    },
    {
      num: 2,
      title: "Connect UV-K5 via USB Programming Cable",
      desc: "Use a Quansheng/K5-compatible USB programming cable. Connect to the radio's speaker/mic port. Power the radio on.",
      link: null,
    },
    {
      num: 3,
      title: "Open in Chrome or Edge (HTTPS/localhost)",
      desc: "Web Serial API requires a secure context. This page must be on HTTPS or localhost. Firefox is not supported.",
      link: null,
    },
    {
      num: 4,
      title: "Click 'Connect to UV-K5' Below",
      desc: "A browser port-picker dialog will appear. Select your UV-K5 serial port (usually CP210x or CH340). Click Connect.",
      link: null,
    },
    {
      num: 5,
      title: "Watch Your Screen Mirror Live!",
      desc: "The UV-K5 LCD will appear in real-time in your browser. Use the controls to zoom in, change colors, or take a screenshot.",
      link: null,
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
          paddingBottom: "3rem",
          background: "#0a0a0a",
        }}
      >
        {/* Animated SVG waves bg */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            opacity: 0.12,
            pointerEvents: "none",
          }}
        >
          <svg
            width="100%"
            height="100%"
            viewBox="0 0 1440 400"
            preserveAspectRatio="xMidYMid slice"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <defs>
              <radialGradient id="mirrorGlow" cx="50%" cy="50%" r="60%">
                <stop offset="0%" stopColor="#00f0ff" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#0a0a0a" stopOpacity="0" />
              </radialGradient>
            </defs>
            <rect width="1440" height="400" fill="url(#mirrorGlow)" />
            {[0, 40, 80, 120, 160].map((offset, i) => (
              <ellipse
                key={offset}
                cx="720"
                cy="200"
                rx={200 + offset * 3}
                ry={80 + offset}
                fill="none"
                stroke="#00f0ff"
                strokeWidth="0.8"
                opacity={0.4 - i * 0.07}
              >
                <animateTransform
                  attributeName="transform"
                  type="scale"
                  values="1;1.04;1"
                  dur={`${3 + i * 0.5}s`}
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
            maxWidth: 860,
            margin: "0 auto",
            padding: "0 1.5rem",
          }}
        >
          {/* Nav buttons */}
          <div className="pt-28 md:pt-32 flex flex-wrap gap-3 mb-8">
            <Link
              to="/equipment-reviews/quansheng-uv-k5"
              data-ocid="uvk5mirror.link"
              style={navBtnStyle}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.boxShadow =
                  "0 0 16px #00f0ffaa";
                (e.currentTarget as HTMLAnchorElement).style.background =
                  "#00f0ff18";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.boxShadow =
                  navBtnStyle.boxShadow as string;
                (e.currentTarget as HTMLAnchorElement).style.background =
                  "transparent";
              }}
            >
              ← Back to UV-K5 Review
            </Link>
            <Link
              to="/equipment-reviews"
              style={navBtnStyle}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.boxShadow =
                  "0 0 16px #00f0ffaa";
                (e.currentTarget as HTMLAnchorElement).style.background =
                  "#00f0ff18";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.boxShadow =
                  navBtnStyle.boxShadow as string;
                (e.currentTarget as HTMLAnchorElement).style.background =
                  "transparent";
              }}
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
                gap: 6,
                padding: "4px 14px",
                border: "1px solid #00f0ff55",
                borderRadius: 20,
                fontSize: 12,
                color: "#00f0ff",
                fontWeight: 600,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                background: "#00f0ff0a",
                marginBottom: "1rem",
              }}
            >
              <span
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  background: "#00f0ff",
                  display: "inline-block",
                }}
              />
              WebSerial + Canvas
            </span>
          </motion.div>

          {/* H1 */}
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            style={{
              fontSize: "clamp(1.8rem, 4vw, 3rem)",
              fontWeight: 800,
              lineHeight: 1.15,
              color: "#ffffff",
              marginBottom: "1rem",
              WebkitTextStroke: "1px #000",
            }}
          >
            Live Screen Mirror Your{" "}
            <span style={{ color: "#00f0ff" }}>Quansheng UV-K5</span> in Browser
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            style={{
              fontSize: 16,
              color: "#aaa",
              maxWidth: 640,
              lineHeight: 1.65,
              marginBottom: "2.5rem",
            }}
          >
            Connect your UV-K5 (F4HWN firmware) via USB cable and mirror its LCD
            live in your browser –{" "}
            <strong style={{ color: "#e0e0e0" }}>
              no software install needed!
            </strong>{" "}
            Great for scanning demos, spectrum analyzer view, and big-screen
            monitoring.
          </motion.p>

          {/* LCD mockup */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            style={{
              display: "inline-flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 8,
              marginBottom: "1rem",
            }}
          >
            <div
              style={{
                width: 256,
                height: 128,
                background: "#000a0a",
                border: "2px solid #00f0ff",
                borderRadius: 6,
                boxShadow: "0 0 32px #00f0ff44, 0 0 64px #00f0ff18",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: "monospace",
                fontSize: 14,
                color: "#00f0ff",
                position: "relative",
                overflow: "hidden",
              }}
            >
              {/* Scanlines */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  backgroundImage:
                    "repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,240,255,0.03) 3px, rgba(0,240,255,0.03) 4px)",
                  pointerEvents: "none",
                }}
              />
              <div style={{ fontWeight: 700, fontSize: 18, letterSpacing: 3 }}>
                UV-K5
              </div>
              <div style={{ fontSize: 11, opacity: 0.7, marginTop: 4 }}>
                F4HWN READY
              </div>
              <div style={{ fontSize: 13, marginTop: 8 }}>◄ 145.500 FM ►</div>
              <div style={{ fontSize: 10, opacity: 0.5, marginTop: 6 }}>
                MIRROR STANDBY
              </div>
            </div>
            <span
              style={{ fontSize: 11, color: "#555", fontFamily: "monospace" }}
            >
              128×64 LCD Preview (×2)
            </span>
          </motion.div>
        </div>
      </section>

      {/* ── Warning Box ── */}
      <section
        style={{ maxWidth: 860, margin: "0 auto", padding: "0 1.5rem 2rem" }}
      >
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          style={{
            border: "1px solid #f59e0b",
            background: "#1a1200",
            borderRadius: 8,
            padding: "1rem 1.25rem",
            fontSize: 14,
            color: "#fbbf24",
            lineHeight: 1.6,
          }}
        >
          <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
            <span style={{ fontSize: 18, flexShrink: 0 }}>⚠️</span>
            <div>
              <strong>Requirements: </strong>
              Requires Chrome/Edge browser + HTTPS site. Firmware: F4HWN v4.x+.
              USB programming cable. RX-only safe.
              <br />
              <span
                style={{
                  color: "#f59e0b99",
                  fontSize: 13,
                  marginTop: 4,
                  display: "block",
                }}
              >
                📱 Mobile USB OTG may not work well – desktop Chrome
                recommended.
              </span>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ── Step-by-step ── */}
      <section
        style={{ maxWidth: 860, margin: "0 auto", padding: "0 1.5rem 3rem" }}
      >
        <motion.h2
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          style={{
            fontSize: "clamp(1.3rem, 3vw, 1.8rem)",
            fontWeight: 700,
            color: "#fff",
            marginBottom: "1.5rem",
            WebkitTextStroke: "0.5px #000",
          }}
        >
          How to Get Started
        </motion.h2>

        <div className="flex flex-col gap-4">
          {steps.map((step, i) => (
            <motion.div
              key={step.num}
              initial={{ opacity: 0, x: -16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.07 }}
              style={{
                display: "flex",
                gap: 16,
                background: "#111",
                border: "1px solid #00f0ff22",
                borderRadius: 8,
                padding: "1rem 1.25rem",
              }}
            >
              <div
                style={{
                  width: 32,
                  height: 32,
                  flexShrink: 0,
                  borderRadius: "50%",
                  border: "2px solid #00f0ff",
                  color: "#00f0ff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: 700,
                  fontSize: 14,
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
                    fontSize: 15,
                  }}
                >
                  {step.title}
                </div>
                <div style={{ fontSize: 14, color: "#888", lineHeight: 1.55 }}>
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
                      fontSize: 13,
                      color: "#00f0ff",
                      textDecoration: "none",
                      borderBottom: "1px solid #00f0ff55",
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

      {/* ── Interactive Viewer ── */}
      <section
        style={{
          maxWidth: 920,
          margin: "0 auto",
          padding: "0 1.5rem 3rem",
        }}
      >
        <motion.h2
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          style={{
            fontSize: "clamp(1.3rem, 3vw, 1.8rem)",
            fontWeight: 700,
            color: "#fff",
            marginBottom: "1.75rem",
            WebkitTextStroke: "0.5px #000",
          }}
        >
          Live Mirror Viewer
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{
            background: "#0e0e0e",
            border: "1px solid #00f0ff33",
            borderRadius: 12,
            padding: "2rem 1.5rem",
          }}
        >
          <UVK5MirrorViewer />
        </motion.div>
      </section>

      {/* ── External Links ── */}
      <section
        style={{ maxWidth: 860, margin: "0 auto", padding: "0 1.5rem 4rem" }}
      >
        <motion.h2
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          style={{
            fontSize: "1.4rem",
            fontWeight: 700,
            color: "#fff",
            marginBottom: "1.25rem",
            WebkitTextStroke: "0.5px #000",
          }}
        >
          Useful Links
        </motion.h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            {
              label: "← Back to UV-K5 Review",
              href: "/equipment-reviews/quansheng-uv-k5",
              external: false,
              desc: "Full Quansheng UV-K5 review, firmware guide & RX tips",
            },
            {
              label: "F4HWN Firmware GitHub ↗",
              href: "https://github.com/armel/uv-k1-k5v3-firmware-custom",
              external: true,
              desc: "Official F4HWN custom firmware source and releases",
            },
            {
              label: "Official K5 Viewer ↗",
              href: "https://armel.github.io/k5viewer/",
              external: true,
              desc: "armel's official web-based UV-K5 screen viewer tool",
            },
          ].map((card, cardIdx) => (
            <motion.div
              key={card.href}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: cardIdx * 0.08 }}
            >
              {card.external ? (
                <a
                  href={card.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={linkCardStyle}
                  onMouseEnter={(e) => linkCardHover(e, true)}
                  onMouseLeave={(e) => linkCardHover(e, false)}
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
                  <div style={{ fontSize: 12, color: "#666", lineHeight: 1.5 }}>
                    {card.desc}
                  </div>
                </a>
              ) : (
                <Link
                  to={card.href as "/equipment-reviews/quansheng-uv-k5"}
                  style={linkCardStyle}
                  onMouseEnter={(e) => linkCardHover(e, true)}
                  onMouseLeave={(e) => linkCardHover(e, false)}
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
                  <div style={{ fontSize: 12, color: "#666", lineHeight: 1.5 }}>
                    {card.desc}
                  </div>
                </Link>
              )}
            </motion.div>
          ))}
        </div>
      </section>
    </main>
  );
}

const navBtnStyle: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  padding: "8px 18px",
  background: "transparent",
  border: "2px solid #00f0ff",
  color: "#00f0ff",
  borderRadius: 6,
  fontWeight: 600,
  fontSize: 13,
  textDecoration: "none",
  boxShadow: "0 0 8px #00f0ff33",
  transition: "box-shadow 0.2s, background 0.2s",
  cursor: "pointer",
};

const linkCardStyle: React.CSSProperties = {
  display: "block",
  background: "#111",
  border: "1px solid #00f0ff33",
  borderRadius: 8,
  padding: "1rem 1.25rem",
  textDecoration: "none",
  transition: "border-color 0.2s, box-shadow 0.2s",
  height: "100%",
};

const linkCardHover = (e: React.MouseEvent, enter: boolean) => {
  const el = e.currentTarget as HTMLElement;
  el.style.borderColor = enter ? "#00f0ff" : "#00f0ff33";
  el.style.boxShadow = enter ? "0 0 18px #00f0ff33" : "none";
};
