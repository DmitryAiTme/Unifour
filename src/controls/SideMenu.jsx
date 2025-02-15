import React from 'react';
import Button from "./Button.jsx";
import "./controlsStyle.css";

export default function SideMenu() {
  const buttonNames = [
    { text: "telegram", mode: "socials" },
    { text: "x", mode: "socials" },
    { text: "dex", mode: "socials" },
    { text: "pump", mode: "socials" },
  ];
  const buttons = buttonNames.map((props, index) => (
    <Button key={index} {...props} />
  ));
  return <div id="menu-side"> {buttons} </div>;
}
