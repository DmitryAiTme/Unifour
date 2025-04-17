import React from "react";
import "./MessageBubble.css";

export default function MessageBubble({
  message,
  uniqueKey,
  characterColor = "#ffffff",
}) {
  const isUserMessage = message.sender === "user";
  const hasQuote = message.q_description || message.q_name;

  function splitIntoParagraphs(text, baseKey) {
    if (text) {
      return text.toString()
        .split("\n")
        .map((txt, i) => (
          <p key={`${baseKey}-${i}`}>
            {processTextWithLinks(txt)}
          </p>
        ));
    }
    return <p>{text}</p>;
  }

  function processTextWithLinks(text) {
    // Regular expression to match URLs
    const urlRegex = /(https?:\/\/[^\s]+)/g;

    // Split the text into parts with links
    const parts = text.split(urlRegex);

    return parts.map((part, index) => {
      if (part.match(urlRegex)) {
        return (
          <a
            key={index}
            href={part}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: '#1DA1F2', textDecoration: 'underline' }}
          >
            {part}
          </a>
        );
      }
      return part;
    });
  }

  const paragraphs = splitIntoParagraphs(
    message.description,
    `desc-${uniqueKey}`
  );

  return (
    <div
      className={`message-bubble ${
        isUserMessage ? "user-message" : "other-message"
      }`}
      style={
        !isUserMessage
          ? {
              borderColor: characterColor,
              backgroundColor: `${characterColor}22`,
            }
          : {}
      }
    >
      {message.name && (
        <pre>{`${message.name || ""}`}</pre>
      )}

      <div className="message-content">
        {paragraphs}
        {message.media && !hasQuote && (
          <img alt="post image" src={message.media} />
        )}
      </div>

      {hasQuote && (
        <div
          className="quoted-message"
          style={{
            margin: "8px 0",
            padding: "10px",
            borderRadius: "8px",
            borderLeft: "4px solid #ccc",
            backgroundColor: "rgba(0, 0, 0, 0.05)",
          }}
        >
          {message.q_name && (
            <pre>{`${message.q_name || ""} ${message.q_username || ""}`}</pre>
          )}
          <div className="quoted-content">
            {splitIntoParagraphs(message.q_description, `qdesc-${uniqueKey}`)}
            {message.media && (
              <img alt="quoted post image" src={message.media} />
            )}
          </div>
        </div>
      )}
      { message.link && <p><a href={message.link}> View post </a></p>}
    </div>
  );
}
