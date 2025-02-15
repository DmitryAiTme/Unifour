import devixHead from "../../assets/devix/Head.png";
import devixEyes1 from "../../assets/devix/eyes/Eyes1.png";
import devixEyes2 from "../../assets/devix/eyes/Eyes2.png";
import devixEyes3 from "../../assets/devix/eyes/Eyes3.png";
import devixEyes4 from "../../assets/devix/eyes/Eyes4.png";
import devixMouth1 from "../../assets/devix/mouth/Mouth1.png";
import devixMouth2 from "../../assets/devix/mouth/Mouth2.png";
import devixMouth3 from "../../assets/devix/mouth/Mouth3.png";
import devixMouth4 from "../../assets/devix/mouth/Mouth4.png";
import devixMouth5 from "../../assets/devix/mouth/Mouth5.png";
import devixMouth6 from "../../assets/devix/mouth/Mouth6.png";
import devixMouth7 from "../../assets/devix/mouth/Mouth7.png";
import devixMouth8 from "../../assets/devix/mouth/Mouth8.png";

import React, { useState, useEffect } from 'react';

export default function HeadBuilder() {
  const [eyes, setEyes] = useState(devixEyes2);
  const [mouth, setMouth] = useState(devixMouth1);
  const eyesSequence = [
    { img: devixEyes1, delay: 60 },
    { img: devixEyes3, delay: 60 },
    { img: devixEyes4, delay: 60 },
    { img: devixEyes3, delay: 60 },
    { img: devixEyes1, delay: 60 },
    { img: devixEyes2, delay: 60 },
  ];
  const mouthSequence = [
    { img: devixMouth2, delay: 150 },
    { img: devixMouth3, delay: 150 },
    { img: devixMouth4, delay: 150 },
    { img: devixMouth5, delay: 150 },
    { img: devixMouth6, delay: 150 },
    { img: devixMouth7, delay: 150 },
    { img: devixMouth8, delay: 150 },
    { img: devixMouth1, delay: 150 },
  ];
  function animation(sequence, setter) {
    let currentIndex = 0;
    function playNextFrame() {
      if (currentIndex < sequence.length) {
        setter(sequence[currentIndex].img);
        setTimeout(() => {
          currentIndex++;
          playNextFrame();
        }, sequence[currentIndex].delay);
      }
    }
    playNextFrame();
  }

  useEffect(() => {
    const blinkInterval = setInterval(() => animation(eyesSequence, setEyes), 5000);
    const speakInterval = setInterval(() => animation(mouthSequence, setMouth), 2500);
    return () => {
      clearInterval(blinkInterval);
      clearInterval(speakInterval);
    };
  }, []);

  return (
    <section>
      <img className="big-head" src={devixHead} alt="devix head" />
      <img className="big-head" src={eyes} alt="devix eyes" />
      <img className="big-head" src={mouth} alt="devix mouth" />
    </section>
  );
}
