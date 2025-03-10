import { useState, useRef, useEffect } from "react";
import MessageBubble from "./MessageBubble.jsx";
import Button from "./Button.jsx";
import TwitterModule from "../pages/TwitterModule.jsx";
import HeadStateMachine from "./HeadStateMachine.jsx";
import "./ChatAnimation.css";

export default function RightSection({ currentMode }) {
  const messageInput = useRef(null);
  const chatContainerRef = useRef(null);
  const stateMachine = useRef(null);
  const apiUrl = /*"http://localhost:5522/backend/api"*/"https://unifour.io/backend/api";
  const sectionBackground = "assets/space.png";
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAnimating, setIsAnimating] = useState(false);
  const [previousMode, setPreviousMode] = useState(null);
  const [messages, setMessages] = useState({
    devix: [],
    postix: [],
    flipso: [],
    teachy: [],
  });

  async function connectToDB() {
    console.log("connecting");
    try {
      const response = await fetch(`${apiUrl}/posts2`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setPosts(data);
      console.log("Posts loaded:", data);
    } catch (err) {
      console.error("API Error:", err);
    } finally {
      setLoading(false);
    }
  }

  function sortByDate(items) {
    return [...items].sort(
      (a, b) => new Date(a.created_at) - new Date(b.created_at)
    );
  }

  function messageHandler(message) {
    if (currentMode === "postix") {
      stateMachine.current.preaction(message);
      const replies = stateMachine.current.searchRequest(message);
      console.log(replies);
      setMessages((oldMessages) => {
        const lastId =
          oldMessages[currentMode].length > 0
            ? Math.max(...oldMessages[currentMode].map((msg) => msg.uniqueId || 0))
            : 0;

        return {
          ...oldMessages,
          [currentMode]: [
            ...oldMessages[currentMode],
            ...replies.map((reply, index) => ({
              ...reply,
              sender: "other",
              uniqueId: lastId + index + 1,
            })),
          ],
        };
      })
      stateMachine.current.action(message);
    }
  }

  function greetMessage() {
    if (messages[currentMode].length === 0) {
      function greet() {
        if (currentMode === "postix") {
          stateMachine.current.action('');
          return stateMachine.current.searchRequest('');
        } else {
          return [{
            description: `Hello user! My name is ${currentMode.charAt(0).toUpperCase() + currentMode.slice(1)}`
          }];
        }
      };
      const objects = greet();
      setMessages((oldMessages) => {
        const lastId =
          oldMessages[currentMode].length > 0
            ? Math.max(...oldMessages[currentMode].map((msg) => msg.uniqueId || 0))
            : 0;
        return {
          ...oldMessages,
          [currentMode]: [
            ...oldMessages[currentMode],
            ...objects.map((object, index) => {
              console.log(lastId, index, 1);
              return {
                ...object,
                sender: "other",
                uniqueId: lastId + index + 1,
              }
            }),
          ],
        }
      });
    }
  }

  useEffect(() => {
    if (previousMode && previousMode !== currentMode) {
      setIsAnimating(false);
      setTimeout(() => {
        setIsAnimating(true);
        const animationTimeout = setTimeout(() => {
          greetMessage();

          setIsAnimating(false);
        }, 500);

        return () => clearTimeout(animationTimeout);
      }, 0);
    } else {
      greetMessage();
    }

    setPreviousMode(currentMode);
  }, [currentMode]);

  // Handle new posts from TwitterModule
  const handlePostsUpdated = () => {
    connectToDB(); // Reload posts from the database
  };

  const triggerAvatarAnimation = () => {
    const avatar = document.querySelector(".chat-avatar");
    if (avatar) {
      avatar.style.transform = "scale(1.2)";
      setTimeout(() => {
        avatar.style.transform = "scale(1)";
      }, 300);
    }
  };

  function sendMessage() {
    const message = messageInput.current.value.trim();
    if (message) {
      setMessages((oldMessages) => {
        const lastId =
          oldMessages[currentMode].length > 0
            ? Math.max(
                ...oldMessages[currentMode].map((msg) => msg.uniqueId || 0)
              )
            : 0;

        return {
          ...oldMessages,
          [currentMode]: [
            ...oldMessages[currentMode],
            {
              description: message,
              sender: "user",
              uniqueId: lastId + 1,
            },
          ],
        };
      });
      messageHandler(message);
      messageInput.current.value = "";
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };

  useEffect(() => {
    connectToDB();
  }, []);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [messages[currentMode]]);

  if (loading) {
    return <div>Loading...</div>;
  }

  const getCharacterColor = (mode) => {
    const colors = {
      flipso: "#F9AF50",
      postix: "#282989",
      teachy: "#FEC734",
      devix: "#9C4E1F",
    };
    return colors[mode] || "#ffffff";
  };

  return (
    <section id="section-right">
      <img
        className="background"
        src={sectionBackground}
        alt="space background"
      />
      <div className="chat">
        <div
          className={`chat-header ${currentMode}-theme`}
          style={{
            backgroundColor: `${getCharacterColor(currentMode)}22`,
            borderBottom: `2px solid ${getCharacterColor(currentMode)}`,
          }}
        >
          <img
            src={`assets/${currentMode}/Head_face.png`}
            alt={currentMode}
            className="chat-avatar"
          />
          <span className="chat-title">
            {currentMode.charAt(0).toUpperCase() + currentMode.slice(1)}
          </span>
        </div>

        <div
          ref={chatContainerRef}
          className={`message-list ${
            isAnimating ? "animating" : ""
          } ${currentMode}-mode`}
          data-previous-mode={previousMode}
          data-current-mode={currentMode}
        >
          {messages[currentMode].map((message) => (
            <div
              key={`msg-${message.uniqueId || Math.random()}`}
              className={`message-wrapper ${
                message.sender === "user" ? "message-user" : "message-other"
              }`}
            >
              <MessageBubble
                message={message}
                uniqueKey={`msg-${message.uniqueId || Math.random()}`}
                characterColor={getCharacterColor(currentMode)}
              />
            </div>
          ))}
        </div>

        {currentMode === "postix" && (
          <TwitterModule
            apiUrl={apiUrl}
            onPostsUpdated={handlePostsUpdated}
          />
        )}
        <HeadStateMachine
          ref={stateMachine}
          mode={currentMode}
          posts={posts}
        />

        <div className="message-input-container">
          <input
            className="message-input"
            ref={messageInput}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
          />
          <Button mode="text" text="➤" fixed={false} onClick={sendMessage} />
        </div>
      </div>
    </section>
  );
}
