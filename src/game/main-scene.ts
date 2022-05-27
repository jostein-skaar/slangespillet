import { adjustForPixelRatio } from '@jostein-skaar/common-game';
import Phaser from 'phaser';

export class MainScene extends Phaser.Scene {
  playerName!: string;

  groundLayer: any;
  bredde!: number;
  hoyde!: number;
  map!: Phaser.Tilemaps.Tilemap;
  hero!: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
  presentsGroup!: Phaser.Physics.Arcade.Group;
  enemyGroup!: Phaser.Physics.Arcade.Group;
  hasJumpedTwice: boolean | undefined;
  backgroundMountains!: Phaser.GameObjects.TileSprite;
  backgroundSnow!: Phaser.GameObjects.TileSprite;
  collectedPresents = 0;
  collectedPresentsBest = 0;
  collectedPresentsText!: Phaser.GameObjects.Text;
  isPaused: boolean = false;
  isDead: boolean = false;
  level: number = 1;
  useParallax = false;
  countdownText!: Phaser.GameObjects.Text;

  constructor() {
    super('main-scene');
  }

  init(data: any): void {
    this.playerName = data.playerName;
    this.bredde = this.game.scale.gameSize.width;
    this.hoyde = this.game.scale.gameSize.height;
    const tempBestScore = localStorage.getItem(`slangespillet-best-score-${this.level}`);
    this.collectedPresentsBest = tempBestScore === null ? 0 : +tempBestScore;
  }

  create(): void {
    const tilesSize = adjustForPixelRatio(32);

    this.map = this.make.tilemap({ key: 'map' });
    const tiles = this.map.addTilesetImage('tiles', 'tiles');

    console.log('this.map.widthInPixels', this.map.widthInPixels);

    const platformLayer = this.map.createLayer(`level${this.level}`, [tiles]);
    platformLayer.setCollisionByProperty({ ground: true });

    this.presentsGroup = this.physics.add.group({
      allowGravity: false,
      immovable: true,
    });

    this.enemyGroup = this.physics.add.group({
      allowGravity: false,
      // immovable: true,
    });

    const presentsFirstGid = this.map.tilesets.find((x) => x.name.startsWith('presents'))?.firstgid!;
    for (let x = 0; x < this.map.width; x++) {
      for (let y = 0; y < this.map.height; y++) {
        if (platformLayer.hasTileAt(x, y)) {
          const t = platformLayer.getTileAt(x, y);
          if (t.properties.present === true) {
            t.visible = false;
            this.presentsGroup.create(x * tilesSize, y * tilesSize, 'present', t.index - presentsFirstGid).setOrigin(0, 0);
          }
        }
      }
    }

    this.hero = this.physics.add.sprite(0, 0, 'sprites', 'hero-001.png');
    this.hero.setPosition(this.hero.width / 2 + adjustForPixelRatio(10), this.hoyde - this.hero.height / 2 - tilesSize);

    this.hero.anims.create({
      key: 'stand',
      frames: [{ key: 'sprites', frame: 'hero-001.png' }],
      frameRate: 6,
    });
    this.hero.anims.create({
      key: 'walk',
      frames: [
        { key: 'sprites', frame: 'hero-001.png' },
        { key: 'sprites', frame: 'hero-002.png' },
      ],
      frameRate: 6,
    });
    this.hero.anims.create({
      key: 'jump',
      frames: [{ key: 'sprites', frame: 'hero-003.png' }],
      frameRate: 6,
    });

    this.input.on('pointerdown', () => {
      if (this.hero.body.onFloor()) {
        this.hero.setVelocityY(adjustForPixelRatio(-200));
        this.hasJumpedTwice = false;
        console.log('HOPP: onFloor()');
      } else if (this.hasJumpedTwice === false) {
        this.hero.setVelocityY(adjustForPixelRatio(-200));
        this.hasJumpedTwice = true;
        console.log('HOPP: hasJumpedTwice === false');
      } else {
        console.log('HOPP: else');
      }
    });

    this.cameras.main.startFollow(this.hero);
    this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);

    this.physics.add.collider(this.hero, platformLayer);

    this.physics.add.overlap(this.hero, this.presentsGroup, (_helt, present) => {
      //@ts-ignore
      present.disableBody(true, true);
      this.collectedPresents += 1;
      this.updateText();
    });

    this.physics.add.overlap(this.hero, this.enemyGroup, (_helt, _enemy) => {
      this.lose();
    });

    this.collectedPresentsText = this.add.text(adjustForPixelRatio(16), adjustForPixelRatio(16), '', {
      fontSize: `${adjustForPixelRatio(24)}px`,
      color: '#000',
      backgroundColor: '#ccc',
      padding: { x: adjustForPixelRatio(5), y: adjustForPixelRatio(5) },
    });
    this.collectedPresentsText.setScrollFactor(0, 0);

    this.countdownText = this.add
      .text(this.bredde / 2, this.hoyde / 2, '', {
        fontSize: `${adjustForPixelRatio(200)}px`,
        color: '#0653c7',
        fontStyle: 'bold',
      })
      .setOrigin(0.5, 0.5);

    this.tweens.add({
      targets: this.countdownText,
      // x: this.bredde,
      scale: 1.4,
      ease: 'Power0',
      duration: 250,
      yoyo: true,
      repeat: -1,
    });
    let countdownCounter = 0;
    if (countdownCounter > 0) {
      this.countdownText.setText(countdownCounter.toString());
      const countdownIntervalId = setInterval(() => {
        countdownCounter--;
        this.countdownText.setText(countdownCounter.toString());
        console.log(countdownCounter);
        if (countdownCounter <= 0) {
          this.countdownText.setVisible(false);
          this.startGame();
          clearInterval(countdownIntervalId);
        }
      }, 1000);

      this.isPaused = true;
      this.physics.pause();
    } else {
      this.startGame();
    }

    this.collectedPresents = 0;
    this.isDead = false;
    this.updateText();
  }

  update(): void {
    if (this.useParallax) {
      // Because we use background@1-versions (pixelRatio=1), we need to compensate the scrolling.
      this.backgroundMountains.tilePositionX = (this.cameras.main.scrollX * 0.2) / adjustForPixelRatio(1);
      this.backgroundSnow.tilePositionX = (this.cameras.main.scrollX * 0.6) / adjustForPixelRatio(1);
    }

    this.hero.setVelocityX(adjustForPixelRatio(100));

    // Animasjoner.
    if (!this.isPaused) {
      if (this.hero.body.onFloor() && !this.hero.body.onWall()) {
        this.hero.play('walk', true);
      } else if (!this.hero.body.onFloor()) {
        this.hero.play('jump', true);
      } else {
        this.hero.play('stand', true);
      }
      if (this.hero.body.onFloor()) {
        this.hasJumpedTwice = undefined;
      }
    }
    if (this.hero.x > this.map.widthInPixels) {
      this.lose();
    }

    if (this.hero.y > this.map.heightInPixels) {
      this.lose();
    }
  }

  private updateText() {
    let text = `Level ${this.level}`;
    text += `\nPakker: ${this.collectedPresents}`;
    if (this.collectedPresentsBest > 0) {
      text += `\nRekord: ${this.collectedPresentsBest}`;
    }

    this.collectedPresentsText.setText(text);
  }

  private startGame() {
    this.isPaused = false;
    this.physics.resume();
  }

  private lose() {
    if (this.isDead) {
      return;
    }
    this.isDead = true;
    this.scene.pause();
    this.hero.setTint(0xff0000);
    this.cameras.main.setBackgroundColor(0xbababa);
    this.cameras.main.setAlpha(0.5);

    this.collectedPresentsBest = Math.max(this.collectedPresents, this.collectedPresentsBest);
    localStorage.setItem(`slangespillet-best-score-${this.level}`, this.collectedPresentsBest.toString());

    console.log({ resultat: this.collectedPresents, level: this.level });
    this.scene.launch('lost-scene', { resultat: this.collectedPresents, level: this.level });

    // const goToHomeTimeout = setTimeout(() => {
    //   // this.scene.restart({ level: this.level });
    //   const home = document.querySelector<HTMLDivElement>('#home')!;
    //   const game = document.querySelector<HTMLDivElement>('#game')!;
    //   home.style.display = 'block';
    //   game.style.display = 'none';
    // }, 3000);

    // setTimeout(() => {
    //   this.input.once('pointerdown', () => {
    //     console.log('Want to try level again');
    //     clearTimeout(goToHomeTimeout);
    //     this.scene.start('main-scene', { level: this.level });
    //   });
    // }, 500);
  }
}
