import React from 'react';

/**
 * DOMONO Landing Page — rocket-launch themed hero screen.
 * Entry point before the user "launches" into the live control dashboard.
 * Styled with plain CSS (see src/index.css) — no Tailwind.
 */
export default function LandingPage({ onLaunch }) {
  const stars = React.useMemo(
    () =>
      Array.from({ length: 60 }).map(() => ({
        top: `${Math.random() * 100}%`,
        left: `${Math.random() * 100}%`,
        size: `${Math.random() * 2 + 1}px`,
        delay: `${Math.random() * 3}s`,
        opacity: Math.random() * 0.6 + 0.2,
      })),
    []
  );

  const modules = [
    'User Story Analyzer',
    'DOM Scanner',
    'Playwright Generator',
    'Self-Healer',
    'Dashboard & GitHub',
    'Web + Native UI',
  ];

  return (
    <div className="landing">
      <div className="landing-stars">
        {stars.map((s, i) => (
          <span
            key={i}
            className="landing-star"
            style={{
              top: s.top,
              left: s.left,
              width: s.size,
              height: s.size,
              animationDelay: s.delay,
              opacity: s.opacity,
            }}
          />
        ))}
      </div>

      <div className="landing-content">
        <div className="landing-rocket">🚀</div>
        <h1 className="landing-title">DOMONO</h1>
        <p className="landing-subtitle">
          Autonomous End-to-End QA Agent — story analysis, DOM scanning, Playwright
          generation, runtime self-healing, and GitHub-integrated reporting, all in one
          mission control.
        </p>

        <button className="landing-launch-btn" onClick={onLaunch}>
          🚀 Launch Mission Control
        </button>

        <div className="landing-pills">
          {modules.map((m) => (
            <span key={m} className="landing-pill">
              {m}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
