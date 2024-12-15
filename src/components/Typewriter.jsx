import { useEffect, useState, useContext } from "react";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import rehypeRewrite from "rehype-rewrite";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Context } from "../context/Context";
import { useMediaQuery } from 'react-responsive';

const Typewriter = ({ text }) => {
  const { writing, setWriting } = useContext(Context);
  const [displayedText, setDisplayedText] = useState("");
  const isSmallScreen = useMediaQuery({ query: '(max-width: 640px)' });


  useEffect(() => {

    if (isSmallScreen) {
      setDisplayedText(text);
      setWriting(false);
      return;
    }

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
    }, 0.2);
  
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
    <ReactMarkdown
      rehypePlugins={[rehypeRaw]}
      components={isSmallScreen ? {} : {
        code({ node, inline, className, children, ...props }) {
          const match = /language-(\w+)/.exec(className || '');
          return !inline && match ? (
            <SyntaxHighlighter
              style={oneDark}
              language={match[1]}
              PreTag="div"
              {...props}
            >
              {String(children).replace(/\n$/, '')}
            </SyntaxHighlighter>
          ) : (
            <code className={className} {...props}>
              {children}
            </code>
          );
        }
      }}
    >
      {displayedText}
    </ReactMarkdown>
  );
};

export default Typewriter;
