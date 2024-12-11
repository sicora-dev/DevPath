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


    const onSent = async () => {

        setOutput("");
        setOutputLoaded(false);
        setLoading(true);
        const result = await run(stack, skill, observations);
        setOutput(result);
        setLoading(false);
        setStack("");
        

    }

    const onChatbotSent = async () => {
        setLoadingChat(true);
        const result = await runChat(history, input, selectedProject);
        console.log(result);
        setChatBotOutput(result);
        setLoadingChat(false);
        setHistory([...history, { role: "user", parts:[{text: input}] }, { role: "model", parts:[{text: result}] }]);
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