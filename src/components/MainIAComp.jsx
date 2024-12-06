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
        <label htmlFor="stack" className="text-center">Stack Tecnológico</label>
        <input
          id="stack"
          type="text"
          onChange={(e) => setStack(e.target.value)}
          value={stack}
          className="rounded-md p-2 m-2"
        />
        <label htmlFor="experience" className="text-center">Experiencia</label>
        <input
            id="experience"
            type="text"
            onChange={(e) => setExperience(e.target.value)}
            className="rounded-md p-2 m-2"
            value={experience}
        ></input>
        <button type="submit">Enviar</button>
      </form>
      <section className="w-[50%] flex flex-col">
        {loading && <p>Loading...</p>}
        <p id="output">{output}</p>
      </section>
    </div>
  );
};

export default MainIAComp;
