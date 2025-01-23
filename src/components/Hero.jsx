import React from 'react';
import { motion } from "framer-motion";
import { styles } from "../styles";
import { AvatarCanvas} from "./canvas";

const Hero = () => {
  return (
    <section className={`relative w-full h-screen mx-auto`}>
      <div
        className={`absolute inset-0 top-[120px] max-w-7xl mx-auto ${styles.paddingX} flex flex-row items-start gap-5 ml-0`}
      >
        <div className="flex flex-col justify-center items-center mt-5">
          <div className="w-5 h-5 rounded-full bg-[#bbd3ff]" />
          <div className="w-1 sm:h-80 h-40 bg-[#bbd3ff]" />
        </div>

        <div className="ml-0 pl-5">
          <h1 className={`${styles.heroHeadText} text-white `}>
            Hi, I'm <span className="text-[#92f8f3]">Arshiya</span>
          </h1>
          <p className={`${styles.heroSubText} mt-2 text-white-100`}>
            I develop Full Stack web applications,{" "}
            <br className="sm:block hidden" />
            and Ai solutions
          </p>
        </div>
      </div>

      <AvatarCanvas />

      <div className="absolute xs:bottom-10 bottom-32 w-full flex justify-center items-center">
        <a href="#about">
          <div className="w-[50px] h-[80px] rounded-3xl border-4 border-[#92f8f3] flex justify-center items-center p-2">
            <motion.div
              animate={{
                x: [0, 40, -40, 0], // Horizontal movement with oscillation
                y: [0, 30, -30, 0], // Bouncing effect
                rotate: [0, 360, 0], // Rotation for dynamic effect
                scale: [1, 1.5, 1], // Scale up and down for extra dynamics
              }}
              transition={{
                duration: 2, // Longer duration for smooth animation
                repeat: Infinity,
                repeatType: "loop",
                ease: "easeInOut", // Smooth easing for a more natural movement
              }}
              className="w-3 h-3 rounded-full bg-[#92f8f3]"
            />
          </div>
        </a>
      </div>
    </section>
  );
};

export default Hero;
