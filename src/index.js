import Phaser from "phaser";
import Game from './Scenes/game';

const gameDimensions = {
    width: 800,
    height: 800
};

const numberTextStyles = {
    fontSize: '60px',
    color: '#000',
    align: 'center'
};

const config = {
  type: Phaser.AUTO,
  parent: "sudoku-game",
  scale: {
    parent: 'game',
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: gameDimensions.width,
    height: gameDimensions.height
  }
};

const game = new Phaser.Game(config);

game.scene.add('game', Game, true, {gameDimensions, numberTextStyles});