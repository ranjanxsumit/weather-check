import React from 'react';
const CardEffects = ({ showRain = false, isNight = false }) => {
  // small rain drops for cards
  const rainDrops = showRain
    ? Array.from({ length: 18 }).map((_, i) => {
        const style = {
          left: `${Math.random() * 100}%`,
          animationDelay: `${Math.random() * 1.5}s`,
          animationDuration: `${0.6 + Math.random() * 0.8}s`,
        };
        return <div key={`r-${i}`} className="card-rain-drop" style={style} />;
      })
    : null;

  // stars for night (small blinking dots)
  const stars = isNight
    ? Array.from({ length: 16 }).map((_, i) => {
        const style = {
          left: `${Math.random() * 92 + 4}%`,
          top: `${Math.random() * 80 + 4}%`,
          animationDelay: `${Math.random() * 2}s`,
        };
        return <div key={`s-${i}`} className="card-star" style={style} />;
      })
    : null;

  if (!showRain && !isNight) return null;

  return (
    <div className="absolute inset-0 pointer-events-none">
      {/* rain drops */}
      <div className="absolute inset-0 overflow-hidden">{rainDrops}</div>

      {/* stars */}
      <div className="absolute inset-0">{stars}</div>
    </div>
  );
};

export default CardEffects;
