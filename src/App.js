import "./App.css";
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

  return (
    <div className="App">
      <div className="Background">
        <SceneCanvas
          setTriggerAnimation={setTriggerAnimation}
          setTriggerTextAnimation={setTriggerTextAnimation}
        />
        <UserInfo className="User-info" />
        <button className="Hover-area" onClick={handleButtonAnims} />
        <div style={{ height: "100vh" }}>Extra content to ensure scrolling</div>
      </div>
    </div>
  );
}

export default App;
