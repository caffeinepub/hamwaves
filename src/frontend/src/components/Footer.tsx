import { Instagram, Twitter, Youtube } from "lucide-react";

const socials = [
  {
    icon: Youtube,
    label: "YouTube",
    href: "https://www.youtube.com/@dmtoozer",
  },
  { icon: Instagram, label: "Instagram", href: "https://instagram.com/" },
  { icon: Twitter, label: "Twitter/X", href: "https://x.com/" },
];

export default function Footer() {
  return (
    <footer
      className="relative mt-20 py-12 px-4"
      style={{
        borderTop: "1px solid rgba(255,255,255,0.06)",
        background: "rgba(255,255,255,0.01)",
      }}
    >
      <div className="max-w-5xl mx-auto flex flex-col items-center gap-6">
        {/* Logo row */}
        <div className="flex items-center gap-2">
          <img
            src="/assets/generated/hamwaves-logo-transparent.dim_512x512.png"
            alt="HamWaves"
            className="h-8 w-8 object-contain"
          />
          <span
            className="font-display font-bold"
            style={{
              color: "#00f0ff",
              textShadow: "0 0 8px rgba(0,240,255,0.4)",
            }}
          >
            HamWaves
          </span>
        </div>

        {/* Social icons */}
        <div className="flex items-center gap-4">
          {socials.map(({ icon: Icon, label, href }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              className="p-2 rounded-lg transition-all duration-200 group"
              style={{ color: "#606060" }}
              data-ocid="footer.link"
            >
              <Icon
                size={20}
                className="transition-all duration-200 group-hover:text-cyan-400"
                style={{}}
              />
            </a>
          ))}
        </div>

        {/* Tagline */}
        <p className="text-sm text-center" style={{ color: "#505050" }}>
          Tuning Into the World of Ham Radio
        </p>

        {/* Copyright */}
        <div
          className="flex flex-col sm:flex-row items-center gap-2 text-xs"
          style={{ color: "#383838" }}
        >
          <span>
            © {new Date().getFullYear()} HamWaves. All rights reserved.
          </span>
          <span className="hidden sm:block">·</span>
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "rgba(0,240,255,0.3)" }}
          >
            Built with ♥ using caffeine.ai
          </a>
        </div>
      </div>
    </footer>
  );
}
