import Phaser from "phaser";

const gameDimensions = {
    width: 800,
    height: 800
};

const gameStatus = {
    squares: [],
    clickedSquare: {bigSquare: -1, smallSquare: -1}
};

const config = {
  type: Phaser.AUTO,
  parent: "sudoku-game",
  scale: {
    parent: 'game',
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: gameDimensions.width,
    height: gameDimensions.height
  },
  scene: {
    preload: preload,
    create: create
  }
};

const game = new Phaser.Game(config);

function preload() {
}

function create() {
    game.scale.pageAlignHorizontally = true;
    game.scale.pageAlignVertically = true;

    const bigSquareWidth = gameDimensions.width/3,
          bigSquareHeight = gameDimensions.height/3,
          smallSquareWidth = bigSquareWidth/3,
          smallSquareHeight = bigSquareHeight/3;
    let positionX = bigSquareWidth/2,
        positionY = bigSquareHeight/2;
    for (let i = 0; i < 9; i++) {
        //add the big square
        const bigSquare = this.add.rectangle(positionX, positionY, bigSquareWidth, bigSquareHeight, 0xffffff).setStrokeStyle(2, 0x000000);
        gameStatus.squares.push({bigSquare, smallSqaures: []});
        const initialPositionX = positionX - (bigSquareWidth/2) + (smallSquareWidth/2);
        let smallSquarePositionX = initialPositionX,
            smallSquarePositionY = positionY - (bigSquareHeight/2) + (smallSquareHeight/2);
        //add the small squares
        for(let k = 0; k < 9; k ++) {
            const square = this.add.rectangle(smallSquarePositionX, smallSquarePositionY, smallSquareWidth,
                                                smallSquareHeight, 0xFFFFFF).setStrokeStyle(1, 0xd3d3d3);
            gameStatus.squares[i].smallSqaures.push(square);
            if(k === 2 || k === 5) {
                smallSquarePositionY += smallSquareHeight;
                smallSquarePositionX = initialPositionX;
            } else {
                smallSquarePositionX += smallSquareWidth;
            }
            //make interactive
            gameStatus.squares[i].smallSqaures[k].setInteractive({
                useHandCursor: true
            });
            //add pointer events
            gameStatus.squares[i].smallSqaures[k].on('pointerover', function(pointer, localX, localY, event) {
                if(gameStatus.clickedSquare.bigSquare === -1 && gameStatus.clickedSquare.smallSquare === -1){
                    square.setFillStyle(0xF0F8FF);
                }
            }, {square: gameStatus.squares[i].smallSqaures[k]});

            gameStatus.squares[i].smallSqaures[k].on('pointerout', function(pointer, localX, localY, event){
                if(gameStatus.clickedSquare.bigSquare === -1 && gameStatus.clickedSquare.smallSquare === -1){
                    square.setFillStyle(0xFFFFFF);
                }
            }, {square: gameStatus.squares[i].smallSqaures[k]});

            gameStatus.squares[i].smallSqaures[k].on('pointerup', function(pointer, localX, localY, event){
                if(gameStatus.clickedSquare.bigSquare !== -1 && gameStatus.clickedSquare.smallSquare !== -1) {
                    gameStatus.squares[gameStatus.clickedSquare.bigSquare].smallSquares[gameStatus.clickedSquare.smallSquare].setFillStyle(0xFFFFFF);
                    gameStatus.clickedSquare.bigSquare = -1;
                    gameStatus.clickedSquare.smallSquare = -1;

                } else {
                    gameStatus.clickedSquare.bigSquare = bigSquare;
                    gameStatus.clickedSquare.smallSquare = smallSquare;
                }
            }, {square: gameStatus.squares[i].smallSqaures[k], bigSquare: i, smallSquare: k});
        }
        if(i === 2 || i === 5) {
            positionY += bigSquareHeight;
            positionX = bigSquareWidth/2;
        } else {
            positionX += bigSquareWidth;
        }
    }
}