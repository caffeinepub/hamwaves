import {
  Antenna,
  ChevronLeft,
  ChevronRight,
  Play,
  Radio,
  Youtube,
} from "lucide-react";
import { type Variants, motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import RadioWavesBg from "../components/RadioWavesBg";

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

function formatCount(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return `${n}`;
}

export default function Home() {
  const [activeSlide, setActiveSlide] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [videoCount, setVideoCount] = useState<string | null>(null);
  const [subscriberCount, setSubscriberCount] = useState<string | null>(null);
  const [statsLive, setStatsLive] = useState(false);

  useEffect(() => {
    fetch("https://yt.lemnoslife.com/channels?handle=@dmtoozer")
      .then((r) => r.json())
      .then((data) => {
        const stats = data?.items?.[0]?.statistics;
        if (stats) {
          setVideoCount(formatCount(Number(stats.videoCount)));
          setSubscriberCount(formatCount(Number(stats.subscriberCount)));
          setStatsLive(true);
        }
      })
      .catch(() => {
        // fallback to static values — leave state null so we show statics
      });
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

  const stats = [
    { val: videoCount, fallback: "150+", label: "Videos" },
    { val: subscriberCount, fallback: "5K+", label: "Subscribers" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.35 }}
      data-ocid="home.page"
    >
      {/* ========= HERO ========= */}
      <section
        className="relative flex flex-col items-center justify-center overflow-hidden"
        style={{ minHeight: "100vh" }}
        data-ocid="home.section"
      >
        <RadioWavesBg />

        {/* Radial glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 80% 60% at 50% 70%, rgba(0,240,255,0.06) 0%, transparent 60%), radial-gradient(ellipse 60% 40% at 50% 90%, rgba(168,85,247,0.08) 0%, transparent 60%)",
          }}
        />

        <div className="relative z-10 flex flex-col items-center text-center px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="float-anim mb-3"
          >
            <img
              src="/assets/generated/hamwaves-logo-transparent.dim_512x512.png"
              alt="HamWaves"
              className="w-40 h-40 sm:w-48 sm:h-48 object-contain drop-shadow-[0_0_30px_rgba(0,240,255,0.5)]"
            />
          </motion.div>

          <motion.h1
            custom={1}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="font-display font-black text-3xl sm:text-5xl lg:text-7xl leading-tight mb-3 glow-cyan"
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
            className="text-base sm:text-lg mb-7 tracking-wide"
            style={{ color: "#707070" }}
          >
            Equipment breakdowns&nbsp;&nbsp;•&nbsp;&nbsp;Field
            ops&nbsp;&nbsp;•&nbsp;&nbsp;Shorts
          </motion.p>

          <motion.div
            custom={3}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="flex flex-col sm:flex-row items-center gap-4"
          >
            <motion.a
              href="https://www.youtube.com/@dmtoozer"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-neon-cyan text-base px-8 py-3"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              data-ocid="home.primary_button"
            >
              <Play size={18} fill="currentColor" />
              Watch Latest Video
            </motion.a>
            <motion.a
              href="https://www.youtube.com/@dmtoozer?sub_confirmation=1"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-neon-purple text-base px-8 py-3"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              data-ocid="home.secondary_button"
            >
              <Youtube size={18} />
              Subscribe on YouTube
            </motion.a>
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
          className="glass-card p-8 sm:p-12"
        >
          <div className="flex items-center gap-3 mb-6">
            <Radio size={20} style={{ color: "#a855f7" }} />
            <h2
              className="font-display font-bold text-2xl sm:text-3xl"
              style={{ color: "#e0e0e0" }}
            >
              About <span className="glow-cyan">HamWaves</span>
            </h2>
            {/* Live indicator dot */}
            {statsLive && (
              <span className="flex items-center gap-1.5 ml-2">
                <span className="relative flex h-2.5 w-2.5">
                  <span
                    className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
                    style={{ background: "#00f0ff" }}
                  />
                  <span
                    className="relative inline-flex rounded-full h-2.5 w-2.5"
                    style={{
                      background: "#00f0ff",
                      boxShadow: "0 0 6px #00f0ff",
                    }}
                  />
                </span>
                <span
                  className="text-xs tracking-wider uppercase"
                  style={{ color: "#00f0ff", opacity: 0.7 }}
                >
                  Live
                </span>
              </span>
            )}
          </div>
          <p
            className="text-base sm:text-lg leading-relaxed"
            style={{ color: "#909090" }}
          >
            Passionate ham radio operator sharing the thrill of the airwaves.
            From building antennas to chasing DX contacts – join the adventure!
            Whether you&apos;re a seasoned operator or just getting your ticket,
            HamWaves covers everything from gear reviews and antenna builds to
            live contact sessions and field operations.
          </p>
          <div className="mt-8 grid grid-cols-2 gap-4 text-center">
            {stats.map((stat) => (
              <div key={stat.label} className="py-4">
                <div className="font-display font-black text-2xl sm:text-3xl glow-cyan">
                  {stat.val !== null ? (
                    stat.val
                  ) : (
                    <span
                      className="inline-block animate-pulse"
                      style={{ color: "rgba(0,240,255,0.5)", minWidth: "3rem" }}
                    >
                      ...
                    </span>
                  )}
                </div>
                <div
                  className="text-xs mt-1 tracking-wide uppercase"
                  style={{ color: "#505050" }}
                >
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ========= FEATURED IMAGES CAROUSEL ========= */}
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
              Featured <span className="glow-cyan">Images</span>
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

        {/* Desktop: grid of cards */}
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

        {/* Mobile: single active card */}
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
      data-ocid={`home.item.${index + 1}`}
    >
      <div className="relative overflow-hidden" style={{ aspectRatio: "3/4" }}>
        <img
          src={image.src}
          alt={image.title}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
        />
      </div>
      <div className="p-5">
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
