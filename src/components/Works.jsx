import React from "react";
import { Tilt } from "react-tilt";
import { motion } from "framer-motion";
import { styles } from "../styles";
import { SectionWrapper } from "../hoc";
import { projects } from "../constants";
import { fadeIn, textVariant } from "../utils/motion";

const ProjectCard = ({
  index,
  name,
  description,
  tags,
  image,
  icon, 
  source_code_link,
}) => {
  return (
    <motion.div variants={fadeIn("up", "spring", index * 0.4, 0.8)}>
      <Tilt
        options={{ max: 20, scale: 1.02, speed: 450 }}
        className="relative p-5 rounded-2xl w-full sm:w-[360px]
                   bg-[rgba(25,25,60,0.6)] backdrop-blur-lg 
                   border border-[rgba(255,255,255,0.15)]
                   shadow-lg shadow-blue-900/30
                   transition-all duration-500 ease-in-out
                   hover:shadow-2xl hover:shadow-purple-500/50
                   cursor-pointer"
      >
        <div className="relative w-full h-[230px] overflow-hidden rounded-2xl">
          <img
            src={image}
            alt="project image"
            className="w-full h-full object-cover rounded-2xl transition-transform duration-500 hover:scale-105"
          />

          <div className="absolute inset-0 flex justify-end m-3">
            <div
              onClick={() => window.open(source_code_link, "_blank")}
              className="
                w-10 h-10 
                flex justify-center items-center 
                rounded-full 
                bg-[rgba(0,0,0,0.6)] 
                border border-[rgba(255,255,255,0.2)] 
                hover:bg-purple-600/80 
                transition-colors duration-300 
                hover:shadow-lg hover:shadow-purple-500/50
              "
            >
              <img
                src={icon} 
                alt="source code icon"
                className="w-1/2 h-1/2 object-contain"
              />
            </div>
          </div>
        </div>

        <div className="mt-5">
          <h3 className="text-white font-bold text-[24px] drop-shadow-lg">
            {name}
          </h3>
          <p className="mt-2 text-purple-200 text-[14px] leading-relaxed">
            {description}
          </p>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {tags.map((tag) => (
            <p
              key={`${name}-${tag.name}`}
              className={`text-[14px] py-1 px-2 rounded-full bg-[rgba(255,255,255,0.1)] text-purple-200 hover:text-white hover:bg-purple-600 transition-colors duration-300 ${tag.color}`}
            >
              #{tag.name}
            </p>
          ))}
        </div>
      </Tilt>
    </motion.div>
  );
};

const Works = () => {
  return (
    <>
      <motion.div variants={textVariant(0.2)}>
        <p className={`${styles.sectionSubText} text-purple-200`}>My work</p>
        <h2
          className={`${styles.sectionHeadText} text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-300 drop-shadow-lg`}
        >
          Projects.
        </h2>
      </motion.div>

      <div className="w-full flex">
        <motion.p
          variants={fadeIn("", "", 0.2, 1)}
          className="mt-3 text-purple-200 text-[17px] max-w-3xl leading-[30px]"
        >
          Explore a selection of projects that highlight my expertise in various
          technologies. Each project below is accompanied by a brief description
          and links to code repositories or live demos, demonstrating my ability
          to tackle challenges, adapt to new tools, and efficiently manage
          complex tasks.
        </motion.p>
      </div>

      <div className="mt-20 flex flex-wrap gap-7 justify-center">
        {projects.map((project, index) => (
          <ProjectCard key={`project-${index}`} index={index} {...project} />
        ))}
      </div>
    </>
  );
};

export default SectionWrapper(Works, "");
