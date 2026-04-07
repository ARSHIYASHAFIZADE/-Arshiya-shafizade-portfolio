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

/* ── Service card ────────────────────────────────────────────────────────── */
const ServiceCard = ({ index, title, icon }) => (
  <Tilt
    className="xs:w-[250px] w-full"
    options={{ max: 45, scale: 1, speed: 450 }}
  >
    <motion.div
      variants={fadeIn("up", "spring", index * 0.5, 0.75)}
      className="w-full bg-gradient-to-r from-blue-600 via-purple-700 to-pink-600 p-[3px] rounded-[20px] shadow-[0_10px_30px_rgba(0,0,0,0.5)]"
    >
      <div className="rounded-[20px] py-6 px-10 min-h-[300px] bg-[#1a1a1a] flex justify-center items-center flex-col">
        <div className="relative w-20 h-20 rounded-full bg-gradient-to-r from-purple-500 to-blue-400 flex justify-center items-center">
          <img src={icon} alt={title} className="w-[70%] h-[70%] object-contain" />
          <div className="absolute inset-0 rounded-full animate-pulse bg-gradient-to-r from-purple-500 to-blue-500 opacity-20" />
        </div>
        <h3 className="text-white text-[22px] font-bold text-center mt-4">{title}</h3>
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

    <div className="mt-20 flex flex-wrap gap-10">
      {services.map((service, index) => (
        <ServiceCard key={service.title} index={index} {...service} />
      ))}
    </div>
  </>
);

export default SectionWrapper(About, "about");
