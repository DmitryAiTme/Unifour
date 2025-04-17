import { useState, useRef, useEffect } from "react";
import MessageBubble from "./MessageBubble.jsx";
import Button from "./Button.jsx";
import TwitterModule from "../pages/TwitterModule.jsx";
import HeadStateMachine from "./HeadStateMachine.jsx";
import "./ChatAnimation.css";
// const host = 'http://localhost:5522';
const host = 'https://unifour.io';

export default function RightSection({ currentMode, headRef }) {
  const messageInput = useRef(null);
  const chatContainerRef = useRef(null);
  const stateMachine = useRef(null);
  const apiUrl = `${host}/backend/api`;
  const sectionBackground = "assets/space.png";
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAnimating, setIsAnimating] = useState(false);
  const [previousMode, setPreviousMode] = useState(null);
  const [showButtons, setShowButtons] = useState(false);
  const [currentRequests, setCurrentRequests] = useState([]);
  const [isStateMachineReady, setIsStateMachineReady] = useState(false);
  const [isBotSpeaking, setIsBotSpeaking] = useState(false);
  const [messages, setMessages] = useState({
    devix: [],
    postix: [],
    flipso: [],
    teachy: [],
  });

  async function connectToDB() {
    try {
      const response = await fetch(`${apiUrl}/posts2`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setPosts(data);;
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
      setIsBotSpeaking(true); // Set bot speaking to true when starting to handle a message
      stateMachine.current.preaction(message);
      const replies = stateMachine.current.searchRequest(message);
      console.log(replies);

      // In the messageHandler function, modify the setTimeout:
      let totalDelay = 0;
      replies.forEach((reply, index) => {
        totalDelay = (index + 1) * 800; // Calculate total delay
        setTimeout(() => {
          setMessages((oldMessages) => {
            const lastId = oldMessages[currentMode].length > 0
              ? Math.max(...oldMessages[currentMode].map((msg) => msg.uniqueId || 0))
              : 0;

            // Animate mouth before adding the message
            animateMouthSpeaking();

            return {
              ...oldMessages,
              [currentMode]: [
                ...oldMessages[currentMode],
                {
                  ...reply,
                  sender: "other",
                  uniqueId: lastId + 1,
                },
              ],
            };
          });

          // If this is the last reply, set bot speaking to false after it's displayed
          if (index === replies.length - 1) {
            setTimeout(() => {
              setIsBotSpeaking(false);
            }, 500); // Short delay after the message appears
          }
        }, index * 800); // Using existing 800ms delay
      });

      // If no replies, ensure we reset the speaking state
      if (replies.length === 0) {
        setIsBotSpeaking(false);
      }

      stateMachine.current.action(message);
  }

  // Animation function to simulate mouth speaking
  const animateMouthSpeaking = () => {
    if (headRef.current && headRef.current.speak) {
      headRef.current.speak();
    }
  };

  function prettyMessage(msg) {
    return msg.replace(/[']/g, '').replace(/[^a-zA-Z]/g, ' ').replace(/\s+/g, ' ').trim();
  }

  function greetMessage() {
    const key = prettyMessage('wvkjvyvoiptag');
    if (messages[currentMode].length === 0) {
      setIsBotSpeaking(true); // Set speaking to true during greeting

      function greet() {
        stateMachine.current.action(key);
        return stateMachine.current.searchRequest(key);
      };

      const objects = greet();
      let totalDelay = 0;

      // Add greeting messages with delay
      objects.forEach((object, index) => {
        totalDelay = (index + 1) * 800; // Calculate total delay
        setTimeout(() => {
          setMessages((oldMessages) => {
            const lastId = oldMessages[currentMode].length > 0
              ? Math.max(...oldMessages[currentMode].map((msg) => msg.uniqueId || 0))
              : 0;

            return {
              ...oldMessages,
              [currentMode]: [
                ...oldMessages[currentMode],
                {
                  ...object,
                  sender: "other",
                  uniqueId: lastId + 1,
                }
              ],
            };
          });

          // If this is the last message, set speaking to false
          if (index === objects.length - 1) {
            setTimeout(() => {
              setIsBotSpeaking(false);
            }, 500); // Short delay after the message appears
          }
        }, index * 800); // Increased from 300ms to 800ms
      });

      // If no greeting messages, ensure we reset the speaking state
      if (objects.length === 0) {
        setIsBotSpeaking(false);
      }
    }
  }

  function greetAnimation() {
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
  }

  // Check for state changes that might affect button display
  useEffect(() => {
    if (stateMachine.current) {
      const { showRequests, requests } = stateMachine.current.getCurrentRequests();
      setShowButtons(showRequests);
      setCurrentRequests(requests);
    } else {
      setShowButtons(false);
    }
  }, [messages, currentMode]);

  useEffect(() => {
    if (stateMachine.current && !isStateMachineReady) {
      setIsStateMachineReady(true);
    }
  }, [stateMachine.current]);

  // Modify your existing useEffect to use the state variable
  useEffect(() => {
    if (isStateMachineReady) {
      greetAnimation();
    }
  }, [currentMode, isStateMachineReady]);

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
    const replacedMessage = prettyMessage(messageInput.current.value);
    console.log(replacedMessage);
    if (message && !isBotSpeaking) { // Only send if bot is not currently speaking
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
      messageHandler(replacedMessage);
      messageInput.current.value = "";
    }
  }

  function handleRequestButton(request) {
    if (isBotSpeaking) return; // Skip if bot is currently speaking

    setIsBotSpeaking(true); // Set bot speaking to true
    stateMachine.current.preaction(request);
    const replies = stateMachine.current.searchRequest(request);

    // First add the user message
    setMessages((oldMessages) => {
      const lastId = oldMessages[currentMode].length > 0
        ? Math.max(...oldMessages[currentMode].map((msg) => msg.uniqueId || 0))
        : 0;

      return {
        ...oldMessages,
        [currentMode]: [
          ...oldMessages[currentMode],
          {
            description: request,
            sender: "user",
            uniqueId: lastId + 1,
          }
        ],
      };
    });

    // Then add each reply with a delay
    let totalDelay = 0;
    replies.forEach((reply, index) => {
      totalDelay = (index + 1) * 800; // Calculate total delay
      setTimeout(() => {
        setMessages((oldMessages) => {
          const lastId = oldMessages[currentMode].length > 0
            ? Math.max(...oldMessages[currentMode].map((msg) => msg.uniqueId || 0))
            : 0;

          return {
            ...oldMessages,
            [currentMode]: [
              ...oldMessages[currentMode],
              {
                ...reply,
                sender: "other",
                uniqueId: lastId + 1,
              },
            ],
          };
        });

        // If this is the last reply, set bot speaking to false
        if (index === replies.length - 1) {
          setTimeout(() => {
            setIsBotSpeaking(false);
          }, 500); // Short delay after the message appears
        }
      }, (index + 1) * 800); // Increased delay to 800ms
    });

    // If no replies, ensure we reset the speaking state
    if (replies.length === 0) {
      setIsBotSpeaking(false);
    }

    stateMachine.current.action(request);

    // Update button state after action
    const { showRequests, requests } = stateMachine.current.getCurrentRequests();
    setShowButtons(showRequests);
    setCurrentRequests(requests);
  }

  function toggleInputMode() {
    if (!isBotSpeaking) { // Only allow toggle if bot is not speaking
      setShowButtons(!showButtons);
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !isBotSpeaking) { // Only handle Enter if bot is not speaking
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

  // CSS for disabled buttons
  const disabledStyle = isBotSpeaking ? {
    opacity: 0.5,
    pointerEvents: "none",
    cursor: "not-allowed"
  } : {};

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
        <TwitterModule
          apiUrl={apiUrl}
          onPostsUpdated={handlePostsUpdated}
        />
        <HeadStateMachine
          ref={stateMachine}
          mode={currentMode}
          posts={posts}
        />

        <div className="message-input-container">
          {showButtons ? (
            <>
              <div className="request-buttons-container" style={disabledStyle}>
                {currentRequests.map((request, index) => (
                  <Button
                    key={`request-${index}`}
                    mode="text"
                    text={request[0]}
                    fixed={false}
                    onClick={() => handleRequestButton(request[0])}
                  />
                ))}
              </div>
              <Button
                mode="text"
                text="⬇"
                fixed={false}
                onClick={toggleInputMode}
                style={disabledStyle}
              />
            </>
          ) : (
          <>
            <input
              className="message-input"
              ref={messageInput}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              disabled={isBotSpeaking} // Disable input when bot is speaking
              style={isBotSpeaking ? {opacity: 0.5} : {}}
            />
            <>
              {stateMachine.current?.getCurrentRequests().showRequests && (
                <Button
                  mode="text"
                  text="⬆"
                  fixed={false}
                  onClick={toggleInputMode}
                  style={disabledStyle}
                />
              )}
            </>
            <Button
              mode="text"
              text="➤"
              fixed={false}
              onClick={sendMessage}
              style={disabledStyle}
            />
          </>
        )}
        </div>
      </div>
    </section>
  );
}
