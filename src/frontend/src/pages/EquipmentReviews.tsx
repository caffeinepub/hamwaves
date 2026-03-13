import { Link } from "@tanstack/react-router";
import { Radio } from "lucide-react";
import { motion } from "motion/react";
import RadioWavesBg from "../components/RadioWavesBg";

const activeCards = [
  {
    title: "Quansheng UV-K5 Review 2026",
    excerpt:
      "Under $30 and completely hackable. Custom firmware turns this budget handheld into a powerhouse — spectrum analyzer, wide RX, SSB, and more.",
    href: "/equipment-reviews/quansheng-uv-k5",
    image: "/assets/generated/eq-review-uvk5.dim_800x450.jpg",
    imageAlt: "Quansheng UV-K5 handheld radio",
  },
  {
    title: "CHIRP Programming Guide for Quansheng UV-K5 2026",
    excerpt:
      "Step-by-step beginner tutorial to program your UV-K5 with CHIRP — add repeaters, unlock frequencies, custom firmware support (Egzumer/IJV), and troubleshooting tips.",
    href: "/equipment-reviews/chirp-programming-guide",
    image: "/assets/generated/eq-review-chirp.dim_800x450.jpg",
    imageAlt: "CHIRP radio programming software on laptop",
  },
  {
    title: "Best Antennas & Mods for Quansheng UV-K5 2026",
    excerpt:
      "Nagoya NA-771, tactical foldable options, and hardware mods for better RX gain, noise reduction, and SOTA/portable use. Real improvements & buying tips.",
    href: "/equipment-reviews/best-antennas-mods-uv-k5",
    image: "/assets/generated/eq-review-antennas.dim_800x450.jpg",
    imageAlt: "Nagoya NA-771 and tactical antennas",
  },
  {
    title: "Best Budget Handhelds 2026 Compared",
    excerpt:
      "UV-K5 vs UV-K6 vs UV-K1 vs Baofeng UV-5R – which sub-$50 radio wins for RX scanning beginners? Honest 2026 comparison with firmware, battery, and value breakdown.",
    href: "/equipment-reviews/best-budget-handhelds-2026",
    image: "/assets/generated/eq-review-budget-handhelds.dim_800x450.jpg",
    imageAlt: "Budget handheld radios comparison",
  },
  {
    title:
      "Satellite & Scanning: Best Antennas for Receiving Ham Radio Satellites 2026",
    excerpt:
      "Yagi, tactical & portable antennas for FM birds, ISS packet, weather sats & space signals. RX-only beginner guide – Arrow II, DIY tape measure, tactical foldable & more.",
    href: "/equipment-reviews/satellite-scanning-antennas",
    image: "/assets/generated/eq-review-satellite.dim_800x450.jpg",
    imageAlt: "Yagi antenna pointed at satellite in night sky",
  },
];

const comingCards = [
  {
    title: "Quansheng UV-K6 SSB Mod Guide",
    excerpt:
      "How to add the HF board to your UV-K6 and unlock full SSB/CW capability.",
  },
];

export default function EquipmentReviews() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.35 }}
      data-ocid="equipment_reviews.page"
    >
      <style>{`
        @keyframes reviewCardPulse {
          0%, 100% { box-shadow: 0 0 18px rgba(0,240,255,0.18); }
          50% { box-shadow: 0 0 36px rgba(0,240,255,0.38); }
        }
        .review-card {
          background: #111111;
          border: 1px solid rgba(0,240,255,0.22);
          border-radius: 14px;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          transition: transform 0.3s ease, border-color 0.3s ease;
        }
        .review-card:hover {
          transform: translateY(-5px);
          border-color: rgba(0,240,255,0.55);
          animation: reviewCardPulse 1.8s ease-in-out infinite;
        }
        .review-card-img {
          width: 100%;
          aspect-ratio: 16/9;
          object-fit: cover;
          display: block;
          border-bottom: 1px solid rgba(0,240,255,0.15);
          transition: transform 0.4s ease;
        }
        .review-card:hover .review-card-img {
          transform: scale(1.04);
        }
        @keyframes neonPulseBtn {
          0%, 100% { box-shadow: 0 0 14px rgba(0,240,255,0.45); }
          50% { box-shadow: 0 0 28px rgba(0,240,255,0.75); }
        }
        .btn-read-guide {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          padding: 0.6rem 1rem;
          border-radius: 8px;
          font-size: 0.875rem;
          font-weight: 600;
          color: #00f0ff;
          background: rgba(0,240,255,0.08);
          border: 1px solid rgba(0,240,255,0.45);
          transition: background 0.2s ease, box-shadow 0.2s ease;
          text-decoration: none;
          cursor: pointer;
        }
        .btn-read-guide:hover {
          background: rgba(0,240,255,0.16);
          animation: neonPulseBtn 1.5s ease-in-out infinite;
        }
      `}</style>

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
        <div className="relative z-10 flex flex-col items-center text-center px-4 pt-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mb-4 w-14 h-14 rounded-2xl flex items-center justify-center"
            style={{
              background: "rgba(0,240,255,0.1)",
              border: "1px solid rgba(0,240,255,0.25)",
            }}
          >
            <Radio size={28} style={{ color: "#00f0ff" }} />
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="font-display font-black text-3xl sm:text-5xl lg:text-6xl leading-tight mb-4"
          >
            Equipment Reviews &amp; Guides
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="text-base sm:text-lg max-w-xl px-2"
            style={{ color: "#707070" }}
          >
            Honest breakdowns, custom firmware tutorials, and real-world ham
            radio tests
          </motion.p>
        </div>
      </section>

      {/* Card grid */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-3 mb-8"
        >
          <Radio size={18} style={{ color: "#00f0ff" }} />
          <h2
            className="font-display font-bold text-2xl"
            style={{ color: "#e0e0e0" }}
          >
            Latest Reviews
          </h2>
          <div
            className="flex-1 h-px"
            style={{
              background:
                "linear-gradient(to right, rgba(0,240,255,0.2), transparent)",
            }}
          />
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {activeCards.map((card, i) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="review-card"
              data-ocid={`equipment_reviews.item.${i + 1}`}
            >
              <div className="overflow-hidden">
                <img
                  src={card.image}
                  alt={card.imageAlt}
                  className="review-card-img"
                  loading="lazy"
                />
              </div>
              <div className="p-5 sm:p-6 flex flex-col flex-1">
                <h3 className="font-display font-bold text-base sm:text-lg leading-snug mb-3">
                  {card.title}
                </h3>
                <p
                  className="text-sm sm:text-base leading-relaxed mb-5 flex-1"
                  style={{ color: "#606060" }}
                >
                  {card.excerpt}
                </p>
                <Link
                  to={card.href as "/equipment-reviews/quansheng-uv-k5"}
                  style={{ textDecoration: "none" }}
                >
                  <motion.span
                    className="btn-read-guide"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    data-ocid={`equipment_reviews.primary_button.${i + 1}`}
                  >
                    Read Full Guide →
                  </motion.span>
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

        {/* More Reviews Coming */}
        <div className="mt-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-3 mb-6"
          >
            <h2
              className="font-display font-bold text-xl"
              style={{ color: "#505050" }}
            >
              More Reviews Coming
            </h2>
            <div
              className="flex-1 h-px"
              style={{
                background:
                  "linear-gradient(to right, rgba(255,255,255,0.08), transparent)",
              }}
            />
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {comingCards.map((card, i) => (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="glass-card overflow-hidden flex flex-col"
                style={{ opacity: 0.45 }}
                data-ocid={`equipment_reviews.item.${activeCards.length + i + 1}`}
              >
                <div
                  className="flex items-center justify-center"
                  style={{ aspectRatio: "16/9", background: "#0d0d0d" }}
                >
                  <Radio size={36} style={{ color: "#505050" }} />
                </div>
                <div className="p-5 sm:p-6 flex flex-col flex-1">
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <h3
                      className="font-display font-bold text-base leading-snug"
                      style={{ color: "#909090" }}
                    >
                      {card.title}
                    </h3>
                    <span
                      className="shrink-0 text-xs px-2 py-0.5 rounded-full font-semibold"
                      style={{
                        background: "rgba(168,85,247,0.15)",
                        color: "#a855f7",
                        border: "1px solid rgba(168,85,247,0.3)",
                      }}
                    >
                      Coming Soon
                    </span>
                  </div>
                  <p
                    className="text-sm leading-relaxed mb-5 flex-1"
                    style={{ color: "#505050" }}
                  >
                    {card.excerpt}
                  </p>
                  <span
                    className="text-sm px-5 py-2 text-center rounded-lg"
                    style={{
                      background: "rgba(255,255,255,0.04)",
                      color: "#505050",
                      border: "1px solid rgba(255,255,255,0.08)",
                    }}
                  >
                    Coming Soon
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </motion.div>
  );
}
