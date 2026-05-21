interface WelcomeProps {
  onStart: () => void;
}

export default function Welcome({ onStart }: WelcomeProps) {
  return (
    <div className="welcome">
      <div>
        <div className="hero-eyebrow">★ A Reading Comic for Olivia</div>
        <h1>
          <span className="ln">Read.</span><br />
          <span className="ln">Choose.</span><br />
          <em className="ln">Adventure.</em>
        </h1>
        <p className="lede">
          Pick a hero. Build the story. Then read your way through three chapters of
          space adventure, drawn comic-book style and written for you by Claude. Tap any
          word to hear it. Solve mysteries. Earn XP, coins, and stickers.
        </p>
        <div className="ctas">
          <button className="btn lg" onClick={onStart}>★ Start New Story</button>
          <button className="btn ghost" onClick={onStart}>My Sticker Shelf</button>
        </div>
      </div>
      <div className="hero-visual">
        <div className="panel tilt-r">
          <div className="speed-lines"></div>
          <svg viewBox="0 0 400 400" style={{ width: '100%', height: '100%' }}>
            <defs>
              <pattern id="hwh" x="0" y="0" width="6" height="6" patternUnits="userSpaceOnUse">
                <circle cx="3" cy="3" r="1" fill="#0c0a14" />
              </pattern>
              <radialGradient id="welGlow" cx="0.5" cy="0.5">
                <stop offset="0" stopColor="#ffe9a5" />
                <stop offset="0.5" stopColor="#ff7a4a" />
                <stop offset="1" stopColor="#c5223a" />
              </radialGradient>
            </defs>
            <circle cx="200" cy="220" r="120" fill="url(#welGlow)" stroke="#0c0a14" strokeWidth="5" />
            <circle cx="200" cy="220" r="120" fill="url(#hwh)" opacity="0.22" />
            <path d="M120,200 Q170,220 280,200" stroke="#0c0a14" strokeWidth="3" fill="none" />
            <path d="M130,260 Q200,290 280,250" stroke="#0c0a14" strokeWidth="3" fill="none" />
            <circle cx="160" cy="180" r="8" fill="#0c0a14" />
            <circle cx="240" cy="240" r="6" fill="#0c0a14" />
            <ellipse cx="200" cy="220" rx="170" ry="34" fill="none" stroke="#0c0a14" strokeWidth="5" transform="rotate(-22 200 220)" />
            <ellipse cx="200" cy="220" rx="170" ry="34" fill="none" stroke="#e53b50" strokeWidth="2" transform="rotate(-22 200 220)" />
            <g className="hero-rocket">
              <g transform="rotate(0)">
                <path d="M0,0 L24,0 L36,12 L24,24 L0,24 Z" fill="#e53b50" stroke="#0c0a14" strokeWidth="3" />
                <circle cx="14" cy="12" r="5" fill="#fff" stroke="#0c0a14" strokeWidth="2" />
                <path d="M-12,4 L0,4 L0,20 L-12,20 Z" fill="#ffb02e" stroke="#0c0a14" strokeWidth="3" />
                <circle cx="-18" cy="12" r="4" fill="#ffb02e" opacity="0.6" />
                <circle cx="-24" cy="12" r="3" fill="#ffb02e" opacity="0.35" />
              </g>
            </g>
            <g fill="#0c0a14">
              <path className="hero-star" d="M340,60 L344,72 L356,76 L344,80 L340,92 L336,80 L324,76 L336,72 Z" />
              <path className="hero-star s2" d="M60,340 L62,348 L70,350 L62,352 L60,360 L58,352 L50,350 L58,348 Z" />
              <path className="hero-star s3" d="M330,330 L334,340 L344,344 L334,348 L330,358 L326,348 L316,344 L326,340 Z" />
            </g>
          </svg>
        </div>
        <div className="sfx tl">BOOM!</div>
        <div className="sfx br">ZWOOSH</div>
      </div>
    </div>
  );
}
