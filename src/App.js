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
    }, 800);
  };

  const scrollDown = () => {
      window.scrollTo({
        top: window.pageYOffset + window.innerHeight,
        behavior: "smooth",
      });
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
