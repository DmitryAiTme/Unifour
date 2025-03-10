import { useRef } from "react";
import Button from "./Button.jsx";
import HeadBuilder from "./HeadBuilder.jsx";
import "./controlsStyle.css";

export default function LeftSection({ currentMode, setCurrentMode }) {
  const sectionBackground = "assets/space.png";
  const headRef = useRef(null);
  const buttonProps = [
    {
      text: "flipso",
      mode: "image",
      onClick: () => clickHandle("flipso"),
      active: currentMode === "flipso",
    },
    {
      text: "postix",
      mode: "image",
      onClick: () => clickHandle("postix"),
      active: currentMode === "postix",
    },
    {
      text: "teachy",
      mode: "image",
      onClick: () => clickHandle("teachy"),
      active: currentMode === "teachy",
    },
    {
      text: "devix",
      mode: "image",
      onClick: () => clickHandle("devix"),
      active: currentMode === "devix",
    },
  ];
  const sectionButtons = buttonProps.map((props, index) => (
    <Button key={index} {...props} />
  ));
  function clickHandle(mode) {
    setCurrentMode(mode);
    headRef.current.setMode();
  }
  return (
    <section id="section-left">
      <img
        className="background"
        src={sectionBackground}
        alt="space background"
      />
      <div> {sectionButtons} </div>
      <section className="head-section">
        <HeadBuilder mode={currentMode} ref={headRef} />
      </section>
    </section>
  );
}
