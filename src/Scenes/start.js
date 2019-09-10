import Phaser from "phaser";

class Start extends Phaser.Scene {
    constructor(config) {
        super(config);
        this.difficulties = [{
            name: 'Easy',
            key: 'easy',
            textObject: null,
            positionX: 450
        }, {
            name: 'Medium',
            key: 'medium',
            textObject: null,
            positionX: 430
        }, {
            name: 'Hard',
            key: 'hard',
            textObject: null,
            positionX: 450
        },
        // {
        //     name: 'Very Hard',
        //     key: 'very-hard',
        //     textObject: null,
        //     positionX: 420
        // }
        ];
    }

    init(data) {
        this.data = data;
    }

    create() {
        this.scale.pageAlignHorizontally = true;
        this.scale.pageAlignVertically = true;

        //set background color
        this.cameras.main.setBackgroundColor(0xFFFFFF);
        this.add.text(300, 240, 'Sudoku', {color: '#222', fontFamily: 'Georgia', fontSize: '120px'});
        let textStyle = {color: '#222', fontFamily: 'Arial', fontSize: '30px'};
        this.add.text(400, 360, 'Select difficulty', textStyle);

        textStyle.padding = {left: 20, top: 10, right: 20, bottom: 10};

        let positionY = 440;
        for(let i = 0; i < this.difficulties.length; i++) {
            this.difficulties[i].textObject = this.add.text(this.difficulties[i].positionX, positionY, this.difficulties[i].name, textStyle);
            this.difficulties[i].textObject.setInteractive({
                    useHandCursor: true
                });

            this.difficulties[i].textObject.on('pointerover', function() {
                this.self.difficulties[i].textObject.setBackgroundColor('#f3f5f8');
            }, {i, self: this});

            this.difficulties[i].textObject.on('pointerout', function() {
                this.self.difficulties[i].textObject.setBackgroundColor('#FFFFFF');
            }, {i, self: this});

            this.difficulties[i].textObject.on('pointerup', function() {
                //change scene
                this.self.scene.start('game', {difficulty: this.self.difficulties[i].key, ...this.self.data});
            }, {i, self: this});

            //update position
            positionY += 60;
        }
    }
}

export default Start;