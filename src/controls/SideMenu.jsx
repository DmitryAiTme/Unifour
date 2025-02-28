import React from "react";
import Button from "./Button.jsx";
import "./controlsStyle.css";

export default function SideMenu() {
  function goToTg() {
    return window.open("https://t.me/unifour", "_blank");
  }

  const buttonNames = [
    { text: "telegram", mode: "socials", onClick: goToTg },
    { text: "x", mode: "socials" },
    { text: "dex", mode: "socials" },
    { text: "pump", mode: "socials" },
  ];
  const buttons = buttonNames.map((props, index) => (
    <Button key={index} {...props} />
  ));
  return <div className="menu-side"> {buttons} </div>;
}
