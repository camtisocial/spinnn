import React, { useRef, useEffect } from 'react';
import './CardTilt.css'; // Import CSS for styling

function CardTilt({ children }) {
  const cardRef = useRef(null);
  const shadowRef = useRef(null);

  useEffect(() => {
    const card = cardRef.current;
    const shadow = shadowRef.current;

    function rotateToMouse(e) {
      const bounds = card.getBoundingClientRect();
      const mouseX = e.clientX;
      const mouseY = e.clientY;
      const leftX = mouseX - bounds.x;
      const topY = mouseY - bounds.y;
      const center = {
        x: leftX - bounds.width / 2,
        y: topY - bounds.height / 2
      };
      const maxRotation = 10;
      const rotateX = -(center.y / (bounds.height / 2)) * maxRotation;
      const rotateY = (center.x / (bounds.width / 2)) * maxRotation;
      const perspective = 1000;

      card.parentElement.style.setProperty('--mouse-x', `${leftX}px`);
      card.parentElement.style.setProperty('--mouse-y', `${topY}px`);
      card.parentElement.style.setProperty('--hover-opacity', `0.15`);
      card.style.transformOrigin = 'center center';
      card.style.transitionDuration = '200ms';
      card.style.transform = `
        perspective(${perspective}px)
        rotateX(${rotateX}deg)
        rotateY(${rotateY}deg)
      `;
    }

    function resetRotation() {
      card.style.transform = '';
      shadow.style.transform = '';
      shadow.style.opacity = '0';
    }

    card.addEventListener('mousemove', rotateToMouse);
    card.addEventListener('mouseleave', resetRotation);

    return () => {
      card.removeEventListener('mousemove', rotateToMouse);
      card.removeEventListener('mouseleave', resetRotation);
    };
  }, []);

  return (
    <div className="rotating-card-container">
      <div className="rotating-card" ref={cardRef}>
        {children}
      </div>
      <div className="background-shadow" ref={shadowRef}></div>
    </div>
  );
}

export default CardTilt;
