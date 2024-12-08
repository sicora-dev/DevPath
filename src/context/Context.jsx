import { useState,createContext } from "react";
import run from "../config/gemini";

export const Context = createContext();

const ContextProvider = (props) => {

    const [stack, setStack] = useState("");
    const [experience, setExperience] = useState("");
    const [observations, setObservations] = useState("");
    const [recentPrompt, setRecentPrompt] = useState("");
    const [previousPrompts, setPreviousPrompts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [output, setOutput] = useState("");
    const [outputLoaded, setOutputLoaded] = useState(false);


    const onSent = async () => {

        setOutput("");
        setOutputLoaded(false);
        setLoading(true);
        const result = await run(stack, experience, observations);
        setOutput(result);
        setLoading(false);
        setStack("");
        

    }

    const contextValue = {
        stack,
        setStack,
        experience,
        setExperience,
        observations,
        setObservations,
        recentPrompt,
        setRecentPrompt,
        previousPrompts,
        setPreviousPrompts,
        loading,
        output,
        setOutput,
        outputLoaded, 
        setOutputLoaded,
        onSent
    }

    return (
        <Context.Provider value={contextValue}>
        {props.children}
        </Context.Provider>
    )

}

export default ContextProvider;