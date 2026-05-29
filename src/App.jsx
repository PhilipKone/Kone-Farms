import React from 'react';
import KoneFarms from './components/KoneFarms';

export default function App() {
  return (
    <KoneFarms onBack={() => window.location.href = 'https://koneacademy.io'} />
  );
}
