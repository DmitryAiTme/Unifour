import React from "react";
import "./App.css";
import HeaderMenu from "./pages/HeaderMenu.jsx";
import HomePage from "./pages/HomePage.jsx";
import ChartPage from "./pages/ChartPage.jsx";
import AgentsPage from "./pages/AgentsPage.jsx";
import RoadmapPage from "./pages/RoadmapPage.jsx";
import AboutPage from "./pages/AboutPage.jsx";

export default function App() {
  const homePage = React.useRef(null);
  const chartPage = React.useRef(null);
  const agentsPage = React.useRef(null);
  const roadmapPage = React.useRef(null);

  function scrollToPage(name) {
    let page = null;
    if (name === "Home page") {
      page = homePage;
    } else if (name === "Chart page") {
      page = chartPage;
    } else if (name === "Agents page") {
      page = agentsPage;
    } else if (name === "Roadmap page") {
      page = roadmapPage;
    }
    console.log(page);
    page.current?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <section className="App">
      <HeaderMenu scrollToPage={scrollToPage} />
      <div className="body">
        <HomePage reference={homePage} />
        <AboutPage reference={chartPage} />
        {/*<ChartPage reference={chartPage} />
        <AgentsPage reference={agentsPage} />
        <RoadmapPage reference={roadmapPage} />*/}
      </div>
    </section>
  );
}
