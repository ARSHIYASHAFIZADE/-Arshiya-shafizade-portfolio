import React from "react";
import { SectionWrapper } from "../hoc";
import { technologies } from "../constants";
const TechCard = ({ icon, name }) => {
  return (
    <div className="w-28 h-28 bg-[#232631] rounded-lg shadow-md flex justify-center items-center">
      <img src={icon} alt={name} className="w-[60%] h-[60%] object-contain" />
    </div>
  );
};
const Tech = () => {
  return (
    <div className="flex flex-row flex-wrap justify-center gap-10">
      {technologies.map((technology) => (
        <TechCard
          key={technology.name}
          icon={technology.icon}
          name={technology.name}
        />
      ))}
    </div>
  );
};

export default SectionWrapper(Tech, "");
