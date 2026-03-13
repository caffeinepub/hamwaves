import { Link } from "@tanstack/react-router";
import { ArrowLeft, Radio } from "lucide-react";
import { motion } from "motion/react";
import type React from "react";
import { useEffect } from "react";
import RadioWavesBg from "../components/RadioWavesBg";

const specs = [
  { label: "Bands", value: "VHF 136–174 / UHF 400–520 MHz" },
  { label: "Power", value: "5W / 1W / 0.5W" },
  { label: "Display", value: "1.77″ Color LCD" },
  { label: "Battery", value: "1600 mAh Li-ion" },
  { label: "Size/Weight", value: "Compact (Baofeng-class)" },
  { label: "Price", value: "$20–$30" },
  { label: "Extras", value: "FM / Flashlight / NOAA" },
];

const pros = [
  "Under $30 — unbeatable value",
  "Huge custom firmware community",
  "Built-in spectrum analyzer (with firmware)",
  "Wide RX coverage after flashing",
  "Easy to flash (web flasher, no software needed)",
  "Great for beginners AND experimenters",
];

const cons = [
  "Stock firmware is basic",
  "Cheap plastic feel on buttons",
  "Stock antenna is mediocre",
  "No waterproof/IP rating",
  "TX power drops at high duty cycle",
];

const comingSoon = [
  { title: "CHIRP Programming Masterclass for Beginners" },
  { title: "Best Antennas & Mods for the UV-K5" },
  { title: "Quansheng UV-K6 SSB Mod Guide" },
];

const flashSteps: Array<{ id: string; content: React.ReactNode }> = [
  {
    id: "step-1",
    content:
      "Get the right cable — Kenwood 2 pin USB programming cable for UV-K5 (~$8).",
  },
  {
    id: "step-2",
    content: (
      <>
        Go to the official web flasher:{" "}
        <a
          href="https://egzumer.github.io/uvtools/"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "#00f0ff" }}
        >
          https://egzumer.github.io/uvtools/
        </a>
      </>
    ),
  },
  {
    id: "step-3",
    content: "Put radio in flash mode: Power off → hold PTT while powering on.",
  },
  { id: "step-4", content: "Connect cable and select firmware." },
  { id: "step-5", content: "Flash and wait 30–60 seconds. Done!" },
];

export default function QuanshengUVK5Review() {
  useEffect(() => {
    document.title = "Equipment Reviews & Guides | HamWaves";
    let meta = document.querySelector<HTMLMetaElement>(
      "meta[name='description']",
    );
    if (!meta) {
      meta = document.createElement("meta");
      meta.name = "description";
      document.head.appendChild(meta);
    }
    meta.content =
      "In-depth Quansheng UV-K5 reviews, custom firmware flashing guides, CHIRP tutorials and ham radio equipment breakdowns. New guides added monthly!";
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
      data-ocid="uv_k5_review.page"
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
        <div className="relative z-10 flex flex-col items-center text-center px-4">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-display font-black text-3xl sm:text-5xl leading-tight mb-3 glow-cyan"
          >
            Quansheng UV-K5 Review 2026
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-base sm:text-lg"
            style={{ color: "#707070" }}
          >
            The Ultimate Hackable Budget Ham Radio
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
              data-ocid="uv_k5_review.link"
            >
              <ArrowLeft size={14} />
              Back to Reviews
            </motion.span>
          </Link>
        </motion.div>

        <div className="flex flex-col gap-6">
          {/* Overview */}
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
              className="text-base leading-relaxed mb-5"
              style={{ color: "#909090" }}
            >
              If you&apos;re a ham radio operator looking for serious
              performance without spending hundreds, the Quansheng UV-K5 (and
              its variants like UV-K5(8) and UV-K6) is still the king of budget
              handhelds in 2026. For under $30 you get a dual-band VHF/UHF radio
              that&apos;s ridiculously modifiable thanks to its open firmware
              scene. In this complete breakdown I&apos;ll cover stock features,
              why custom firmware transforms it, the easiest flashing method,
              unlocked mods, spectrum analyzer, and exactly how to use it in the
              field.
            </p>
            <div
              className="p-4 rounded-xl text-sm italic"
              style={{
                color: "#00f0ff",
                borderLeft: "3px solid #00f0ff",
                background: "rgba(0,240,255,0.05)",
              }}
            >
              Pro tip: I&apos;ve tested these on my own UV-K5(8) — footage in my
              latest HamWaves Shorts!
            </div>
          </motion.div>

          {/* Specs at a Glance */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.05 }}
            className="glass-card p-7"
          >
            <div className="flex items-center gap-3 mb-5">
              <Radio size={18} style={{ color: "#a855f7" }} />
              <h2
                className="font-display font-bold text-xl"
                style={{ color: "#e0e0e0" }}
              >
                Specs at a Glance
              </h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-5">
              {specs.map((spec) => (
                <div
                  key={spec.label}
                  className="flex flex-col p-4 rounded-xl"
                  style={{
                    background: "rgba(0,240,255,0.04)",
                    border: "1px solid rgba(0,240,255,0.12)",
                  }}
                >
                  <span
                    className="text-xs uppercase tracking-wide mb-1"
                    style={{ color: "#505050" }}
                  >
                    {spec.label}
                  </span>
                  <span className="font-display font-bold text-sm glow-cyan">
                    {spec.value}
                  </span>
                </div>
              ))}
            </div>
            <p className="text-sm leading-relaxed" style={{ color: "#707070" }}>
              Out of the box it&apos;s already better than most $30 radios —
              solid receive, decent audio, and easy programming with CHIRP. But
              the real magic starts when you flash custom firmware.
            </p>
          </motion.div>

          {/* Stock Firmware Limitations */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.05 }}
            className="glass-card p-7"
          >
            <div className="flex items-center gap-3 mb-4">
              <Radio size={18} style={{ color: "#a855f7" }} />
              <h2
                className="font-display font-bold text-xl"
                style={{ color: "#e0e0e0" }}
              >
                Stock Firmware Limitations
              </h2>
            </div>
            <p
              className="text-base leading-relaxed"
              style={{ color: "#909090" }}
            >
              The factory firmware locks transmit to ham bands only and has
              basic scanning. No spectrum analyzer, weak AM airband reception,
              limited menu options, and no SSB/CW support. Ham operators quickly
              outgrow it — especially for airband monitoring, field ops, or
              experimenting with digital modes.
            </p>
          </motion.div>

          {/* Custom Firmware Revolution */}
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
                The Custom Firmware Revolution: Egzumer vs IJV Mod (2026 Best
                Options)
              </h2>
            </div>
            <p
              className="text-sm leading-relaxed mb-6"
              style={{ color: "#909090" }}
            >
              The UV-K5 became legendary because the firmware is completely open
              and flashable. Two stand-out options dominate in 2026:
            </p>

            {/* Egzumer */}
            <div
              className="rounded-xl p-5 mb-4"
              style={{
                background: "rgba(168,85,247,0.05)",
                border: "1px solid rgba(168,85,247,0.2)",
              }}
            >
              <h3
                className="font-display font-bold text-base mb-1"
                style={{ color: "#a855f7" }}
              >
                1. Egzumer Firmware (Most Popular for Beginners)
              </h3>
              <p className="text-xs mb-3" style={{ color: "#606060" }}>
                GitHub: egzumer/uv-k5-firmware-custom (latest v0.22+)
              </p>
              <ul
                className="text-sm space-y-1 mb-3"
                style={{ color: "#909090" }}
              >
                {[
                  "Built-in spectrum analyzer (real-time waterfall!)",
                  "AM fix for crystal-clear airband",
                  "Fast scanning, channel name editing, long-press shortcuts",
                  "FM broadcast bands switching",
                  "Battery saver improvements",
                ].map((f) => (
                  <li key={f} className="flex items-start gap-2">
                    <span style={{ color: "#a855f7" }}>▸</span> {f}
                  </li>
                ))}
              </ul>
              <p className="text-xs italic" style={{ color: "#606060" }}>
                Perfect for everyday ham use and monitoring.
              </p>
            </div>

            {/* IJV */}
            <div
              className="rounded-xl p-5 mb-6"
              style={{
                background: "rgba(0,240,255,0.04)",
                border: "1px solid rgba(0,240,255,0.15)",
              }}
            >
              <h3
                className="font-display font-bold text-base mb-1"
                style={{ color: "#00f0ff" }}
              >
                2. IJV Mod (Best for Advanced Users &amp; Weak Signals)
              </h3>
              <p className="text-xs mb-3" style={{ color: "#606060" }}>
                Versions up to 3.0+ (still actively updated)
              </p>
              <ul className="text-sm space-y-1" style={{ color: "#909090" }}>
                {[
                  "SSB / CW support (great with optional HF mod board on UV-K6)",
                  "Adjustable RF gain & bandwidth filters",
                  "Better weak-signal performance on HF/VHF",
                  "More menu items (up to 70+ secret options)",
                ].map((f) => (
                  <li key={f} className="flex items-start gap-2">
                    <span style={{ color: "#00f0ff" }}>▸</span> {f}
                  </li>
                ))}
              </ul>
            </div>

            {/* Recommendation callout */}
            <div
              className="p-4 rounded-xl text-sm font-semibold"
              style={{
                color: "#e0e0e0",
                background: "rgba(0,240,255,0.07)",
                border: "1px solid rgba(0,240,255,0.2)",
              }}
            >
              💡 My recommendation: Start with Egzumer for 90% of hams. Switch
              to IJV if you chase SSB or need HF receive.
            </div>
          </motion.div>

          {/* How to Flash */}
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
                How to Flash Custom Firmware (5 Minutes)
              </h2>
            </div>

            {/* Warning */}
            <div
              className="p-4 rounded-xl text-sm mb-6"
              style={{
                color: "#f59e0b",
                background: "rgba(245,158,11,0.08)",
                border: "1px solid rgba(245,158,11,0.3)",
              }}
            >
              ⚠️ This voids warranty and is at your own risk. Always back up your
              stock firmware first. Only transmit on frequencies you&apos;re
              licensed for!
            </div>

            <ol className="flex flex-col gap-4 mb-6">
              {flashSteps.map((step, i) => (
                <li key={step.id} className="flex items-start gap-3">
                  <span
                    className="shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
                    style={{
                      background: "rgba(0,240,255,0.12)",
                      color: "#00f0ff",
                      border: "1px solid rgba(0,240,255,0.25)",
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
              className="p-4 rounded-xl text-sm italic"
              style={{
                color: "#00f0ff",
                borderLeft: "3px solid #00f0ff",
                background: "rgba(0,240,255,0.05)",
              }}
            >
              Pro tip: The web tool also lets you patch your own firmware.
            </div>
          </motion.div>

          {/* Unlocked Features */}
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
                Unlocked Features &amp; Mod Possibilities
              </h2>
            </div>
            <ul className="flex flex-col gap-2 mb-5">
              {[
                "Spectrum Analyzer — Scan 1–130 MHz spans in real time",
                "Expanded RX — 18 MHz to 850+ MHz",
                "Expanded TX (with caution)",
                "AM/SSB/CW reception & transmit",
                "Text messaging between radios",
                "Hardware mods: Add HF board for SSB, better antennas",
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
                background: "rgba(245,158,11,0.06)",
                border: "1px solid rgba(245,158,11,0.2)",
              }}
            >
              ⚖️ Legal note: Always stay within your license privileges.
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
                Pros &amp; Cons
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
                  {pros.map((p) => (
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
                  {cons.map((c) => (
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

          {/* Verdict */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="glass-card p-7"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <Radio size={18} style={{ color: "#a855f7" }} />
                <h2
                  className="font-display font-bold text-xl"
                  style={{ color: "#e0e0e0" }}
                >
                  Verdict
                </h2>
              </div>
              <span className="font-display font-black text-3xl glow-cyan">
                9/10
              </span>
            </div>
            <p
              className="text-base leading-relaxed"
              style={{ color: "#909090" }}
            >
              At its price point, the UV-K5 is essentially unbeatable. The stock
              firmware is passable, but installing custom firmware transforms it
              into a genuinely capable radio that rivals units costing five
              times more. Minor gripes — the stock antenna is mediocre and the
              keypad feel is plasticky — are easily overlooked given the
              performance per dollar ratio. If you&apos;re looking for a first
              handheld or a cheap grab-and-go portable, the UV-K5 is a
              near-automatic recommendation.
            </p>
          </motion.div>
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mt-14 text-center"
        >
          <h2 className="font-display font-black text-2xl sm:text-3xl glow-cyan mb-2">
            Watch My UV-K5(8) Hands-On Tests
          </h2>
          <p className="text-sm mb-6" style={{ color: "#606060" }}>
            See it in action in my latest HamWaves Shorts on YouTube
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
              data-ocid="uv_k5_review.primary_button"
            >
              Watch on YouTube →
            </motion.span>
          </a>
        </motion.div>

        {/* More Coming Soon */}
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
              style={{ color: "#505050" }}
            >
              More Coming Soon
            </h2>
            <div
              className="flex-1 h-px"
              style={{
                background:
                  "linear-gradient(to right, rgba(255,255,255,0.08), transparent)",
              }}
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {comingSoon.map((card, i) => (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className="glass-card overflow-hidden flex flex-col"
                style={{ opacity: 0.45 }}
                data-ocid={`uv_k5_review.item.${i + 1}`}
              >
                <div
                  className="flex items-center justify-center"
                  style={{ aspectRatio: "16/9", background: "#111111" }}
                >
                  <Radio size={32} style={{ color: "#404040" }} />
                </div>
                <div className="p-4 flex flex-col gap-2">
                  <span
                    className="text-xs px-2 py-0.5 rounded-full font-semibold self-start"
                    style={{
                      background: "rgba(168,85,247,0.15)",
                      color: "#a855f7",
                      border: "1px solid rgba(168,85,247,0.3)",
                    }}
                  >
                    Coming Soon
                  </span>
                  <h3
                    className="font-display font-bold text-sm leading-snug"
                    style={{ color: "#707070" }}
                  >
                    {card.title}
                  </h3>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>
    </motion.div>
  );
}
