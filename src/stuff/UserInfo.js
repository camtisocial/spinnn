import React, { useState, useEffect } from "react";

const UserInfo = ({className}) => {
  const [info, setInfo] = useState({
    mouseX: 0,
    mouseY: 0,
    userAgent: navigator.userAgent,
    platform: navigator.platform,
    screenWidth: window.screen.width,
    screenHeight: window.screen.height,
    deviceMemory: navigator.deviceMemory,
    hardwareConcurrency: navigator.hardwareConcurrency,
  });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setInfo({
        ...info,
        mouseX: e.clientX,
        mouseY: e.clientY,
      });
    };

    document.addEventListener("mousemove", handleMouseMove);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <div className={className}>
      <h2>camtisocial.github.io/spinnn</h2>
      {/*<p>{info.userAgent}</p>*/}
      {/*<p>Mouse X: {info.mouseX} Mouse Y: {info.mouseY}</p>*/}
      <p>X:{info.mouseX} Y:{info.mouseY}</p>
      <p>{info.platform}</p>
      <p>Device Memory: {info.deviceMemory}</p>
      <p>Hardware Concurrency: {info.hardwareConcurrency}</p>
    </div>
  );
};

export default UserInfo;
