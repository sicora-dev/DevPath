import { useContext } from "react";
import { Context } from "../context/Context";

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
  };

  return (
    <div>
      <h1>ChatBot</h1>
      <div
        style={{
          border: "1px solid #ccc",
          padding: "10px",
          height: "300px",
          overflowY: "scroll",
        }}
      >
        {history.slice(2).map((chat, index) => (
          <div
            key={index}
            style={{ textAlign: chat.role === "user" ? "right" : "left" }}
          >
            <p>
              <strong>{chat.role}:</strong> {chat.parts[0].text}
            </p>
          </div>
        ))}
      </div>
      <div style={{ marginTop: "10px" }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          style={{ width: "80%", padding: "10px" }}
        />
        <button onClick={(e) => handleSend(e)} style={{ width: "18%", padding: "10px" }}>
          Send
        </button>
      </div>
    </div>
  );
};
export default ChatBot;
