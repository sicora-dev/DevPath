import { useState, createContext } from "react";
import { run, runChat, autocomplete } from "../config/gemini.js";
import { useTranslation } from "react-i18next";

export const Context = createContext();

const ContextProvider = (props) => {
  const { t } = useTranslation();
  const [stack, setStack] = useState("");
  const [skill, setSkill] = useState("");
  const [observations, setObservations] = useState("");
  const [cvError, setCvError] = useState("");
  const [input, setInput] = useState("");
  const [history, setHistory] = useState([]);
  const [selectedProject, setSelectedProject] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);
  const [writing, setWriting] = useState(false);
  const [output, setOutput] = useState("");
  const [outputLoaded, setOutputLoaded] = useState(false);
  const [chatBotOutput, setChatBotOutput] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [actualProject, setActualProject] = useState(1);
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
  };

  const onChatbotSent = async () => {
    setLoadingChat(true);
    try {
      const result = await runChat(
        history,
        input,
        outputSections.projects[selectedProject - 1]
      );

      setChatBotOutput(result);
      setHistory((prevHistory) => {
        const updatedHistory = [
          ...prevHistory,
          { role: "model", parts: [{ text: result }] },
        ];
        sessionStorage.setItem("chatHistory", JSON.stringify(updatedHistory));
        return updatedHistory;
      });
    } catch (error) {
      console.error(error);
      setHistory((prevHistory) => [
        ...prevHistory,
        {
          role: "model",
          parts: [{ text: "Error, intentalo de nuevo mas tarde" }],
        },
      ]);
    } finally {
      setLoadingChat(false);
      setInput("");
    }
  };

  const onPDFUploaded = async (pdfContent) => {
    setLoading(true);
    setCvError(null)
    try {
      const result = await autocomplete(pdfContent);
      
      if (result.trim() === "not-cv") {
        setStack("");
        setSkill("");
        setObservations("");
        setCvError(t('not-cv'))
      } else {
        setStack(result.split("|")[0]);
        setSkill(result.split("|")[1]);
        setObservations(result.split("|")[2]);
        setCvError(null)
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const contextValue = {
    stack,
    setStack,
    skill,
    setSkill,
    observations,
    setObservations,
    cvError,
    history,
    setHistory,
    selectedProject,
    setSelectedProject,
    loading,
    loadingChat,
    input,
    setInput,
    showModal,
    setShowModal,
    actualProject,
    setActualProject,
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
    onChatbotSent,
    onPDFUploaded,
  };

  return (
    <Context.Provider value={contextValue}>{props.children}</Context.Provider>
  );
};

export default ContextProvider;
