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
      className="relative p-5 rounded-2xl w-full max-w-[270px]
                 flex flex-col justify-between
                 bg-[rgba(25,25,60,0.7)] backdrop-blur-lg
                 border border-[rgba(255,255,255,0.15)]
                 hover:shadow-xl hover:shadow-purple-500/30
                 transition-shadow duration-500 ease-in-out"
      style={{ boxShadow: "0 8px 24px rgba(0,0,0,0.3)" }}
    >
      <div className="flex-1">
        <p className="text-purple-400 font-extrabold text-[36px] leading-none">"</p>
        <p className="text-white/90 text-[13px] leading-relaxed mt-1">
          {testimonial}
        </p>
      </div>

      <div className="mt-4 flex items-center gap-3 border-t border-[rgba(255,255,255,0.08)] pt-4">
        <div
          className="w-10 h-10 rounded-full overflow-hidden border border-purple-400/60 flex-shrink-0 bg-[rgba(255,255,255,0.05)]"
        >
          <img
            src={image}
            alt={name}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="min-w-0">
          <p className="text-white font-semibold text-[13px] leading-snug">
            {name}
          </p>
          <p className="text-purple-300 text-[11px] leading-snug">
            {designation} · {company}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

const GitHubActivityCard = () => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, ease: "easeOut" }}
    className="w-full max-w-[720px] rounded-2xl overflow-hidden
               bg-[rgba(15,15,45,0.7)] backdrop-blur-lg
               border border-[rgba(255,255,255,0.1)]
               shadow-lg shadow-blue-900/30"
  >
    {/* Header */}
    <div className="flex items-center gap-3 px-5 py-3 border-b border-[rgba(255,255,255,0.07)]">
      <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
      </svg>
      <span className="text-white font-semibold text-sm">GitHub Activity</span>
      <span className="ml-auto text-purple-300 text-xs">Professional Work Account</span>
    </div>

    {/* Main content: screenshot left, achievements right */}
    <div className="flex flex-col sm:flex-row gap-0">

      {/* Contribution graph screenshot */}
      <div className="sm:flex-1 relative overflow-hidden">
        <img
          src="/github-activity.png"
          alt="GitHub contribution graph"
          className="w-full h-full object-cover object-center"
          style={{ minHeight: "180px", maxHeight: "240px" }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[rgba(15,15,45,0.6)] pointer-events-none" />
      </div>

      {/* Stats + Achievements */}
      <div className="sm:w-[220px] flex flex-col justify-center gap-5 px-5 py-5 border-t sm:border-t-0 sm:border-l border-[rgba(255,255,255,0.07)]">

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: "Contributions", value: "456" },
            { label: "Commits", value: "55%" },
            { label: "Pull Requests", value: "31%" },
            { label: "Issues", value: "13%" },
          ].map(({ label, value }) => (
            <div key={label} className="flex flex-col">
              <span className="text-white font-bold text-lg leading-tight">{value}</span>
              <span className="text-purple-300 text-[11px]">{label}</span>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="w-full h-px bg-[rgba(255,255,255,0.07)]" />

        {/* Achievements */}
        <div>
          <p className="text-purple-300 text-[11px] uppercase tracking-wider mb-2">Achievements</p>
          <div className="flex flex-wrap gap-2">
            {[
              { img: "https://github.githubassets.com/images/modules/profile/achievements/pair-extraordinaire-default.png", label: "Pair Extraordinaire ×3" },
              { img: "https://github.githubassets.com/images/modules/profile/achievements/yolo-default.png", label: "YOLO" },
              { img: "https://github.githubassets.com/images/modules/profile/achievements/pull-shark-default.png", label: "Pull Shark ×2" },
              { img: "https://github.githubassets.com/images/modules/profile/achievements/starstruck-default.png", label: "Starstruck" },
            ].map(({ img, label }) => (
              <div
                key={label}
                title={label}
                className="w-10 h-10 rounded-full overflow-hidden border border-[rgba(255,255,255,0.15)] hover:border-purple-400/50 transition-colors duration-200 cursor-default"
              >
                <img src={img} alt={label} className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>

    {/* Footer */}
    <div className="px-5 py-2.5 border-t border-[rgba(255,255,255,0.07)]">
      <span className="text-purple-400/60 text-xs">@coolriots · Private professional account</span>
    </div>
  </motion.div>
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
          <h2 className="text-white text-5xl font-bold text-center bg-clip-text bg-gradient-to-r from-purple-300 to-blue-300 text-transparent drop-shadow-md">
              Education &amp; Achievements.
            </h2>
        </motion.div>

        <motion.div
          className={`-mt-20 ${styles.paddingX} flex flex-wrap gap-7 justify-center items-stretch`}
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

export default SectionWrapper(Feedbacks, "education");
