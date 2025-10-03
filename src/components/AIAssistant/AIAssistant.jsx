import styles from "./aiAssistant.module.css";
import aiRobot from "../../assets/images/ai-robot.png";
import {
  FaPaperPlane,
  FaRobot,
  FaRegCommentDots,
  FaExpand,
  FaPlus,
} from "react-icons/fa6";
import { useState, useRef } from "react";
import { FaTimesCircle } from "react-icons/fa";

export default function AiAssistant({ isOpen, onClose }) {
  // Chat state
  const [messages, setMessages] = useState([]); // { sender: "user"|"ai", text: string }
  const [input, setInput] = useState("");
  const [welcome, setWelcome] = useState(true);
  const [maximized, setMaximized] = useState(false);
  const inputRef = useRef(null);

  // Handle send message
  function handleSend(e) {
    e.preventDefault();
    if (!input.trim()) return;
    // Add user message
    setMessages((prev) => [...prev, { sender: "user", text: input }]);
    setInput("");
    setWelcome(false);
    // Add default AI response after short delay
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          sender: "ai",
          text: "I'm your AI assistant! (This is a test response.)",
        },
      ]);
    }, 500);
  }

  // New chat
  function handleNewChat() {
    setMessages([]);
    setWelcome(true);
    setInput("");
  }

  // Panel classes
  const panelClass = `${styles.panel} ${isOpen ? styles.open : ""} ${
    maximized ? styles.maximized : ""
  }`;

  return (
    <div className={panelClass}>
      {/* Top bar controls */}
      <div className={styles.topBar}>
        <button
          className={styles.iconBtn}
          title="New Chat"
          onClick={handleNewChat}
        >
          <FaPlus />
        </button>
        <button className={styles.iconBtn} title="Previous Chats">
          <FaRegCommentDots />
        </button>
        <span className={styles.separator}>|</span>
        <button
          className={styles.iconBtn}
          title="Maximize"
          onClick={() => setMaximized((m) => !m)}
        >
          <FaExpand />
        </button>
        <button className={styles.iconBtn} title="Close" onClick={onClose}>
          <FaTimesCircle />
        </button>
      </div>

      {/* Chat area */}
      <div className={styles.chatArea}>
        {welcome ? (
          <div className={styles.welcome}>
            <img src={aiRobot} alt="Ai Robot" className={styles.robotImg} />
            <h1>AI</h1>
            <p>Ask AI Assistant anything!</p>
          </div>
        ) : (
          <div className={styles.messages}>
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={
                  msg.sender === "user" ? styles.userMsg : styles.aiMsg
                }
              >
                {msg.sender === "ai" && (
                  <span className={styles.aiProfile}>
                    <FaRobot />
                  </span>
                )}
                <span className={styles.msgText}>{msg.text}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Input area at bottom */}
      <form className={styles.inputBar} onSubmit={handleSend}>
        <input
          ref={inputRef}
          type="text"
          className={styles.input}
          placeholder="Type your message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button type="submit" className={styles.sendBtn} title="Send">
          <FaPaperPlane />
        </button>
      </form>
    </div>
  );
}
