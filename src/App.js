import "./App.css";
import SceneCanvas from "./hooks/SceneCanvas";
import React from "react";
import UserInfo from "./stuff/UserInfo";

function App() {
  const [triggerAnimation, setTriggerAnimation] = React.useState(null);
  const [triggerTextAnimation, setTriggerTextAnimation] = React.useState(null);

  const handleButtonAnims = () => {
    if (triggerAnimation) triggerAnimation();
    if (triggerTextAnimation) triggerTextAnimation();
  };

  return (
    <div className="App">
      <SceneCanvas
        setTriggerAnimation={setTriggerAnimation}
        setTriggerTextAnimation={setTriggerTextAnimation}
      />
      <UserInfo className="User-info" />
      <button className="Hover-area" onClick={handleButtonAnims} />
    </div>
  );
}

export default App;
