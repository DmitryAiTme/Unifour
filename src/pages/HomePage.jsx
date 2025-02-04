import React from "react";
import SideMenu from "../controls/SideMenu.jsx";
import LeftSection from "../controls/LeftSection.jsx";
import RightSection from "../controls/RightSection.jsx";
import FooterMenu from "../controls/FooterMenu.jsx";
import "./pages.css";

export default function HomePage({ reference }) {
  return (
    <div className="page" ref={reference}>
      <div className="row">
        <SideMenu />
        <LeftSection />
        <RightSection />
      </div>
      <FooterMenu />
    </div>
  );
}
