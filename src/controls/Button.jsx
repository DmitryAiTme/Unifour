import React from "react";
import "./controlsStyle.css";

export default function Button({ mode, text, active = true, fixed = true, onClick }) {
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
      > {text}
      </button>
    );
  } else if (mode === "cross") {
        return (
      <button
        className={`button button-text ${isClickable} ${isFixed} rounded-cross`}
        onClick={onClick}
      >{
        <div className="cross-icon">
          <div className="cross-line line-1"></div>
          <div className="cross-line line-2"></div>
        </div>}
      </button>
    );
  } else if (mode === "burger") {
        return (
      <button
        className={`button button-text ${isClickable} ${isFixed} rounded-burger`}
        onClick={onClick}
      >{
        <div className="burger-icon">
          <div className="burger-line line-1"></div>
          <div className="burger-line line-2"></div>
          <div className="burger-line line-3"></div>
        </div>}
      </button>
    );
  } else if (mode === "label" || mode === "label-underscore") {
    return (
      <h2
        className={`button ${mode} ${isFixed}`}
        onClick={onClick}
      >
        {text}
      </h2>
    );
  } else if (mode === "connect") {
    return (
      <button
        className={`button button-connect ${isClickable} ${isFixed} ${active ? "disconnect" : ""}`}
        onClick={onClick}
      >
        {text}
      </button>
    );
  } else if (mode === "socials" || mode === "image") {
    return (
      <button
        className={`button button-${mode} ${isClickable} ${active && mode === "image" ? "active" : "default"} ${text}`}
        onClick={onClick}
      >
        {text === "telegram" && <img src={socials.telegram} alt={text} />}
        {text === "x" && <img src={socials.twitter} alt={text} />}
        {text === "dex" && <img src={socials.dex} alt={text} />}
        {text === "pump" && <img src={socials.pump} alt={text} />}
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
