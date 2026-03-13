import { Link } from "@tanstack/react-router";
import { ArrowLeft, Radio } from "lucide-react";
import { motion } from "motion/react";
import { useEffect } from "react";
import RadioWavesBg from "../components/RadioWavesBg";

const shortsLinks = [
  {
    id: "x16FwkSTi3U",
    label: "real military ATC chatter caught on budget scanner",
  },
  {
    id: "0pyDkCAbbv8",
    label: "Mini Kong pulls in pilot communications instantly",
  },
  {
    id: "LOQ2r-YTY9o",
    label: "catching real ATC chatter on the cheapest radio possible",
  },
  { id: "f1A77KM8QFk", label: "listening to pilots on the quansheng uvk1" },
  { id: "mOg_0YW2HRI", label: "pilots hate knowing this $20 radio works" },
];

const comparisonRows = [
  {
    model: "Quansheng UV-K5 / UV-K6",
    price: "$25–$35",
    rx: "Excellent wide RX (18–850+ MHz), AM airband fix, spectrum analyzer on firmware, low noise floor",
    firmware: "Yes (Egzumer/IJV – game-changer)",
    battery: "1600mAh / USB-C",
    bestFor: "Best overall scanning & experimenting",
    drawbacks: "Slightly fragile PTT, antenna average",
    accent: "#00f0ff",
  },
  {
    model: "Quansheng UV-K1 (Mini)",
    price: "$20–$30",
    rx: "Compact wide RX, good airband/marine/NOAA, similar to UV-K5 but pocket-sized",
    firmware:
      "Yes (F4HWN Fusion – adapted for UV-K1's newer MCU; spectrum analyzer + advanced scanning features)",
    battery: "Smaller / USB-C",
    bestFor: "Portable RX scanning on the go",
    drawbacks: "Less power/audio than full-size, newer so less tested",
    accent: "#a855f7",
  },
  {
    model: "Baofeng UV-5R (Classic)",
    price: "$15–$25",
    rx: "Basic dual-band RX, cheap entry, lots of accessories",
    firmware: "Limited (some hacks)",
    battery: "1800mAh / Drop-in",
    bestFor: "Ultra-cheap first radio",
    drawbacks: "Weaker RX sensitivity, no USB-C, outdated menu",
    accent: "#00f0ff",
  },
  {
    model: "Baofeng UV-5R Mini / Variants",
    price: "$20–$40",
    rx: "Compact, improved audio in some tests",
    firmware: "Limited",
    battery: "Smaller / USB-C in newer",
    bestFor: "Budget mini for pocket carry",
    drawbacks: "RX not as wide/clean as Quansheng",
    accent: "#a855f7",
  },
];

export default function BestBudgetHandhelds2026() {
  useEffect(() => {
    document.title =
      "Best Budget Handhelds 2026: Quansheng UV-K5 vs UV-K6 vs UV-K1 vs Baofeng UV-5R Compared | HamWaves";
    let meta = document.querySelector<HTMLMetaElement>(
      "meta[name='description']",
    );
    if (!meta) {
      meta = document.createElement("meta");
      meta.name = "description";
      document.head.appendChild(meta);
    }
    meta.content =
      "Best sub-$50 handheld radio 2026 for RX scanning beginners – Quansheng UV-K5, UV-K6, UV-K1 vs Baofeng UV-5R comparison: wideband receive, airband, NOAA, custom firmware, value guide.";
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
      data-ocid="budget_handhelds.page"
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
            Best Budget Handhelds 2026 Compared: UV-K5 vs UV-K6 vs UV-K1 vs
            Baofeng UV-5R – Sub-$50 RX Scanning Picks
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-base sm:text-lg"
            style={{ color: "#707070" }}
          >
            Which cheap handheld radio wins for beginners? RX-only listening,
            scanning airband/NOAA/marine, custom firmware, and value under $50
            in 2026 – honest comparison for new scanner hobbyists.
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
            src="/assets/generated/hero-budget-handhelds.dim_1200x500.jpg"
            alt="Best budget handhelds 2026 comparison"
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
              data-ocid="budget_handhelds.link"
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
              As a beginner focused on RX-only scanning (no license needed for
              listening!), budget handhelds under $50 are perfect for exploring
              airband, NOAA weather, marine, railroad, and local frequencies.
            </p>
            <p
              className="text-base leading-relaxed mb-5"
              style={{ color: "#909090" }}
            >
              In 2026, the{" "}
              <strong style={{ color: "#00f0ff" }}>Quansheng</strong> lineup
              crushes the old Baofeng dominance thanks to better wideband RX,
              USB-C charging, and insane custom firmware support (Egzumer/IJV
              for spectrum analyzer, AM fixes, expanded scanning). The classic{" "}
              <strong style={{ color: "#e0e0e0" }}>Baofeng UV-5R</strong> is
              still cheap and everywhere, but newer Quansheng models pull ahead
              for scanning hobbyists.
            </p>
            <div
              className="p-4 rounded-xl text-sm italic"
              style={{
                color: "#00f0ff",
                borderLeft: "3px solid #00f0ff",
                background: "rgba(0,240,255,0.05)",
              }}
            >
              Here&apos;s a head-to-head comparison of the top sub-$50 (or very
              close) options – all great for RX listening without transmitting.
            </div>
          </motion.div>

          {/* Comparison Table */}
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
                Quick Comparison Table (2026 Prices &amp; Real-World RX Focus)
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table
                className="w-full text-sm"
                style={{ borderCollapse: "collapse", minWidth: "640px" }}
              >
                <thead>
                  <tr
                    style={{
                      background: "rgba(0,240,255,0.06)",
                      borderBottom: "1px solid rgba(0,240,255,0.2)",
                    }}
                  >
                    {[
                      "Model",
                      "Price (2026 est.)",
                      "Key RX Strengths",
                      "Custom Firmware?",
                      "Battery / Charge",
                      "Best For",
                      "Drawbacks",
                    ].map((h) => (
                      <th
                        key={h}
                        className="text-left px-3 py-3 font-bold text-xs"
                        style={{ color: "#00f0ff", whiteSpace: "nowrap" }}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {comparisonRows.map((row, i) => (
                    <tr
                      key={row.model}
                      style={{
                        borderBottom: "1px solid rgba(255,255,255,0.06)",
                        background:
                          i % 2 === 0
                            ? "rgba(255,255,255,0.01)"
                            : "transparent",
                      }}
                    >
                      <td
                        className="px-3 py-3 font-bold"
                        style={{ color: row.accent, whiteSpace: "nowrap" }}
                      >
                        {row.model}
                      </td>
                      <td
                        className="px-3 py-3"
                        style={{ color: "#e0e0e0", whiteSpace: "nowrap" }}
                      >
                        {row.price}
                      </td>
                      <td className="px-3 py-3" style={{ color: "#909090" }}>
                        {row.rx}
                      </td>
                      <td className="px-3 py-3" style={{ color: "#707070" }}>
                        {row.firmware}
                      </td>
                      <td
                        className="px-3 py-3"
                        style={{ color: "#707070", whiteSpace: "nowrap" }}
                      >
                        {row.battery}
                      </td>
                      <td className="px-3 py-3" style={{ color: "#e0e0e0" }}>
                        {row.bestFor}
                      </td>
                      <td className="px-3 py-3" style={{ color: "#606060" }}>
                        {row.drawbacks}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>

          {/* Section 1: UV-K5 / UV-K6 */}
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
                1. Quansheng UV-K5 / UV-K6 – The 2026 Scanning King
              </h2>
            </div>
            <div
              className="rounded-xl p-5"
              style={{
                background: "rgba(0,240,255,0.04)",
                border: "1px solid rgba(0,240,255,0.18)",
              }}
            >
              <ul className="flex flex-col gap-2">
                {[
                  [
                    "Why it wins for beginners",
                    "Best RX performance in class – wide coverage (including airband with AM fix via firmware), built-in spectrum analyzer (real-time waterfall scanning!), and huge community mods.",
                  ],
                  [
                    "RX improvements",
                    "Clearer weak signals, better noise handling than UV-5R; custom firmware unlocks SSB/CW RX potential.",
                  ],
                  ["Price sweet spot", "$25–$35 – unbeatable value."],
                  [
                    "Best if",
                    "You want to scan everything (aircraft, weather, public safety) and tinker with firmware/CHIRP.",
                  ],
                  [
                    "My take",
                    "This is my go-to for RX-only – started my scanning journey here!",
                  ],
                ].map(([label, text]) => (
                  <li
                    key={label as string}
                    className="flex items-start gap-2 text-sm"
                    style={{ color: "#909090" }}
                  >
                    <span style={{ color: "#00f0ff", flexShrink: 0 }}>▸</span>
                    <span>
                      <strong style={{ color: "#e0e0e0" }}>{label}:</strong>{" "}
                      {text}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>

          {/* Section 2: UV-K1 */}
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
                2. Quansheng UV-K1 (Mini Kong) – Compact RX Powerhouse
              </h2>
            </div>
            <div
              className="rounded-xl p-5"
              style={{
                background: "rgba(168,85,247,0.04)",
                border: "1px solid rgba(168,85,247,0.18)",
              }}
            >
              <ul className="flex flex-col gap-2">
                {[
                  [
                    "The mini upgrade",
                    "Newer 2026 compact version (like Baofeng minis but with Quansheng brains).",
                  ],
                  [
                    "RX strengths",
                    "Similar wideband to UV-K5, good airband/marine reception, smaller for EDC.",
                  ],
                  [
                    "Firmware",
                    "Strong custom support via F4HWN Fusion (v5.2.0+ latest 2026) – includes spectrum analyzer, wide RX enhancements, AM airband fixes, extra menu options, and more in a pocket-sized package! Search: Quansheng UV-K1 custom firmware F4HWN Fusion 2026, UV-K1 spectrum analyzer.",
                  ],
                  [
                    "Best if",
                    "You want portable scanning without bulk (hiking, travel).",
                  ],
                  [
                    "Vs others",
                    "Beats Baofeng minis on features/RX quality, but smaller battery/audio.",
                  ],
                ].map(([label, text]) => (
                  <li
                    key={label as string}
                    className="flex items-start gap-2 text-sm"
                    style={{ color: "#909090" }}
                  >
                    <span style={{ color: "#a855f7", flexShrink: 0 }}>▸</span>
                    <span>
                      <strong style={{ color: "#e0e0e0" }}>{label}:</strong>{" "}
                      {text}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>

          {/* Section 3: Baofeng UV-5R */}
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
                3. Baofeng UV-5R – The Classic Budget Starter
              </h2>
            </div>
            <div
              className="rounded-xl p-5"
              style={{
                background: "rgba(0,240,255,0.03)",
                border: "1px solid rgba(0,240,255,0.12)",
              }}
            >
              <ul className="flex flex-col gap-2">
                {[
                  [
                    "Still relevant?",
                    "Yes – cheapest entry (~$15–$25), tons of accessories, CHIRP support.",
                  ],
                  [
                    "RX reality",
                    "Decent for basic scanning, but narrower RX, more noise, weaker airband without tweaks.",
                  ],
                  [
                    "Best if",
                    "Absolute lowest budget or you just want a disposable learner radio.",
                  ],
                  [
                    "Why Quansheng wins",
                    "Better modern features, USB-C, wider/cleaner RX for the same or slightly higher price.",
                  ],
                ].map(([label, text]) => (
                  <li
                    key={label as string}
                    className="flex items-start gap-2 text-sm"
                    style={{ color: "#909090" }}
                  >
                    <span style={{ color: "#00f0ff", flexShrink: 0 }}>▸</span>
                    <span>
                      <strong style={{ color: "#e0e0e0" }}>{label}:</strong>{" "}
                      {text}
                    </span>
                  </li>
                ))}
              </ul>
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
              <Radio size={18} style={{ color: "#a855f7" }} />
              <h2
                className="font-display font-bold text-xl"
                style={{ color: "#e0e0e0" }}
              >
                How to Choose Your First Budget Handheld for RX Scanning
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
              {[
                [
                  "Max features & scanning fun",
                  "Quansheng UV-K5/UV-K6",
                  "#00f0ff",
                ],
                ["Pocket/portable RX", "Quansheng UV-K1 Mini", "#a855f7"],
                ["Cheapest possible start", "Baofeng UV-5R", "#00f0ff"],
              ].map(([usecase, rec, color]) => (
                <div
                  key={usecase as string}
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
            <div
              className="p-4 rounded-xl text-sm"
              style={{
                color: "#00f0ff",
                borderLeft: "3px solid #00f0ff",
                background: "rgba(0,240,255,0.05)",
              }}
            >
              <strong>Pro tip:</strong> Pair any with a better antenna (Nagoya
              NA-771) for +3–5 dB RX gain – huge difference in weak signals! All
              these are RX-legal worldwide (no license for listening). Start
              scanning NOAA/airband today!
            </div>
          </motion.div>

          {/* Watch Shorts CTA */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="glass-card p-7 text-center"
          >
            <p className="text-base mb-4" style={{ color: "#909090" }}>
              See these radios in action – real airband, NOAA, and ISS reception
              captured live.
            </p>
            <Link to="/videos" style={{ textDecoration: "none" }}>
              <motion.span
                className="btn-neon-cyan text-sm px-6 py-2.5 inline-flex items-center gap-2"
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0 0 24px rgba(0,240,255,0.4)",
                }}
                whileTap={{ scale: 0.97 }}
                data-ocid="budget_handhelds.primary_button"
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
                data-ocid={`budget_handhelds.item.${i + 1}`}
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
                data-ocid="budget_handhelds.secondary_button"
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
