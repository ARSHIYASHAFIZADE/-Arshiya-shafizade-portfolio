import React from "react";
import { motion } from "framer-motion";
import { Tilt } from "react-tilt";
import { styles } from "../styles";
import { services } from "../constants";
import { SectionWrapper } from "../hoc";
import { fadeIn, textVariant } from "../utils/motion";

const ServiceCard = ({ index, title, icon }) => (
  <Tilt
    className="xs:w-[250px] w-full"
    options={{
      max: 45,
      scale: 1,
      speed: 450,
    }}
  >
    <motion.div
      variants={fadeIn("up", "spring", index * 0.5, 0.75)}
      className="w-full bg-gradient-to-r from-blue-600 via-purple-700 to-pink-600 p-[3px] rounded-[20px] shadow-[0_10px_30px_rgba(0,0,0,0.5)]"
    >
      <div className="rounded-[20px] py-6 px-10 min-h-[300px] bg-[#1a1a1a] flex justify-center items-center flex-col">
        <div className="relative w-20 h-20 rounded-full bg-gradient-to-r from-purple-500 to-blue-400 flex justify-center items-center">
          <img
            src={icon}
            alt={title}
            className="w-[70%] h-[70%] object-contain"
          />
          <div className="absolute inset-0 rounded-full animate-pulse bg-gradient-to-r from-purple-500 to-blue-500 opacity-20"></div>
        </div>
        <h3 className="text-white text-[22px] font-bold text-center mt-4">
          {title}
        </h3>
      </div>
    </motion.div>
  </Tilt>
);

const About = () => {
  return (
    <>
      <motion.div variants={textVariant()}>
        <p className={styles.sectionSubText}>Introduction</p>
        <h2 className={styles.sectionHeadText}>Overview.</h2>
      </motion.div>

      <motion.p
        variants={fadeIn("", "", 0.1, 1)}
        className="mt-6 text-secondary text-[20px] max-w-3xl leading-[35px]"
      >
        I’m a highly skilled full-stack engineer with a strong background in
        building dynamic, scalable, and user-centric web applications. My
        expertise spans modern technologies such as{" "}
        <span className="text-[#61dafb] [text-shadow:0_0_5px_#61dafb,0_0_10px_#61dafb,0_0_20px_#61dafb,0_0_30px_#21a1f1,0_0_40px_#1d9be0]">
          React
        </span>
        ,{" "}
        <span className="text-[#f7df1e] [text-shadow:0_0_5px_#f7df1e,0_0_10px_#f7df1e,0_0_20px_#f7df1e,0_0_30px_#ffd700,0_0_40px_#ffc000]">
          JavaScript
        </span>
        , and{" "}
        <span className="text-[#306998] [text-shadow:0_0_5px_#306998,0_0_10px_#306998,0_0_20px_#306998,0_0_30px_#4b8bbe,0_0_40px_#5dabe5]">
          Python
        </span>
        . I also work extensively with frameworks like{" "}
        <span className="text-[#ffa07a] [text-shadow:0_0_5px_#ffa07a,0_0_10px_#ffa07a,0_0_20px_#ffa07a,0_0_30px_#ff6347,0_0_40px_#ff4500]">
          Flask
        </span>{" "}
        and{" "}
        <span className="text-[#092e20] [text-shadow:0_0_5px_#092e20,0_0_10px_#092e20,0_0_20px_#44b78b,0_0_30px_#44b78b,0_0_40px_#8dc149]">
          Django
        </span>
        , creating robust applications that solve real-world challenges.
      </motion.p>

      <motion.p
        variants={fadeIn("", "", 0.2, 1)}
        className="mt-4 text-secondary text-[20px] max-w-3xl leading-[35px]"
      >
        I specialize in developing{" "}
        <span className="text-[#00f0ff] [text-shadow:0_0_5px_#00f0ff,0_0_10px_#00f0ff,0_0_20px_#00f0ff,0_0_30px_#00c3cc,0_0_40px_#0095aa]">
          AI
        </span>{" "}
        models that address complex problems and ensure seamless integration
        with databases like{" "}
        <span className="text-[#f29111] [text-shadow:0_0_5px_#f29111,0_0_10px_#f29111,0_0_20px_#f29111,0_0_30px_#f7820d,0_0_40px_#ff9e0f]">
          MySQL
        </span>{" "}
        and{" "}
        <span className="text-[#003b57] [text-shadow:0_0_5px_#003b57,0_0_10px_#003b57,0_0_20px_#00668f,0_0_30px_#0085ba,0_0_40px_#00a5db]">
          SQLite
        </span>
        . Additionally, I hold an{" "}
        <span className="text-[#fff600] [text-shadow:0_0_5px_#fff600,0_0_10px_#fff600,0_0_20px_#fff600,0_0_30px_#ffd700,0_0_40px_#ffc000]">
          AWS
        </span>{" "}
        certification, ensuring the delivery of secure and efficient cloud-based
        solutions.
      </motion.p>

      <motion.p
        variants={fadeIn("", "", 0.3, 1)}
        className="mt-4 text-secondary text-[20px] max-w-3xl leading-[35px]"
      >
        As a quick learner and collaborative team player, I am committed to
        delivering efficient, high-performing solutions that bring innovative
        ideas to life. Let’s collaborate to create impactful applications that
        shape the future!
      </motion.p>

      <div className="mt-20 flex flex-wrap gap-10">
        {services.map((service, index) => (
          <ServiceCard key={service.title} index={index} {...service} />
        ))}
      </div>
    </>
  );
};

export default SectionWrapper(About, "about");
