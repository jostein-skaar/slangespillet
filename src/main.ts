import './style.css';

import Phaser from 'phaser';
import { createGameConfig } from './config';
import { reloadWhenResize } from '@jostein-skaar/common-game';

reloadWhenResize(window);

let isDebug = true;

if (import.meta.env.PROD) {
  isDebug = false;
}

// TODO: GET ALL THIS FROM  common-game package

const maxWidthMap = 100 * 32;
const maxWidth = 1024;
const maxScalingHeight = 1024;

console.log('window.inner:', window.innerWidth, 'x', window.innerHeight);

const availableWidth = window.innerWidth;
const availableHeight = window.innerHeight > maxScalingHeight ? maxScalingHeight : window.innerHeight;

const isPortrait = availableHeight > availableWidth;
// Height should always be 576px. This is from the tilemap (18 tiles x 32px).
const height = 576;

let width = (height * availableWidth) / availableHeight;
if (width > maxWidth) {
  width = maxWidth;
}

if (!isPortrait) {
  console.log('widthInScaling calc', width);
  width = (height / availableHeight) * width;
  if (width > maxWidthMap) {
    width = maxWidthMap;
  }
}

// if (availableHeight === maxScalingHeight && availableWidth > availableHeight) {
//   width = height;
// }

// let scaleModePhaser = Phaser.Scale.ScaleModes.NONE;
// let centerModePhaser = Phaser.Scale.Center.NO_CENTER;
// if (window.innerHeight < height) {
//   scaleModePhaser = Phaser.Scale.ScaleModes.FIT;
//   const scaleRatio = window.innerHeight / height;
//   console.log('scaleRatio', scaleRatio);
//   // Compensate scale ratio to be able to fill width of screen when FIT is used.
//   width = Math.min(window.innerWidth / scaleRatio, maxWantedWidth);
// } else {
//   width = Math.min(window.innerWidth, maxWantedWidth);
// }

// if (width < window.innerWidth) {
//   centerModePhaser = Phaser.Scale.Center.CENTER_BOTH;
// }

console.table({ width, height });

const gameConfig = createGameConfig(width, height, isDebug);
// const phaserGame = new Phaser.Game(gameConfig);
new Phaser.Game(gameConfig);

document.querySelector<HTMLDivElement>('button.start')!.addEventListener('click', () => {
  startGame();
});

function startGame() {
  // phaserGame.scene.start('main-scene', { playerName: 'anonym' });
  const home = document.querySelector<HTMLDivElement>('#home')!;
  const game = document.querySelector<HTMLDivElement>('#game')!;
  home.style.display = 'none';
  game.style.display = 'block';
}

window.onload = () => {
  const loader = document.querySelector<HTMLDivElement>('#loader')!;
  const home = document.querySelector<HTMLDivElement>('#home')!;
  const game = document.querySelector<HTMLDivElement>('#game')!;

  loader.style.display = 'none';
  home.style.display = 'block';
  game.style.display = 'none';

  setTimeout(() => {
    startGame();
  }, 100);
};
