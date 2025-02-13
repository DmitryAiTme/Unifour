import React from "react";
import "./pages.css";
import table from "../../assets/table.png";

export default function AboutPage({ reference }) {
  return (
    <div className="page" ref={reference}>
      <img className="table" src={table} />
    </div>
)
}
