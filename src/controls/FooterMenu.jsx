import React from "react";
import Button from "./Button.jsx";

export default function FooterMenu() {
  const address = "BGtE6A8uvGboV7bSiyyMKuy2NQDYQLc4nnSpu25upump";
  const buttonNames = [
    { text: address, mode: "output" },
    { text: "copy", mode: "text", fixed: false, onClick: () => copyAddress(address) },
  ];
  const buttons = buttonNames.map((props, index) => (
    <Button key={index} {...props} />
  ));
  return <menu id="menu-footer"> {buttons} </menu>;
}

async function copyAddress(address) {
  const textArea = document.createElement("textarea");
  textArea.value = address;
  document.body.appendChild(textArea);
  textArea.select();
  try {
    document.execCommand("copy");
    alert("Address copied to clipboard!");
  } catch (err) {
    console.error("Fallback copying failed:", err);
  }
  document.body.removeChild(textArea);
}
