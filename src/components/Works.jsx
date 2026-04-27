import React, { useRef, useEffect, useState } from "react";
import { motion, useInView } from "framer-motion";
import { styles } from "../styles";
import { SectionWrapper } from "../hoc";
import { projects } from "../constants";
import { fadeIn, textVariant } from "../utils/motion";

/* ── Tech badge color map ─────────────────────────────────────────────────── */
const TECH = {
  "Next.js":       { color: "#e2e8f0", bg: "rgba(226,232,240,0.07)", border: "rgba(226,232,240,0.18)" },
  "Supabase":      { color: "#3ecf8e", bg: "rgba(62,207,142,0.08)",  border: "rgba(62,207,142,0.28)"  },
  "Groq AI":       { color: "#fb923c", bg: "rgba(251,146,60,0.08)",  border: "rgba(251,146,60,0.28)"  },
  "Tailwind":      { color: "#38bdf8", bg: "rgba(56,189,248,0.08)",  border: "rgba(56,189,248,0.28)"  },
  "Three.js":      { color: "#c4b5fd", bg: "rgba(196,181,253,0.07)", border: "rgba(196,181,253,0.22)" },
  "Framer Motion": { color: "#a78bfa", bg: "rgba(167,139,250,0.08)", border: "rgba(167,139,250,0.26)" },
  "TypeScript":    { color: "#60a5fa", bg: "rgba(96,165,250,0.08)",  border: "rgba(96,165,250,0.26)"  },
  "FastAPI":       { color: "#2dd4bf", bg: "rgba(45,212,191,0.08)",  border: "rgba(45,212,191,0.26)"  },
  "Python":        { color: "#facc15", bg: "rgba(250,204,21,0.07)",  border: "rgba(250,204,21,0.24)"  },
  "Docker":        { color: "#60a5fa", bg: "rgba(96,165,250,0.08)",  border: "rgba(96,165,250,0.26)"  },
  "Flask":         { color: "#cbd5e1", bg: "rgba(203,213,225,0.07)", border: "rgba(203,213,225,0.18)" },
  "scikit-learn":  { color: "#fb923c", bg: "rgba(251,146,60,0.08)",  border: "rgba(251,146,60,0.28)"  },
  "Llama 3.3":     { color: "#a78bfa", bg: "rgba(167,139,250,0.08)", border: "rgba(167,139,250,0.26)" },
};
const fallbackTech = { color: "#a78bfa", bg: "rgba(167,139,250,0.08)", border: "rgba(167,139,250,0.26)" };

/* ── Arrow icon ───────────────────────────────────────────────────────────── */
const ArrowIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/* ── Radar chart ──────────────────────────────────────────────────────────── */
// Pre-computed coordinates — center (130,120), maxR=90, 5 axes
const CX = 130, CY = 115, R = 90;
const axes = [
  { label: "Frontend",  angle: -90, value: 0.90, color: "#61dafb" },
  { label: "AI / LLM",  angle: -18, value: 0.78, color: "#a78bfa" },
  { label: "Backend",   angle:  54, value: 0.65, color: "#4ade80" },
  { label: "3D",        angle: 126, value: 0.72, color: "#06b6d4" },
  { label: "DevOps",    angle: 198, value: 0.55, color: "#f97316" },
];

const pt = (angle, pct) => {
  const r = (angle - 90) * (Math.PI / 180);
  return [CX + R * pct * Math.cos(r), CY + R * pct * Math.sin(r)];
};

const polygonPoints = (pct) =>
  axes.map(a => pt(a.angle, pct)).map(([x, y]) => `${x},${y}`).join(" ");

const dataPoints = axes.map(a => pt(a.angle, a.value));
const dataPolygon = dataPoints.map(([x, y]) => `${x},${y}`).join(" ");

const labelPos = (angle) => {
  const r = (angle - 90) * (Math.PI / 180);
  return [CX + (R + 18) * Math.cos(r), CY + (R + 18) * Math.sin(r)];
};

const RadarChart = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <div ref={ref} className="w-full flex flex-col items-center">
      <p className="text-[11px] font-mono uppercase tracking-[0.2em] text-purple-400/70 mb-3">
        Skill Radar
      </p>
      <svg viewBox="0 0 260 230" className="w-full max-w-[260px]">
        <defs>
          <radialGradient id="radarFill" cx="50%" cy="50%" r="50%">
            <stop offset="0%"   stopColor="#a78bfa" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.12" />
          </radialGradient>
          <filter id="radarGlow">
            <feGaussianBlur stdDeviation="2.5" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

        {/* Grid rings */}
        {[0.33, 0.66, 1].map((pct, i) => (
          <motion.polygon
            key={pct}
            points={polygonPoints(pct)}
            fill="none"
            stroke="rgba(255,255,255,0.07)"
            strokeWidth="1"
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.4, delay: i * 0.1 }}
          />
        ))}

        {/* Axis lines */}
        {axes.map((a, i) => {
          const [x, y] = pt(a.angle, 1);
          return (
            <motion.line
              key={a.label}
              x1={CX} y1={CY} x2={x} y2={y}
              stroke="rgba(255,255,255,0.08)"
              strokeWidth="1"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={inView ? { pathLength: 1, opacity: 1 } : {}}
              transition={{ duration: 0.6, delay: 0.3 + i * 0.07 }}
            />
          );
        })}

        {/* Data fill */}
        <motion.polygon
          points={dataPolygon}
          fill="url(#radarFill)"
          stroke="none"
          initial={{ opacity: 0, scale: 0.1 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.5 }}
          style={{ transformOrigin: `${CX}px ${CY}px` }}
        />

        {/* Data stroke */}
        <motion.polygon
          points={dataPolygon}
          fill="none"
          stroke="rgba(167,139,250,0.7)"
          strokeWidth="1.5"
          filter="url(#radarGlow)"
          initial={{ opacity: 0, scale: 0.1 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.5 }}
          style={{ transformOrigin: `${CX}px ${CY}px` }}
        />

        {/* Data dots on each axis */}
        {dataPoints.map(([x, y], i) => (
          <motion.circle
            key={i}
            cx={x} cy={y} r={3.5}
            fill={axes[i].color}
            filter="url(#radarGlow)"
            initial={{ opacity: 0, scale: 0 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.4, delay: 0.85 + i * 0.07 }}
            style={{ transformOrigin: `${x}px ${y}px` }}
          />
        ))}

        {/* Axis labels */}
        {axes.map((a, i) => {
          const [lx, ly] = labelPos(a.angle);
          return (
            <motion.text
              key={a.label}
              x={lx} y={ly}
              textAnchor="middle"
              dominantBaseline="middle"
              fill={a.color}
              fontSize="9.5"
              fontFamily="monospace"
              fontWeight="600"
              letterSpacing="0.04em"
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ duration: 0.4, delay: 1.0 + i * 0.07 }}
            >
              {a.label}
            </motion.text>
          );
        })}

        {/* Percentage labels on rings */}
        {[{ pct: 0.33, label: "33%" }, { pct: 0.66, label: "66%" }].map(({ pct, label }) => (
          <motion.text
            key={label}
            x={CX + 4}
            y={CY - R * pct + 1}
            fill="rgba(255,255,255,0.2)"
            fontSize="7"
            fontFamily="monospace"
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.4, delay: 0.5 }}
          >
            {label}
          </motion.text>
        ))}
      </svg>
    </div>
  );
};

/* ── Count-up number ──────────────────────────────────────────────────────── */
const CountUp = ({ to, suffix = "", prefix = "" }) => {
  const ref = useRef(null);
  const [val, setVal] = useState(0);
  const inView = useInView(ref, { once: true, margin: "-40px" });

  useEffect(() => {
    if (!inView) return;
    const start = Date.now();
    const duration = 1400;
    const tick = () => {
      const p = Math.min((Date.now() - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setVal(Math.round(eased * to));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [inView, to]);

  return <span ref={ref}>{prefix}{val}{suffix}</span>;
};

/* ── Sidebar ──────────────────────────────────────────────────────────────── */
const allTags = [...new Set(projects.flatMap(p => p.tags.map(t => t.name)))];

const STATS = [
  { to: 4,   suffix: "",    label: "Live Projects"  },
  { to: 120, suffix: "+",   label: "File Formats"   },
  { to: 8,   suffix: "+",   label: "LLM Providers"  },
  { to: 5,   suffix: "",    label: "ML Models"       },
];

const ProjectSidebar = () => (
  <motion.aside
    initial={{ opacity: 0, x: 30 }}
    whileInView={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
    viewport={{ once: true }}
    className="hidden xl:flex flex-col gap-5 sticky top-24 self-start"
  >
    {/* ── Radar chart panel ─────────────────────────────── */}
    <div
      className="rounded-2xl p-5"
      style={{
        background: "rgba(9,9,31,0.85)",
        border: "1px solid rgba(255,255,255,0.07)",
        backdropFilter: "blur(12px)",
      }}
    >
      <RadarChart />

      {/* Legend */}
      <div className="mt-4 grid grid-cols-2 gap-x-3 gap-y-2">
        {axes.map(a => (
          <div key={a.label} className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full flex-shrink-0"
                  style={{ background: a.color, boxShadow: `0 0 5px ${a.color}` }} />
            <span className="text-[10.5px] font-mono text-slate-400">{a.label}</span>
            <span className="text-[10px] font-mono ml-auto"
                  style={{ color: a.color }}>{Math.round(a.value * 100)}%</span>
          </div>
        ))}
      </div>
    </div>

    {/* ── Stats grid ────────────────────────────────────── */}
    <div
      className="rounded-2xl p-5 grid grid-cols-2 gap-4"
      style={{
        background: "rgba(9,9,31,0.85)",
        border: "1px solid rgba(255,255,255,0.07)",
        backdropFilter: "blur(12px)",
      }}
    >
      <p className="col-span-2 text-[11px] font-mono uppercase tracking-[0.2em] text-purple-400/70 mb-1">
        By the numbers
      </p>
      {STATS.map(s => (
        <div key={s.label} className="flex flex-col gap-0.5">
          <span className="text-white font-black text-[26px] leading-none"
                style={{ textShadow: "0 0 20px rgba(139,92,246,0.5)" }}>
            <CountUp to={s.to} suffix={s.suffix} />
          </span>
          <span className="text-slate-500 text-[11px] font-mono leading-tight">{s.label}</span>
        </div>
      ))}
    </div>

    {/* ── Tech tag cloud ────────────────────────────────── */}
    <div
      className="rounded-2xl p-5"
      style={{
        background: "rgba(9,9,31,0.85)",
        border: "1px solid rgba(255,255,255,0.07)",
        backdropFilter: "blur(12px)",
      }}
    >
      <p className="text-[11px] font-mono uppercase tracking-[0.2em] text-purple-400/70 mb-3">
        Technologies used
      </p>
      <div className="flex flex-wrap gap-1.5">
        {allTags.map((name, i) => {
          const cfg = TECH[name] || fallbackTech;
          return (
            <motion.span
              key={name}
              initial={{ opacity: 0, scale: 0.7 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: i * 0.04 }}
              viewport={{ once: true }}
              className="px-2.5 py-1 rounded-full text-[10.5px] font-mono font-medium"
              style={{ color: cfg.color, background: cfg.bg, border: `1px solid ${cfg.border}` }}
            >
              {name}
            </motion.span>
          );
        })}
      </div>
    </div>

    {/* ── Deployed on ───────────────────────────────────── */}
    <div
      className="rounded-2xl p-5"
      style={{
        background: "rgba(9,9,31,0.85)",
        border: "1px solid rgba(255,255,255,0.07)",
        backdropFilter: "blur(12px)",
      }}
    >
      <p className="text-[11px] font-mono uppercase tracking-[0.2em] text-purple-400/70 mb-3">
        Deployed on
      </p>
      <div className="flex flex-col gap-3">
        {[
          { name: "Vercel",  count: 4, icon: "https://cdn.jsdelivr.net/gh/simple-icons/simple-icons@v11/icons/vercel.svg",  color: "#e2e8f0" },
        ].map(({ name, count, icon, color }) => (
          <div key={name} className="flex items-center gap-3">
            <img src={icon} alt={name} className="w-4 h-4 object-contain opacity-80 brightness-0 invert" />
            <span className="text-slate-300 text-[12px] font-medium flex-1">{name}</span>
            <div className="flex gap-1">
              {Array.from({ length: count }).map((_, i) => (
                <span key={i} className="w-2 h-2 rounded-full"
                      style={{ background: color, boxShadow: `0 0 6px ${color}` }} />
              ))}
            </div>
            <span className="text-[11px] font-mono" style={{ color }}>{count}/4</span>
          </div>
        ))}
      </div>
    </div>
  </motion.aside>
);

/* ── Single project card ──────────────────────────────────────────────────── */
const ProjectCard = ({ project, index }) => {
  const isEven = index % 2 === 0;
  const accent = project.accent || "#8b5cf6";
  const num = String(index + 1).padStart(2, "0");

  const overlayStyle = {
    background: isEven
      ? `linear-gradient(to right, rgba(9,9,31,0) 20%, rgba(9,9,31,0.95) 100%)`
      : `linear-gradient(to left,  rgba(9,9,31,0) 20%, rgba(9,9,31,0.95) 100%)`,
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1], delay: index * 0.08 }}
      viewport={{ once: true, margin: "-80px" }}
      whileHover={{ y: -6, transition: { duration: 0.35, ease: "easeOut" } }}
      onClick={() => window.open(project.source_code_link, "_blank")}
      className="relative rounded-2xl overflow-hidden cursor-pointer group"
      style={{
        background: "rgba(9,9,31,0.85)",
        border: "1px solid rgba(255,255,255,0.08)",
        backdropFilter: "blur(12px)",
        boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
      }}
      onMouseEnter={e => {
        e.currentTarget.style.boxShadow = `0 20px 70px ${accent}15, 0 8px 40px rgba(0,0,0,0.4)`;
        e.currentTarget.style.borderColor = `${accent}30`;
      }}
      onMouseLeave={e => {
        e.currentTarget.style.boxShadow = "0 8px 32px rgba(0,0,0,0.3)";
        e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
      }}
    >
      <motion.div
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1], delay: index * 0.08 + 0.35 }}
        viewport={{ once: true }}
        className="absolute top-0 left-0 right-0 h-[2px] origin-left z-20"
        style={{ background: `linear-gradient(90deg, ${accent}, transparent)` }}
      />

      <div className={`flex flex-col ${isEven ? "lg:flex-row" : "lg:flex-row-reverse"}`}>

        <div className="relative lg:w-[56%] overflow-hidden" style={{ minHeight: "260px" }}>
          <motion.img
            src={project.image}
            alt={project.name}
            className="w-full h-full object-cover object-top grayscale group-hover:grayscale-0 transition-all duration-700"
            style={{ minHeight: "260px", maxHeight: "340px" }}
            whileHover={{ scale: 1.04 }}
            transition={{ duration: 0.65, ease: "easeOut" }}
          />
          <div className="absolute inset-0 hidden lg:block pointer-events-none" style={overlayStyle} />
          <div className="absolute inset-0 lg:hidden pointer-events-none"
               style={{ background: "linear-gradient(to bottom, rgba(9,9,31,0) 40%, rgba(9,9,31,0.95) 100%)" }} />

          <div
            className="absolute top-4 right-4 flex items-center gap-2 px-3 py-1.5 rounded-full z-10"
            style={{ background: "rgba(0,0,0,0.8)", backdropFilter: "blur(12px)", border: "1px solid rgba(255,255,255,0.15)" }}
          >
            <img src={project.icon} alt="platform" className="w-5 h-5 object-contain brightness-0 invert" />
            <span className="text-white text-[11px] font-bold tracking-widest uppercase">
              {project.icon.includes("vercel") ? "Vercel" : "GitHub"}
            </span>
          </div>
        </div>

        <div className="lg:w-[44%] flex flex-col justify-center gap-4 p-7 lg:px-10 lg:py-10">
          <span className="text-[10px] font-mono tracking-[0.3em] uppercase font-bold" style={{ color: accent }}>
            PROJECT // {num}
          </span>
          <h3 className="text-white font-bold leading-tight" style={{ fontSize: "clamp(20px, 2.5vw, 24px)" }}>
            {project.name}
          </h3>
          <p className="text-slate-400 text-[13.5px] leading-relaxed group-hover:text-slate-300 transition-colors">
            {project.description}
          </p>

          <div className="flex flex-wrap gap-2 mt-1">
            {project.tags.map(tag => {
              const cfg = TECH[tag.name] || fallbackTech;
              return (
                <span key={tag.name}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10.5px] font-mono font-medium"
                  style={{ color: cfg.color, background: `${cfg.color}08`, border: `1px solid ${cfg.color}25` }}
                >
                  <span className="w-1 h-1 rounded-full flex-shrink-0"
                        style={{ background: cfg.color, boxShadow: `0 0 5px ${cfg.color}` }} />
                  {tag.name}
                </span>
              );
            })}
          </div>

          <motion.div
            className="mt-2 flex items-center gap-2 w-fit text-[12px] font-bold uppercase tracking-wider cursor-pointer"
            style={{ color: accent }}
            whileHover={{ x: 5, transition: { duration: 0.2 } }}
          >
            <span>Visit Live</span>
            <ArrowIcon />
          </motion.div>
        </div>
      </div>
    </motion.article>
  );
};

/* ── Section ──────────────────────────────────────────────────────────────── */
const Works = () => (
  <>
    <motion.div variants={textVariant(0.2)}>
      <p className={`${styles.sectionSubText} text-purple-200`}>My work</p>
      <h2 className={`${styles.sectionHeadText} text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-300 drop-shadow-lg`}>
        Projects.
      </h2>
    </motion.div>

    <motion.p
      variants={fadeIn("", "", 0.25, 1)}
      className="mt-4 text-slate-400 text-[15px] max-w-2xl leading-[1.85]"
    >
      A selection of live projects spanning AI platforms, immersive 3D experiences,
      full-stack tools, and clinical ML systems — each linked directly to its deployed product.
    </motion.p>

    <div className="mt-14 xl:grid xl:grid-cols-[1fr_290px] xl:gap-10 xl:items-start">
      {/* Cards */}
      <div className="flex flex-col gap-8">
        {projects.map((project, index) => (
          <ProjectCard key={project.name} project={project} index={index} />
        ))}
      </div>

      {/* Sidebar — visible xl+ only */}
      <ProjectSidebar />
    </div>
  </>
);

export default SectionWrapper(Works, "projects");
