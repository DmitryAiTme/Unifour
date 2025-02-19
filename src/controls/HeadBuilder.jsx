import React, { useState, useEffect, useImperativeHandle, useRef } from 'react';

export default function HeadBuilder({ mode, ref }) {
  const getAssetPaths = (currentMode) => ({
    head: `assets/${currentMode}/Head.png`,
    eyes: {
      eyes1: `assets/${currentMode}/eyes/Eyes1.png`,
      eyes2: `assets/${currentMode}/eyes/Eyes2.png`,
      eyes3: `assets/${currentMode}/eyes/Eyes3.png`,
      eyes4: `assets/${currentMode}/eyes/Eyes4.png`,
    },
    mouth: {
      mouth1: `assets/${currentMode}/mouth/Mouth1.png`,
      mouth2: `assets/${currentMode}/mouth/Mouth2.png`,
      mouth3: `assets/${currentMode}/mouth/Mouth3.png`,
      mouth4: `assets/${currentMode}/mouth/Mouth4.png`,
      mouth5: `assets/${currentMode}/mouth/Mouth5.png`,
      mouth6: `assets/${currentMode}/mouth/Mouth6.png`,
      mouth7: `assets/${currentMode}/mouth/Mouth7.png`,
      mouth8: `assets/${currentMode}/mouth/Mouth8.png`,
    }
  });

  const [assets, setAssets] = useState(getAssetPaths(mode));
  const [eyes, setEyes] = useState(assets.eyes.eyes2);
  const [mouth, setMouth] = useState(assets.mouth.mouth1);
  const [eyesSequence, setEyesSequence] = useState([]);
  const [mouthSequence, setMouthSequence] = useState([]);

  const blinkIntervalRef = useRef(null);
  const speakIntervalRef = useRef(null);
  const animationTimeoutsRef = useRef([]);
  const initialAnimationTimeoutsRef = useRef([]);

  const updateSequences = (currentAssets) => {
    setEyesSequence([
      { img: currentAssets.eyes.eyes1, delay: 60 },
      { img: currentAssets.eyes.eyes3, delay: 60 },
      { img: currentAssets.eyes.eyes4, delay: 60 },
      { img: currentAssets.eyes.eyes3, delay: 60 },
      { img: currentAssets.eyes.eyes1, delay: 60 },
      { img: currentAssets.eyes.eyes2, delay: 60 },
    ]);
    setMouthSequence([
      { img: currentAssets.mouth.mouth2, delay: 100 },
      { img: currentAssets.mouth.mouth3, delay: 100 },
      { img: currentAssets.mouth.mouth4, delay: 100 },
      { img: currentAssets.mouth.mouth5, delay: 100 },
      { img: currentAssets.mouth.mouth6, delay: 100 },
      { img: currentAssets.mouth.mouth7, delay: 100 },
      { img: currentAssets.mouth.mouth8, delay: 100 },
      { img: currentAssets.mouth.mouth1, delay: 100 },
    ]);
  };

  const resetAnimations = () => {
    if (blinkIntervalRef.current) {
      clearInterval(blinkIntervalRef.current);
      blinkIntervalRef.current = null;
    }
    if (speakIntervalRef.current) {
      clearInterval(speakIntervalRef.current);
      speakIntervalRef.current = null;
    }
    animationTimeoutsRef.current.forEach(timeout => clearTimeout(timeout));
    animationTimeoutsRef.current = [];
    initialAnimationTimeoutsRef.current.forEach(timeout => clearTimeout(timeout));
    initialAnimationTimeoutsRef.current = [];
    setEyes(assets.eyes.eyes2);
    setMouth(assets.mouth.mouth1);
  };

  function animation(sequence, setter) {
    let currentIndex = 0;
    function playNextFrame() {
      if (currentIndex < sequence.length) {
        setter(sequence[currentIndex].img);
        const timeout = setTimeout(() => {
          currentIndex++;
          playNextFrame();
        }, sequence[currentIndex].delay);
        animationTimeoutsRef.current.push(timeout);
      }
    }
    playNextFrame();
  }

  useEffect(() => {
    const newAssets = getAssetPaths(mode);
    setAssets(newAssets);
    resetAnimations();
    updateSequences(newAssets);
  }, [mode]);

  useEffect(() => {
    if (eyesSequence.length && mouthSequence.length) {
      resetAnimations();
      const eyesTimeout = setTimeout(() => {
        animation(eyesSequence, setEyes);
        blinkIntervalRef.current = setInterval(() => animation(eyesSequence, setEyes), 5000);
      }, 5000);

      const mouthTimeout = setTimeout(() => {
        animation(mouthSequence, setMouth);
        speakIntervalRef.current = setTimeout(() => animation(mouthSequence, setMouth), 800/*2500*/);
      }, 800/*2500*/);

      initialAnimationTimeoutsRef.current = [eyesTimeout, mouthTimeout];

      return () => {
        resetAnimations();
      };
    }
  }, [eyesSequence, mouthSequence]);

  useImperativeHandle(ref, () => ({
    setMode() {
      const newAssets = getAssetPaths(mode);
      setAssets(newAssets);
      resetAnimations();
      updateSequences(newAssets);
    }
  }), [mode]);

  return (
    <div className="relative">
      <img src={assets.head} alt="Head" className="big-head" />
      <img src={eyes} alt="Eyes" className="big-head" />
      <img src={mouth} alt="Mouth" className="big-head" />
    </div>
  );
}
