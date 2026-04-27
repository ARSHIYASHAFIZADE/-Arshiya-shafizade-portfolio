import React, { useRef, useEffect, useState } from "react";
import { motion, useInView } from "framer-motion";
import { styles } from "../styles";
import { workExperiences } from "../constants";
import { SectionWrapper } from "../hoc";
import { textVariant } from "../utils/motion";

/* ── CountUp ──────────────────────────────────────────────────────────────── */
const CountUp = ({ to, suffix = "", prefix = "" }) => {
  const ref = useRef(null);
  const [val, setVal] = useState(0);
  const inView = useInView(ref, { once: true, margin: "-40px" });

  useEffect(() => {
    if (!inView) return;
    const start = Date.now();
    const duration = 1500;
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

/* ── Animated skill bar ───────────────────────────────────────────────────── */
const SkillBar = ({ label, pct, color, delay }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });

  return (
    <div ref={ref} className="flex flex-col gap-1.5">
      <div className="flex justify-between items-center">
        <span className="text-[11px] font-mono text-slate-400">{label}</span>
        <span className="text-[11px] font-mono font-semibold" style={{ color }}>{pct}%</span>
      </div>
      <div className="h-[5px] rounded-full bg-white/5 overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{ background: `linear-gradient(90deg, ${color}99, ${color})` }}
          initial={{ width: 0 }}
          animate={inView ? { width: `${pct}%` } : {}}
          transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1], delay }}
        />
      </div>
    </div>
  );
};

/* ── Career arc SVG ───────────────────────────────────────────────────────── */
const CareerArc = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  const companies = [
    { label: "LeadAlways", sub: "ECM",  start: 0,    end: 0.52, color: "#38bdf8", years: "2024–2025" },
    { label: "Coolriots",  sub: "BeX",  start: 0.52, end: 1,    color: "#a78bfa", years: "2025" },
  ];

  const W = 240, H = 64, BAR_Y = 28, BAR_H = 14;

  return (
    <div ref={ref} className="w-full flex flex-col items-center">
      <p className="text-[11px] font-mono uppercase tracking-[0.2em] text-purple-400/70 mb-3">
        Career Timeline
      </p>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-[240px]">
        <rect x="0" y={BAR_Y} width={W} height={BAR_H} rx="7" fill="rgba(255,255,255,0.04)" />

        {companies.map((c, i) => {
          const x = c.start * W;
          const w = (c.end - c.start) * W;
          return (
            <g key={c.label}>
              <motion.rect
                x={x + 1} y={BAR_Y} width={w - 2} height={BAR_H} rx="6"
                fill={`${c.color}22`} stroke={c.color} strokeWidth="1"
                initial={{ scaleX: 0, opacity: 0 }}
                animate={inView ? { scaleX: 1, opacity: 1 } : {}}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.2 + i * 0.2 }}
                style={{ transformOrigin: `${x + 1}px ${BAR_Y}px` }}
              />
              <motion.text
                x={x + w / 2} y={BAR_Y + BAR_H / 2 + 1}
                textAnchor="middle" dominantBaseline="middle"
                fill={c.color} fontSize="7.5" fontFamily="monospace" fontWeight="700"
                initial={{ opacity: 0 }}
                animate={inView ? { opacity: 1 } : {}}
                transition={{ duration: 0.4, delay: 0.5 + i * 0.2 }}
              >{c.sub}</motion.text>
            </g>
          );
        })}

        {["2024", "2025", "Now"].map((yr, i) => {
          const x = [0, W * 0.52, W][i];
          return (
            <motion.text
              key={yr} x={x} y={BAR_Y - 7}
              textAnchor={i === 2 ? "end" : i === 0 ? "start" : "middle"}
              fill="rgba(255,255,255,0.3)" fontSize="7" fontFamily="monospace"
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ duration: 0.4, delay: 0.8 + i * 0.1 }}
            >{yr}</motion.text>
          );
        })}

        {[0, W * 0.52, W].map((x, i) => (
          <motion.line
            key={i} x1={x} y1={BAR_Y - 4} x2={x} y2={BAR_Y}
            stroke="rgba(255,255,255,0.2)" strokeWidth="1"
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.3, delay: 0.7 + i * 0.05 }}
          />
        ))}

        {companies.map((c, i) => (
          <g key={`leg-${c.label}`}>
            <motion.rect
              x={i * 118} y={H - 10} width="7" height="7" rx="2"
              fill={`${c.color}30`} stroke={c.color} strokeWidth="1"
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ duration: 0.3, delay: 1.0 + i * 0.1 }}
            />
            <motion.text
              x={i * 118 + 10} y={H - 4}
              fill="rgba(255,255,255,0.45)" fontSize="7.5" fontFamily="monospace"
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ duration: 0.3, delay: 1.0 + i * 0.1 }}
            >{c.label} · {c.years}</motion.text>
          </g>
        ))}
      </svg>
    </div>
  );
};

/* ── Sidebar data ─────────────────────────────────────────────────────────── */
const COMPANY_TECH = [
  {
    company: "Coolriots",
    color: "#a78bfa",
    tags: [
      "JavaScript", "TypeScript", "React", "Next.js", "Node.js", "Express", 
      "Python", "FastAPI", "PostgreSQL", "Redis", "Neo4j", "Milvus", 
      "Docker", "Kubernetes", "OpenShift", "IBM Cloud", "Vault", 
      "Elasticsearch", "ArgoCD", "Git", "GitHub", "Playwright"
    ],
  },
  {
    company: "LeadAlways",
    color: "#38bdf8",
    tags: ["TypeScript", "React", "Docker", "Nginx", "GitLab CI", "i18n", "Gemini AI", "LDAP"],
  },
];

const SKILLS = [
  { label: "Frontend",         pct: 92, color: "#61dafb" },
  { label: "AI / LLM Integ.",  pct: 88, color: "#a78bfa" },
  { label: "Architecture",     pct: 82, color: "#4ade80" },
  { label: "Security / Auth",  pct: 74, color: "#fb923c" },
  { label: "Backend",          pct: 70, color: "#34d399" },
  { label: "DevOps / CI",      pct: 68, color: "#f97316" },
];

const IMPACT = [
  { to: 130, suffix: "K", label: "Lines of Code" },
  { to: 890, suffix: "+", label: "Files Shipped"  },
  { to: 8,   suffix: "+", label: "LLM Providers"  },
  { to: 30,  suffix: "+", label: "Admin Modules"  },
];

const panelStyle = {
  background: "rgba(9,9,31,0.85)",
  border: "1px solid rgba(255,255,255,0.07)",
  backdropFilter: "blur(12px)",
};

/* ── Sidebar ──────────────────────────────────────────────────────────────── */
const ExperienceSidebar = () => (
  <motion.aside
    initial={{ opacity: 0, x: 30 }}
    whileInView={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
    viewport={{ once: true }}
    className="hidden xl:flex flex-col gap-5 sticky top-24 self-start"
  >
    <div className="rounded-2xl p-5" style={panelStyle}>
      <CareerArc />
    </div>

    <div className="rounded-2xl p-5 grid grid-cols-2 gap-4" style={panelStyle}>
      <p className="col-span-2 text-[11px] font-mono uppercase tracking-[0.2em] text-purple-400/70 mb-1">
        Impact
      </p>
      {IMPACT.map(s => (
        <div key={s.label} className="flex flex-col gap-0.5">
          <span className="text-white font-black text-[24px] leading-none"
                style={{ textShadow: "0 0 18px rgba(139,92,246,0.5)" }}>
            <CountUp to={s.to} suffix={s.suffix} />
          </span>
          <span className="text-slate-500 text-[10.5px] font-mono leading-tight">{s.label}</span>
        </div>
      ))}
    </div>

    <div className="rounded-2xl p-5 flex flex-col gap-3" style={panelStyle}>
      <p className="text-[11px] font-mono uppercase tracking-[0.2em] text-purple-400/70 mb-1">
        Proficiency
      </p>
      {SKILLS.map((s, i) => (
        <SkillBar key={s.label} {...s} delay={0.15 + i * 0.08} />
      ))}
    </div>

    <div className="rounded-2xl p-5 flex flex-col gap-4" style={panelStyle}>
      <p className="text-[11px] font-mono uppercase tracking-[0.2em] text-purple-400/70 mb-1">
        Stack per Company
      </p>
      {COMPANY_TECH.map(({ company, color, tags }, ci) => (
        <div key={company}>
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2 h-2 rounded-full flex-shrink-0"
                  style={{ background: color, boxShadow: `0 0 6px ${color}` }} />
            <span className="text-[11px] font-mono font-semibold" style={{ color }}>{company}</span>
          </div>
          <div className="flex flex-wrap gap-1.5 pl-4">
            {tags.map((tag, ti) => (
              <motion.span
                key={tag}
                initial={{ opacity: 0, scale: 0.7 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.25, delay: ci * 0.1 + ti * 0.04 }}
                viewport={{ once: true }}
                className="px-2 py-0.5 rounded-full text-[10px] font-mono"
                style={{ color, background: `${color}10`, border: `1px solid ${color}30` }}
              >
                {tag}
              </motion.span>
            ))}
          </div>
        </div>
      ))}
    </div>
  </motion.aside>
);

/* ── Accent colors per company ────────────────────────────────────────────── */
const ACCENTS = ["#a78bfa", "#38bdf8"];

/* ── Experience card ──────────────────────────────────────────────────────── */
const ExperienceCard = ({ experience, index }) => {
  const accent = ACCENTS[index % ACCENTS.length];
  const num = String(index + 1).padStart(2, "0");

  return (
    <motion.article
      initial={{ opacity: 0, y: 55 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1], delay: index * 0.1 }}
      viewport={{ once: true, margin: "-60px" }}
      className="relative rounded-2xl overflow-hidden flex flex-col lg:flex-row group"
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
      {/* Animated accent top bar */}
      <motion.div
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1], delay: index * 0.1 + 0.3 }}
        viewport={{ once: true }}
        className="absolute top-0 left-0 right-0 h-[2px] origin-left z-20"
        style={{ background: `linear-gradient(90deg, ${accent}, transparent)` }}
      />

      {/* ── Left: Company identity panel ── */}
      <div
        className="lg:w-[320px] shrink-0 flex flex-col items-center justify-center gap-6 px-8 py-10 relative border-b lg:border-b-0 lg:border-r"
        style={{
          background: `linear-gradient(145deg, ${accent}08 0%, rgba(9,9,31,0) 70%)`,
          borderColor: "rgba(255,255,255,0.08)",
        }}
      >
        {/* Ghost index number */}
        <div
          className="absolute top-4 left-4 font-mono font-black text-[14px] opacity-20 tracking-tighter"
          style={{ color: accent }}
        >
          SYS_LOG // {num}
        </div>

        {/* Logo */}
        <div className="relative group/logo">
          <div className="absolute inset-0 bg-white/5 blur-2xl rounded-full scale-0 group-hover/logo:scale-150 transition-transform duration-700 opacity-0 group-hover/logo:opacity-100" />
          <motion.img
            src={experience.icon}
            alt={experience.company_name}
            className="relative z-10 max-w-[180px] h-auto grayscale group-hover:grayscale-0 transition-all duration-700 brightness-110"
            style={{ filter: `drop-shadow(0 0 15px ${accent}25)` }}
            whileHover={{ scale: 1.05 }}
          />
        </div>

        {/* Role + company + date */}
        <div className="relative z-10 flex flex-col items-center gap-2 text-center">
          <h3 className="text-white font-bold text-[19px] leading-tight tracking-tight">
            {experience.title}
          </h3>
          <p className="text-[12px] font-mono font-black tracking-[0.2em] uppercase" style={{ color: accent }}>
            {experience.company_name}
          </p>
          <div className="mt-4 flex flex-col gap-2 w-full max-w-[200px]">
            {experience.metrics?.map((m, i) => (
              <div key={i} className="flex items-center justify-between px-3 py-1.5 rounded-lg bg-white/[0.03] border border-white/[0.05]">
                 <span className="text-[9px] font-mono text-slate-500 uppercase">{m.label}</span>
                 <span className="text-[10.5px] font-mono font-bold text-white" style={{ textShadow: `0 0 8px ${accent}60` }}>{m.value}</span>
              </div>
            ))}
          </div>
          <span
            className="mt-4 px-4 py-1.5 rounded-full text-[10.5px] font-mono font-bold tracking-widest bg-white/[0.02] border border-white/[0.08] text-slate-400"
          >
            {experience.date}
          </span>
        </div>
      </div>

      {/* ── Right: Content Area ── */}
      <div className="flex-1 flex flex-col px-8 py-10 lg:px-12 bg-white/[0.01]">
        {/* Bullet points */}
        <ul className="flex flex-col gap-4 flex-1">
          {experience.points.map((point, i) => (
            <motion.li
              key={i}
              initial={{ opacity: 0, x: 10 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 + 0.3 + i * 0.05 }}
              viewport={{ once: true }}
              className="flex items-start gap-4"
            >
              <div
                className="mt-[7px] w-1.5 h-1.5 rounded-full shrink-0 animate-pulse"
                style={{ background: accent, boxShadow: `0 0 10px ${accent}` }}
              />
              <p className="text-slate-400 text-[14.5px] leading-relaxed group-hover:text-slate-200 transition-colors duration-300">
                {point}
              </p>
            </motion.li>
          ))}
        </ul>
      </div>
    </motion.article>
  );
};

/* ── Section ──────────────────────────────────────────────────────────────── */
const Experience = () => (
  <>
    <motion.div variants={textVariant()}>
      <p className={`${styles.sectionSubText} text-purple-200`}>
        Where I have worked
      </p>
      <h2
        className={`${styles.sectionHeadText} text-transparent bg-clip-text
                    bg-gradient-to-r from-purple-400 to-blue-300 drop-shadow-lg`}
      >
        Work Experience.
      </h2>
    </motion.div>

    <div className="mt-14 xl:grid xl:grid-cols-[1fr_290px] xl:gap-10 xl:items-start">
      {/* Cards */}
      <div className="flex flex-col gap-8">
        {workExperiences.map((experience, index) => (
          <ExperienceCard key={index} experience={experience} index={index} />
        ))}
      </div>

      {/* Sidebar — xl+ only */}
      <ExperienceSidebar />
    </div>
  </>
);

export default SectionWrapper(Experience, "work");
