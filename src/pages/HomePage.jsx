import { useState } from 'react';
import SideMenu from "../controls/SideMenu.jsx";
import LeftSection from "../controls/LeftSection.jsx";
import RightSection from "../controls/RightSection.jsx";
import FooterMenu from "../controls/FooterMenu.jsx";
import "./pages.css";

export default function HomePage({ reference }) {
  const [ currentMode, setCurrentMode ] = useState("flipso");
  return (
    <div className="page" ref={reference}>
      <div className="row">
        <SideMenu />
        <LeftSection currentMode={currentMode} setCurrentMode={setCurrentMode} />
        <RightSection currentMode={currentMode} />
      </div>
      <FooterMenu />
    </div>
  );
}
