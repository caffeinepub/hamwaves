import { Link } from "@tanstack/react-router";
import { ArrowLeft, Radio, Satellite } from "lucide-react";
import { motion } from "motion/react";
import { useEffect } from "react";
import RadioWavesBg from "../components/RadioWavesBg";

const shortsLinks = [
  {
    id: "2Vg5Qvr6uEY",
    label: "Budget handheld beats expensive radios for ISS reception",
  },
  { id: "uqvBpZlFNH8", label: "ISS broadcasting directly into my radio" },
  { id: "eCbmom_0Y5I", label: "This $20 Radio Picks Up Satellite" },
  { id: "Eh4c4lPUea8", label: "This Radio Connects to the Space Station" },
  { id: "mOg_0YW2HRI", label: "pilots hate knowing this $20 radio works" },
];

const comparisonData = [
  {
    type: "Arrow II Dual-Band Yagi",
    price: "$130–$200",
    gain: "7–10",
    bestFor: "Reliable FM bird/ISS RX",
    portability: "Handheld, aluminum",
    specs: "3-el 2m + 7-el 70cm, BNC",
    color: "#00f0ff",
  },
  {
    type: "DIY Tape Measure Yagi",
    price: "<$20",
    gain: "6–9",
    bestFor: "Budget learning & portable",
    portability: "DIY, collapsible",
    specs: "Steel tape elements, PVC boom",
    color: "#a855f7",
  },
  {
    type: "Tactical Foldable (HYS/ABBREE)",
    price: "$15–$35",
    gain: "3–7",
    bestFor: "EDC/quick sky scanning",
    portability: "Foldable, flexible",
    specs: "144/430 MHz, SMA-female",
    color: "#00f0ff",
  },
  {
    type: "Nagoya NA-771 Upgrade",
    price: "$10–$15",
    gain: "2–4",
    bestFor: "Starter RX boost",
    portability: "Whip, pocketable",
    specs: "Flexible rubber, SMA",
    color: "#a855f7",
  },
];

export default function SatelliteScanningAntennas() {
  useEffect(() => {
    document.title =
      "Satellite Scanning Antennas 2026: Best Yagi & Tactical for Ham Radio RX Beginners | HamWaves";
    let meta = document.querySelector<HTMLMetaElement>(
      "meta[name='description']",
    );
    if (!meta) {
      meta = document.createElement("meta");
      meta.name = "description";
      document.head.appendChild(meta);
    }
    meta.content =
      "Best antennas for receiving ham radio satellites 2026 – Yagi (Arrow II, DIY tape measure), tactical foldable, portable options for FM birds, ISS, weather sats. RX-only beginner guide, specs & builds.";
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
      data-ocid="satellite_antennas.page"
    >
      {/* Hero */}
      <section
        className="relative flex flex-col items-center justify-center overflow-hidden"
        style={{ minHeight: "65vh" }}
      >
        <RadioWavesBg />
        {/* Satellite orbit overlay */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 80% 60% at 50% 70%, rgba(0,240,255,0.07) 0%, transparent 60%), radial-gradient(ellipse 60% 40% at 50% 90%, rgba(168,85,247,0.09) 0%, transparent 60%)",
          }}
        />
        {/* Orbit ring SVG overlay */}
        <div
          className="absolute inset-0 pointer-events-none flex items-center justify-center"
          style={{ opacity: 0.06 }}
        >
          <svg
            width="700"
            height="700"
            viewBox="0 0 700 700"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <ellipse
              cx="350"
              cy="350"
              rx="320"
              ry="120"
              stroke="#00f0ff"
              strokeWidth="1.5"
            />
            <ellipse
              cx="350"
              cy="350"
              rx="250"
              ry="90"
              stroke="#a855f7"
              strokeWidth="1"
              transform="rotate(30 350 350)"
            />
            <circle cx="350" cy="230" r="6" fill="#00f0ff" />
            <circle cx="480" cy="390" r="4" fill="#a855f7" />
          </svg>
        </div>
        <div className="relative z-10 flex flex-col items-center text-center px-4 max-w-3xl pt-24">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.05 }}
            className="mb-4 w-14 h-14 rounded-2xl flex items-center justify-center"
            style={{
              background: "rgba(0,240,255,0.1)",
              border: "1px solid rgba(0,240,255,0.25)",
            }}
          >
            <Satellite size={28} style={{ color: "#00f0ff" }} />
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-display font-black text-3xl sm:text-5xl leading-tight mb-3"
          >
            Satellite &amp; Scanning: Best Antennas for Receiving Ham Radio
            Satellites 2026
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-base sm:text-lg"
            style={{ color: "#707070" }}
          >
            RX-only guide for beginners – Yagi, directional, tactical &amp;
            portable antennas to listen to FM birds, ISS packet, weather sats
            &amp; space signals. No license needed!
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
              data-ocid="satellite_antennas.link"
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
              <Satellite size={18} style={{ color: "#00f0ff" }} />
              <h2
                className="font-display font-bold text-xl"
                style={{ color: "#e0e0e0" }}
              >
                Overview
              </h2>
            </div>
            <p
              className="text-base leading-relaxed mb-3"
              style={{ color: "#909090" }}
            >
              Listening to ham radio satellites (FM &quot;birds&quot; like
              AO-91/AO-92/SO-50), ISS packet/APRS beacons, or weather satellites
              is one of the coolest RX-only hobbies – no license required!
            </p>
            <p
              className="text-base leading-relaxed mb-3"
              style={{ color: "#909090" }}
            >
              Satellites pass overhead quickly (5–15 minutes), so directional
              antennas with gain help pull in weak signals from space (typically{" "}
              <strong style={{ color: "#e0e0e0" }}>2m downlink ~145 MHz</strong>
              ,{" "}
              <strong style={{ color: "#e0e0e0" }}>70cm uplink ~435 MHz</strong>{" "}
              for FM – but we focus RX).
            </p>
            <p
              className="text-base leading-relaxed mb-5"
              style={{ color: "#909090" }}
            >
              Handheld Yagis or tactical whips beat stock rubber ducks by{" "}
              <strong style={{ color: "#00f0ff" }}>6–12+ dB</strong>, making
              faint beeps clear. This beginner guide covers top options for
              portable scanning with budget radios like Quansheng UV-K5/K6.
            </p>
            <div
              className="p-4 rounded-xl text-sm italic"
              style={{
                color: "#00f0ff",
                borderLeft: "3px solid #00f0ff",
                background: "rgba(0,240,255,0.05)",
              }}
            >
              No license needed for RX-only satellite listening – tune in and
              enjoy space signals legally worldwide!
            </div>
          </motion.div>

          {/* Why Directional */}
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
                Why Directional Antennas for Satellite RX?
              </h2>
            </div>
            <ul className="flex flex-col gap-3">
              {[
                [
                  "Weak & moving signals",
                  "Need gain (3–10+ dBi) and directionality to point at the sky.",
                  "#a855f7",
                ],
                [
                  "Polarization",
                  "Most FM sats use linear (vertical/horizontal); Yagis match well.",
                  "#00f0ff",
                ],
                [
                  "Portable/handheld",
                  "Easy to track passes manually or with apps (N2YO.com, Heavens-Above).",
                  "#a855f7",
                ],
                [
                  "RX improvements",
                  "+6–15 dB over stock → hear more passes, clearer audio, less noise.",
                  "#00f0ff",
                ],
              ].map(([title, desc, color]) => (
                <li
                  key={title as string}
                  className="flex items-start gap-3 p-4 rounded-xl"
                  style={{
                    background: `rgba(${color === "#00f0ff" ? "0,240,255" : "168,85,247"},0.04)`,
                    border: `1px solid rgba(${color === "#00f0ff" ? "0,240,255" : "168,85,247"},0.14)`,
                  }}
                >
                  <span style={{ color: color as string, marginTop: 2 }}>
                    ▸
                  </span>
                  <div>
                    <strong style={{ color: color as string }}>{title}</strong>
                    <span style={{ color: "#909090" }}>
                      {" – "}
                      {desc}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
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
              <Satellite size={18} style={{ color: "#00f0ff" }} />
              <h2
                className="font-display font-bold text-xl"
                style={{ color: "#e0e0e0" }}
              >
                Top Antennas for Satellite Scanning (RX-Only Focus)
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
                  Arrow II Handheld Dual-Band Yagi{" "}
                  <span style={{ color: "#707070", fontWeight: 400 }}>
                    (Classic Gold Standard)
                  </span>
                </h3>
              </div>
              <ul
                className="flex flex-col gap-1 text-sm"
                style={{ color: "#909090" }}
              >
                {[
                  "3 elements VHF (2m) + 7 elements UHF (70cm) on shared boom.",
                  "Gain: ~7–10 dBi effective for sats.",
                  "Best for: Reliable FM bird/ISS reception; handheld tracking.",
                  "Specs: Lightweight aluminum, BNC connector, ~$130–$200.",
                  "Pro tip: Point at satellite using phone app – many beginners make first contacts (RX) with this.",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <span style={{ color: "#00f0ff" }}>▸</span> {item}
                  </li>
                ))}
              </ul>
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
                  DIY Tape Measure Yagi{" "}
                  <span style={{ color: "#707070", fontWeight: 400 }}>
                    (Cheap &amp; Fun Beginner Build)
                  </span>
                </h3>
              </div>
              <ul
                className="flex flex-col gap-1 text-sm"
                style={{ color: "#909090" }}
              >
                {[
                  "Materials: Tape measure steel (elements), PVC/wood boom, coax cable.",
                  "Design: 3–4 element 2m + parasitic 70cm (KG0ZZ / $4 Satellite Yagi plans).",
                  "Gain: 6–9 dBi.",
                  'Build steps: Cut tape to precise lengths (e.g., driven element ~19" for 2m), mount on boom, solder coax. Total cost <$20.',
                  "Best for: Learning antenna basics, portable SOTA-style satellite hunting.",
                  'Resources: Search "tape measure Yagi satellite" tutorials – super forgiving for RX.',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <span style={{ color: "#a855f7" }}>▸</span> {item}
                  </li>
                ))}
              </ul>
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
                    (Portable &amp; Rugged)
                  </span>
                </h3>
              </div>
              <ul
                className="flex flex-col gap-1 text-sm"
                style={{ color: "#909090" }}
              >
                {[
                  'Examples: HYS Tactical Foldable, ABBREE AR-771/AR-152, TIDRADIO TD-152 (31–42" extendable).',
                  "Gain: 3–7 dBi (better than stock, omnidirectional-ish when extended).",
                  "Best for: EDC scanning of overhead passes; fold for pocket/camping.",
                  "Specs: SMA-female, dual-band 144/430 MHz, flexible sections bend 90°+.",
                  "Pro: Great for quick sky-pointing without full Yagi bulk.",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <span style={{ color: "#00f0ff" }}>▸</span> {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Antenna 4 */}
            <div
              className="rounded-xl p-5"
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
                  Simple Handheld Upgrades{" "}
                  <span style={{ color: "#707070", fontWeight: 400 }}>
                    (Nagoya NA-771 or RH-660)
                  </span>
                </h3>
              </div>
              <ul
                className="flex flex-col gap-1 text-sm"
                style={{ color: "#909090" }}
              >
                {[
                  'Length: 15–17".',
                  "Gain: ~2–4 dBi.",
                  "Best for: Starter RX before full directional – noticeable improvement on ISS/beacons.",
                  "Verdict: Budget step-up if Yagi feels too advanced.",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <span style={{ color: "#a855f7" }}>▸</span> {item}
                  </li>
                ))}
              </ul>
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
              <Radio size={18} style={{ color: "#00f0ff" }} />
              <h2
                className="font-display font-bold text-xl"
                style={{ color: "#e0e0e0" }}
              >
                Quick Comparison Table
              </h2>
            </div>
            {/* Desktop table */}
            <div className="hidden md:block overflow-x-auto">
              <table
                className="w-full text-sm"
                style={{ borderCollapse: "separate", borderSpacing: "0 4px" }}
              >
                <thead>
                  <tr>
                    {[
                      "Antenna Type",
                      "Approx. Price",
                      "Gain (dBi)",
                      "Best For",
                      "Build/Portability",
                      "Key Specs",
                    ].map((h) => (
                      <th
                        key={h}
                        className="text-left px-3 py-2 text-xs font-bold"
                        style={{ color: "#505050" }}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {comparisonData.map((row) => (
                    <tr
                      key={row.type}
                      style={{
                        background: `rgba(${row.color === "#00f0ff" ? "0,240,255" : "168,85,247"},0.04)`,
                      }}
                    >
                      <td
                        className="px-3 py-3 font-semibold rounded-l-lg"
                        style={{ color: row.color }}
                      >
                        {row.type}
                      </td>
                      <td className="px-3 py-3" style={{ color: "#e0e0e0" }}>
                        {row.price}
                      </td>
                      <td className="px-3 py-3" style={{ color: row.color }}>
                        {row.gain}
                      </td>
                      <td className="px-3 py-3" style={{ color: "#909090" }}>
                        {row.bestFor}
                      </td>
                      <td className="px-3 py-3" style={{ color: "#909090" }}>
                        {row.portability}
                      </td>
                      <td
                        className="px-3 py-3 rounded-r-lg"
                        style={{ color: "#707070" }}
                      >
                        {row.specs}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {/* Mobile cards */}
            <div className="flex flex-col gap-3 md:hidden">
              {comparisonData.map((row) => (
                <div
                  key={row.type}
                  className="rounded-xl p-4"
                  style={{
                    background: `rgba(${row.color === "#00f0ff" ? "0,240,255" : "168,85,247"},0.04)`,
                    border: `1px solid rgba(${row.color === "#00f0ff" ? "0,240,255" : "168,85,247"},0.15)`,
                  }}
                >
                  <p
                    className="font-bold text-sm mb-2"
                    style={{ color: row.color }}
                  >
                    {row.type}
                  </p>
                  <div className="grid grid-cols-2 gap-1 text-xs">
                    <span style={{ color: "#505050" }}>Price:</span>
                    <span style={{ color: "#e0e0e0" }}>{row.price}</span>
                    <span style={{ color: "#505050" }}>Gain:</span>
                    <span style={{ color: row.color }}>{row.gain} dBi</span>
                    <span style={{ color: "#505050" }}>Best For:</span>
                    <span style={{ color: "#909090" }}>{row.bestFor}</span>
                    <span style={{ color: "#505050" }}>Build:</span>
                    <span style={{ color: "#909090" }}>{row.portability}</span>
                    <span style={{ color: "#505050" }}>Specs:</span>
                    <span style={{ color: "#707070" }}>{row.specs}</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Beginner Tips */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="glass-card p-7"
          >
            <div className="flex items-center gap-3 mb-5">
              <Satellite size={18} style={{ color: "#a855f7" }} />
              <h2
                className="font-display font-bold text-xl"
                style={{ color: "#e0e0e0" }}
              >
                Beginner Tips for Satellite Scanning Success
              </h2>
            </div>
            <div className="flex flex-col gap-3 mb-6">
              {[
                [
                  "Track passes",
                  "Use N2YO.com or AMSAT app for times/direction/Doppler.",
                  "#00f0ff",
                ],
                [
                  "Radio setup",
                  "Quansheng UV-K5 with custom firmware (better RX sensitivity/AM fix if needed).",
                  "#a855f7",
                ],
                [
                  "Pointing",
                  "Hold Yagi upright, aim at predicted sky position – sweep slowly.",
                  "#00f0ff",
                ],
                [
                  "Apps",
                  "Heavens-Above (visual passes), ISS Detector.",
                  "#a855f7",
                ],
                [
                  "Legal",
                  "Pure RX is fine worldwide – enjoy the space signals!",
                  "#00f0ff",
                ],
              ].map(([title, desc, color]) => (
                <div
                  key={title as string}
                  className="flex items-start gap-3 p-4 rounded-xl"
                  style={{
                    background: `rgba(${color === "#00f0ff" ? "0,240,255" : "168,85,247"},0.04)`,
                    border: `1px solid rgba(${color === "#00f0ff" ? "0,240,255" : "168,85,247"},0.12)`,
                  }}
                >
                  <span
                    className="shrink-0 mt-0.5"
                    style={{ color: color as string }}
                  >
                    ▸
                  </span>
                  <div>
                    <strong style={{ color: color as string }}>{title}</strong>
                    <span className="text-sm" style={{ color: "#909090" }}>
                      {" – "}
                      {desc}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <p className="text-sm mb-5" style={{ color: "#707070" }}>
              Start simple: Try a Nagoya upgrade today, then build a tape
              measure Yagi for your first satellite beacon.
            </p>
            <Link to="/videos" style={{ textDecoration: "none" }}>
              <motion.span
                className="btn-neon-cyan text-sm px-6 py-2.5 inline-flex items-center gap-2"
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0 0 24px rgba(0,240,255,0.4)",
                }}
                whileTap={{ scale: 0.97 }}
                data-ocid="satellite_antennas.primary_button"
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
                data-ocid={`satellite_antennas.item.${i + 1}`}
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
              Subscribe to HamWaves for more RX scanning &amp; satellite
              listening tips!
            </h3>
            <p className="text-sm mb-6" style={{ color: "#606060" }}>
              Got your first satellite signal? Share in the comments! New guides
              &amp; Shorts weekly.
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
                data-ocid="satellite_antennas.secondary_button"
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
