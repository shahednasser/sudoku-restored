import Phaser from "phaser";

const gameDimensions = {
    width: 800,
    height: 600
};

const gameStatus = {
    squares: []
};

const config = {
  type: Phaser.AUTO,
  parent: "sudoku-game",
  width: gameDimensions.width,
  height: gameDimensions.height,
  scene: {
    preload: preload,
    create: create
  }
};

const game = new Phaser.Game(config);

function preload() {
}

function create() {
    const bigSquareWidth = gameDimensions.width/3,
          bigSquareHeight = gameDimensions.height/3,
          positionX = bigSquareWidth/2,
          positionY = bigSquareHeight/2;
    for (let i = 0; i < 9; i++) {
        gameStatus.squares.push(this.add.rectangle(positionX, positionY, bigSquareWidth, bigSquareHeight).setStrokeStyle(2, 0x000000));
        positionX += bigSquareWidth;
        positionY += bigSquareHeight;

    }
}
