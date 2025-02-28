import React from "react";
import "./controlsStyle.css";

export default function Button({ mode, text, active, fixed = true, onClick }) {
  const logo = "logo.png";
  const characters = {
    devix: "assets/devix/Head_face.png",
    postix: "assets/postix/Head_face.png",
    flipso: "assets/flipso/Head_face.png",
    teachy: "assets/teachy/Head_face.png",
  };
  const socials = {
    telegram: "assets/socials/telegram.webp",
    twitter: "assets/socials/x.png",
    dex: "assets/socials/dex-screener.png",
    pump: "assets/socials/pump-fun.png",
  };
  const isClickable = !!onClick ? "text-blur" : "text-shake";
  const isFixed = fixed ? "fixed-size" : "dynamic-size";

  if (mode === "text") {
    return (
      <button
        className={`button button-text ${isClickable} ${isFixed}`}
        onClick={onClick}
      >
        {text}
      </button>
    );
  } else if (mode === "connect") {
    return (
      <button className={`button button-connect ${isClickable} ${isFixed}`}>
        {text}
      </button>
    );
  } else if (mode === "socials") {
    return (
      <button
        className={`button button-socials ${isClickable} ${text}`}
        onClick={onClick}
      >
        {text === "telegram" && <img src={socials.telegram} alt={text} />}
        {text === "x" && <img src={socials.twitter} alt={text} />}
        {text === "dex" && <img src={socials.dex} alt={text} />}
        {text === "pump" && <img src={socials.pump} alt={text} />}
      </button>
    );
  } else if (mode === "image") {
    return (
      <button
        className={`button button-image ${isClickable} ${
          active ? "active" : "default"
        }`}
        onClick={onClick}
      >
        {text === "devix" && <img src={characters.devix} alt={text} />}
        {text === "postix" && <img src={characters.postix} alt={text} />}
        {text === "flipso" && <img src={characters.flipso} alt={text} />}
        {text === "teachy" && <img src={characters.teachy} alt={text} />}
      </button>
    );
  } else if (mode === "output") {
    return (
      <label className={`button button-output ${isClickable}`}> {text} </label>
    );
  } else if (mode === "logo") {
    return (
      <button className={`button button-logo ${isClickable}`} onClick={onClick}>
        <img src={logo} alt={text} />
      </button>
    );
  }
}
