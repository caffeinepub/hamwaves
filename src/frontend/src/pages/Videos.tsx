import { AnimatePresence, motion } from "motion/react";
import { allVideos } from "../data/siteData";

export default function Videos() {
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
          border-radius: 14px;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          transition: transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease;
        }
        .video-card:hover {
          transform: translateY(-6px);
          border-color: rgba(0,240,255,0.7);
          animation: borderPulse 1.6s ease-in-out infinite;
        }
        .video-card-title {
          padding: 0.875rem 1rem;
          font-size: 0.9rem;
          font-weight: 600;
          color: #e0e0e0;
          line-height: 1.4;
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
          <p className="text-sm sm:text-base" style={{ color: "#606060" }}>
            All {allVideos.length} Shorts — straight from the HamWaves channel.
          </p>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          <AnimatePresence mode="popLayout">
            {allVideos.map((video, i) => (
              <motion.div
                key={video.id}
                layout
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                className="video-card"
                data-ocid={`videos.item.${i + 1}`}
              >
                <iframe
                  width="100%"
                  height="480"
                  src={`https://www.youtube.com/embed/${video.id}`}
                  title={video.title}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                  style={{ display: "block" }}
                />
                <div className="video-card-title">{video.title}</div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {allVideos.length === 0 && (
          <div
            className="text-center py-20"
            style={{
              background: "#111111",
              border: "1px solid rgba(0,240,255,0.2)",
              borderRadius: "12px",
            }}
            data-ocid="videos.empty_state"
          >
            <p style={{ color: "#505050" }}>No videos found.</p>
          </div>
        )}
      </motion.div>
    </>
  );
}
