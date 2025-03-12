import { useState, useRef } from 'react';
import SideMenu from "../controls/SideMenu.jsx";
import LeftSection from "../controls/LeftSection.jsx";
import RightSection from "../controls/RightSection.jsx";
import FooterMenu from "../controls/FooterMenu.jsx";
import useMediaQuery from '@mui/material/useMediaQuery';
import "./pages.css";

export default function HomePage({ reference }) {
  const [currentMode, setCurrentMode] = useState("flipso");
  const matches = useMediaQuery('(max-width:768px)');
  const headRef = useRef(null);

  return (
    <div className="page" ref={reference}>
      <div className="responsive-layout">
        {matches ? <FooterMenu /> : <SideMenu />}
        <LeftSection currentMode={currentMode} setCurrentMode={setCurrentMode} headRef={headRef} />
        <RightSection currentMode={currentMode} headRef={headRef} />
      </div>
      {!matches && <FooterMenu />}
    </div>
  );
}
