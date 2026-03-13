import { Filter } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { allVideos } from "../data/siteData";

export default function Videos() {
  const [filter, setFilter] = useState<"all" | "short">("short");

  const visible = filter === "all" ? allVideos : allVideos;

  return (
    <>
      <style>{`
        @keyframes borderPulse {
          0%, 100% { box-shadow: 0 0 24px rgba(0,240,255,0.5), 0 0 8px rgba(0,240,255,0.3); }
          50% { box-shadow: 0 0 40px rgba(0,240,255,0.75), 0 0 16px rgba(0,240,255,0.5); }
        }
        .video-card {
          background: #111111;
          border: 1px solid rgba(0,240,255,0.4);
          box-shadow: 0 0 12px rgba(0,240,255,0.25);
          border-radius: 12px;
          overflow: hidden;
          transition: transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease;
        }
        .video-card:hover {
          transform: translateY(-6px);
          border-color: rgba(0,240,255,0.7);
          animation: borderPulse 1.6s ease-in-out infinite;
        }
      `}</style>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.35 }}
        className="max-w-7xl mx-auto px-4 pt-28 pb-24"
        data-ocid="videos.page"
      >
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-10"
        >
          <h1 className="font-display font-black text-4xl sm:text-6xl mb-3 tracking-tight">
            <span style={{ color: "#00f0ff" }}>HamWaves</span>{" "}
            <span style={{ color: "#e0e0e0" }}>Shorts</span>
          </h1>
          <p className="text-base" style={{ color: "#606060" }}>
            All {allVideos.length} Shorts — straight from the HamWaves channel.
          </p>
        </motion.div>

        {/* Filter buttons */}
        <div className="flex items-center gap-3 mb-8">
          <Filter size={16} style={{ color: "#505050" }} />
          {(["all", "short"] as const).map((f) => (
            <motion.button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="px-5 py-2 rounded-lg text-sm font-medium capitalize transition-all duration-200"
              style={{
                background:
                  filter === f
                    ? "rgba(0,240,255,0.1)"
                    : "rgba(255,255,255,0.04)",
                border:
                  filter === f
                    ? "1px solid rgba(0,240,255,0.5)"
                    : "1px solid rgba(255,255,255,0.1)",
                color: filter === f ? "#00f0ff" : "#808080",
                boxShadow:
                  filter === f ? "0 0 15px rgba(0,240,255,0.2)" : "none",
              }}
              data-ocid="videos.tab"
            >
              {f === "all" ? "All Videos" : "Shorts Only"}
            </motion.button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {visible.map((video, i) => (
              <motion.div
                key={video.id}
                layout
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4, delay: i * 0.06 }}
                className="video-card flex flex-col"
                data-ocid={`videos.item.${i + 1}`}
              >
                <iframe
                  width="100%"
                  height="560"
                  src={`https://www.youtube.com/embed/${video.id}`}
                  title={video.title}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                />
                <div className="p-4">
                  <h3
                    className="font-display font-semibold text-sm"
                    style={{ color: "#e0e0e0" }}
                  >
                    {video.title}
                  </h3>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {visible.length === 0 && (
          <div
            className="text-center py-20"
            style={{
              background: "#111111",
              border: "1px solid rgba(0,240,255,0.2)",
              borderRadius: "12px",
            }}
            data-ocid="videos.empty_state"
          >
            <p style={{ color: "#505050" }}>No videos found for this filter.</p>
          </div>
        )}
      </motion.div>
    </>
  );
}
