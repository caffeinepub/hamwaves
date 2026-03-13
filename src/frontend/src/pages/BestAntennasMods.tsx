import { Link } from "@tanstack/react-router";
import { ArrowLeft, Radio } from "lucide-react";
import { motion } from "motion/react";
import { useEffect } from "react";
import RadioWavesBg from "../components/RadioWavesBg";

const shortsLinks = [
  { id: "vJu--Y2fG54", label: "This UV-K5 AM fix is insane" },
  {
    id: "x16FwkSTi3U",
    label: "real military ATC chatter caught on budget scanner",
  },
  { id: "uqvBpZlFNH8", label: "ISS broadcasting directly into my radio" },
  {
    id: "2Vg5Qvr6uEY",
    label: "Budget handheld beats expensive radios for ISS reception",
  },
  { id: "mOg_0YW2HRI", label: "pilots hate knowing this $20 radio works" },
];

export default function BestAntennasMods() {
  useEffect(() => {
    document.title =
      "Best Antennas & Mods for Quansheng UV-K5 2026: Nagoya NA-771, Tactical & More | HamWaves";
    let meta = document.querySelector<HTMLMetaElement>(
      "meta[name='description']",
    );
    if (!meta) {
      meta = document.createElement("meta");
      meta.name = "description";
      document.head.appendChild(meta);
    }
    meta.content =
      "Best antenna for Quansheng UV-K5 – Nagoya NA-771 review, tactical foldable options, mods for better RX gain/dB, noise reduction, SOTA/portable use. Real improvements & buying tips 2026.";
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
      data-ocid="antennas_mods.page"
    >
      {/* Hero */}
      <section
        className="relative flex flex-col items-center justify-center overflow-hidden"
        style={{ paddingBottom: "3rem" }}
      >
        <RadioWavesBg />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 80% 60% at 50% 70%, rgba(0,240,255,0.06) 0%, transparent 60%), radial-gradient(ellipse 60% 40% at 50% 90%, rgba(168,85,247,0.08) 0%, transparent 60%)",
          }}
        />
        <div className="relative z-10 flex flex-col items-center text-center px-4 max-w-3xl pt-24">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-display font-black text-3xl sm:text-5xl leading-tight mb-3"
          >
            Best Antennas &amp; Mods for Quansheng UV-K5 2026: Upgrade Your
            Signal
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-base sm:text-lg"
            style={{ color: "#707070" }}
          >
            Top aftermarket antennas (Nagoya NA-771, tactical options &amp;
            more), hardware mods, RX/TX improvements, gain estimates, noise
            reduction tips, and portable/SOTA recommendations for the
            UV-K5(8)/UV-K1.
          </motion.p>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          style={{
            width: "100%",
            maxWidth: "900px",
            margin: "2rem auto 0",
            borderRadius: "12px",
            overflow: "hidden",
            border: "1.5px solid rgba(0,240,255,0.35)",
            boxShadow:
              "0 0 24px rgba(0,240,255,0.15), 0 0 60px rgba(0,240,255,0.07)",
          }}
        >
          <img
            src="/assets/generated/hero-antennas.dim_1200x500.jpg"
            alt="Best antennas and mods for UV-K5 hero"
            style={{
              width: "100%",
              height: "auto",
              display: "block",
              objectFit: "cover",
              objectPosition: "center",
            }}
            loading="eager"
          />
        </motion.div>
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
              data-ocid="antennas_mods.link"
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
              The stock antenna on the Quansheng UV-K5 (UV-K5(8), UV-K6) is
              decent for a budget radio, but swapping it for an aftermarket whip
              or adding simple mods can dramatically improve RX sensitivity,
              reduce noise, extend range, and make your handheld shine for local
              repeaters, airband monitoring, SOTA activations, or field ops.
            </p>
            <p
              className="text-base leading-relaxed mb-5"
              style={{ color: "#909090" }}
            >
              In this guide I cover the{" "}
              <strong style={{ color: "#e0e0e0" }}>best antennas</strong>{" "}
              (tested in 2026 community reviews), tactical/foldable options,
              estimated improvements (gain in dB, noise floor drop), and easy
              hardware mods. All SMA-female compatible — no soldering required
              for most!
            </p>
            <div
              className="p-4 rounded-xl text-sm italic"
              style={{
                color: "#00f0ff",
                borderLeft: "3px solid #00f0ff",
                background: "rgba(0,240,255,0.05)",
              }}
            >
              Pro tip: Pair these with custom firmware like Egzumer for spectrum
              analyzer views of your new signal boost. Footage in my HamWaves
              Shorts!
            </div>
          </motion.div>

          {/* Why Upgrade */}
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
                Why Upgrade the UV-K5 Antenna? Real-World Improvements
              </h2>
            </div>
            <div className="flex flex-col gap-4 mb-4">
              <div
                className="rounded-xl p-4"
                style={{
                  background: "rgba(168,85,247,0.05)",
                  border: "1px solid rgba(168,85,247,0.18)",
                }}
              >
                <p
                  className="text-sm font-bold mb-2"
                  style={{ color: "#a855f7" }}
                >
                  Stock antenna issues
                </p>
                <p className="text-sm" style={{ color: "#909090" }}>
                  Short (~4-5 inches), stiff, average SWR on VHF/UHF, weak on
                  fringe signals or noisy environments.
                </p>
              </div>
              <div
                className="rounded-xl p-4"
                style={{
                  background: "rgba(0,240,255,0.04)",
                  border: "1px solid rgba(0,240,255,0.15)",
                }}
              >
                <p
                  className="text-sm font-bold mb-2"
                  style={{ color: "#00f0ff" }}
                >
                  Aftermarket benefits
                </p>
                <ul className="flex flex-col gap-2">
                  {[
                    "+2–6 dB gain (often 3–5 dB effective in real use) → 20–50% more range",
                    "Lower noise floor (better RX quieting, clearer weak signals)",
                    "Better SWR matching → cleaner TX, less heat/power waste",
                    "Portable/SOTA-friendly: lighter, flexible, or foldable designs",
                  ].map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-2 text-sm"
                      style={{ color: "#909090" }}
                    >
                      <span style={{ color: "#00f0ff" }}>▸</span> {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <p className="text-sm" style={{ color: "#707070" }}>
              Biggest wins: Repeaters 10–30+ miles away become reliable;
              airband/NOAA clearer; portable ops less frustrating.
            </p>
          </motion.div>

          {/* Top Antennas */}
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
                Top Recommended Antennas for Quansheng UV-K5 (2026)
              </h2>
            </div>

            {/* Antenna 1 */}
            <div
              className="rounded-xl p-5 mb-4"
              style={{
                background: "rgba(0,240,255,0.04)",
                border: "1px solid rgba(0,240,255,0.2)",
              }}
            >
              <div className="flex items-center gap-2 mb-3">
                <span
                  className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                  style={{
                    background: "rgba(0,240,255,0.15)",
                    color: "#00f0ff",
                    border: "1px solid rgba(0,240,255,0.3)",
                  }}
                >
                  1
                </span>
                <h3 className="font-bold text-sm" style={{ color: "#00f0ff" }}>
                  Nagoya NA-771{" "}
                  <span style={{ color: "#707070", fontWeight: 400 }}>
                    (Best Overall / Most Popular Upgrade)
                  </span>
                </h3>
              </div>
              <ul
                className="flex flex-col gap-1 text-sm"
                style={{ color: "#909090" }}
              >
                {[
                  "Length: ~15.6 inches (flexible whip)",
                  "Gain: ~2–3 dBi (VHF/UHF dual-band)",
                  "Real improvements: +3–5 dB RX sensitivity vs stock; noticeably quieter noise floor; better TX punch for simplex/repeaters.",
                  "Best for: Everyday ham use, local nets, airband monitoring.",
                  "Price: $10–15 (Amazon/AliExpress — buy authentic to avoid fakes)",
                  "Drawbacks: Longer = less pocketable, but flexible rubber avoids breakage.",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <span style={{ color: "#00f0ff" }}>▸</span> {item}
                  </li>
                ))}
              </ul>
              <p
                className="text-sm mt-3 font-semibold"
                style={{ color: "#e0e0e0" }}
              >
                Verdict: The go-to upgrade — community favorite for
                UV-K5/Baofeng-style radios.
              </p>
            </div>

            {/* Antenna 2 */}
            <div
              className="rounded-xl p-5 mb-4"
              style={{
                background: "rgba(168,85,247,0.04)",
                border: "1px solid rgba(168,85,247,0.18)",
              }}
            >
              <div className="flex items-center gap-2 mb-3">
                <span
                  className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                  style={{
                    background: "rgba(168,85,247,0.15)",
                    color: "#a855f7",
                    border: "1px solid rgba(168,85,247,0.3)",
                  }}
                >
                  2
                </span>
                <h3 className="font-bold text-sm" style={{ color: "#a855f7" }}>
                  Signal Stick / Similar Slim Dual-Band{" "}
                  <span style={{ color: "#707070", fontWeight: 400 }}>
                    (Best Portable/SOTA)
                  </span>
                </h3>
              </div>
              <ul
                className="flex flex-col gap-1 text-sm"
                style={{ color: "#909090" }}
              >
                {[
                  "Length: ~19 inches (collapsible or flexible)",
                  "Gain: ~2.5–4 dBi claimed",
                  "Improvements: Excellent RX clarity in portable setups; low SWR on 2m/70cm; great for SOTA/POTA with less wind drag.",
                  "Best for: Hiking, activations, backpack carry.",
                  "Price: $15–25",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <span style={{ color: "#a855f7" }}>▸</span> {item}
                  </li>
                ))}
              </ul>
              <p
                className="text-sm mt-3 font-semibold"
                style={{ color: "#e0e0e0" }}
              >
                Verdict: If you want max performance without bulk — many hams
                prefer this over NA-771 for field use.
              </p>
            </div>

            {/* Antenna 3 */}
            <div
              className="rounded-xl p-5 mb-4"
              style={{
                background: "rgba(0,240,255,0.03)",
                border: "1px solid rgba(0,240,255,0.12)",
              }}
            >
              <div className="flex items-center gap-2 mb-3">
                <span
                  className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                  style={{
                    background: "rgba(0,240,255,0.12)",
                    color: "#00f0ff",
                    border: "1px solid rgba(0,240,255,0.25)",
                  }}
                >
                  3
                </span>
                <h3 className="font-bold text-sm" style={{ color: "#00f0ff" }}>
                  Tactical / Foldable CS Antennas{" "}
                  <span style={{ color: "#707070", fontWeight: 400 }}>
                    (ABBREE AR-771, TIDRADIO, Bingfu 42.5&quot;)
                  </span>
                </h3>
              </div>
              <ul
                className="flex flex-col gap-1 text-sm"
                style={{ color: "#909090" }}
              >
                {[
                  "Length: 18–42 inches (foldable tactical style)",
                  "Gain: Up to 5–7 dBi on longer models",
                  "Improvements: Huge range boost for portable ops; folds for carry; better VHF performance (lower SWR on 144–155 MHz bands).",
                  "Best for: Tactical/field, GMRS/ham crossover, extended reach in open areas.",
                  "Price: $12–25",
                  "Drawbacks: Bulkier when extended; some cheaper ones have QC issues.",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <span style={{ color: "#00f0ff" }}>▸</span> {item}
                  </li>
                ))}
              </ul>
              <p
                className="text-sm mt-3 font-semibold"
                style={{ color: "#e0e0e0" }}
              >
                Verdict: Great for SOTA or vehicle mount — 42-inch versions can
                double effective range in tests.
              </p>
            </div>

            {/* Antenna 4 */}
            <div
              className="rounded-xl p-5 mb-6"
              style={{
                background: "rgba(168,85,247,0.03)",
                border: "1px solid rgba(168,85,247,0.12)",
              }}
            >
              <div className="flex items-center gap-2 mb-3">
                <span
                  className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                  style={{
                    background: "rgba(168,85,247,0.12)",
                    color: "#a855f7",
                    border: "1px solid rgba(168,85,247,0.25)",
                  }}
                >
                  4
                </span>
                <h3 className="font-bold text-sm" style={{ color: "#a855f7" }}>
                  Stubby / Short Options{" "}
                  <span style={{ color: "#707070", fontWeight: 400 }}>
                    (Nagoya NA-717, HYS RH-660, etc.)
                  </span>
                </h3>
              </div>
              <ul
                className="flex flex-col gap-1 text-sm"
                style={{ color: "#909090" }}
              >
                {[
                  "Length: 8–10 inches",
                  "Gain: ~1–2 dBi",
                  "Improvements: Better than stock for pocket carry; slight noise reduction.",
                  "Best for: EDC/discreet use.",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <span style={{ color: "#a855f7" }}>▸</span> {item}
                  </li>
                ))}
              </ul>
              <p
                className="text-sm mt-3 font-semibold"
                style={{ color: "#e0e0e0" }}
              >
                Verdict: Trade-off — convenience over max performance.
              </p>
            </div>

            {/* Comparison Table */}
            <div
              className="rounded-xl p-5"
              style={{
                background: "rgba(255,255,255,0.02)",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              <p
                className="text-sm font-bold mb-3"
                style={{ color: "#e0e0e0" }}
              >
                Quick Comparison Table (Community-Tested Estimates)
              </p>
              <div className="flex flex-col gap-2">
                {[
                  ["Stock", "Baseline (0 dB reference)", "#606060"],
                  ["NA-771", "+3–5 dB RX, quieter noise", "#00f0ff"],
                  [
                    "Tactical 42\u201d",
                    "+4–7 dB in open field, best VHF",
                    "#a855f7",
                  ],
                  ["Signal Stick", "+3–6 dB, portable king", "#00f0ff"],
                ].map(([label, value, color]) => (
                  <div
                    key={label}
                    className="flex items-center gap-3 p-3 rounded-lg"
                    style={{ background: "rgba(255,255,255,0.02)" }}
                  >
                    <span
                      className="text-xs font-bold w-24 shrink-0"
                      style={{ color: color as string }}
                    >
                      {label}
                    </span>
                    <span className="text-xs" style={{ color: "#707070" }}>
                      {value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Hardware Mods */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="glass-card p-7"
          >
            <div className="flex items-center gap-3 mb-5">
              <Radio size={18} style={{ color: "#a855f7" }} />
              <h2
                className="font-display font-bold text-xl"
                style={{ color: "#e0e0e0" }}
              >
                Hardware Mods to Boost Antenna Performance Further
              </h2>
            </div>
            <ol className="flex flex-col gap-4 mb-5">
              {[
                [
                  "Better SMA Connector / Adapter",
                  "Upgrade to gold-plated if yours is loose — reduces signal loss.",
                ],
                [
                  "External Antenna Port Mod (with HF board)",
                  "For HF SSB/CW — add second port + portable random wire or EFHW antenna (huge for 17–30 MHz RX).",
                ],
                [
                  "LNA / Preamp Add-on",
                  "Cheap broadband LNA (~$10–20) inline for weak-signal work (airband, distant repeaters) — +10–20 dB gain, but watch overload.",
                ],
                [
                  "Ground Plane / Counterpoise",
                  "Add short wire/radial for base use — improves TX efficiency 1–3 dB.",
                ],
                [
                  "Filter Mods",
                  "Bandpass filters for airband/marine to cut noise (pairs great with custom firmware AM fix).",
                ],
              ].map(([title, desc], i) => (
                <li key={title} className="flex items-start gap-3">
                  <span
                    className="shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
                    style={{
                      background: "rgba(168,85,247,0.12)",
                      color: "#a855f7",
                      border: "1px solid rgba(168,85,247,0.25)",
                    }}
                  >
                    {i + 1}
                  </span>
                  <div>
                    <p
                      className="text-sm font-bold"
                      style={{ color: "#e0e0e0" }}
                    >
                      {title}
                    </p>
                    <p className="text-sm" style={{ color: "#909090" }}>
                      {desc}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
            <div
              className="p-4 rounded-xl text-sm font-semibold"
              style={{
                color: "#f59e0b",
                background: "rgba(245,158,11,0.08)",
                border: "1px solid rgba(245,158,11,0.3)",
              }}
            >
              ⚠️ <strong>Legal/Safety Note:</strong> Mods are RX-focused mostly;
              TX outside licensed bands risks fines/harmonics — always filter
              and stay legal.
            </div>
          </motion.div>

          {/* How to Choose */}
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
                How to Choose the Best Antenna for Your Use Case
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
              {[
                ["Local repeater / daily driver", "Nagoya NA-771", "#00f0ff"],
                [
                  "SOTA / portable / hiking",
                  "Signal Stick or foldable tactical",
                  "#a855f7",
                ],
                [
                  "Max range / tactical ops",
                  "Long ABBREE/TIDRADIO 42\u201d",
                  "#00f0ff",
                ],
                ["Pocket / discreet", "Stubby like NA-717", "#a855f7"],
                [
                  "Airband / monitoring",
                  "NA-771 + custom firmware AM fix",
                  "#00f0ff",
                ],
              ].map(([usecase, rec, color]) => (
                <div
                  key={usecase}
                  className="rounded-xl p-4"
                  style={{
                    background: "rgba(255,255,255,0.02)",
                    border: `1px solid ${color}22`,
                  }}
                >
                  <p
                    className="text-xs font-semibold mb-1"
                    style={{ color: color as string }}
                  >
                    {usecase}
                  </p>
                  <p className="text-sm" style={{ color: "#e0e0e0" }}>
                    {rec}
                  </p>
                </div>
              ))}
            </div>
            <p className="text-sm" style={{ color: "#707070" }}>
              Test with your radio&apos;s S-meter or a TinySA for real dB
              improvements.
            </p>
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
                Pros &amp; Cons Summary
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
                  ✅ Pros of Upgrading
                </h3>
                <ul className="flex flex-col gap-2">
                  {[
                    "Cheap ($10–30) huge ROI",
                    "Better RX clarity & range",
                    "More enjoyable field ops",
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
                    "Longer antennas less portable",
                    "Fakes common — buy from trusted sellers",
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

          {/* Final Verdict */}
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
                Final Verdict: Upgrade Today!
              </h2>
            </div>
            <p
              className="text-base leading-relaxed mb-4"
              style={{ color: "#909090" }}
            >
              Start with the{" "}
              <strong style={{ color: "#e0e0e0" }}>Nagoya NA-771</strong> —
              it&apos;s the biggest bang-for-buck mod for any UV-K5 owner. Your
              signal will thank you!
            </p>
            <p className="text-sm mb-6" style={{ color: "#707070" }}>
              Subscribe for more guides like CHIRP mastery, UV-K6 SSB mods, and
              field setups.
            </p>
            <Link to="/videos" style={{ textDecoration: "none" }}>
              <motion.span
                className="btn-neon-cyan text-sm px-6 py-2.5 inline-flex items-center gap-2"
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0 0 24px rgba(0,240,255,0.4)",
                }}
                whileTap={{ scale: 0.97 }}
                data-ocid="antennas_mods.primary_button"
              >
                Watch Related Shorts →
              </motion.span>
            </Link>
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
                data-ocid={`antennas_mods.item.${i + 1}`}
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
          <div className="text-center mt-10">
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
                data-ocid="antennas_mods.secondary_button"
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
