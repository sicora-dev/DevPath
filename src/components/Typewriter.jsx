import { useEffect, useState } from "react";
import Markdown from "react-markdown";

const Typewriter = ({ text }) => {
  const [displayedText, setDisplayedText] = useState("");

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      setDisplayedText((prev) => prev + text[index]);
      index++;
      if (index === text.length) {
        clearInterval(interval);
      }
    }, 0.5);
    return () => clearInterval(interval);
  }, []);

  return <Markdown>{displayedText}</Markdown>;
};

export default Typewriter;