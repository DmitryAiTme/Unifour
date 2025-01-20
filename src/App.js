// import logo from './logo.svg';
import './App.css';
import HeaderMenu from './controls/HeaderMenu';
import SideMenu from './controls/SideMenu';
import LeftSection from './controls/LeftSection';
import RightSection from './controls/RightSection';
import FooterMenu from './controls/FooterMenu';
import logo from './logo.svg';
// import { useState } from "react";

export default function App() {
  // const [activeContentIndex, setActiveContentIndex] = useState(0);

      //   <header className="App-header">
      //   <img src={logo} className="App-logo" alt="logo" />
      // </header>
  return (
    <div className="App">
      <div className="row">
        <img className='App-logo' src={ logo } />
        <HeaderMenu></HeaderMenu>
      </div>
      <div className="row">
        <SideMenu/>
        <LeftSection/>
        <RightSection/>
      </div>
      <FooterMenu/>
    </div>
  );
}
