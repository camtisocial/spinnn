import "./App.css";
import SceneCanvas from "./hooks/SceneCanvas";
import React from "react";
import UserInfo from "./stuff/UserInfo";

function App() {
  const [triggerAnimation, setTriggerAnimation] = React.useState(null);
  return (
    <div className="App">
      <SceneCanvas setTriggerAnimation={setTriggerAnimation} />
      <UserInfo className="User-info" />
      <button
        className="Hover-area"
        onClick={() => {
        if (triggerAnimation) triggerAnimation();
      }}>
      </button>

    </div>
  );
}

export default App;
