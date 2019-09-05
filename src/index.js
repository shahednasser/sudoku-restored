import Phaser from "phaser";

const gameDimensions = {
    width: 800,
    height: 800
};

const numberTextStyles = {
    fontSize: '60px',
    color: '#000',
    align: 'center'
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
    create: create,
    update: update
  }
};

const game = new Phaser.Game(config);

function preload() {
}

function create() {
    game.scale.pageAlignHorizontally = true;
    game.scale.pageAlignVertically = true;

    //add input controls
    gameStatus.keys = {
        1: [this.input.keyboard.addKey('ONE'), this.input.keyboard.addKey('NUMPAD_ONE')],
        2: [this.input.keyboard.addKey('TWO'), this.input.keyboard.addKey('NUMPAD_TWO')],
        3: [this.input.keyboard.addKey('THREE'), this.input.keyboard.addKey('NUMPAD_THREE')],
        4: [this.input.keyboard.addKey('FOUR'), this.input.keyboard.addKey('NUMPAD_FOUR')],
        5: [this.input.keyboard.addKey('FIVE'), this.input.keyboard.addKey('NUMPAD_FIVE')],
        6: [this.input.keyboard.addKey('SIX'), this.input.keyboard.addKey('NUMPAD_SIX')],
        7: [this.input.keyboard.addKey('SEVEN'), this.input.keyboard.addKey('NUMPAD_SEVEN')],
        8: [this.input.keyboard.addKey('EIGHT'), this.input.keyboard.addKey('NUMPAD_EIGHT')],
        9: [this.input.keyboard.addKey('NINE'), this.input.keyboard.addKey('NUMPAD_NINE')],
    }

    const bigSquareWidth = gameDimensions.width/3,
          bigSquareHeight = gameDimensions.height/3,
          smallSquareWidth = bigSquareWidth/3,
          smallSquareHeight = bigSquareHeight/3;
    let positionX = bigSquareWidth/2,
        positionY = bigSquareHeight/2;
    for (let i = 0; i < 9; i++) {
        //add the big square
        const bigSquare = this.add.rectangle(positionX, positionY, bigSquareWidth, bigSquareHeight, 0xffffff).setStrokeStyle(2, 0x000000);
        gameStatus.squares.push({bigSquare, smallSquares: []});
        const initialPositionX = positionX - (bigSquareWidth/2) + (smallSquareWidth/2);
        let smallSquarePositionX = initialPositionX,
            smallSquarePositionY = positionY - (bigSquareHeight/2) + (smallSquareHeight/2);
        //add the small squares
        for(let k = 0; k < 9; k ++) {
            const square = this.add.rectangle(smallSquarePositionX, smallSquarePositionY, smallSquareWidth,
                                                smallSquareHeight, 0xFFFFFF).setStrokeStyle(1, 0xd3d3d3);
            gameStatus.squares[i].smallSquares.push(square);
            if(k === 2 || k === 5) {
                smallSquarePositionY += smallSquareHeight;
                smallSquarePositionX = initialPositionX;
            } else {
                smallSquarePositionX += smallSquareWidth;
            }
            //make interactive
            gameStatus.squares[i].smallSquares[k].setInteractive({
                useHandCursor: true
            });
            //add pointer events
            gameStatus.squares[i].smallSquares[k].on('pointerover', function(pointer, localX, localY, event) {
                if(gameStatus.clickedSquare.bigSquare === -1 && gameStatus.clickedSquare.smallSquare === -1){
                    this.square.setFillStyle(0xF0F8FF);
                }
            }, {square: gameStatus.squares[i].smallSquares[k]});

            gameStatus.squares[i].smallSquares[k].on('pointerout', function(pointer, localX, localY, event){
                if(gameStatus.clickedSquare.bigSquare === -1 && gameStatus.clickedSquare.smallSquare === -1){
                    this.square.setFillStyle(0xFFFFFF);
                }
            }, {square: gameStatus.squares[i].smallSquares[k]});

            gameStatus.squares[i].smallSquares[k].on('pointerup', function(pointer, localX, localY, event){
                if(gameStatus.clickedSquare.bigSquare !== -1 && gameStatus.clickedSquare.smallSquare !== -1) {
                    gameStatus.squares[gameStatus.clickedSquare.bigSquare].smallSquares[gameStatus.clickedSquare.smallSquare].setFillStyle(0xFFFFFF);
                    gameStatus.clickedSquare.bigSquare = -1;
                    gameStatus.clickedSquare.smallSquare = -1;

                } else {
                    gameStatus.clickedSquare.bigSquare = this.bigSquare;
                    gameStatus.clickedSquare.smallSquare = this.smallSquare;
                }
            }, {square: gameStatus.squares[i].smallSquares[k], bigSquare: i, smallSquare: k});
        }
        if(i === 2 || i === 5) {
            positionY += bigSquareHeight;
            positionX = bigSquareWidth/2;
        } else {
            positionX += bigSquareWidth;
        }
    }
}

function update() {
    if(gameStatus.clickedSquare.bigSquare === -1 && gameStatus.clickedSquare.smallSquare === -1) {
        return;
    }
    for(let key in gameStatus.keys) {
        if(gameStatus.keys.hasOwnProperty(key)) {
            let value = gameStatus.keys[key];
            if(value[0].isDown || value[1].isDown) {
                this.add.text(gameStatus.squares[gameStatus.clickedSquare.bigSquare].smallSquares[gameStatus.clickedSquare.smallSquare].x,
                                gameStatus.squares[gameStatus.clickedSquare.bigSquare].smallSquares[gameStatus.clickedSquare.smallSquare].y,
                                key, numberTextStyles);
                return;
            }
        }
    }
}