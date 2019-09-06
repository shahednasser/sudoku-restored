import Phaser from "phaser";

class Start extends Phaser.Scene {
    constructor(config) {
        super(config);
        this.difficulties = [{
            name: 'Easy',
            key: 'easy',
            textObject: null,
            positionX: 350
        }, {
            name: 'Medium',
            key: 'medium',
            textObject: null,
            positionX: 330
        }, {
            name: 'Hard',
            key: 'hard',
            textObject: null,
            positionX: 350
        }, {
            name: 'Very Hard',
            key: 'very-hard',
            textObject: null,
            positionX: 320
        }];
    }

    init(data) {
        this.data = data;
    }

    create() {
        this.scale.pageAlignHorizontally = true;
        this.scale.pageAlignVertically = true;

        //set background color
        this.cameras.main.setBackgroundColor(0xFFFFFF);
        this.add.text(220, 100, 'Sudoku', {color: '#222', fontFamily: 'Georgia', fontSize: '120px'});
        let textStyle = {color: '#222', fontFamily: 'Arial', fontSize: '30px'};
        this.add.text(300, 220, 'Select difficulty', textStyle);

        textStyle.padding = {left: 20, top: 10, right: 20, bottom: 10};

        let positionY = 300;

        const self = this;
        for(let i = 0; i < this.difficulties.length; i++) {
            this.difficulties[i].textObject = this.add.text(this.difficulties[i].positionX, positionY, this.difficulties[i].name, textStyle);
            this.difficulties[i].textObject.setInteractive({
                    useHandCursor: true
                });

            this.difficulties[i].textObject.on('pointerover', function() {
                self.difficulties[i].textObject.setBackgroundColor('#F0F8FF');
            }, {i});

            this.difficulties[i].textObject.on('pointerout', function() {
                self.difficulties[i].textObject.setBackgroundColor('#FFFFFF');
            }, {i});

            this.difficulties[i].textObject.on('pointerup', function() {
                //change scene
                self.scene.start('game', {difficulty: self.difficulties[i].key, ...self.data});
            }, {i});

            //update position
            positionY += 60;
        }
    }
}

export default Start;