import React from "react";
import "./pages.css";

export default function AboutPage({ reference }) {
  const table = "assets/table.png";
  return (
    <div className="page" ref={reference}>
      <img className="table" src={table} />
    </div>
)
}
