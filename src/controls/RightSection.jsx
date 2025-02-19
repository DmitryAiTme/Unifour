import { useState, useRef } from 'react';
import MessageBubble from "./MessageBubble.jsx";
import Button from "./Button.jsx";

export default function RightSection({ currentMode }) {
  const modes = ["flipso", "postix", "teachy", "devix"];
  const messageInput = useRef();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const API_URL = 'http://localhost:3001/api';
  const sectionBackground = "assets/space.png";

  async function connectToDB() {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/posts`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      let data = await response.json();
      data = sortByDate(data);
      console.log(data);
      setPosts(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }
  function sortByDate(items) {
    let sortedItems = items;
    let i = 0;
    let j = 0;
    for (i = 0; i < items.length; ++i) {
      for (j = i+1; j < items.length; ++j) {
        if (sortedItems[i].created_at > sortedItems[j].created_at) {
          const buffer = {...sortedItems[i]};
          sortedItems[i] = {...sortedItems[j]};
          sortedItems[j] = buffer;
        }
      }
    }
    return sortedItems;
  }
  function messageHandler(message) {
    if (message.includes("post")) {

        {/*posts.map((post, index) => (
          <div className="post" key={index}>
            <ul style={{whiteSpace: "pre-wrap"}}> { splitter(post.title) } <img src={post.content} /> </ul>
          </div>
      ))*/}
      setMessages(oldMessages => {
        const newMessages = {...oldMessages};
        posts.map((post, index) => (newMessages[currentMode].push({ id: oldMessages.length, key: index, text: post.title, sender: 'other' })));
        return newMessages;
      } )
    }
  }

  const [messages, setMessages] = useState({
    devix: [],
    postix: [],
    flipso: [],
    teachy: []
  });
  if (messages[currentMode].length === 0) {
    setMessages( oldMessages => {
      const newMessages = {...oldMessages};
      newMessages[currentMode] = [{ id: 0, text: `Hello user! My name is ${currentMode.charAt(0).toUpperCase() + currentMode.slice(1)}`, sender: 'other' }]
      console.log(newMessages[currentMode]);
      return newMessages;
    } );
  }
  function sendMessage() {
    if (messageInput.current.value !== '') {
      setMessages( oldMessages => {
          const newMessages = {...oldMessages};
          newMessages[currentMode].push({ id: oldMessages.length, text: messageInput.current.value, sender: 'user' })
          return newMessages;
        } )
      messageInput.current.value = '';
    }
  }
  const [newMessage, setNewMessage] = useState('');
  return (
    <section id="section-right">
      <img className="background" src={sectionBackground} />
      <div className="chat">
        <div className="message-list">
          {messages[currentMode].map((message) => (
            <div
              key={message.id}
              className={`message-wrapper ${
                message.sender === 'user' ? 'message-user' : 'message-other'
              }`} >
              <MessageBubble text={message.text} />
            </div>
          ))}
        </div>
        <div className="row">
          <input className="message-input" ref={messageInput} ></input>
          <Button mode="text" text="➤" fixed={false} onClick={sendMessage} />
        </div>
      </div>
    </section>
  );
}
