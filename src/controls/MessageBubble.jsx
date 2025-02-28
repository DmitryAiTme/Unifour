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
      return text
        .split("\n")
        .map((txt, i) => <p key={`${baseKey}-${i}`}>{txt}</p>);
    }
    return <p>{text}</p>;
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
        <pre>{`${message.name}\n${message.username || ""}`}</pre>
      )}

      <div className="message-content">
        {paragraphs}
        {message.media && (
          <img alt="post image" src={`posts/${message.media}`} />
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
            <pre>{`${message.q_name}\n${message.q_username || ""}`}</pre>
          )}
          <div className="quoted-content">
            {splitIntoParagraphs(message.q_description, `qdesc-${uniqueKey}`)}
            {message.q_media && (
              <img alt="quoted post image" src={`posts/${message.q_media}`} />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
