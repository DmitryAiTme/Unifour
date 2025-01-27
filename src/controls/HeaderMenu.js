import Button from "./Button";
import "./controlsStyle.css";

export default function HeaderMenu() {
  const buttonProps = [
    { text: "⬆", mode: "text" },
    { text: "AI Agents", mode: "text" },
    { text: "Roadmap", mode: "text" },
    { text: "Whitepaper", mode: "text" },
    { text: "Github", mode: "text", onClick: goToGH },
    { text: "Connect Wallet", mode: "connect" },
  ];
  const headerButtons = buttonProps.map((props, index) => (
    <Button key={index} {...props} />
  ));
  return <menu id="menu-header"> {headerButtons} </menu>;
}

function goToGH() {
  return window.open("https://github.com/DmitryAiTme", "_blank");
}
