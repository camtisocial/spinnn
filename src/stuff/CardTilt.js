import React, { useRef, useEffect } from 'react';
import './CardTilt.css'; 

function CardTilt({ children }) {
  const cardRef = useRef(null);

  useEffect(() => {
    const card = cardRef.current;

    function rotateToMouse(e) {
      const mouseX = e.clientX;
      const mouseY = e.clientY;

      const center = {
        x: mouseX - (window.innerWidth) / 2,
        y: mouseY - (window.innerHeight) / 2,
      };

      const maxRotation = 7;
      const rotateX = -(center.y / (window.innerHeight / 2)) * maxRotation;
      const rotateY = (center.x / (window.innerWidth / 2)) * maxRotation;
      const perspective = 1000;

      card.style.transformOrigin = 'center center';
      card.style.transitionDuration = '500ms';

      card.style.transform = `
        perspective(${perspective}px)
        rotateX(${rotateX}deg)
        rotateY(${rotateY}deg)
      `;
    }


    window.addEventListener('mousemove', rotateToMouse);

    return () => {
      window.removeEventListener('mousemove', rotateToMouse);
    };
  }, []);

  return (
    <div className="rotating-card-container">
      <div className="rotating-card" ref={cardRef}>
        {children}
      </div>
    </div>
  );
}

export default CardTilt;
