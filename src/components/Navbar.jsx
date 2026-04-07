import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { navLinks } from "../constants";
import logo from "../assets/a.png";

/* ── Hamburger / Close icon ──────────────────────────────────────────────── */
const MenuIcon = ({ open }) => (
  <div className="w-6 h-6 flex flex-col justify-center gap-[5px] cursor-pointer">
    <motion.span
      animate={open ? { rotate: 45, y: 7 } : { rotate: 0, y: 0 }}
      transition={{ duration: 0.25, ease: "easeInOut" }}
      className="block h-[1.5px] w-full rounded-full bg-white origin-center"
    />
    <motion.span
      animate={open ? { opacity: 0, scaleX: 0 } : { opacity: 1, scaleX: 1 }}
      transition={{ duration: 0.2 }}
      className="block h-[1.5px] w-full rounded-full bg-white"
    />
    <motion.span
      animate={open ? { rotate: -45, y: -7 } : { rotate: 0, y: 0 }}
      transition={{ duration: 0.25, ease: "easeInOut" }}
      className="block h-[1.5px] w-full rounded-full bg-white origin-center"
    />
  </div>
);

/* ── Navbar ───────────────────────────────────────────────────────────────── */
const Navbar = () => {
  const [active, setActive]   = useState("");
  const [toggle, setToggle]   = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 60);

      // Scroll-based active section tracking
      let found = "";
      for (const nav of navLinks) {
        const anchor = document.getElementById(nav.id);
        if (!anchor) continue;
        const section = anchor.parentElement;
        if (!section) continue;
        const { top, bottom } = section.getBoundingClientRect();
        if (top <= 120 && bottom > 120) { found = nav.title; break; }
      }
      if (found) setActive(found);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* lock body scroll when mobile menu is open */
  useEffect(() => {
    document.body.style.overflow = toggle ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [toggle]);

  return (
    <>
      {/* ── Main bar ─────────────────────────────────────────────────────── */}
      <motion.nav
        animate={{
          backgroundColor: scrolled ? "rgba(5,5,20,0.82)" : "rgba(0,0,0,0)",
          borderBottomColor: scrolled ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0)",
        }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="fixed top-0 left-0 right-0 z-30 border-b"
        style={{ backdropFilter: scrolled ? "blur(20px) saturate(180%)" : "none" }}
      >
        {/* Thin gradient underline — only visible on scroll */}
        <motion.div
          animate={{ opacity: scrolled ? 1 : 0 }}
          transition={{ duration: 0.4 }}
          className="absolute bottom-0 left-0 right-0 h-px pointer-events-none"
          style={{ background: "linear-gradient(90deg, transparent, rgba(139,92,246,0.6) 40%, rgba(99,102,241,0.6) 60%, transparent)" }}
        />

        <div className="w-full px-4 sm:px-8 h-16 flex items-center justify-between">

          {/* ── Logo ──────────────────────────────────────────────────────── */}
          <Link
            to="/"
            onClick={() => { setActive(""); window.scrollTo(0, 0); }}
            className="flex items-center gap-3 group select-none"
          >
            {/* Avatar ring */}
            <div className="relative flex-shrink-0">
              <div
                className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{ background: "radial-gradient(circle, rgba(139,92,246,0.4), transparent 70%)", filter: "blur(6px)" }}
              />
              <img
                src={logo}
                alt="Arshiya"
                className="relative w-9 h-9 rounded-full object-cover ring-2 ring-purple-500/40 group-hover:ring-purple-400/70 transition-all duration-300"
              />
              {/* Pulsing availability dot */}
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-[#050514]">
                <span className="absolute inset-0 rounded-full bg-emerald-400 animate-ping opacity-70" />
              </span>
            </div>

            {/* Name — stacked, no repetition */}
            <div className="leading-none">
              <p className="text-white text-[15px] font-bold tracking-tight">Arshiya</p>
              <p className="text-purple-400 text-[11px] font-medium tracking-[0.1em] mt-[1px]">
                Shafizade
              </p>
            </div>
          </Link>

          {/* ── Desktop nav pill ──────────────────────────────────────────── */}
          <ul
            className="hidden sm:flex items-center gap-0.5 rounded-full p-1"
            style={{
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            {navLinks.map((nav) => (
              <li key={nav.id} className="relative">
                <a
                  href={`#${nav.id}`}
                  onClick={() => setActive(nav.title)}
                  className={`relative z-10 block px-5 py-1.5 rounded-full text-[13.5px] font-medium transition-colors duration-200
                             ${active === nav.title ? "text-white" : "text-slate-400 hover:text-slate-200"}`}
                >
                  {/* Sliding active pill */}
                  {active === nav.title && (
                    <motion.span
                      layoutId="nav-active-pill"
                      className="absolute inset-0 rounded-full"
                      style={{
                        background: "rgba(255,255,255,0.1)",
                        boxShadow: "0 0 16px rgba(139,92,246,0.25)",
                        border: "1px solid rgba(139,92,246,0.25)",
                      }}
                      transition={{ type: "spring", stiffness: 420, damping: 32 }}
                    />
                  )}
                  {nav.title}
                </a>
              </li>
            ))}
          </ul>

          {/* ── Mobile hamburger ──────────────────────────────────────────── */}
          <button
            className="sm:hidden relative z-40 p-1"
            onClick={() => setToggle(!toggle)}
            aria-label="Toggle menu"
          >
            <MenuIcon open={toggle} />
          </button>
        </div>
      </motion.nav>

      {/* ── Mobile full-screen menu ───────────────────────────────────────── */}
      <AnimatePresence>
        {toggle && (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0, clipPath: "circle(0% at calc(100% - 2rem) 2rem)" }}
            animate={{ opacity: 1, clipPath: "circle(150% at calc(100% - 2rem) 2rem)" }}
            exit={{ opacity: 0, clipPath: "circle(0% at calc(100% - 2rem) 2rem)" }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-20 flex flex-col"
            style={{ background: "rgba(5,5,20,0.97)", backdropFilter: "blur(24px)" }}
          >
            {/* Subtle background glow */}
            <div
              className="absolute top-0 right-0 w-[400px] h-[400px] opacity-20 pointer-events-none"
              style={{ background: "radial-gradient(circle at top right, #7c3aed, transparent 65%)" }}
            />
            <div
              className="absolute bottom-0 left-0 w-[300px] h-[300px] opacity-10 pointer-events-none"
              style={{ background: "radial-gradient(circle at bottom left, #3b82f6, transparent 65%)" }}
            />

            <div className="flex flex-col justify-center items-start h-full px-10 gap-2">
              {/* Label */}
              <p className="text-purple-400/60 text-[11px] uppercase tracking-[0.25em] font-mono mb-4">
                Navigation
              </p>

              {navLinks.map((nav, i) => (
                <motion.a
                  key={nav.id}
                  href={`#${nav.id}`}
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1], delay: 0.1 + i * 0.08 }}
                  onClick={() => { setToggle(false); setActive(nav.title); }}
                  className={`group flex items-center gap-4 py-3 w-full border-b
                             ${active === nav.title
                               ? "text-white border-purple-500/30"
                               : "text-slate-400 border-white/[0.05] hover:text-white"
                             } transition-colors duration-200`}
                >
                  {/* Number */}
                  <span className="text-[11px] font-mono text-purple-500/60 w-6 flex-shrink-0">
                    0{i + 1}
                  </span>
                  {/* Link text */}
                  <span className="text-[32px] font-bold leading-none tracking-tight">
                    {nav.title}
                  </span>
                  {/* Arrow that slides in on hover */}
                  <motion.svg
                    className={`ml-auto w-5 h-5 transition-opacity duration-200 ${active === nav.title ? "opacity-100" : "opacity-0 group-hover:opacity-60"}`}
                    viewBox="0 0 20 20" fill="none"
                    initial={{ x: -4 }}
                    whileHover={{ x: 0 }}
                  >
                    <path d="M4 10h12M12 6l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </motion.svg>
                </motion.a>
              ))}

              {/* Bottom name mark */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.45 }}
                className="mt-10 text-white/20 text-[12px] font-mono tracking-[0.15em]"
              >
                ARSHIYA SHAFIZADE © 2025
              </motion.p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
