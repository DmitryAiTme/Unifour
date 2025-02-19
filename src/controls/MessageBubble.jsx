export default function MessageBubble({ text, speaker }) {
  function splitter(text) {
    const arr = [];
    const texts = text.split("\\n");
    texts.map((txt, i) => arr.push(<p key={i}> {txt} </p>));
    return arr;
  }
//   const texts = splitter(text);
//   const paragraphs = [];
//   texts.forEach((splittedText, index) => { paragraphs.push(<li key={`${splittedText.key}${index}`}> {splittedText} </li>)});

  return <div className="message-bubble">
    <p>{/*...paragraphs*/text}</p>
  </div>
}
