import './style.css';

import Phaser from 'phaser';
import { createGameConfig } from './config';
import { calculateSidescrollerWidth, reloadWhenResize } from '@jostein-skaar/common-game';

reloadWhenResize(window);

let isDebug = true;

if (import.meta.env.PROD) {
  isDebug = false;
}

// TODO: GET ALL THIS FROM  common-game package

// const maxWidthMap = 3200; // 100 * 32;
const maxWidth = 1080;
const maxHeight = 1080;

const height = 360;

const width = calculateSidescrollerWidth(height, maxWidth, maxHeight, window.innerWidth, window.innerHeight);

console.log('window.inner:', window.innerWidth, 'x', window.innerHeight);

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
