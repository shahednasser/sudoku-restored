import Phaser from "phaser";
//const sudoku = require('../sudoku');
const _ = require('lodash');

class Game extends Phaser.Scene {
    constructor(config) {
        super(config);
        this.gameStatus = { squares: [],
                            clickedSquare: {bigSquare: -1, smallSquare: -1}
                            };
        this.unsetClicked = this.unsetClicked.bind(this);
        this.setText = this.setText.bind(this);
    }

    init(data) {
        if(data.hasOwnProperty('gameDimensions')) {
            this.gameDimensions = data.gameDimensions;
        }
        if(data.hasOwnProperty('numberTextStyles')) {
            this.numberTextStyles = data.numberTextStyles;
        }
        if(data.hasOwnProperty('difficulty')) {
            this.difficulty = data.difficulty;
        }
    }

    create() {
        this.scale.pageAlignHorizontally = true;
        this.scale.pageAlignVertically = true;

        //generate game
        this.gameString = sudoku.generate(this.difficulty);
        this.gameBoard = sudoku.board_string_to_grid(this.gameString);
        this.solution = sudoku.solve(this.gameString);
        // this.gameBoard = sudoku.generate(this.difficulty);
         this.currentBoard = this.gameBoard;
        // this.solution = sudoku.solve(this.gameBoard);
         console.log("gameBoard", this.gameBoard);
         console.log("solution", this.solution);

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

                //adding text if available
                const ind = this.getGameBoardInd(i, k);
                // if(this.gameBoard.hasOwnProperty(ind)) {
                //    this.setText(i, k, square.x, square.y, this.gameBoard[ind]);
                //    continue;
                // }
                if(this.gameBoard[ind.row][ind.col] !== ".") {
                   this.setText(i, k, square.x, square.y, this.gameBoard[ind.row][ind.col]);
                   square.setFillStyle(0xf1f3f6);
                   continue;
                }

                //make interactive
                this.gameStatus.squares[i].smallSquares[k].square.setInteractive({
                    useHandCursor: true
                });
                //add pointer events
                const self = this;
                this.gameStatus.squares[i].smallSquares[k].square.on('pointerover', function(pointer, localX, localY, event) {
                    if(self.gameStatus.clickedSquare.bigSquare === -1 && self.gameStatus.clickedSquare.smallSquare === -1){
                        this.square.setFillStyle(0xf3f5f8);
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
                        this.square.setFillStyle(0xd5dde6);
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
                        break;
                    }
                } else {
                    if(value[0].isDown || value[1].isDown) {
                        if(squareObj.text !== null) {
                            squareObj.text.setText(key);
                        } else {
                         this.setText(this.gameStatus.clickedSquare.bigSquare, this.gameStatus.clickedSquare.smallSquare, squareObj.square.x, squareObj.square.y, key);
                         const ind = this.getGameBoardInd(this.gameStatus.clickedSquare.bigSquare, this.gameStatus.clickedSquare.smallSquare);
                         //this.currentBoard[ind] = key;
                         this.currentBoard[ind.row][ind.col] = key;
                        }
                        this.unsetClicked();
                        break;
                    }
                }
            }
        }

        //check if game is successfully finished
        // if(_.isEqual(this.currentBoard, this.solution)) {
        //     //game won
        //     console.log("you won");
        // }
        const currentBoardString = sudoku.board_grid_to_string(this.currentBoard);
        if(currentBoardString === this.solution) {
            //game won
            //add overlay
            this.add.rectangle(400, 400, this.gameDimensions.width, this.gameDimensions.height, 0xFFFFFF, 0.5);
            //add text
            this.add.text((this.gameDimensions.width / 2) - 225, (this.gameDimensions.height / 2) - 70, 'You won', {color: '#222', fontFamily: 'Georgia', fontSize: '120px'});
        }
    }

    unsetClicked() {
        this.gameStatus.squares[this.gameStatus.clickedSquare.bigSquare].smallSquares[this.gameStatus.clickedSquare.smallSquare].square.setFillStyle(0xFFFFFF);
        this.gameStatus.clickedSquare.bigSquare = -1;
        this.gameStatus.clickedSquare.smallSquare = -1;
    }

    setText(i, k,squareX, squareY, number) {
        this.gameStatus.squares[i].smallSquares[k].text = this.add.text(squareX - 20, squareY - 30, number, this.numberTextStyles);
    }

    getGameBoardInd(bigSquareInd, smallSquareInd) {
        let ind = {row: (Math.floor(bigSquareInd / 3) * 3) + Math.floor(smallSquareInd / 3), //add + 1 for other library
                col: ((bigSquareInd % 3) * 3) + (smallSquareInd % 3)};
        //get col as letter
        // switch(ind.col) {
        //     case 0: ind.col = "A"; break;
        //     case 1: ind.col = "B"; break;
        //     case 2: ind.col = "C"; break;
        //     case 3: ind.col = "D"; break;
        //     case 4: ind.col = "E"; break;
        //     case 5: ind.col = "F"; break;
        //     case 6: ind.col = "G"; break;
        //     case 7: ind.col = "H"; break;
        //     case 8: ind.col = "I"; break;
        // }
        return ind;
        //return ind.col + ind.row;
    }
}

export default Game;