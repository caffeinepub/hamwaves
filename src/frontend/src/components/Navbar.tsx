import { Link, useRouterState } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";

const navLinks = [
  { label: "Home", path: "/" },
  { label: "Videos", path: "/videos" },
  { label: "Links", path: "/links" },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close menu on route change - currentPath is the trigger, setMenuOpen is stable
  // biome-ignore lint/correctness/useExhaustiveDependencies: intentional - only re-run when path changes
  useEffect(() => {
    setMenuOpen(false);
  }, [currentPath]);

  return (
    <>
      <header
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
        style={{
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          background: scrolled ? "rgba(10,10,10,0.85)" : "rgba(10,10,10,0.6)",
          borderBottom: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center">
          {/* Logo – left slot */}
          <div className="flex-1">
            <Link
              to="/"
              data-ocid="nav.link"
              className="inline-flex items-center gap-2 group"
            >
              <img
                src="/assets/generated/hamwaves-logo-transparent.dim_512x512.png"
                alt="HamWaves"
                className="h-9 w-9 object-contain group-hover:drop-shadow-[0_0_8px_rgba(0,240,255,0.8)] transition-all duration-300"
              />
              <span
                className="font-display font-bold text-lg tracking-wide"
                style={{
                  color: "#00f0ff",
                  textShadow: "0 0 10px rgba(0,240,255,0.5)",
                }}
              >
                HamWaves
              </span>
            </Link>
          </div>

          {/* Desktop Nav – centred slot */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => {
              const isActive = currentPath === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  data-ocid="nav.link"
                  className="relative text-sm font-medium tracking-wide transition-all duration-200 group"
                  style={{
                    color: isActive ? "#00f0ff" : "#a0a0a0",
                    textShadow: isActive
                      ? "0 0 8px rgba(0,240,255,0.6)"
                      : "none",
                  }}
                >
                  {link.label}
                  <span
                    className="absolute -bottom-1 left-0 h-px transition-all duration-300"
                    style={{
                      width: isActive ? "100%" : "0%",
                      background: "linear-gradient(90deg, #00f0ff, #a855f7)",
                      boxShadow: "0 0 6px rgba(0,240,255,0.6)",
                    }}
                  />
                </Link>
              );
            })}
          </nav>

          {/* Right slot – keeps layout balanced on desktop, hamburger on mobile */}
          <div className="flex-1 flex justify-end">
            <button
              type="button"
              onClick={() => setMenuOpen((v) => !v)}
              className="md:hidden p-2 rounded-lg transition-colors duration-200"
              style={{ color: "#e0e0e0" }}
              aria-label="Toggle menu"
              data-ocid="nav.toggle"
            >
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40"
              style={{
                background: "rgba(0,0,0,0.6)",
                backdropFilter: "blur(4px)",
              }}
              onClick={() => setMenuOpen(false)}
            />
            <motion.nav
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 z-50 w-72 flex flex-col pt-20 pb-8 px-6"
              style={{
                background: "rgba(10,10,10,0.97)",
                backdropFilter: "blur(20px)",
                borderLeft: "1px solid rgba(255,255,255,0.1)",
              }}
              data-ocid="nav.panel"
            >
              <button
                type="button"
                onClick={() => setMenuOpen(false)}
                className="absolute top-4 right-4 p-2"
                style={{ color: "#a0a0a0" }}
                data-ocid="nav.close_button"
              >
                <X size={22} />
              </button>

              <div className="flex flex-col gap-2">
                {navLinks.map((link, i) => {
                  const isActive = currentPath === link.path;
                  return (
                    <motion.div
                      key={link.path}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.07 }}
                    >
                      <Link
                        to={link.path}
                        data-ocid="nav.link"
                        className="flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium transition-all duration-200"
                        style={{
                          color: isActive ? "#00f0ff" : "#c0c0c0",
                          background: isActive
                            ? "rgba(0,240,255,0.08)"
                            : "transparent",
                          border: isActive
                            ? "1px solid rgba(0,240,255,0.2)"
                            : "1px solid transparent",
                          textShadow: isActive
                            ? "0 0 8px rgba(0,240,255,0.4)"
                            : "none",
                        }}
                      >
                        {link.label}
                      </Link>
                    </motion.div>
                  );
                })}
              </div>
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
