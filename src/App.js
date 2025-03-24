import "./App.css";
import SceneCanvas from "./hooks/SceneCanvas";
import React from "react";
import UserInfo from "./stuff/UserInfo";

function App() {
  return (
    <div className="App">
      <SceneCanvas />
      <UserInfo className="User-info" />
      <button className="Hover-area"/>
    </div>
  );
}

export default App;
