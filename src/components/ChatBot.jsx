import { useContext } from "react";
import { Context } from "../context/Context";
import ReactMarkdown from "react-markdown";
import Markdown from "react-markdown";
import "../styles/chatbot.css";

const ChatBot = () => {
  const {
    stack,
    setStack,
    skill,
    setSkill,
    observations,
    setObservations,
    history,
    setHistory,
    selectedProject,
    setSelectedProject,
    loading,
    input,
    setInput,
    output,
    setOutput,
    outputSections,
    setOutputSections,
    chatBotOutput,
    setChatBotOutput,
    outputLoaded,
    setOutputLoaded,
    onSent,
    onChatbotSent,
  } = useContext(Context);

  const handleSend = (e) => {
    e.preventDefault();
    onChatbotSent();
    setHistory([...history, { role: "user", parts: [{ text: input }] }]);
  };

  return (
    <div className="px-3 flex-1 flex-col content-center grid-cols-1 h-full w-full justify-items-center justify-center items-center chatbot">
      <section className="flex w-fit items-center row-start-1 row-end-1 gap-2 py-2 justify-start">
        <div className="flex items-center justify-start">
          <button
            onClick={() => {
              setSelectedProject(null);
              setHistory([]);
            }}
            className="py-1 px-2 bg-light-highlight dark:bg-dark-highlight rounded-md hover:bg-light-secondary dark:hover:bg-dark-secondary transition ease-in-out justify-start"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="sm:w-8 sm:h-8 w-6 h-6"
            >
              <path
                d="M11 6L5 12M5 12L11 18M5 12H19"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
        <div className="w-full">
          <h1 className="w-full font-title text-2xl rounded-md py-1 px-2 bg-light-secondary dark:bg-dark-secondary">
            <span className="hidden lg:inline-block">
              Preguntale a la{" "}
              <span className="text-light-highlight dark:text-dark-highlight inline-block">
                IA{" "}
                <svg
                  width="20px"
                  height="20px"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="inline-block"
                >
                  <path
                    d="M18.5 8V3M5.5 21V16M16 5.5H21M3 18.5H8M6.5 2L5.71554 3.56892C5.45005 4.09989 5.31731 4.36538 5.13997 4.59545C4.98261 4.79959 4.79959 4.98261 4.59545 5.13997C4.36538 5.31731 4.0999 5.45005 3.56892 5.71554L2 6.5L3.56892 7.28446C4.0999 7.54995 4.36538 7.68269 4.59545 7.86003C4.79959 8.01739 4.98261 8.20041 5.13997 8.40455C5.31731 8.63462 5.45005 8.9001 5.71554 9.43108L6.5 11L7.28446 9.43108C7.54995 8.9001 7.68269 8.63462 7.86003 8.40455C8.01739 8.20041 8.20041 8.01739 8.40455 7.86003C8.63462 7.68269 8.9001 7.54995 9.43108 7.28446L11 6.5L9.43108 5.71554C8.9001 5.45005 8.63462 5.31731 8.40455 5.13997C8.20041 4.98261 8.01739 4.79959 7.86003 4.59545C7.68269 4.36538 7.54995 4.0999 7.28446 3.56892L6.5 2ZM17 12L16.0489 13.9022C15.7834 14.4332 15.6506 14.6987 15.4733 14.9288C15.3159 15.1329 15.1329 15.3159 14.9288 15.4733C14.6987 15.6506 14.4332 15.7834 13.9023 16.0489L12 17L13.9023 17.9511C14.4332 18.2166 14.6987 18.3494 14.9288 18.5267C15.1329 18.6841 15.3159 18.8671 15.4733 19.0712C15.6506 19.3013 15.7834 19.5668 16.0489 20.0977L17 22L17.9511 20.0978C18.2166 19.5668 18.3494 19.3013 18.5267 19.0712C18.6841 18.8671 18.8671 18.6841 19.0712 18.5267C19.3013 18.3494 19.5668 18.2166 20.0977 17.9511L22 17L20.0977 16.0489C19.5668 15.7834 19.3013 15.6506 19.0712 15.4733C18.8671 15.3159 18.6841 15.1329 18.5267 14.9288C18.3494 14.6987 18.2166 14.4332 17.9511 13.9023L17 12Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>{" "}
              sobre el{" "}
            </span>
            <span className="text-light-heading lg:inline-block hidden ml-2">
              {outputSections.projects[
                selectedProject - 1
              ].title[0].toLowerCase()}
              {outputSections.projects[selectedProject - 1].title.slice(1)}
            </span>
            <span className="text-light-heading hidden sm:inline-block lg:hidden">
              {outputSections.projects[selectedProject - 1].title}
            </span>
            <span className="text-light-heading inline-block sm:hidden text-[3.5vw]">
              {" "}
              {outputSections.projects[selectedProject - 1].title.split(":")[1]}
            </span>
          </h1>
        </div>
      </section>
      <div className="w-full block flex-1 min-h-[70vh] max-h-[70vh] border-none rounded-md bg-light-background dark:bg-dark-background overflow-y-scroll p-2 scroll-smooth overflow-x-hidden ">
        {history.map((chat, index) => (
          <div
            key={index}
            className={`flex w-full text-center sm:text-start ${
              index % 2 === 0 ? "justify-end" : "justify-start"
            }`}
          >
            {chat.role === "model" && (
              <div className="flex">
                <h3>
                  <svg
                    width="20px"
                    height="20px"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="inline-block"
                  >
                    <path
                      d="M18.5 8V3M5.5 21V16M16 5.5H21M3 18.5H8M6.5 2L5.71554 3.56892C5.45005 4.09989 5.31731 4.36538 5.13997 4.59545C4.98261 4.79959 4.79959 4.98261 4.59545 5.13997C4.36538 5.31731 4.0999 5.45005 3.56892 5.71554L2 6.5L3.56892 7.28446C4.0999 7.54995 4.36538 7.68269 4.59545 7.86003C4.79959 8.01739 4.98261 8.20041 5.13997 8.40455C5.31731 8.63462 5.45005 8.9001 5.71554 9.43108L6.5 11L7.28446 9.43108C7.54995 8.9001 7.68269 8.63462 7.86003 8.40455C8.01739 8.20041 8.20041 8.01739 8.40455 7.86003C8.63462 7.68269 8.9001 7.54995 9.43108 7.28446L11 6.5L9.43108 5.71554C8.9001 5.45005 8.63462 5.31731 8.40455 5.13997C8.20041 4.98261 8.01739 4.79959 7.86003 4.59545C7.68269 4.36538 7.54995 4.0999 7.28446 3.56892L6.5 2ZM17 12L16.0489 13.9022C15.7834 14.4332 15.6506 14.6987 15.4733 14.9288C15.3159 15.1329 15.1329 15.3159 14.9288 15.4733C14.6987 15.6506 14.4332 15.7834 13.9023 16.0489L12 17L13.9023 17.9511C14.4332 18.2166 14.6987 18.3494 14.9288 18.5267C15.1329 18.6841 15.3159 18.8671 15.4733 19.0712C15.6506 19.3013 15.7834 19.5668 16.0489 20.0977L17 22L17.9511 20.0978C18.2166 19.5668 18.3494 19.3013 18.5267 19.0712C18.6841 18.8671 18.8671 18.6841 19.0712 18.5267C19.3013 18.3494 19.5668 18.2166 20.0977 17.9511L22 17L20.0977 16.0489C19.5668 15.7834 19.3013 15.6506 19.0712 15.4733C18.8671 15.3159 18.6841 15.1329 18.5267 14.9288C18.3494 14.6987 18.2166 14.4332 17.9511 13.9023L17 12Z"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </h3>
                <div
                  className={`flex flex-col bg-light-secondary/20 dark:bg-dark-secondary/20 mx-1 my-2 w-full rounded-md rounded-tl-none px-3 py-2`}
                >
                  <Markdown>{chat.parts[0].text}</Markdown>
                </div>
              </div>
            )}
            {chat.role === "user" && (
              <div className="flex max-w-[80%]">
                <p
                  className={`bg-light-secondary dark:bg-dark-secondary mx-1 my-2 w-fit rounded-md px-3 py-2 rounded-tr-none `}
                >
                  {chat.parts[0].text}
                </p>
                <h3></h3>
              </div>
            )}
          </div>
        ))}
      </div>
      <form
        className="flex  gap-2 py-2 w-full bottom-0 justify-center"
        onSubmit={(e) => handleSend(e)}
      >
        <div className="flex items-center justify-start">
          <button
            onClick={(e) => {
              e.preventDefault();
              setHistory([]);
            }}
            className="px-2 py-1 hover:bg-light-highlight transition hover:dark:bg-dark-highlight rounded-md hidden lg:block "
          >
            Limpiar Chat
          </button>
          <button
            onClick={(e) => {
              e.preventDefault();
              setHistory([]);
            }}
            className="px-2 py-1 sm:hover:bg-light-highlight sm:hover:dark:bg-dark-highlight rounded-md block lg:hidden dark:bg-dark-highlight bg-light-highlight hover:bg-light-secondary dark:hover:bg-dark-secondary transition ease-in-out"
          >
            <svg
              width="800px"
              height="800px"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="sm:w-8 sm:h-8 w-6 h-6"
            >
              <path
                d="M6 5H18M9 5V5C10.5769 3.16026 13.4231 3.16026 15 5V5M9 20H15C16.1046 20 17 19.1046 17 18V9C17 8.44772 16.5523 8 16 8H8C7.44772 8 7 8.44772 7 9V18C7 19.1046 7.89543 20 9 20Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
        <textarea
          type="text"
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            e.target.style.height = "auto";
            e.target.style.height = `${e.target.scrollHeight}px`;
          }}
          className="w-[70vw] max-h-36 resize-none  overflow-y-scroll no-scrollbar-b p-2 rounded-md border-none bg-light-secondary dark:bg-dark-secondary focus:outline outline-light-highlight scroll-smooth scrollbar-thumb-light-highlight scrollbar-w-3 scrollbar scrollbar-thumb-rounded-md"
        />
        <div className="flex items-center justify-start">
          <button
            type="submit"
            className="px-2 py-1 bg-light-highlight dark:bg-dark-highlight rounded-md hidden lg:block hover:bg-light-secondary dark:hover:bg-dark-secondary transition ease-in-out"
          >
            Enviar
          </button>
          <button
            type="submit"
            className="px-2 py-1 bg-light-highlight dark:bg-dark-highlight rounded-md block lg:hidden hover:bg-light-secondary dark:hover:bg-dark-secondary transition ease-in-out"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="sm:w-8 sm:h-8 w-6 h-6"
            >
              <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
              <g
                id="SVGRepo_tracerCarrier"
                strokeLinecap="round"
                strokeLinejoin="round"
              ></g>
              <g id="SVGRepo_iconCarrier">
                {" "}
                <path
                  d="M10 14L14 21L21 3M10 14L3 10L21 3M10 14L21 3"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinejoin="round"
                ></path>{" "}
              </g>
            </svg>
          </button>
        </div>
      </form>
    </div>
  );
};
export default ChatBot;
