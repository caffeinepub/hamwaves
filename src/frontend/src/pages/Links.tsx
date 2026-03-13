import { useNavigate } from "@tanstack/react-router";
import {
  ArrowRight,
  BookOpen,
  ExternalLink,
  Instagram,
  Link2,
  List,
  Radio,
  ShoppingBag,
  Twitter,
  Youtube,
} from "lucide-react";
import { motion } from "motion/react";

type LinkItem = {
  icon: React.ElementType;
  title: string;
  desc: string;
  href?: string;
  internalHref?: string;
  accentColor?: string;
};

const sections: {
  heading: string;
  icon: React.ElementType;
  links: LinkItem[];
}[] = [
  {
    heading: "Main Channel",
    icon: Youtube,
    links: [
      {
        icon: Youtube,
        title: "HamWaves on YouTube",
        desc: "Subscribe to the main channel for tutorials, equipment reviews, and live DX contacts.",
        href: "https://www.youtube.com/@dmtoozer",
        accentColor: "#00f0ff",
      },
    ],
  },
  {
    heading: "Playlists",
    icon: List,
    links: [
      {
        icon: BookOpen,
        title: "Ham Radio Playlist",
        desc: "A selection on ham radio youtube shorts videos from hearing the ISS to Airband",
        href: "https://www.youtube.com/watch?v=Eh4c4lPUea8&list=PL7bawgPZOurz5lmE3112vc4pUy17aCL2n&pp=sAgC",
        accentColor: "#00f0ff",
      },
      {
        icon: Radio,
        title: "Equipment Reviews",
        desc: "Honest, in-depth reviews of radios, antennas, and accessories.",
        internalHref: "/equipment-reviews",
        accentColor: "#a855f7",
      },
      {
        icon: ExternalLink,
        title: "Field Operations",
        desc: "SOTA activations, park operations, and portable setups.",
        href: "https://www.youtube.com/@dmtoozer",
        accentColor: "#00f0ff",
      },
    ],
  },
  {
    heading: "Socials",
    icon: Link2,
    links: [
      {
        icon: Instagram,
        title: "Instagram",
        desc: "Behind-the-scenes gear shots, antenna builds, and shack updates.",
        href: "https://instagram.com/",
        accentColor: "#a855f7",
      },
      {
        icon: Twitter,
        title: "Twitter / X",
        desc: "Real-time updates, DX spots, and band condition reports.",
        href: "https://x.com/",
        accentColor: "#00f0ff",
      },
    ],
  },
  {
    heading: "Ham Radio Resources",
    icon: Radio,
    links: [
      {
        icon: BookOpen,
        title: "ARRL",
        desc: "The American Radio Relay League – licensing info, operating guides, and events.",
        href: "https://www.arrl.org",
        accentColor: "#00f0ff",
      },
      {
        icon: ExternalLink,
        title: "QRZ.com",
        desc: "Amateur radio callsign lookup, logbook, and forums.",
        href: "https://www.qrz.com",
        accentColor: "#a855f7",
      },
      {
        icon: Link2,
        title: "eHam.net",
        desc: "Equipment reviews, elmer forum, and ham radio community.",
        href: "https://www.eham.net",
        accentColor: "#00f0ff",
      },
      {
        icon: Radio,
        title: "DXWatch",
        desc: "Real-time DX cluster – spots, alerts, and propagation data.",
        href: "https://www.dxwatch.com",
        accentColor: "#a855f7",
      },
    ],
  },
  {
    heading: "Affiliate Gear",
    icon: ShoppingBag,
    links: [
      {
        icon: Radio,
        title: "Baofeng UV-5R Radio",
        desc: "Best budget handheld for new hams. Dual-band VHF/UHF, tons of features.",
        href: "https://www.amazon.com/",
        accentColor: "#a855f7",
      },
      {
        icon: ExternalLink,
        title: "RTL-SDR Dongle",
        desc: "Get started with Software Defined Radio for under $30.",
        href: "https://www.amazon.com/",
        accentColor: "#00f0ff",
      },
      {
        icon: Link2,
        title: "Antenna Kit",
        desc: "Complete dipole antenna kit – quick deploy for portable ops.",
        href: "https://www.amazon.com/",
        accentColor: "#a855f7",
      },
    ],
  },
];

export default function Links() {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.35 }}
      className="max-w-4xl mx-auto px-4 pt-28 pb-24"
      data-ocid="links.page"
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-12"
      >
        <h1 className="font-display font-black text-4xl sm:text-5xl mb-2">
          <span style={{ color: "#e0e0e0" }}>Useful </span>
          <span className="glow-cyan">Links</span>
        </h1>
        <p className="text-base" style={{ color: "#606060" }}>
          Everything HamWaves – channels, resources, gear, and socials.
        </p>
      </motion.div>

      <div className="flex flex-col gap-12">
        {sections.map((section, si) => {
          const SIcon = section.icon;
          return (
            <motion.div
              key={section.heading}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: si * 0.08 }}
            >
              <div className="flex items-center gap-3 mb-5">
                <SIcon size={18} style={{ color: "#00f0ff" }} />
                <h2
                  className="font-display font-bold text-xl"
                  style={{ color: "#e0e0e0" }}
                >
                  {section.heading}
                </h2>
                <div
                  className="flex-1 h-px"
                  style={{
                    background:
                      "linear-gradient(to right, rgba(0,240,255,0.2), transparent)",
                  }}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {section.links.map((link, li) => {
                  const LIcon = link.icon;
                  const accent = link.accentColor ?? "#00f0ff";
                  const isInternal = !!link.internalHref;

                  const cardContent = (
                    <>
                      <div
                        className="shrink-0 w-10 h-10 rounded-xl flex items-center justify-center mt-0.5"
                        style={{
                          background: `${accent}18`,
                          border: `1px solid ${accent}30`,
                        }}
                      >
                        <LIcon size={18} style={{ color: accent }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p
                          className="font-display font-semibold text-sm mb-1"
                          style={{ color: "#e0e0e0" }}
                        >
                          {link.title}
                        </p>
                        <p
                          className="text-xs leading-relaxed"
                          style={{ color: "#606060" }}
                        >
                          {link.desc}
                        </p>
                      </div>
                      <ArrowRight
                        size={16}
                        className="shrink-0 mt-1 transition-transform duration-200 group-hover:translate-x-1"
                        style={{ color: accent }}
                      />
                    </>
                  );

                  if (isInternal) {
                    return (
                      <motion.div
                        key={link.title}
                        onClick={() =>
                          navigate({
                            to: link.internalHref as "/equipment-reviews",
                          })
                        }
                        whileHover={{
                          scale: 1.02,
                          boxShadow: `0 0 20px ${accent}33`,
                          borderColor: `${accent}55`,
                        }}
                        whileTap={{ scale: 0.98 }}
                        className="glass-card p-5 flex items-start gap-4 group cursor-pointer"
                        data-ocid={`links.item.${si * 10 + li + 1}`}
                      >
                        {cardContent}
                      </motion.div>
                    );
                  }

                  return (
                    <motion.a
                      key={link.title}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{
                        scale: 1.02,
                        boxShadow: `0 0 20px ${accent}33`,
                        borderColor: `${accent}55`,
                      }}
                      whileTap={{ scale: 0.98 }}
                      className="glass-card p-5 flex items-start gap-4 group cursor-pointer no-underline"
                      style={{ textDecoration: "none" }}
                      data-ocid={`links.item.${si * 10 + li + 1}`}
                    >
                      {cardContent}
                    </motion.a>
                  );
                })}
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
