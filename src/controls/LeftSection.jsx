import React from 'react';
import Button from "./Button.jsx";
import "./controlsStyle.css";
import logo from "../logo.svg";
import devix from "../../assets/devix/Head_face.png";
import postix from "../../assets/postix/Head_face.png";
import flipso from "../../assets/flipso/Head_face.png";
import teachy from "../../assets/teachy/Head_face.png";

export default function LeftSection() {
  const [ currentMode, setCurrentMode ] = React.useState("postix");
  const buttonProps = [
    { text: "flipso", mode: "image", onClick: () => clickHandle("flipso") },
    { text: "postix", mode: "image", onClick: () => clickHandle("postix") },
    { text: "teachy", mode: "image", onClick: () => clickHandle("teachy") },
    { text: "devix", mode: "image", onClick: () => clickHandle("devix") },
  ];
  const sectionButtons = buttonProps.map((props, index) => (
    <Button key={index} {...props} />
  ));
  function clickHandle(mode) {
    setCurrentMode(mode);
  }
  return (
    <section id="section-left">
      <menu> {sectionButtons} </menu>
      <section className="head-section">
        <img className="big-head" src={ currentMode==="postix" ? postix : currentMode==="flipso" ? flipso : currentMode==="devix" ? devix : teachy } alt="mini pepega" />
      </section>
    </section>
  );
}
