import { useEffect, useState, useContext } from "react";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Context } from "../context/Context";
import { useMediaQuery } from 'react-responsive';

const Typewriter = ({ text }) => {
  const { writing, setWriting } = useContext(Context);
  const [displayedText, setDisplayedText] = useState("");
  const isSmallScreen = useMediaQuery({ query: '(max-width: 640px)' });


  useEffect(() => {

      setDisplayedText(text);
      setWriting(false);
      return;
      
  }, [text, setWriting]);

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
