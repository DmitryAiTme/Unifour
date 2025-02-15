import React from "react";
import "./controlsStyle.css";
import logo from "../logo.png";
import devix from "../../assets/devix/Head_face.png";
import postix from "../../assets/postix/Head_face.png";
import flipso from "../../assets/flipso/Head_face.png";
import teachy from "../../assets/teachy/Head_face.png";

import telegram from "../../assets/socials/telegram.webp";
import twitter from "../../assets/socials/x.png";
import dex from "../../assets/socials/dex-screener.png";
import pump from "../../assets/socials/pump-fun.png";

export default function Button({ mode, text, active, onClick }) {
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
        {text === "telegram" && <img src={telegram} alt={text} />}
        {text === "x" && <img src={twitter} alt={text} />}
        {text === "dex" && <img src={dex} alt={text} />}
        {text === "pump" && <img src={pump} alt={text} />}
      </button>
    );
  } else if (mode === "image") {
    return (
      <button id={`button-image${active ? '-active' : ''}`} onClick={onClick}>
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
