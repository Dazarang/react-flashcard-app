import React, { useState, useEffect, useRef } from "react";

export default function Flashcard({ flashcard }) {
  const [flip, setFlip] = useState(false);
  const [height, setHeight] = useState("initial");

  const frontEl = useRef();
  const backEl = useRef();

  function setMaxHeight() {
    const frontHeight = frontEl.current.getBoundingClientRect().height;
    const backHeight = backEl.current.getBoundingClientRect().height;

    setHeight(Math.max(frontHeight, backHeight, 400));
  }

  useEffect(setMaxHeight, [flashcard.eng, flashcard.spa, flashcard.ex]);
  useEffect(() => {
    window.addEventListener("resize", setMaxHeight);
    return () => window.removeEventListener("resize", setMaxHeight);
  });

  function handleFlip() {
    setFlip(!flip);
  }

  function handleKeyPress(event) {
    if (event.keyCode == 32 || event.keyCode == 38 || event.keyCode == 40) {
      handleFlip();
    }
  }

  useEffect(() => {
    window.addEventListener("keydown", handleKeyPress);
    // return cleanup funtion to remove the handler after use
    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  });

  return (
    <div
      className={`card ${flip ? "flip" : ""}`}
      style={{ height: height }}
      onClick={handleFlip}
      // tabIndex="0"
      // onKeyPress={handleKeyPress}
    >
      <img className="front-img" src="./britain.png" alt="britain" />
      <img className="back-img" src="./spain.png" alt="britain" />

      <div className="front" ref={frontEl}>
        {flashcard.eng}
      </div>
      <div className="back" ref={backEl}>
        {flashcard.spa}
        <div className="flashcard-exs">
          {flashcard.ex.map((ex) => {
            return (
              <div className="flashcard-ex" key={ex}>
                {ex}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
