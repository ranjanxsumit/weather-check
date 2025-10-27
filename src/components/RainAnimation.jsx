import React from 'react';
const RainAnimation = () => {
  // Created an array of 100 drops
  const drops = Array.from({ length: 100 }).map((_, i) => {
    const style = {
      left: `${Math.random() * 100}%`,
      animationDelay: `${Math.random() * 2}s`,
      animationDuration: `${0.5 + Math.random() * 0.5}s`,
    };
    return <div key={i} className="rain-drop" style={style}></div>;
  });

  return (
    // placed rain layer above the background but below the UI (cards have z-10)
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
      {drops}
    </div>
  );
};

export default RainAnimation;