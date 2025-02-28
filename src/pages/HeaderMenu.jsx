import React from "react";
import Button from "../controls/Button.jsx";
import "./pages.css";

export default function HeaderMenu({ scrollToPage }) {
  const buttonProps = [
    { text: "logo", mode: "logo", onClick: goToHome },
    { text: "⬆", mode: "text", onClick: goToCharts },
    { text: "AI Agents", mode: "text", onClick: goToHome },
    { text: "Roadmap", mode: "text" },
    { text: "Whitepaper", mode: "text" },
    { text: "Github", mode: "text", onClick: goToGH },
    { text: "Connect Wallet", mode: "connect" },
  ];
  const headerButtons = buttonProps.map((props, index) => (
    <Button key={index} {...props} />
  ));
  return (
    <header className="header-row">
      <menu className="header-menu"> {headerButtons} </menu>
    </header>
  );
  function goToHome() {
    scrollToPage("Home page");
  }
  function goToCharts() {
    scrollToPage("Chart page");
  }
}

function goToGH() {
  return window.open("https://github.com/DmitryAiTme", "_blank");
}
