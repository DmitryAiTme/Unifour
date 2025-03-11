import React, { useRef, useState } from "react";
import Button from "../controls/Button.jsx";
import BurgerMenu from "../controls/BurgerMenu.jsx";
import useMediaQuery from '@mui/material/useMediaQuery';
import WalletModule from "./WalletModule.jsx";
import "./pages.css";

export default function HeaderMenu({ scrollToPage, cookies }) {
  const matches = useMediaQuery('(max-width:768px)');
  const burgerRef = useRef(null);
  const walletRef = useRef(null);
  const [publicKey, setPublicKey] = useState(typeof(cookies.get('publicKey')) !== 'undefined' ? cookies.get('publicKey') : "");
  const isConnected = publicKey !== "";

  const buttonProps = matches ?
    [
      { text: "logo", mode: "logo" },
      { text: "Unifour", mode: "label", fixed: false },
      { text: "◻", mode: "burger", fixed: false, onClick: () => openBurger(burgerRef) },
    ] :
    [
      { text: "logo", mode: "logo" },
      { text: "⬆", mode: "text" },
      { text: "AI Agents", mode: "text", onClick: goToHome },
      { text: "Roadmap", mode: "text", onClick: openRoadmap },
      { text: "Whitepaper", mode: "text", onClick: openWhitepaper },
      { text: "Github", mode: "text", onClick: openGH },
      { text: isConnected ? `Disconnect Wallet\n${publicKey.substring(0, 4)}***${publicKey.substring(publicKey.length-4)}` : "Connect Wallet", mode: "connect", onClick: handleWallet, active: isConnected },
    ];

  const headerButtons = buttonProps.map((props, index) => (
    <Button key={index} {...props} />
  ));

  function saveKey(key) {
    setPublicKey(key.toString());
    cookies.set('publicKey', key, { path: '/' });
  }
  async function disconnectWallet() {
    setPublicKey('');
    cookies.set('publicKey', '', { path: '/' });
    alert("Phantom Wallet was disconnected");
  }

  const functionsSet = {
    goToHome: goToHome,
    openRoadmap: openRoadmap,
    openWhitepaper: openWhitepaper,
    openGH: openGH,
    goToAbout: goToAbout
  }

  return (
    <>
      <header className="header-row">
        <div className="header-menu">
          {headerButtons}
          <WalletModule ref={walletRef} saveKey={saveKey} />
        </div>
      </header>
      {matches && <BurgerMenu ref={burgerRef} functionsSet={functionsSet} /> }
    </>
  );

  function goToHome() {
    scrollToPage("Home page");
  }

  function goToAbout() {
    scrollToPage("About page");
  }

  function handleWallet() {
    if (isConnected) disconnectWallet();
    else walletRef.current.connectWallet();
  }
}

function openGH() {
  return window.open("https://github.com/DmitryAiTme", "_blank");
}

function openRoadmap() {
  return window.open("https://docs.unifour.io/roadmap", "_blank");
}

function openWhitepaper() {
  return window.open("https://docs.unifour.io/", "_blank");
}

function openBurger(ref) {
  ref.current.changeVisibility()
}
