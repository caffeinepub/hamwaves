import { useNavigate } from "@tanstack/react-router";
import {
  Antenna,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Play,
  Radio,
  Youtube,
} from "lucide-react";
import { type Variants, motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import RadioWavesBg from "../components/RadioWavesBg";
import { activeGuides, allVideos } from "../data/siteData";

const featuredImages = [
  {
    src: "/assets/uploads/InShot_20260313_112348746-1.jpg",
    title: "Ham Radio in the Field",
    desc: "Taking the radio out for a field day session – nothing beats operating portable with great views.",
  },
];

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.12 },
  }),
};

function useCountUp(target: number, duration = 1200) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const started = useRef(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const start = performance.now();
          const tick = (now: number) => {
            const progress = Math.min((now - start) / duration, 1);
            setCount(Math.round(progress * target));
            if (progress < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        }
      },
      { threshold: 0.3 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [target, duration]);
  return { count, ref };
}

export default function Home() {
  const [activeSlide, setActiveSlide] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const navigate = useNavigate();

  const { count: videoCount, ref: videoRef } = useCountUp(allVideos.length);
  const { count: guideCount, ref: guideRef } = useCountUp(activeGuides.length);

  useEffect(() => {
    document.title =
      "Beginner Ham Radio Scanning RX Only | HamWaves – Budget Radio Guides & Reviews";
    let meta = document.querySelector<HTMLMetaElement>(
      'meta[name="description"]',
    );
    if (!meta) {
      meta = document.createElement("meta");
      meta.name = "description";
      document.head.appendChild(meta);
    }
    meta.content =
      "Curious beginner exploring ham radio scanning with budget radios. Honest reviews, CHIRP guides, custom firmware tips (Egzumer/IJV), and RX-only listening for Quansheng UV-K5 & UV-K1.";
  }, []);

  const startAuto = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (featuredImages.length > 1) {
      intervalRef.current = setInterval(() => {
        setActiveSlide((p) => (p + 1) % featuredImages.length);
      }, 4000);
    }
  }, []);

  useEffect(() => {
    startAuto();
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [startAuto]);

  const prev = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setActiveSlide(
      (p) => (p - 1 + featuredImages.length) % featuredImages.length,
    );
    startAuto();
  };

  const next = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setActiveSlide((p) => (p + 1) % featuredImages.length);
    startAuto();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.35 }}
      data-ocid="home.page"
    >
      <style>{`
        .logo-hero-box {
          width: 176px;
          height: 176px;
          border: 2px solid rgba(0,240,255,0.65);
          border-radius: 16px;
          background: rgba(0,0,0,0.25);
          box-shadow: 0 0 40px rgba(0,240,255,0.45), 0 0 80px rgba(0,240,255,0.18);
          padding: 8px;
          cursor: default;
          transition: box-shadow 0.3s ease;
        }
        .logo-hero-box:hover {
          animation: logoPulse 1.5s ease-in-out infinite;
          box-shadow: 0 0 60px rgba(0,240,255,0.7), 0 0 120px rgba(0,240,255,0.3);
        }
        @media (min-width: 640px) {
          .logo-hero-box { width: 224px; height: 224px; }
        }
        @media (min-width: 1024px) {
          .logo-hero-box { width: 272px; height: 272px; }
        }
        @keyframes logoPulse {
          0%, 100% { box-shadow: 0 0 60px rgba(0,240,255,0.65), 0 0 120px rgba(0,240,255,0.25); }
          50% { box-shadow: 0 0 90px rgba(0,240,255,0.9), 0 0 160px rgba(0,240,255,0.45); }
        }
        @keyframes neonPulseCyanBtn {
          0%, 100% { box-shadow: 0 0 18px rgba(0,240,255,0.5), inset 0 0 10px rgba(0,240,255,0.05); }
          50% { box-shadow: 0 0 36px rgba(0,240,255,0.85), inset 0 0 18px rgba(0,240,255,0.1); }
        }
        @keyframes neonPulsePurpleBtn {
          0%, 100% { box-shadow: 0 0 18px rgba(168,85,247,0.5), inset 0 0 10px rgba(168,85,247,0.05); }
          50% { box-shadow: 0 0 36px rgba(168,85,247,0.85), inset 0 0 18px rgba(168,85,247,0.1); }
        }
        .hero-btn-cyan {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 0.85rem 2rem;
          border-radius: 10px;
          font-size: 1.05rem;
          font-weight: 700;
          color: #00f0ff;
          background: rgba(0,240,255,0.1);
          border: 1.5px solid rgba(0,240,255,0.55);
          text-decoration: none;
          transition: background 0.2s ease;
          cursor: pointer;
          white-space: nowrap;
        }
        .hero-btn-cyan:hover {
          background: rgba(0,240,255,0.18);
          animation: neonPulseCyanBtn 1.4s ease-in-out infinite;
        }
        .hero-btn-purple {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 0.85rem 2rem;
          border-radius: 10px;
          font-size: 1.05rem;
          font-weight: 700;
          color: #a855f7;
          background: rgba(168,85,247,0.1);
          border: 1.5px solid rgba(168,85,247,0.55);
          text-decoration: none;
          transition: background 0.2s ease;
          cursor: pointer;
          white-space: nowrap;
        }
        .hero-btn-purple:hover {
          background: rgba(168,85,247,0.18);
          animation: neonPulsePurpleBtn 1.4s ease-in-out infinite;
        }
        @media (max-width: 639px) {
          .hero-btn-cyan, .hero-btn-purple {
            width: 100%;
            justify-content: center;
            padding: 0.9rem 1rem;
          }
        }
        .kw-cyan { color: #00f0ff; cursor: default; }
        .kw-purple { color: #a855f7; cursor: default; }
        @keyframes cardPulseCyan {
          0%, 100% { box-shadow: 0 0 20px rgba(0,240,255,0.15); }
          50% { box-shadow: 0 0 35px rgba(0,240,255,0.3); }
        }
        @keyframes cardPulsePurple {
          0%, 100% { box-shadow: 0 0 20px rgba(168,85,247,0.15); }
          50% { box-shadow: 0 0 35px rgba(168,85,247,0.3); }
        }
        .stat-card-cyan {
          background: #111111;
          border: 1px solid rgba(0,240,255,0.35);
          box-shadow: 0 0 20px rgba(0,240,255,0.15);
          border-radius: 12px;
          padding: 1.75rem 1.5rem;
          text-align: center;
          transition: transform 0.3s ease;
        }
        .stat-card-cyan:hover {
          transform: translateY(-5px);
          animation: cardPulseCyan 1.8s ease-in-out infinite;
        }
        .stat-card-purple {
          background: #111111;
          border: 1px solid rgba(168,85,247,0.35);
          box-shadow: 0 0 20px rgba(168,85,247,0.15);
          border-radius: 12px;
          padding: 1.75rem 1.5rem;
          text-align: center;
          transition: transform 0.3s ease;
        }
        .stat-card-purple:hover {
          transform: translateY(-5px);
          animation: cardPulsePurple 1.8s ease-in-out infinite;
        }
      `}</style>

      {/* ========= HERO ========= */}
      <section
        className="relative flex flex-col items-center justify-center overflow-hidden"
        style={{ minHeight: "100vh" }}
        data-ocid="home.section"
      >
        <RadioWavesBg />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 80% 60% at 50% 70%, rgba(0,240,255,0.06) 0%, transparent 60%), radial-gradient(ellipse 60% 40% at 50% 90%, rgba(168,85,247,0.08) 0%, transparent 60%)",
          }}
        />

        <div className="relative z-10 flex flex-col items-center text-center px-4 w-full max-w-2xl">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="float-anim mt-24 sm:mt-28 mb-6"
          >
            <motion.div
              className="logo-hero-box"
              whileHover={{ scale: 1.1 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <img
                src="/assets/uploads/gemini-2.5-flash-image_create_a_more_refined_version_of_the_image_provided_for_as_reference_does_not_ne-0-1--1.jpg"
                alt="HamWaves"
                className="w-full h-full object-contain"
                style={{ imageRendering: "auto" }}
              />
            </motion.div>
          </motion.div>

          <motion.h1
            custom={1}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="font-display font-black text-3xl sm:text-5xl lg:text-7xl leading-tight mb-3 mt-6"
            style={{ color: "#00f0ff" }}
          >
            Tuning Into the World
            <br />
            of Ham Radio
          </motion.h1>

          <motion.p
            custom={2}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="text-base sm:text-lg mb-8 tracking-wide"
            style={{ color: "#707070" }}
          >
            Equipment breakdowns&nbsp;&nbsp;•&nbsp;&nbsp;Field
            ops&nbsp;&nbsp;•&nbsp;&nbsp;Shorts
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            custom={3}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto"
          >
            <motion.a
              href="https://www.youtube.com/@dmtoozer"
              target="_blank"
              rel="noopener noreferrer"
              className="hero-btn-cyan"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              data-ocid="home.primary_button"
            >
              <Play size={20} fill="currentColor" />
              Watch Latest Video
            </motion.a>
            <motion.button
              type="button"
              onClick={() => navigate({ to: "/equipment-reviews" as const })}
              className="hero-btn-purple"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              data-ocid="home.secondary_button"
            >
              <BookOpen size={20} />
              Explore Guides
            </motion.button>
          </motion.div>

          {/* Subscribe sub-link */}
          <motion.div
            custom={4}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="mt-4"
          >
            <a
              href="https://www.youtube.com/@dmtoozer?sub_confirmation=1"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm"
              style={{ color: "#505050", textDecoration: "none" }}
            >
              <Youtube size={14} />
              Subscribe on YouTube
            </a>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.6 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1"
          style={{ color: "#404040" }}
        >
          <span className="text-xs tracking-widest uppercase">Scroll</span>
          <div
            className="w-px h-8"
            style={{
              background:
                "linear-gradient(to bottom, rgba(0,240,255,0.4), transparent)",
            }}
          />
        </motion.div>
      </section>

      {/* ========= ABOUT ========= */}
      <section
        className="max-w-4xl mx-auto px-4 py-24"
        data-ocid="home.section"
      >
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="glass-card p-6 sm:p-10 lg:p-12"
        >
          <div className="flex items-center gap-3 mb-6">
            <Radio size={20} style={{ color: "#a855f7" }} />
            <h2
              className="font-display font-bold text-2xl sm:text-3xl"
              style={{ color: "#e0e0e0" }}
            >
              About <span style={{ color: "#00f0ff" }}>HamWaves</span>
            </h2>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-4 mb-8"
          >
            <p
              className="text-base sm:text-lg leading-relaxed font-semibold"
              style={{ color: "#c0c0c0" }}
            >
              Welcome, I&apos;m Damien — a curious beginner exploring the world
              of radio scanning and looking to achieve my ham radio license!
            </p>
            <p
              className="text-base sm:text-lg leading-relaxed"
              style={{ color: "#909090" }}
            >
              I&apos;m learning the airwaves one frequency at a time, focusing
              on <span className="kw-cyan">RX-only listening</span> with{" "}
              <span className="kw-cyan">budget handhelds</span> like the{" "}
              <span className="kw-cyan">Quansheng UV-K5(8)/UV-K1</span>.
              HamWaves shares honest reviews, step-by-step guides, and tips for
              new listeners: from programming budget radios with CHIRP, flashing
              custom firmware (<span className="kw-purple">Egzumer/IJV</span>){" "}
              for better scanning, choosing the best antennas for clearer
              reception, to discovering airband, NOAA weather, marine, satcom,
              ISS, and local ham frequencies – all without transmitting.
            </p>
            <p
              className="text-base sm:text-lg leading-relaxed"
              style={{ color: "#909090" }}
            >
              Whether you&apos;re just starting out, prepping for emergencies,
              or enjoying the scanner hobby, join me as I test gear, share what
              works (and what doesn&apos;t), and grow together in this exciting
              RX-focused side of radio!
            </p>

            <div className="pt-2">
              <motion.button
                type="button"
                onClick={() => navigate({ to: "/equipment-reviews" as const })}
                className="btn-neon-cyan text-sm px-6 py-2.5 w-full sm:w-auto"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
                data-ocid="home.guides_button"
              >
                Explore Budget Radio Guides →
              </motion.button>
            </div>
          </motion.div>

          {/* STAT CARDS */}
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div
              ref={videoRef}
              className="stat-card-cyan"
              data-ocid="home.item.1"
            >
              <div
                className="font-display font-black text-sm tracking-[0.2em] uppercase mb-2"
                style={{ color: "#00f0ff" }}
              >
                VIDEOS
              </div>
              <div
                className="font-display font-black text-5xl sm:text-6xl leading-none mb-2"
                style={{ color: "#00f0ff" }}
              >
                {videoCount}
              </div>
              <div
                className="text-xs tracking-wide"
                style={{ color: "#505050" }}
              >
                Ham radio Shorts &amp; full videos
              </div>
            </div>

            <div
              ref={guideRef}
              className="stat-card-purple"
              data-ocid="home.item.2"
            >
              <div
                className="font-display font-black text-sm tracking-[0.2em] uppercase mb-2"
                style={{ color: "#a855f7" }}
              >
                GUIDES
              </div>
              <div
                className="font-display font-black text-5xl sm:text-6xl leading-none mb-2"
                style={{ color: "#a855f7" }}
              >
                {guideCount}
              </div>
              <div
                className="text-xs tracking-wide"
                style={{ color: "#505050" }}
              >
                In-depth reviews, mods &amp; tutorials
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ========= FEATURED IMAGES ========= */}
      <section
        className="max-w-7xl mx-auto px-4 pb-24"
        data-ocid="home.section"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex items-center justify-between mb-8"
        >
          <div className="flex items-center gap-3">
            <Antenna size={20} style={{ color: "#00f0ff" }} />
            <h2
              className="font-display font-bold text-2xl sm:text-3xl"
              style={{ color: "#e0e0e0" }}
            >
              Featured <span style={{ color: "#00f0ff" }}>Images</span>
            </h2>
          </div>
          {featuredImages.length > 1 && (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={prev}
                className="p-2 rounded-lg glass-card transition-all duration-200"
                style={{ color: "#a0a0a0" }}
                data-ocid="home.pagination_prev"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                type="button"
                onClick={next}
                className="p-2 rounded-lg glass-card transition-all duration-200"
                style={{ color: "#a0a0a0" }}
                data-ocid="home.pagination_next"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          )}
        </motion.div>

        <div className="hidden md:grid grid-cols-3 gap-5">
          {featuredImages.map((img, i) => (
            <ImageCard
              key={img.title}
              image={img}
              index={i}
              isActive={i === activeSlide}
            />
          ))}
        </div>

        <div className="md:hidden">
          <motion.div
            key={activeSlide}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.3 }}
          >
            <ImageCard image={featuredImages[activeSlide]} index={0} isActive />
          </motion.div>

          {featuredImages.length > 1 && (
            <div className="flex justify-center gap-2 mt-5">
              {featuredImages.map((img, i) => (
                <button
                  key={img.title}
                  type="button"
                  onClick={() => setActiveSlide(i)}
                  className="w-2 h-2 rounded-full transition-all duration-200"
                  style={{
                    background: i === activeSlide ? "#00f0ff" : "#303030",
                    boxShadow:
                      i === activeSlide
                        ? "0 0 8px rgba(0,240,255,0.6)"
                        : "none",
                  }}
                  data-ocid="home.toggle"
                />
              ))}
            </div>
          )}
        </div>
      </section>
    </motion.div>
  );
}

function ImageCard({
  image,
  index,
  isActive,
}: {
  image: (typeof featuredImages)[0];
  index: number;
  isActive: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -4, boxShadow: "0 0 30px rgba(0,240,255,0.25)" }}
      className="glass-card overflow-hidden cursor-pointer transition-all duration-300"
      style={{
        boxShadow: isActive
          ? "0 0 25px rgba(0,240,255,0.2), 0 0 50px rgba(0,240,255,0.1)"
          : undefined,
        border: isActive
          ? "1px solid rgba(0,240,255,0.3)"
          : "1px solid rgba(255,255,255,0.1)",
      }}
    >
      <div className="relative overflow-hidden" style={{ aspectRatio: "3/4" }}>
        <img
          src={image.src}
          alt={image.title}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
        />
      </div>
      <div className="p-5 sm:p-6">
        <h3
          className="font-display font-semibold text-base mb-2"
          style={{ color: "#e0e0e0" }}
        >
          {image.title}
        </h3>
        <p className="text-sm leading-relaxed" style={{ color: "#606060" }}>
          {image.desc}
        </p>
      </div>
    </motion.div>
  );
}
