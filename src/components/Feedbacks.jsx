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
      transition: {
        duration: 0.7,
        ease: "easeInOut",
      },
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
      style={{
        boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
      }}
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

const Feedbacks = () => {
  return (
    <section className="relative z-10 mt-12">
      <div
        className="rounded-[20px]
                   bg-gradient-to-tr from-purple-700 via-blue-900 to-black 
                   p-1 pb-10"
      >
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
          <h2
            className="text-white text-5xl font-bold text-center bg-clip-text 
                       bg-gradient-to-r from-purple-300 to-blue-300 text-transparent 
                       drop-shadow-md"
          ></h2>
        </motion.div>

        <motion.div
          className={`-mt-20 ${styles.paddingX} flex flex-wrap gap-7 justify-center`}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
        >
          {testimonials.map((testimonial, index) => (
            <FeedbackCard
              key={testimonial.name}
              index={index}
              {...testimonial}
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default SectionWrapper(Feedbacks, "");
