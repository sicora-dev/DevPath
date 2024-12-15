import { useState,createContext } from "react";
import { run, runChat } from "../config/gemini.js";

export const Context = createContext();

const ContextProvider = (props) => {

    const [stack, setStack] = useState("");
    const [skill, setSkill] = useState("");
    const [observations, setObservations] = useState("");
    const [input, setInput] = useState("");
    const [history, setHistory] = useState([]);
    const [selectedProject, setSelectedProject] = useState("");
    const [loading, setLoading] = useState(false);
    const [loadingChat, setLoadingChat] = useState(false);
    const [writing, setWriting] = useState(false);
    const [output, setOutput] = useState("");
    const [outputLoaded, setOutputLoaded] = useState(false);
    const [chatBotOutput, setChatBotOutput] = useState("");
    const [outputSections, setOutputSections] = useState({
        intro: {
          title: "",
          body: "",
        },
        analysis: {
          title: "",
          body: "",
        },
        roadmap: {
          title: "",
          body: "",
        },
        projects: [
          {
            title: "",
            body: "",
          },
          {
            title: "",
            body: "",
          },
          {
            title: "",
            body: "",
          },
          {
            title: "",
            body: "",
          },
          {
            title: "",
            body: "",
          },
        ],
        tips: {
          title: "",
          body: "",
        },
      });


    const onSent = async (restricted) => {

        setOutput("");
        setOutputLoaded(false);
        setLoading(true);
        const result = await run(stack, skill, observations, restricted);
        setOutput(result);
        setLoading(false);
        setStack("");
        

    }

    const onChatbotSent = async () => {
      setLoadingChat(true);
      try {
          const result = await runChat(history, input, outputSections.projects[selectedProject-1]);
          
          setChatBotOutput(result);
          setHistory(prevHistory => [
              ...prevHistory,
              { role: "model", parts: [{ text: result }] }
          ]);
          
      } catch (error) {
          console.error(error);
          setHistory(prevHistory => [
              ...prevHistory,
              { role: "model", parts: [{ text: "Error, intentalo de nuevo mas tarde" }] }
          ]);
      } finally {
          setLoadingChat(false);
          setInput("");
      }
  }

    const contextValue = {
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
        loadingChat,
        input,
        setInput,
        writing,
        setWriting,
        output,
        setOutput,
        outputLoaded, 
        setOutputLoaded,
        outputSections,
        setOutputSections,
        chatBotOutput,
        setChatBotOutput,
        onSent,
        onChatbotSent
    }

    return (
        <Context.Provider value={contextValue}>
        {props.children}
        </Context.Provider>
    )

}

export default ContextProvider;