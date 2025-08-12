// React and Next.js imports
import React from 'react';

// Third-party libraries
import ReactCanvasConfetti from 'react-canvas-confetti';

// Canvas styles
const canvasStyles: React.CSSProperties = {
  position: 'fixed',
  pointerEvents: 'none',
  width: '100%',
  height: '100%',
  top: 0,
  left: 0,
};

// Confetti component - displays animated confetti celebration effect
export default class Realistic extends React.Component {
  animationInstance: any = null;

  // Helper methods
  makeShot = (particleRatio: number, opts: any) => {
    if (this.animationInstance) {
      this.animationInstance({
        ...opts,
        origin: { x: 0.5, y: 0.7 }, // Spread origin across the width of the screen
        particleCount: Math.floor(150 * particleRatio),
      });
    }
  };

  fire = () => {
    this.makeShot(0.25, {
      spread: 26,
      startVelocity: 55,
      decay: 0.92,
    });

    this.makeShot(0.2, {
      spread: 60,
      decay: 0.91,
    });

    this.makeShot(0.35, {
      spread: 100,
      decay: 0.91,
      scalar: 0.8,
    });

    this.makeShot(0.1, {
      spread: 120,
      startVelocity: 25,
      decay: 0.92,
      scalar: 1.2,
    });

    this.makeShot(0.1, {
      spread: 120,
      startVelocity: 45,
      decay: 0.91,
    });
  };

  getInstance = (instance: any) => {
    this.animationInstance = instance;
  };

  // Lifecycle methods
  componentDidMount() {
    this.fire(); // Trigger confetti automatically on component mount
  }

  render() {
    return <ReactCanvasConfetti refConfetti={this.getInstance} style={canvasStyles} />;
  }
}
