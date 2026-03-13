import { Link } from "@tanstack/react-router";
import { ArrowLeft, Radio } from "lucide-react";
import { motion } from "motion/react";
import type React from "react";
import { useEffect } from "react";
import RadioWavesBg from "../components/RadioWavesBg";

const shortsLinks = [
  { id: "x16FwkSTi3U", label: "HamWaves Short #1" },
  { id: "0pyDkCAbbv8", label: "HamWaves Short #2" },
  { id: "LOQ2r-YTY9o", label: "HamWaves Short #3" },
  { id: "f1A77KM8QFk", label: "HamWaves Short #4" },
  { id: "V2qggdK5hyU", label: "HamWaves Short #5" },
];

const step1Items: Array<{ id: string; content: React.ReactNode }> = [
  {
    id: "s1-1",
    content: (
      <>
        Go to{" "}
        <a
          href="https://chirp.danplanet.com/projects/chirp/wiki/Download"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "#00f0ff" }}
        >
          chirp.danplanet.com/projects/chirp/wiki/Download
        </a>
      </>
    ),
  },
  {
    id: "s1-2",
    content:
      "Download the latest Windows/macOS/Linux installer (or .exe for Windows).",
  },
  { id: "s1-3", content: "Install like any app — no extras needed." },
  {
    id: "s1-4",
    content:
      'Open CHIRP. If it asks, enable "Developer Mode" under Help menu (helps with custom drivers).',
  },
];

const step2Items: Array<{ id: string; content: React.ReactNode }> = [
  { id: "s2-1", content: "Power off your UV-K5." },
  {
    id: "s2-2",
    content:
      "Plug the programming cable into the radio's side port and your computer's USB.",
  },
  { id: "s2-3", content: "Turn radio volume to max (important for comms)." },
  {
    id: "s2-4",
    content:
      "Power on the radio (it should stay in normal mode — no special button hold).",
  },
  { id: "s2-5", content: "In CHIRP: Radio → Download From Radio..." },
  {
    id: "s2-6",
    content:
      "Select your COM port (Windows: check Device Manager under Ports; usually COM3–COM10).",
  },
  { id: "s2-7", content: "Vendor: Quansheng" },
  {
    id: "s2-8",
    content: (
      <>
        Model: UV-K5(8) or UV-K5 (2024 version may show as UV-K5; use latest
        daily build).{" "}
        <span style={{ color: "#606060" }}>
          For Egzumer/IJV: If not listed, load custom driver (File → Load Module
          → uvk5_EGZUMER.py from{" "}
          <a
            href="https://github.com/egzumer/uvk5-chirp-driver"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "#00f0ff" }}
          >
            github.com/egzumer/uvk5-chirp-driver
          </a>
          ).
        </span>
      </>
    ),
  },
  {
    id: "s2-9",
    content: "Click OK — CHIRP reads the radio (progress bar, ~20–40 seconds).",
  },
];

const step5Items = [
  "File → Save your work (.img).",
  "Radio → Upload To Radio... (same port/model settings).",
  "Wait for upload (~30s).",
  "Disconnect cable, reboot radio (power cycle).",
  "Switch to Channel Mode — test your new channels!",
];

export default function ChirpProgrammingGuide() {
  useEffect(() => {
    document.title =
      "CHIRP Programming Guide Quansheng UV-K5 2026: Beginner Tutorial & Tips | HamWaves";
    let meta = document.querySelector<HTMLMetaElement>(
      "meta[name='description']",
    );
    if (!meta) {
      meta = document.createElement("meta");
      meta.name = "description";
      document.head.appendChild(meta);
    }
    meta.content =
      "Step-by-step CHIRP tutorial for Quansheng UV-K5 – download from radio, add repeaters, custom firmware support (Egzumer/IJV), troubleshooting, and frequency unlocking. Beginner-friendly ham radio programming guide.";
    return () => {
      document.title = "HamWaves | Ham Radio YouTube – Tutorials, Reviews";
    };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.35 }}
      data-ocid="chirp_guide.page"
    >
      {/* Hero */}
      <section
        className="relative flex flex-col items-center justify-center overflow-hidden"
        style={{ minHeight: "60vh" }}
      >
        <RadioWavesBg />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 80% 60% at 50% 70%, rgba(0,240,255,0.06) 0%, transparent 60%), radial-gradient(ellipse 60% 40% at 50% 90%, rgba(168,85,247,0.08) 0%, transparent 60%)",
          }}
        />
        <div className="relative z-10 flex flex-col items-center text-center px-4 max-w-3xl">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-display font-black text-3xl sm:text-5xl leading-tight mb-3"
          >
            CHIRP Programming Guide for Quansheng UV-K5 2026: Beginner
            Step-by-Step Tutorial
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-base sm:text-lg"
            style={{ color: "#707070" }}
          >
            Learn how to program your UV-K5 (or UV-K1) with CHIRP software – add
            repeaters, simplex channels, scan lists, unlock frequencies, and
            more. Perfect for new hams!
          </motion.p>
        </div>
      </section>

      {/* Content */}
      <section className="max-w-3xl mx-auto px-4 py-12">
        {/* Back button */}
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="mb-10"
        >
          <Link to="/equipment-reviews" style={{ textDecoration: "none" }}>
            <motion.span
              className="inline-flex items-center gap-2 glass-card px-4 py-2 rounded-full text-sm font-semibold"
              style={{ color: "#00f0ff", cursor: "pointer" }}
              whileHover={{
                scale: 1.05,
                boxShadow: "0 0 16px rgba(0,240,255,0.3)",
              }}
              whileTap={{ scale: 0.97 }}
              data-ocid="chirp_guide.link"
            >
              <ArrowLeft size={14} />
              Back to All Reviews
            </motion.span>
          </Link>
        </motion.div>

        <div className="flex flex-col gap-6">
          {/* Intro */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="glass-card p-7"
          >
            <div className="flex items-center gap-3 mb-4">
              <Radio size={18} style={{ color: "#00f0ff" }} />
              <h2
                className="font-display font-bold text-xl"
                style={{ color: "#e0e0e0" }}
              >
                Overview
              </h2>
            </div>
            <p
              className="text-base leading-relaxed mb-4"
              style={{ color: "#909090" }}
            >
              CHIRP is the{" "}
              <strong style={{ color: "#e0e0e0" }}>
                free, open-source tool
              </strong>{" "}
              every ham radio operator needs for programming handhelds like the
              Quansheng UV-K5 (UV-K5(8), UV-K6). It lets you easily add
              repeaters, simplex frequencies, tones, scan lists, import from
              databases, and even unlock expanded bands on custom firmware
              (Egzumer or IJV).
            </p>
            <p
              className="text-base leading-relaxed mb-5"
              style={{ color: "#909090" }}
            >
              No more manual menu fiddling — program dozens of channels in
              minutes! This in-depth beginner guide covers everything from
              installation to advanced tips, tested on UV-K5 with 2026 firmware
              versions.
            </p>
            <div
              className="p-4 rounded-xl text-sm italic"
              style={{
                color: "#00f0ff",
                borderLeft: "3px solid #00f0ff",
                background: "rgba(0,240,255,0.05)",
              }}
            >
              Pro tip: Check my HamWaves Shorts for live demos of UV-K5
              programming!
            </div>
          </motion.div>

          {/* Why Use CHIRP */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="glass-card p-7"
          >
            <div className="flex items-center gap-3 mb-4">
              <Radio size={18} style={{ color: "#a855f7" }} />
              <h2
                className="font-display font-bold text-xl"
                style={{ color: "#e0e0e0" }}
              >
                Why Use CHIRP for Quansheng UV-K5?
              </h2>
            </div>
            <ul className="flex flex-col gap-2 mb-5">
              {[
                "Free and cross-platform (Windows, macOS, Linux)",
                "Supports 1000s of radios — including UV-K5 stock and custom firmwares",
                "Import repeater lists from RadioReference or RepeaterBook",
                "Edit memory channels, tones (CTCSS/DCS), offsets, power levels, names",
                "Backup/restore your radio config",
                "Unlock out-of-band TX/RX on Egzumer/IJV firmware",
              ].map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-2 text-sm"
                  style={{ color: "#909090" }}
                >
                  <span style={{ color: "#a855f7" }}>▸</span> {item}
                </li>
              ))}
            </ul>
            <p className="text-sm" style={{ color: "#707070" }}>
              Stock Quansheng software works, but CHIRP is faster, more
              reliable, and ham-community supported.
            </p>
          </motion.div>

          {/* What You'll Need */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="glass-card p-7"
          >
            <div className="flex items-center gap-3 mb-4">
              <Radio size={18} style={{ color: "#00f0ff" }} />
              <h2
                className="font-display font-bold text-xl"
                style={{ color: "#e0e0e0" }}
              >
                What You&apos;ll Need Before Starting
              </h2>
            </div>
            <ul className="flex flex-col gap-2 mb-5">
              {[
                "Quansheng UV-K5 (or compatible variant)",
                "USB programming cable (Kenwood-style 2-pin — cheap on Amazon/AliExpress, ~$8)",
                "Computer (Windows recommended for easiest drivers)",
              ].map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-2 text-sm"
                  style={{ color: "#909090" }}
                >
                  <span style={{ color: "#00f0ff" }}>▸</span> {item}
                </li>
              ))}
              <li
                className="flex items-start gap-2 text-sm"
                style={{ color: "#909090" }}
              >
                <span style={{ color: "#00f0ff" }}>▸</span>
                Latest CHIRP: Download from{" "}
                <a
                  href="https://chirp.danplanet.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: "#00f0ff" }}
                >
                  chirp.danplanet.com
                </a>{" "}
                (use &ldquo;CHIRP-next&rdquo; daily build for best UV-K5 support
                in 2026)
              </li>
            </ul>
            <div
              className="p-4 rounded-xl text-sm font-semibold"
              style={{
                color: "#f59e0b",
                background: "rgba(245,158,11,0.08)",
                border: "1px solid rgba(245,158,11,0.3)",
              }}
            >
              ⚠️ <strong>Important:</strong> For custom firmware (Egzumer v0.22+
              or IJV), CHIRP support is built-in on recent versions. If issues
              arise, load the egzumer uvk5 driver module (details below).
            </div>
          </motion.div>

          {/* Step 1 */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="glass-card p-7"
          >
            <div className="flex items-center gap-3 mb-4">
              <span
                className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                style={{
                  background: "rgba(0,240,255,0.12)",
                  color: "#00f0ff",
                  border: "1px solid rgba(0,240,255,0.25)",
                }}
              >
                1
              </span>
              <h2
                className="font-display font-bold text-xl"
                style={{ color: "#e0e0e0" }}
              >
                Install CHIRP (5 Minutes)
              </h2>
            </div>
            <ol className="flex flex-col gap-3 mb-5">
              {step1Items.map((step, i) => (
                <li key={step.id} className="flex items-start gap-3">
                  <span
                    className="shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
                    style={{
                      background: "rgba(168,85,247,0.12)",
                      color: "#a855f7",
                      border: "1px solid rgba(168,85,247,0.25)",
                    }}
                  >
                    {i + 1}
                  </span>
                  <span
                    className="text-sm leading-relaxed pt-0.5"
                    style={{ color: "#909090" }}
                  >
                    {step.content}
                  </span>
                </li>
              ))}
            </ol>
            <div
              className="p-3 rounded-xl text-sm italic"
              style={{
                color: "#707070",
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.06)",
              }}
            >
              Restart CHIRP after install.
            </div>
          </motion.div>

          {/* Step 2 */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="glass-card p-7"
          >
            <div className="flex items-center gap-3 mb-4">
              <span
                className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                style={{
                  background: "rgba(0,240,255,0.12)",
                  color: "#00f0ff",
                  border: "1px solid rgba(0,240,255,0.25)",
                }}
              >
                2
              </span>
              <h2
                className="font-display font-bold text-xl"
                style={{ color: "#e0e0e0" }}
              >
                Connect Your UV-K5 &amp; Download from Radio
              </h2>
            </div>
            <ol className="flex flex-col gap-3 mb-5">
              {step2Items.map((step, i) => (
                <li key={step.id} className="flex items-start gap-3">
                  <span
                    className="shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
                    style={{
                      background: "rgba(168,85,247,0.12)",
                      color: "#a855f7",
                      border: "1px solid rgba(168,85,247,0.25)",
                    }}
                  >
                    {i + 1}
                  </span>
                  <span
                    className="text-sm leading-relaxed pt-0.5"
                    style={{ color: "#909090" }}
                  >
                    {step.content}
                  </span>
                </li>
              ))}
            </ol>
            <p className="text-sm mb-4" style={{ color: "#707070" }}>
              Success? You&apos;ll see your current memory channels (probably
              empty if new).
            </p>
            <div
              className="p-4 rounded-xl text-sm italic"
              style={{
                color: "#00f0ff",
                borderLeft: "3px solid #00f0ff",
                background: "rgba(0,240,255,0.05)",
              }}
            >
              <strong>Tip:</strong> Save this as a .img file immediately (File →
              Save As) — your backup!
            </div>
          </motion.div>

          {/* Step 3 */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="glass-card p-7"
          >
            <div className="flex items-center gap-3 mb-5">
              <span
                className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                style={{
                  background: "rgba(0,240,255,0.12)",
                  color: "#00f0ff",
                  border: "1px solid rgba(0,240,255,0.25)",
                }}
              >
                3
              </span>
              <h2
                className="font-display font-bold text-xl"
                style={{ color: "#e0e0e0" }}
              >
                Add Channels – Simplex &amp; Repeaters (Core Tutorial)
              </h2>
            </div>
            <p
              className="text-sm leading-relaxed mb-4"
              style={{ color: "#909090" }}
            >
              CHIRP&apos;s Memory Editor looks like a spreadsheet:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-6">
              {[
                ["Location", "Channel number (1–999)"],
                ["Frequency", "RX freq (e.g., 146.520 for 2m calling)"],
                ["Name", '"2m Call" or "Local Repeater"'],
                ["Tone Mode", "Tone (for PL/CTCSS), TSQL, etc."],
                ["Tone", "e.g., 100.0 Hz"],
                ["Duplex", "+ or - (for repeaters)"],
                ["Offset", "0.600 MHz for 2m, 5.000 for 70cm"],
                ["Mode", "FM (default)"],
                ["Power", "High/Med/Low"],
                ["Skip", "S (skip in scan) or blank"],
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="flex gap-2 p-3 rounded-lg"
                  style={{
                    background: "rgba(0,240,255,0.04)",
                    border: "1px solid rgba(0,240,255,0.1)",
                  }}
                >
                  <span
                    className="text-xs font-bold shrink-0"
                    style={{ color: "#00f0ff", minWidth: 72 }}
                  >
                    {label}
                  </span>
                  <span className="text-xs" style={{ color: "#707070" }}>
                    {value}
                  </span>
                </div>
              ))}
            </div>

            {/* Example 1 */}
            <div
              className="rounded-xl p-5 mb-4"
              style={{
                background: "rgba(0,240,255,0.04)",
                border: "1px solid rgba(0,240,255,0.15)",
              }}
            >
              <h3
                className="font-bold text-sm mb-3"
                style={{ color: "#00f0ff" }}
              >
                Example 1: Add Simplex Channel
              </h3>
              <ul
                className="flex flex-col gap-1 text-sm"
                style={{ color: "#909090" }}
              >
                {[
                  "Location: 1",
                  "Frequency: 146.520000",
                  "Name: 2M CALL",
                  "Tone Mode: (None)",
                  "Duplex: off",
                  "Power: High",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <span style={{ color: "#00f0ff" }}>▸</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Example 2 */}
            <div
              className="rounded-xl p-5 mb-5"
              style={{
                background: "rgba(168,85,247,0.05)",
                border: "1px solid rgba(168,85,247,0.2)",
              }}
            >
              <h3
                className="font-bold text-sm mb-3"
                style={{ color: "#a855f7" }}
              >
                Example 2: Add Repeater (e.g., local 2m repeater)
              </h3>
              <ul
                className="flex flex-col gap-1 text-sm"
                style={{ color: "#909090" }}
              >
                {[
                  "Frequency: 146.010000 (output freq)",
                  "Name: CITY RPTR",
                  "Duplex: -",
                  "Offset: 0.600000",
                  "Tone Mode: Tone",
                  "Tone: 100.0 (check repeaterbook.com for your area)",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <span style={{ color: "#a855f7" }}>▸</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <p
              className="text-sm font-semibold mb-2"
              style={{ color: "#e0e0e0" }}
            >
              To import bulk:
            </p>
            <ul
              className="flex flex-col gap-1 text-sm"
              style={{ color: "#909090" }}
            >
              <li className="flex items-start gap-2">
                <span style={{ color: "#00f0ff" }}>▸</span>Radio → Import from
                data source → RepeaterBook (query by location)
              </li>
              <li className="flex items-start gap-2">
                <span style={{ color: "#00f0ff" }}>▸</span>Or File → Import →
                CSV from repeater lists
              </li>
            </ul>
          </motion.div>

          {/* Step 4 */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="glass-card p-7"
          >
            <div className="flex items-center gap-3 mb-4">
              <span
                className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                style={{
                  background: "rgba(0,240,255,0.12)",
                  color: "#00f0ff",
                  border: "1px solid rgba(0,240,255,0.25)",
                }}
              >
                4
              </span>
              <h2
                className="font-display font-bold text-xl"
                style={{ color: "#e0e0e0" }}
              >
                Unlock Frequencies &amp; Custom Firmware Tips
              </h2>
            </div>
            <p className="text-sm mb-3" style={{ color: "#909090" }}>
              On Egzumer/IJV firmware:
            </p>
            <ul className="flex flex-col gap-2 mb-5">
              {[
                'Enable "Show out-of-band" in CHIRP settings (Radio Settings tab)',
                "Add airband (118–137 MHz AM), marine, GMRS/FRS (with legal caution — TX only if licensed)",
                "For Egzumer v0.22+: Native support — no extra module needed in latest CHIRP.",
              ].map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-2 text-sm"
                  style={{ color: "#909090" }}
                >
                  <span style={{ color: "#a855f7" }}>▸</span> {item}
                </li>
              ))}
            </ul>
            <div
              className="p-4 rounded-xl text-sm font-semibold"
              style={{
                color: "#f59e0b",
                background: "rgba(245,158,11,0.08)",
                border: "1px solid rgba(245,158,11,0.3)",
              }}
            >
              ⚠️ <strong>Warning:</strong> Only transmit on licensed frequencies.
              Use responsibly!
            </div>
          </motion.div>

          {/* Step 5 */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="glass-card p-7"
          >
            <div className="flex items-center gap-3 mb-4">
              <span
                className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                style={{
                  background: "rgba(0,240,255,0.12)",
                  color: "#00f0ff",
                  border: "1px solid rgba(0,240,255,0.25)",
                }}
              >
                5
              </span>
              <h2
                className="font-display font-bold text-xl"
                style={{ color: "#e0e0e0" }}
              >
                Upload Back to Radio &amp; Test
              </h2>
            </div>
            <ol className="flex flex-col gap-3">
              {step5Items.map((item, i) => (
                <li key={item} className="flex items-start gap-3">
                  <span
                    className="shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
                    style={{
                      background: "rgba(168,85,247,0.12)",
                      color: "#a855f7",
                      border: "1px solid rgba(168,85,247,0.25)",
                    }}
                  >
                    {i + 1}
                  </span>
                  <span
                    className="text-sm leading-relaxed pt-0.5"
                    style={{ color: "#909090" }}
                  >
                    {item}
                  </span>
                </li>
              ))}
            </ol>
          </motion.div>

          {/* Troubleshooting */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="glass-card p-7"
          >
            <div className="flex items-center gap-3 mb-4">
              <Radio size={18} style={{ color: "#f59e0b" }} />
              <h2
                className="font-display font-bold text-xl"
                style={{ color: "#e0e0e0" }}
              >
                Common Troubleshooting for UV-K5 CHIRP Issues
              </h2>
            </div>
            <div className="flex flex-col gap-3">
              {[
                [
                  "Radio not responding",
                  "Volume max, restart PC/CHIRP, try different USB port/cable, reinstall drivers (Prolific or generic).",
                ],
                [
                  "Firmware not supported",
                  "Use latest CHIRP daily + load egzumer driver if needed.",
                ],
                [
                  "Failed upload",
                  "Power cycle radio, ensure no menu open on radio.",
                ],
                [
                  "No Quansheng in list",
                  "Developer mode + manual module load.",
                ],
              ].map(([issue, fix]) => (
                <div
                  key={issue}
                  className="rounded-xl p-4"
                  style={{
                    background: "rgba(245,158,11,0.05)",
                    border: "1px solid rgba(245,158,11,0.18)",
                  }}
                >
                  <p
                    className="text-sm font-bold mb-1"
                    style={{ color: "#f59e0b" }}
                  >
                    ❌ &ldquo;{issue}&rdquo;
                  </p>
                  <p className="text-sm" style={{ color: "#909090" }}>
                    {fix}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Pros & Cons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="glass-card p-7"
          >
            <div className="flex items-center gap-3 mb-5">
              <Radio size={18} style={{ color: "#00f0ff" }} />
              <h2
                className="font-display font-bold text-xl"
                style={{ color: "#e0e0e0" }}
              >
                Pros &amp; Cons of Using CHIRP with UV-K5
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div
                className="rounded-xl p-5"
                style={{
                  background: "rgba(0,240,255,0.04)",
                  border: "1px solid rgba(0,240,255,0.15)",
                }}
              >
                <h3
                  className="font-bold text-sm mb-3"
                  style={{ color: "#00f0ff" }}
                >
                  ✅ Pros
                </h3>
                <ul className="flex flex-col gap-2">
                  {[
                    "Free & powerful",
                    "Bulk import/export",
                    "Custom firmware unlocks",
                    "Community repeater databases",
                  ].map((p) => (
                    <li
                      key={p}
                      className="text-sm flex items-start gap-2"
                      style={{ color: "#909090" }}
                    >
                      <span style={{ color: "#00f0ff" }}>+</span> {p}
                    </li>
                  ))}
                </ul>
              </div>
              <div
                className="rounded-xl p-5"
                style={{
                  background: "rgba(168,85,247,0.04)",
                  border: "1px solid rgba(168,85,247,0.15)",
                }}
              >
                <h3
                  className="font-bold text-sm mb-3"
                  style={{ color: "#a855f7" }}
                >
                  ❌ Cons
                </h3>
                <ul className="flex flex-col gap-2">
                  {[
                    "Learning curve first time",
                    "Cable quality matters",
                    "Driver quirks on older Windows",
                  ].map((c) => (
                    <li
                      key={c}
                      className="text-sm flex items-start gap-2"
                      style={{ color: "#909090" }}
                    >
                      <span style={{ color: "#a855f7" }}>−</span> {c}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>

          {/* Final Thoughts */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="glass-card p-7"
          >
            <div className="flex items-center gap-3 mb-4">
              <Radio size={18} style={{ color: "#a855f7" }} />
              <h2
                className="font-display font-bold text-xl"
                style={{ color: "#e0e0e0" }}
              >
                Final Thoughts: Level Up Your UV-K5 Shack
              </h2>
            </div>
            <p
              className="text-base leading-relaxed mb-4"
              style={{ color: "#909090" }}
            >
              Mastering CHIRP turns your cheap UV-K5 into a fully customized
              workhorse for local nets, SOTA, airband monitoring, and more.
              Start simple — add 5–10 local repeaters today!
            </p>
            <p className="text-sm" style={{ color: "#707070" }}>
              Subscribe for more guides like UV-K5 mods, antenna builds, and
              field ops.
            </p>
          </motion.div>
        </div>

        {/* Related Shorts */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mt-16"
        >
          <div className="flex items-center gap-3 mb-6">
            <h2
              className="font-display font-bold text-xl"
              style={{ color: "#e0e0e0" }}
            >
              Related Shorts
            </h2>
            <div
              className="flex-1 h-px"
              style={{
                background:
                  "linear-gradient(to right, rgba(0,240,255,0.2), transparent)",
              }}
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-8">
            {shortsLinks.map((short, i) => (
              <motion.a
                key={short.id}
                href={`https://www.youtube.com/shorts/${short.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="glass-card p-4 flex items-center gap-3 rounded-xl"
                style={{ textDecoration: "none", color: "#e0e0e0" }}
                whileHover={{
                  scale: 1.03,
                  boxShadow: "0 0 18px rgba(0,240,255,0.2)",
                }}
                whileTap={{ scale: 0.97 }}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.07 }}
                data-ocid={`chirp_guide.item.${i + 1}`}
              >
                <span
                  className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
                  style={{
                    background: "rgba(0,240,255,0.1)",
                    border: "1px solid rgba(0,240,255,0.25)",
                  }}
                >
                  <Radio size={14} style={{ color: "#00f0ff" }} />
                </span>
                <span className="text-sm font-semibold">{short.label}</span>
                <span className="ml-auto text-xs" style={{ color: "#00f0ff" }}>
                  ▶
                </span>
              </motion.a>
            ))}
          </div>

          {/* Subscribe CTA */}
          <div className="text-center">
            <h3 className="font-display font-black text-2xl sm:text-3xl mb-2">
              Subscribe for More Guides!
            </h3>
            <p className="text-sm mb-6" style={{ color: "#606060" }}>
              New UV-K5 tutorials, antenna builds, and field ops on YouTube
              weekly.
            </p>
            <a
              href="https://www.youtube.com/@dmtoozer"
              target="_blank"
              rel="noopener noreferrer"
              style={{ textDecoration: "none" }}
            >
              <motion.span
                className="btn-neon-cyan text-base px-8 py-3 inline-flex items-center gap-2"
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0 0 24px rgba(0,240,255,0.4)",
                }}
                whileTap={{ scale: 0.97 }}
                data-ocid="chirp_guide.primary_button"
              >
                Subscribe on YouTube →
              </motion.span>
            </a>
          </div>
        </motion.div>
      </section>
    </motion.div>
  );
}
