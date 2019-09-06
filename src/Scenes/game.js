import Phaser from "phaser";

class Game extends Phaser.Scene {
    constructor(config) {
        super(config);
        this.gameStatus = { squares: [],
                            clickedSquare: {bigSquare: -1, smallSquare: -1}
                            };
        this.unsetClicked = this.unsetClicked.bind(this);
    }

    init(data) {
        if(data.hasOwnProperty('gameDimensions')) {
            this.gameDimensions = data.gameDimensions;
        }
        if(data.hasOwnProperty('numberTextStyles')) {
            this.numberTextStyles = data.numberTextStyles;
        }
    }

    create() {
        this.scale.pageAlignHorizontally = true;
        this.scale.pageAlignVertically = true;

        //add input controls
        this.gameStatus.keys = {
            1: [this.input.keyboard.addKey('ONE'), this.input.keyboard.addKey('NUMPAD_ONE')],
            2: [this.input.keyboard.addKey('TWO'), this.input.keyboard.addKey('NUMPAD_TWO')],
            3: [this.input.keyboard.addKey('THREE'), this.input.keyboard.addKey('NUMPAD_THREE')],
            4: [this.input.keyboard.addKey('FOUR'), this.input.keyboard.addKey('NUMPAD_FOUR')],
            5: [this.input.keyboard.addKey('FIVE'), this.input.keyboard.addKey('NUMPAD_FIVE')],
            6: [this.input.keyboard.addKey('SIX'), this.input.keyboard.addKey('NUMPAD_SIX')],
            7: [this.input.keyboard.addKey('SEVEN'), this.input.keyboard.addKey('NUMPAD_SEVEN')],
            8: [this.input.keyboard.addKey('EIGHT'), this.input.keyboard.addKey('NUMPAD_EIGHT')],
            9: [this.input.keyboard.addKey('NINE'), this.input.keyboard.addKey('NUMPAD_NINE')],
            backspace: this.input.keyboard.addKey('BACKSPACE')
        }

        const bigSquareWidth = this.gameDimensions.width/3,
            bigSquareHeight = this.gameDimensions.height/3,
            smallSquareWidth = bigSquareWidth/3,
            smallSquareHeight = bigSquareHeight/3;
        let positionX = bigSquareWidth/2,
            positionY = bigSquareHeight/2;
        for (let i = 0; i < 9; i++) {
            //add the big square
            const bigSquare = this.add.rectangle(positionX, positionY, bigSquareWidth, bigSquareHeight, 0xffffff).setStrokeStyle(2, 0x000000);
            this.gameStatus.squares.push({bigSquare, smallSquares: []});
            const initialPositionX = positionX - (bigSquareWidth/2) + (smallSquareWidth/2);
            let smallSquarePositionX = initialPositionX,
                smallSquarePositionY = positionY - (bigSquareHeight/2) + (smallSquareHeight/2);
            //add the small squares
            for(let k = 0; k < 9; k ++) {
                const square = this.add.rectangle(smallSquarePositionX, smallSquarePositionY, smallSquareWidth,
                                                    smallSquareHeight, 0xFFFFFF).setStrokeStyle(1, 0xd3d3d3);
                this.gameStatus.squares[i].smallSquares.push({square, text: null});
                if(k === 2 || k === 5) {
                    smallSquarePositionY += smallSquareHeight;
                    smallSquarePositionX = initialPositionX;
                } else {
                    smallSquarePositionX += smallSquareWidth;
                }
                //make interactive
                this.gameStatus.squares[i].smallSquares[k].square.setInteractive({
                    useHandCursor: true
                });
                //add pointer events
                const self = this;
                this.gameStatus.squares[i].smallSquares[k].square.on('pointerover', function(pointer, localX, localY, event) {
                    if(self.gameStatus.clickedSquare.bigSquare === -1 && self.gameStatus.clickedSquare.smallSquare === -1){
                        this.square.setFillStyle(0xF0F8FF);
                    }
                }, {square: this.gameStatus.squares[i].smallSquares[k].square});

                this.gameStatus.squares[i].smallSquares[k].square.on('pointerout', function(pointer, localX, localY, event){
                    if(self.gameStatus.clickedSquare.bigSquare === -1 && self.gameStatus.clickedSquare.smallSquare === -1){
                        this.square.setFillStyle(0xFFFFFF);
                    }
                }, {square: this.gameStatus.squares[i].smallSquares[k].square});

                this.gameStatus.squares[i].smallSquares[k].square.on('pointerup', function(pointer, localX, localY, event){
                    if(self.gameStatus.clickedSquare.bigSquare !== -1 && self.gameStatus.clickedSquare.smallSquare !== -1) {
                        self.unsetClicked();

                    } else {
                        self.gameStatus.clickedSquare.bigSquare = this.bigSquare;
                        self.gameStatus.clickedSquare.smallSquare = this.smallSquare;
                    }
                }, {square: this.gameStatus.squares[i].smallSquares[k].square, bigSquare: i, smallSquare: k});
            }
            if(i === 2 || i === 5) {
                positionY += bigSquareHeight;
                positionX = bigSquareWidth/2;
            } else {
                positionX += bigSquareWidth;
            }
        }
    }

    update() {
        if(this.gameStatus.clickedSquare.bigSquare === -1 && this.gameStatus.clickedSquare.smallSquare === -1) {
            return;
        }
        let squareObj = this.gameStatus.squares[this.gameStatus.clickedSquare.bigSquare].smallSquares[this.gameStatus.clickedSquare.smallSquare];
        for(let key in this.gameStatus.keys) {
            if(this.gameStatus.keys.hasOwnProperty(key)) {
                let value = this.gameStatus.keys[key];
                if(key === "backspace") {
                    if(value.isDown && squareObj.text !== null) {
                        squareObj.text.setText('');
                        this.unsetClicked();
                        return;
                    }
                } else {
                    if(value[0].isDown || value[1].isDown) {
                        if(squareObj.text !== null) {
                            squareObj.text.setText(key);
                        } else {
                        this.gameStatus.squares[this.gameStatus.clickedSquare.bigSquare].smallSquares[this.gameStatus.clickedSquare.smallSquare].text = this.add.text(squareObj.square.x - 20, squareObj.square.y - 30, key, this.numberTextStyles);
                        }
                        this.unsetClicked();
                        return;
                    }
                }
            }
        }
    }

    unsetClicked() {
        this.gameStatus.squares[this.gameStatus.clickedSquare.bigSquare].smallSquares[this.gameStatus.clickedSquare.smallSquare].square.setFillStyle(0xFFFFFF);
        this.gameStatus.clickedSquare.bigSquare = -1;
        this.gameStatus.clickedSquare.smallSquare = -1;
    }
}

export default Game;