import React from "react";
import { motion } from "framer-motion";
import { Tilt } from "react-tilt";
import { styles } from "../styles";
import { services } from "../constants";
import { SectionWrapper } from "../hoc";
import { fadeIn, textVariant } from "../utils/motion";

/* ── Glow helper ─────────────────────────────────────────────────────────── */
const G = ({ c, children, gradient }) => {
  if (gradient) {
    return (
      <span
        style={{
          background: gradient,
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          fontWeight: 600,
        }}
      >
        {children}
      </span>
    );
  }
  return (
    <span
      style={{
        color: c,
        fontWeight: 600,
        textShadow: `0 0 8px ${c}90, 0 0 22px ${c}45`,
      }}
    >
      {children}
    </span>
  );
};

/* ── Animation variants ──────────────────────────────────────────────────── */
const containerVariants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.22, delayChildren: 0.1 },
  },
};

const paraVariants = {
  hidden: { opacity: 0, y: 28, filter: "blur(6px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.85, ease: [0.22, 1, 0.36, 1] },
  },
};

/* ── Custom Technical Icons ──────────────────────────────────────────────── */
const ServiceIcon = ({ type, color }) => {
  const props = { width: "42", height: "42", viewBox: "0 0 24 24", fill: "none", stroke: color, strokeWidth: "1.5", strokeLinecap: "round", strokeLinejoin: "round" };
  
  if (type.includes("Backend")) {
    return (
      <svg {...props}>
        <rect x="2" y="2" width="20" height="8" rx="2" />
        <rect x="2" y="14" width="20" height="8" rx="2" />
        <line x1="6" y1="6" x2="6" y2="6" />
        <line x1="6" y1="18" x2="6" y2="18" />
      </svg>
    );
  }
  if (type.includes("LLM")) {
    return (
      <svg {...props}>
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        <path d="M8 9h8" /><path d="M8 13h6" />
      </svg>
    );
  }
  if (type.includes("ML")) {
    return (
      <svg {...props}>
        <path d="M12 2v8" /><path d="M12 14v8" />
        <path d="M2 12h8" /><path d="M14 12h8" />
        <path d="M4.93 4.93l5.66 5.66" /><path d="M13.41 13.41l5.66 5.66" />
        <path d="M19.07 4.93l-5.66 5.66" /><path d="M10.59 13.41l-5.66 5.66" />
      </svg>
    );
  }
  return (
    <svg {...props}>
      <polygon points="12 2 2 7 12 12 22 7 12 2" />
      <polyline points="2 17 12 22 22 17" />
      <polyline points="2 12 12 17 22 12" />
    </svg>
  );
};

/* ── Service card ────────────────────────────────────────────────────────── */
const ServiceCard = ({ title, description, accent }) => (
  <Tilt
    className="w-full"
    options={{ max: 15, scale: 1.02, speed: 800, transition: true }}
  >
    <motion.div
      variants={fadeIn("up", "spring", 0, 0.75)}
      className="w-full group relative"
    >
      {/* Dynamic Glow Background */}
      <div 
        className="absolute -inset-0.5 rounded-2xl opacity-20 group-hover:opacity-100 transition duration-500 blur-xl"
        style={{ background: `linear-gradient(45deg, ${accent}, transparent, ${accent})` }}
      />
      
      <div 
        className="relative rounded-2xl p-8 min-h-[320px] flex flex-col items-start gap-6 overflow-hidden"
        style={{
          background: "rgba(9,9,31,0.85)",
          border: "1px solid rgba(255,255,255,0.08)",
          backdropFilter: "blur(12px)",
        }}
      >
        {/* Animated Background Stream */}
        <div className="absolute top-0 right-0 w-32 h-32 opacity-10 pointer-events-none translate-x-8 -translate-y-8">
           <div className="w-full h-full rotate-45" style={{ 
             backgroundImage: `repeating-linear-gradient(90deg, ${accent} 0px, ${accent} 1px, transparent 1px, transparent 10px)` 
           }} />
        </div>

        {/* Icon Container */}
        <div 
          className="w-16 h-16 rounded-xl flex items-center justify-center transition-all duration-500 group-hover:scale-110"
          style={{ 
            background: `${accent}12`, 
            border: `1px solid ${accent}30`,
            boxShadow: `inset 0 0 20px ${accent}10`
          }}
        >
          <ServiceIcon type={title} color={accent} />
        </div>

        <div className="flex flex-col gap-3">
          <h3 className="text-white text-[20px] font-bold leading-tight tracking-tight">
            {title}
          </h3>
          <p className="text-slate-400 text-[13.5px] leading-relaxed">
            {description}
          </p>
        </div>

        {/* Bottom indicator */}
        <div className="mt-auto pt-4 flex items-center gap-2 w-full">
          <div className="h-0.5 flex-1 rounded-full bg-white/5 overflow-hidden">
            <motion.div 
              className="h-full rounded-full"
              style={{ background: accent }}
              initial={{ width: 0 }}
              whileInView={{ width: "40%" }}
              transition={{ duration: 1, delay: 0.5 }}
            />
          </div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-white/30">Expertise</span>
        </div>
      </div>
    </motion.div>
  </Tilt>
);

/* ── About ───────────────────────────────────────────────────────────────── */
const About = () => (
  <>
    <motion.div variants={textVariant()}>
      <p className={styles.sectionSubText}>Introduction</p>
      <h2 className={styles.sectionHeadText}>Overview.</h2>
    </motion.div>

    {/* Thin gradient rule under heading */}
    <motion.div
      variants={fadeIn("", "", 0.05, 0.6)}
      className="mt-4 mb-2 h-px w-24 rounded-full"
      style={{ background: "linear-gradient(90deg, #a78bfa, #38bdf8, transparent)" }}
    />

    <motion.div
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-60px" }}
      variants={containerVariants}
      className="mt-4 max-w-3xl flex flex-col gap-6"
    >
      {/* Para 1 — who I am */}
      <motion.p
        variants={paraVariants}
        className="text-slate-300 text-[18px] leading-[1.9] font-normal tracking-[0.01em]"
      >
        I'm a full-stack engineer and AI developer studying Computer Science
        (AI&nbsp;+&nbsp;Data Science) at{" "}
        <G c="#34d399">Taylor's University</G> while shipping production
        systems at{" "}
        <G c="#a78bfa">Coolriots</G> and{" "}
        <G c="#38bdf8">LeadAlways</G>. My core stack is{" "}
        <G c="#61dafb">React</G>{" "}
        <span className="text-slate-500">/</span>{" "}
        <G c="#60a5fa">TypeScript</G> on the frontend,{" "}
        <G c="#4ade80">Node.js</G> and{" "}
        <G c="#2dd4bf">FastAPI</G> on the backend, and{" "}
        <G c="#22c55e">MongoDB</G>,{" "}
        <G c="#f87171">Redis</G>, and vector databases like{" "}
        <G c="#22d3ee">Milvus</G> in production.
      </motion.p>

      {/* Para 2 — AI depth */}
      <motion.p
        variants={paraVariants}
        className="text-slate-300/90 text-[17px] leading-[1.9] font-normal tracking-[0.01em]"
      >
        My deepest work is in{" "}
        <G c="#00f0ff">AI engineering</G> — designing LLM orchestration
        systems, RAG pipelines, and agentic workflows. At Coolriots I
        architected the{" "}
        <G gradient="linear-gradient(90deg,#a78bfa,#60a5fa,#34d399)">
          OpCode V2 CPIE
        </G>
        : a JSON-based workflow engine supporting 8+ providers (OpenAI, Groq,
        Gemini, WatsonX, Mistral and more), conditional routing, memory
        threading, and real-time{" "}
        <G c="#fbbf24">WebSocket</G> token streaming to the frontend.
      </motion.p>

      {/* Para 3 — closing */}
      <motion.p
        variants={paraVariants}
        className="text-slate-300/80 text-[17px] leading-[1.9] font-normal tracking-[0.01em]"
      >
        Beyond production work I build immersive{" "}
        <G c="#e2e8f0">3D</G> web experiences with{" "}
        <G c="#c4b5fd">Three.js</G> and ML-powered applications with
        scikit-learn. I bring the same precision to a cinematic 3D jungle as I
        do to a 100K-line enterprise SaaS codebase —{" "}
        <span className="text-slate-200 font-medium italic">
          ship fast, care about the details,
        </span>{" "}
        and always push what's possible on the web.
      </motion.p>
    </motion.div>

    <motion.div 
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-100px" }}
      className="mt-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
    >
      {services.map((service) => (
        <ServiceCard key={service.title} {...service} />
      ))}
    </motion.div>
  </>
);

export default SectionWrapper(About, "about");
