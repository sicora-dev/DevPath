import React, { useState, useContext, useEffect } from "react";
import { Context } from "./context/Context";

const App = () => {
  const {
    input,
    setInput,
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
    setRecentPrompt(input);
    setPreviousPrompts([...previousPrompts, input]);
    onSent();
  };

  return (
    <>
      <form onSubmit={handleClick}>
        <input type="text" onChange={(e) => setInput(e.target.value)} value={input}/>
        <button type="submit">Enviar</button>
      </form>
      {loading && <p>Loading...</p>}
      <p id="output">{output}</p>
    </>
  );
};

export default App;
