import React, { useState } from 'react';
import LandingPage from './components/LandingPage.jsx';
import DomonoDashboard from './components/DomonoDashboard.jsx';

export default function App() {
  const [launched, setLaunched] = useState(false);

  if (!launched) {
    return <LandingPage onLaunch={() => setLaunched(true)} />;
  }

  return <DomonoDashboard onExit={() => setLaunched(false)} />;
}
