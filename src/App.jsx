import { useRef, useState, useEffect } from "react";
import "./App.css";
import HeaderMenu from "./pages/HeaderMenu.jsx";
import HomePage from "./pages/HomePage.jsx";
import AboutPage from "./pages/AboutPage.jsx";
import Footer from "./pages/Footer.jsx";
import LoadingScreen from "./pages/LoadingScreen.jsx";
import Cookies from 'universal-cookie';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();
const cookies = new Cookies();

export default function App() {
  const homePage = useRef(null);
  const aboutPage = useRef(null);
  const background = "assets/dogs.png";
  const [isLoading, setIsLoading] = useState(true);

  function scrollToPage(name) {
    let page = null;
    if (name === "Home page") {
      page = homePage;
    } else if (name === "About page") {
      page = aboutPage;
    }
    console.log(page);
    page.current?.scrollIntoView({ behavior: "smooth" });
  }

  const handleFinishLoading = () => {
    setIsLoading(false);
  };

  useEffect(() => {
    const imageUrls = [
      background,
      "logo.png",
      "assets/devix/Head_face.png",
      "assets/postix/Head_face.png",
      "assets/flipso/Head_face.png",
      "assets/teachy/Head_face.png",
      "assets/space.png",
    ];

    const preloadImages = async () => {
      const promises = imageUrls.map((url) => {
        return new Promise((resolve, reject) => {
          const img = new Image();
          img.src = url;
          img.onload = resolve;
          img.onerror = reject;
        });
      });

      try {
        await Promise.all(promises);
      } catch (error) {
        console.error("Failed to preload images:", error);
      }
    };

    preloadImages();
  }, []);

  return (
    <>
      {isLoading && <LoadingScreen onFinishLoading={handleFinishLoading} />}
      <section className="App">
        <QueryClientProvider client={queryClient}>
          <img className="App-img" src={background} alt="dogs background" />
          <HeaderMenu scrollToPage={scrollToPage} cookies={cookies} />
          <div className="body">
            <HomePage reference={homePage} />
            <AboutPage reference={aboutPage} />
            <Footer />
          </div>
        </QueryClientProvider>
      </section>
    </>
  );
}
