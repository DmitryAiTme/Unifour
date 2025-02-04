import React from "react";
import "./pages.css";

export default function HomePage({ reference }) {
  return (
    <div className="page" ref={reference}>
      <p> Chart page </p>
    </div>
  );
}
