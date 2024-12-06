import { useState,createContext } from "react";
import run from "../config/gemini";

export const Context = createContext();

const ContextProvider = (props) => {

    const [input, setInput] = useState("");
    const [recentPrompt, setRecentPrompt] = useState("");
    const [previousPrompts, setPreviousPrompts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [output, setOutput] = useState("");


    const onSent = async () => {

        setOutput("");
        setLoading(true);
        const result = await run(input);
        setOutput(result);
        setLoading(false);
        setInput("");
        

    }

    const contextValue = {
        input,
        setInput,
        recentPrompt,
        setRecentPrompt,
        previousPrompts,
        setPreviousPrompts,
        loading,
        output,
        onSent
    }

    return (
        <Context.Provider value={contextValue}>
        {props.children}
        </Context.Provider>
    )

}

export default ContextProvider;