import React from "react";
import { motion } from "framer-motion";
import { styles } from "../styles";
import { SectionWrapper } from "../hoc";
import { textVariant } from "../utils/motion";
import { AstronautCanvas } from "./canvas";

const SOCIALS = [
  {
    label: "GitHub",
    handle: "@ARSHIYASHAFIZADE",
    href: "https://github.com/ARSHIYASHAFIZADE",
    description: "Explore my open-source work",
    color: "#e2e8f0",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
      </svg>
    ),
  },
  {
    label: "LinkedIn",
    handle: "arshiya-shafizade",
    href: "https://www.linkedin.com/in/arshiya-shafizade",
    description: "Connect with me professionally",
    color: "#0a66c2",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
  {
    label: "Email",
    handle: "shafizadearshiya@gmail.com",
    href: "mailto:shafizadearshiya@gmail.com",
    description: "Drop me a message",
    color: "#ea4335",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
        <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    label: "Phone",
    handle: "+60 17 282 1378",
    href: "tel:+601728213788",
    description: "Available for calls",
    color: "#4ade80",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
        <path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
      </svg>
    ),
  },
];

const SocialCard = ({ label, handle, href, description, color, icon, index }) => (
  <motion.a
    href={href}
    target={href.startsWith("http") ? "_blank" : undefined}
    rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: index * 0.1 }}
    viewport={{ once: true }}
    whileHover={{ y: -5, transition: { duration: 0.25 } }}
    className="flex items-center gap-5 p-5 rounded-2xl group relative overflow-hidden"
    style={{
      background: "rgba(9,9,31,0.85)",
      border: "1px solid rgba(255,255,255,0.08)",
      backdropFilter: "blur(12px)",
      boxShadow: "0 4px 24px rgba(0,0,0,0.3)",
      cursor: "pointer",
    }}
    onMouseEnter={e => {
      e.currentTarget.style.boxShadow = `0 16px 48px ${color}15, 0 4px 24px rgba(0,0,0,0.4)`;
      e.currentTarget.style.borderColor = `${color}30`;
    }}
    onMouseLeave={e => {
      e.currentTarget.style.boxShadow = "0 4px 24px rgba(0,0,0,0.3)";
      e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
    }}
  >
    {/* Icon Container */}
    <div
      className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-300 group-hover:scale-110"
      style={{ background: `${color}10`, border: `1px solid ${color}25`, color }}
    >
      {icon}
    </div>

    {/* Text */}
    <div className="flex-1 min-w-0">
      <p className="text-[10px] font-mono uppercase font-bold tracking-[0.2em] mb-1" style={{ color }}>
        {label}
      </p>
      <p className="text-white font-bold text-[15px]">{handle}</p>
      <p className="text-slate-500 text-[12.5px] mt-0.5 group-hover:text-slate-400 transition-colors">{description}</p>
    </div>

    {/* Arrow */}
    <motion.svg
      className="w-5 h-5 flex-shrink-0 opacity-20 group-hover:opacity-100 transition-all duration-300"
      style={{ color }}
      viewBox="0 0 20 20"
      fill="none"
      whileHover={{ x: 3 }}
    >
      <path d="M3 10h14M13 6l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </motion.svg>
  </motion.a>
);

const Contact = () => (
  <>
    <motion.div variants={textVariant()}>
      <p className={`${styles.sectionSubText} text-purple-200`}>Get in touch</p>
      <h2 className={`${styles.sectionHeadText} text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-300 drop-shadow-lg`}>
        Contact.
      </h2>
    </motion.div>

    <div className="mt-10 flex flex-col xl:flex-row gap-10 xl:items-center">

      {/* Left: social cards */}
      <div className="flex flex-col gap-3 w-full xl:max-w-[480px] shrink-0">
        {SOCIALS.map((social, index) => (
          <SocialCard key={social.label} {...social} index={index} />
        ))}

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          viewport={{ once: true }}
          className="mt-4 px-4 py-2.5 rounded-full text-[11.5px] font-mono font-medium w-fit"
          style={{
            color: "#a78bfa",
            background: "rgba(167,139,250,0.08)",
            border: "1px solid rgba(167,139,250,0.22)",
            letterSpacing: "0.06em",
          }}
        >
          Available for full-time roles &amp; freelance projects
        </motion.p>
      </div>

      {/* Right: 3D astronaut */}
      <motion.div
        initial={{ opacity: 0, x: 40 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
        viewport={{ once: true }}
        className="xl:flex-1 h-[560px] xl:h-[700px]"
      >
        <AstronautCanvas />
      </motion.div>

    </div>
  </>
);

export default SectionWrapper(Contact, "contact");
