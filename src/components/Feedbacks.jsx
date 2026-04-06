import React from "react";
import { motion } from "framer-motion";
import { styles } from "../styles";
import { SectionWrapper } from "../hoc";
import { fadeIn, textVariant } from "../utils/motion";
import { testimonials } from "../constants";

const FeedbackCard = ({
  index,
  testimonial,
  name,
  designation,
  company,
  image,
}) => {
  const combinedVariants = {
    initial: fadeIn("up", "spring", index * 0.4, 0.8).hidden,
    animate: fadeIn("up", "spring", index * 0.4, 0.8).show,
    hover: {
      scale: 1.05,
      rotateX: [0, 2, -2, 1, 0],
      rotateY: [0, -2, 2, -1, 0],
      transition: { duration: 0.7, ease: "easeInOut" },
    },
  };

  return (
    <motion.div
      variants={combinedVariants}
      initial="initial"
      animate="animate"
      whileHover="hover"
      className="relative p-10 rounded-3xl w-full max-w-[320px]
                 bg-[rgba(25,25,60,0.7)] backdrop-blur-lg
                 border border-[rgba(255,255,255,0.15)]
                 hover:shadow-xl hover:shadow-purple-500/30
                 transition-shadow duration-500 ease-in-out
                 cursor-pointer"
      style={{ boxShadow: "0 10px 30px rgba(0,0,0,0.3)" }}
    >
      <p className="text-white font-extrabold text-[48px] leading-none">"</p>
      <div className="mt-1">
        <p className="text-white tracking-wider text-[18px] italic">
          {testimonial}
        </p>

        <div className="mt-7 flex justify-between items-center gap-1">
          <div className="flex flex-col">
            <p className="text-white font-semibold text-[16px]">
              <span className="text-purple-400">@</span> {name}
            </p>
            <p className="mt-1 text-purple-200 text-[12px]">
              {designation} of {company}
            </p>
          </div>

          <div
            className="w-12 h-12 rounded-full overflow-hidden border-2 border-purple-400 flex-shrink-0"
            style={{ boxShadow: "0 0 10px rgba(128,90,213,0.5)" }}
          >
            <img
              src={image}
              alt={`feedback_by-${name}`}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const GitHubActivityCard = () => (
  <motion.a
    href="https://github.com/Arshiya-shafizade-coolriots"
    target="_blank"
    rel="noreferrer"
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, ease: "easeOut" }}
    whileHover={{ y: -6, transition: { duration: 0.3 } }}
    className="w-full max-w-[720px] rounded-2xl overflow-hidden
               bg-[rgba(15,15,45,0.7)] backdrop-blur-lg
               border border-[rgba(255,255,255,0.1)]
               shadow-lg shadow-blue-900/30
               hover:shadow-purple-500/40 hover:border-purple-500/40
               transition-all duration-300 cursor-pointer block"
  >
    {/* Header */}
    <div className="flex items-center gap-3 px-5 py-3 border-b border-[rgba(255,255,255,0.07)]">
      <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
      </svg>
      <span className="text-white font-semibold text-sm">GitHub Activity</span>
      <span className="ml-auto text-purple-300 text-xs">Arshiya-shafizade-coolriots</span>
    </div>

    {/* Stats row */}
    <div className="flex items-center gap-6 px-5 py-3 border-b border-[rgba(255,255,255,0.07)]">
      {[
        { label: "Contributions", value: "456" },
        { label: "Commits", value: "55%" },
        { label: "Pull Requests", value: "31%" },
        { label: "Issues", value: "13%" },
      ].map(({ label, value }) => (
        <div key={label} className="flex flex-col items-center">
          <span className="text-white font-bold text-base">{value}</span>
          <span className="text-purple-300 text-[11px]">{label}</span>
        </div>
      ))}

      {/* Achievement badges */}
      <div className="ml-auto flex items-center gap-2">
        <span className="text-purple-300 text-[11px] mr-1">Achievements</span>
        {["🥦", "🪃", "🦈", "🤠"].map((emoji, i) => (
          <span
            key={i}
            className="w-7 h-7 rounded-full bg-[rgba(255,255,255,0.08)] border border-[rgba(255,255,255,0.15)] flex items-center justify-center text-sm"
          >
            {emoji}
          </span>
        ))}
      </div>
    </div>

    {/* Screenshot */}
    <div className="relative overflow-hidden">
      <img
        src="/github-activity.png"
        alt="GitHub contribution activity"
        className="w-full object-cover object-top max-h-[200px]"
      />
      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-[rgba(15,15,45,0.95)] to-transparent" />
    </div>

    {/* Footer */}
    <div className="flex items-center justify-between px-5 py-3">
      <span className="text-purple-300 text-xs">@coolriots · Professional work account</span>
      <span className="text-purple-400 text-xs flex items-center gap-1">
        View profile
        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </span>
    </div>
  </motion.a>
);

const Feedbacks = () => {
  return (
    <section className="relative z-10 mt-12">
      <div className="rounded-[20px] bg-gradient-to-tr from-purple-700 via-blue-900 to-black p-1 pb-10">
        <motion.div
          variants={textVariant(0.2)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className={`bg-[rgba(0,0,0,0.6)] rounded-2xl p-10 min-h-[300px] ${styles.flexCenter} flex-col`}
        >
          <p className="text-purple-200 uppercase tracking-wider text-sm mb-2">
            More of me
          </p>
          <h2 className="text-white text-5xl font-bold text-center bg-clip-text bg-gradient-to-r from-purple-300 to-blue-300 text-transparent drop-shadow-md" />
        </motion.div>

        <motion.div
          className={`-mt-20 ${styles.paddingX} flex flex-wrap gap-7 justify-center`}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
        >
          {testimonials.map((testimonial, index) => (
            <FeedbackCard key={testimonial.name} index={index} {...testimonial} />
          ))}
        </motion.div>

        {/* GitHub Activity */}
        <div className={`mt-10 ${styles.paddingX} flex justify-center`}>
          <GitHubActivityCard />
        </div>
      </div>
    </section>
  );
};

export default SectionWrapper(Feedbacks, "");
