import "./App.css";
import CardTilt from "./stuff/CardTilt";
import SceneCanvas from "./hooks/SceneCanvas";
import React, { useEffect } from "react";
import UserInfo from "./stuff/UserInfo";

function App() {
  useEffect(() => {
    setTimeout(() => {
      window.scrollTo({
        top: 0,
        behavior: "auto",
      });
    }, 50);
  }, []);

  const [triggerAnimation, setTriggerAnimation] = React.useState(null);
  const [setTriggerTextAnimation] = React.useState(null);

  const handleButtonAnims = () => {
    if (triggerAnimation) triggerAnimation();
    setTimeout(() => {
      scrollDown();
      fadeOutButtonGlow();
    }, 1000);
  };

  const scrollDown = () => {
    const start = window.pageYOffset;
    const end = start + window.innerHeight;
    const duration = 1000;
    const startTime = performance.now();

    const easeInOutQuint = (t, b, c, d) => {
      t /= d;
      return -c * t * (t - 2) + b;
    };

    const animateScroll = (currentTime) => {
      const timeElapsed = currentTime - startTime;
      const nextScrollY = easeInOutQuint(
        timeElapsed,
        start,
        end - start,
        duration,
      );

      window.scrollTo(0, nextScrollY);

      if (timeElapsed < duration) {
        requestAnimationFrame(animateScroll);
      } else {
        window.scrollTo(0, end);
      }
    };

    requestAnimationFrame(animateScroll);
  };

  const fadeOutButtonGlow = () => {
    const button = document.querySelector(".Hover-area");
    if (button) {
      button.style.transition = "opacity 0.6s ease-out";
      button.style.opacity = "0";
    }
  };

  return (
    <div className="App">
      <div className="Background">
        <SceneCanvas
          setTriggerAnimation={setTriggerAnimation}
          setTriggerTextAnimation={setTriggerTextAnimation}
        />
        <UserInfo className="User-info" />
        <button className="Hover-area" onClick={handleButtonAnims} />
        <div style={{ height: "20vh" }}>asdf</div>

        <CardTilt>
          <div className="Text-container">
            <h1 className="Text">Hello, I'm</h1>
            <h1 className="Text">Cameron</h1>
          </div>
        </CardTilt>
      </div>
    </div>
  );
}

export default App;
