import React from "react";
import "./App.css";
import HeaderMenu from "./pages/HeaderMenu.jsx";
import HomePage from "./pages/HomePage.jsx";
import AboutPage from "./pages/AboutPage.jsx";
import Footer from "./pages/Footer.jsx";

export default function App() {
  const homePage = React.useRef(null);
  const chartPage = React.useRef(null);

  function scrollToPage(name) {
    let page = null;
    if (name === "Home page") {
      page = homePage;
    } else if (name === "Chart page") {
      page = chartPage;
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
        <Footer />
      </div>
    </section>
  );
}
