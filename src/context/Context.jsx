import { useState,createContext } from "react";
import { run, runChat } from "../config/gemini.js";
import { text } from "framer-motion/client";

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
        const result = await runChat(history, input, outputSections.projects[selectedProject-1]);
        console.log(outputSections.projects[selectedProject-1]);
        setChatBotOutput(result);
        setLoadingChat(false);
        console.log(result)
        console.log(input)
        setHistory(prevHistory => [
            ...prevHistory,
            { role: "model", parts: [{ text: result }] }
          ]);
        console.log(history);
        setInput("");
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
        input,
        setInput,
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