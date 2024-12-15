import { useEffect, useState, useContext } from "react";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import rehypeRewrite from "rehype-rewrite";
import { Context } from "../context/Context";

const Typewriter = ({ text }) => {
  const { writing, setWriting } = useContext(Context);
  const [displayedText, setDisplayedText] = useState("");

  useEffect(() => {
    let index = 0;
    setWriting(true);
  
    const interval = setInterval(() => {
      setDisplayedText((prev) => {
        const newText = prev + (text[index] || "");
        return newText;
      });
      index++;
      if (index >= text.length) {
        clearInterval(interval);
        setWriting(false);
      }
    }, 0); // Ajusta el tiempo del intervalo según sea necesario
  
    return () => {
      clearInterval(interval);
      setWriting(false);
    };
  }, [text, setWriting]);

  const rewriteLinks = () => {
    return rehypeRewrite({
      rewrite: (node) => {
        if (node.tagName === "a" && node.properties) {
          node.properties.target = "_blank";
        }
      },
    });
  };

  return (
    <ReactMarkdown rehypePlugins={[rehypeRaw, rewriteLinks]}>
      {displayedText}
    </ReactMarkdown>
  );
};

export default Typewriter;
