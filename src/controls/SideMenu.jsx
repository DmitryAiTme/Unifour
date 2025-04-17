import React from "react";
import Button from "./Button.jsx";
import "./controlsStyle.css";

export default function SideMenu({inBurger = false}) {
  function goToTg() {
    return window.open("https://t.me/unifourchanel", "_blank");
  }
  function goToX() {
    return window.open("https://x.com/UnifourLabs", "_blank");
  }

  const buttonNames = [
    { text: "telegram", mode: "socials", onClick: goToTg },
    { text: "x", mode: "socials", onClick: goToX },
    { text: "dex", mode: "socials" },
    { text: "pump", mode: "socials" },
  ];
  const buttons = buttonNames.map((props, index) => (
    <Button key={index} {...props} />
  ));
  return <div className={`menu-side ${inBurger ? "in-burger" : ""}`}> {buttons} </div>;
}
