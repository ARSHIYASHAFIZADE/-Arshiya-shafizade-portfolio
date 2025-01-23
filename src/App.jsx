import React from "react";
import { BrowserRouter } from "react-router-dom";
import {
  About,
  Contact,
  Experience,
  Feedbacks,
  Hero,
  Navbar,
  Tech,
  Works,
  StarsCanvas,
  DV,
} from "./components";

const App = () => {
  return (
    <BrowserRouter
      future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
    >
      <div className="relative z-0 bg-gradient-to-r from-blue-800 via-blue-900 to-blue-950">
        <div className="bg-gradient-to-r from-blue-800 via-blue-900 to-blue-950 p-8 bg-cover bg-no-repeat bg-center relative">
          <Navbar />
          <Hero />
          <div className="absolute top-0 left-0 right-0 bottom-0 bg-gradient-to-b from-transparent via-blue-500 to-blue-800 opacity-80 z-0"></div>
        </div>
        <About />
        <Experience />
        <Tech />
        <Works />
        <Feedbacks />
        <DV />
        <div className="relative z-0">
          <Contact />
          <StarsCanvas />
        </div>
      </div>
    </BrowserRouter>
  );
};

export default App;
