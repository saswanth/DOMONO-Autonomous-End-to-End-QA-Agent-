import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import LandingScreen from './src/components/LandingScreen';
import DomonoDashboard from './src/components/DomonoDashboard';

export default function App() {
  const [launched, setLaunched] = useState(false);

  return (
    <>
      <StatusBar style="light" />
      {launched ? (
        <DomonoDashboard onExit={() => setLaunched(false)} />
      ) : (
        <LandingScreen onLaunch={() => setLaunched(true)} />
      )}
    </>
  );
}
