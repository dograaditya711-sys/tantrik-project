import React from 'react';
import { TempleNightScene } from './temple-night/TempleNightScene'; 
import './temple-night/threeui.css';

export default function TempleScene() {
  return (
    <div className="fixed inset-0 w-full h-full z-0 bg-[#05070a]">
      <TempleNightScene />
    </div>
  );
}