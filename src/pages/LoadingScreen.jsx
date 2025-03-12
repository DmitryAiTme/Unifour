import React, { useState, useEffect } from "react";
import "./LoadingScreen.css";

export default function LoadingScreen({ onFinishLoading }) {
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [showScreen, setShowScreen] = useState(true);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const charactersOrder = ["flipso", "postix", "devix", "teachy"];
  const characters = {
    flipso: "assets/flipso/Head_face.png",
    postix: "assets/postix/Head_face.png",
    teachy: "assets/teachy/Head_face.png",
    devix: "assets/devix/Head_face.png",
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setLoadingProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsFadingOut(true);
          setTimeout(() => {
            setShowScreen(false);
            if (onFinishLoading) onFinishLoading();
          }, 1200);
          return 100;
        }
        return prev + Math.floor(Math.random() * 10) + 1;
      });
    }, 200);

    return () => clearInterval(interval);
  }, [onFinishLoading]);

  if (!showScreen) return null;

  return (
    <div className={`loading-screen ${isFadingOut ? "fade-out" : ""}`}>
      <div className="loading-content">
        <div className="logo-container">
          <img src="logo.png" alt="Logo" className="loading-logo" />
        </div>
        <div className="characters-container">
          {charactersOrder.map((name, index) => (
            <div
              key={name}
              className={`character ${name}`}
              style={{
                animationDelay: `${index * 0.2}s`,
                animationDuration: "1.2s",
              }}
            >
              <img src={characters[name]} alt={name} />
            </div>
          ))}
        </div>
        <div className="loading-bar-container">
          <div
            className="loading-bar"
            style={{ width: `${loadingProgress}%` }}
          ></div>
          <div className="loading-text">Loading... {loadingProgress}%</div>
        </div>
        <div className="loading-message">Welcome to Unifour</div>
      </div>
    </div>
  );
}
