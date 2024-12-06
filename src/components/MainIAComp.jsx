import React, { useState, useContext, useEffect } from "react";
import { Context } from "../context/Context";

const MainIAComp = () => {
  const {
    stack,
    setStack,
    experience,
    setExperience,
    recentPrompt,
    setRecentPrompt,
    previousPrompts,
    setPreviousPrompts,
    loading,
    output,
    onSent,
  } = useContext(Context);

  const handleClick = (e) => {
    e.preventDefault();
    setRecentPrompt();
    setPreviousPrompts([...previousPrompts]);
    onSent();
  };

  return (
    <div className="flex flex-col items-center">
      <form onSubmit={handleClick} className="flex flex-col w-fit">
        <label htmlFor="stack" className="text-center text-light-highlight dark:text-dark-highlight font-bold">Stack Tecnológico</label>
        <input
          id="stack"
          type="text"
          onChange={(e) => setStack(e.target.value)}
          value={stack}
          className="rounded-md p-2 m-2"
        />
        <label htmlFor="experience" className="text-center text-light-highlight dark:text-dark-highlight font-bold">Experiencia</label>
        <input
            id="experience"
            type="text"
            onChange={(e) => setExperience(e.target.value)}
            className="rounded-md p-2 m-2"
            value={experience}
        ></input>
        <button type="submit" className="px-2 py-1 bg-light-highlight dark:bg-dark-highlight rounded-md m-2">Enviar</button>
      </form>
      <section className="min-w-[50%] flex flex-col items-center">
        
        <p id="output" className="w-[50%] min-h-52 max-h-[60vh] bg-light-secondary dark:bg-dark-secondary rounded-md overflow-y-scroll scrollbar-hide">{loading && <p>Loading...</p>}{output}</p>
      </section>
    </div>
  );
};

export default MainIAComp;
