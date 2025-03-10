import SideMenu from "./SideMenu.jsx";
import Button from "./Button.jsx";
import { useImperativeHandle, useState } from 'react';

export default function BurgerMenu({ ref, functionsSet }) {
  const sectionBackground = "assets/space.png";
  const [active, setActive] = useState(true);
  useImperativeHandle(ref, () => {
    return {
      changeVisibility() {
        swapVisibility()
      }
    };
  }, []);
  function swapVisibility() {
    setActive(a => !a);
  }
  function goToAbout() {
    swapVisibility()
    functionsSet.goToAbout()
  }

  const buttonNames = [
    { text: "⨯", mode: "cross", fixed: false, onClick: swapVisibility },
    { text: "Roadmap", mode: "label-underscore", fixed: false, onClick: functionsSet.openRoadmap },
    { text: "Whitepaper", mode: "label-underscore", fixed: false, onClick: functionsSet.openWhitepaper },
    { text: "Github", mode: "label-underscore", fixed: false, onClick: functionsSet.openGH },
    { text: "How it works", mode: "label-underscore", fixed: false, onClick: goToAbout }
  ];
  const buttons = buttonNames.map((props, index) => (
    <Button key={index} {...props} />
  ));

  return <div className={`menu-burger ${active ? "invisible" : ""}`}>
    <img
        className="background"
        src={sectionBackground}
        alt="space background"
      />
    {buttons}
    <SideMenu inBurger={true} />
  </div>
}
