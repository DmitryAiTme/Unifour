import React from "react";
import "./controlsStyle.css";
import logo from "../logo.svg";
import devix from "../../assets/devix/Head_face.png";
import postix from "../../assets/postix/Head_face.png";
import flipso from "../../assets/flipso/Head_face.png";
import teachy from "../../assets/teachy/Head_face.png";

export default function Button({ mode, text, onClick }) {
  if (mode === "text") {
    return (
      <button id="button-text" onClick={onClick}>
        {text}
      </button>
    );
  } else if (mode === "connect") {
    return <button id="button-connect"> {text} </button>;
  } else if (mode === "socials") {
    return (
      <button id="button-socials">
        <img src={logo} alt={text} />
      </button>
    );
  } else if (mode === "image") {
    return (
      <button id="button-image" onClick={onClick}>
        {text === "devix" && <img src={devix} alt={text} />}
        {text === "postix" && <img src={postix} alt={text} />}
        {text === "flipso" && <img src={flipso} alt={text} />}
        {text === "teachy" && <img src={teachy} alt={text} />}
      </button>
    );
  } else if (mode === "output") {
    return <label id="button-output"> {text} </label>;
  } else if (mode === "logo") {
    return (
      <button id="button-logo" onClick={onClick}>
        <img src={logo} alt={text} />
      </button>
    );
  }
}
