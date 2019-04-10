'use strict';

const WIDTH = window.innerWidth;
const HEIGHT = window.innerHeight;
const GRAVITY = 1000;
const START_X = 100;
const START_Y = HEIGHT/2;
let SPACE = -200;
let SPEED = 2000;

const mainState = {
    restartGame: () => {
        SPACE = -200;
        SPEED = 2000;
        game.state.start('main')
    },
    jump: ()  => this.ball.body.velocity.y = -HEIGHT/2.5,
    incrementPoints: (ball, holes) => {
        holes.kill();
        this.score++;
        this.labelScore.text = this.score;  
    },
    generateBlock: (x, y) => {
        const block = game.add.sprite(x, y, 'block');
        this.blocks.add(block);
        game.physics.arcade.enable(block);
    
        block.body.velocity.x = SPACE; 
    
        block.checkWorldBounds = true;
        block.outOfBoundsKill = true;
    },
    generateHole: (x, y) => {
        const hole = game.add.sprite(x, y, 'hole');
        this.holes.add(hole);
        game.physics.arcade.enable(hole);
    
        hole.body.velocity.x = SPACE;

        hole.collideWorldBounds = true;
        hole.outOfBoundsKill = true;
    },
    generateRowOfBlocks: () => {
        const maxBlocks = Math.floor(HEIGHT/50);
        const emptyBlock = Math.floor(Math.random() * maxBlocks/2) + 3;

        for (let i = 0; i <= maxBlocks; i++) {
            if (i != emptyBlock && i != emptyBlock + 1 && i != emptyBlock + 2 && i != emptyBlock -1) {
                mainState.generateBlock(WIDTH, i * 50);
            } else {
                mainState.generateHole(WIDTH, i * 50);
            }
        }
    },
    preload: () => {
        game.load.image('ball', 'asset/ball.png'); 
        game.load.image('block', 'asset/block.png');
        game.load.image('hole', 'asset/hole.png');
    },
    create: () => {
        game.stage.backgroundColor = '#0da2d8';
        game.physics.startSystem(Phaser.Physics.ARCADE);
    
        this.ball = game.add.sprite(START_X, START_Y, 'ball');
        game.physics.arcade.enable(this.ball);
        
        this.ball.body.gravity.y = GRAVITY;  
        
        const spaceKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        spaceKey.onDown.add(mainState.jump, this);

        this.blocks = game.add.group();
        this.holes = game.add.group();

        this.score = 0;
        this.labelScore = game.add.text(30, 30, "0", {font: "32px Arial", fill: "#ffffff" });

        this.timer = game.time.events.loop(SPEED, mainState.generateRowOfBlocks, this); 
    },
    update: () => {
        if (this.ball.y < 0 || this.ball.y > HEIGHT) {
            mainState.restartGame();
        }

        if (this.score % 5 === 0 && this.score !== 0) {
            game.stage.backgroundColor = Phaser.Color.getRandomColor(50, 255, 255);
            SPEED += 400;
            SPACE -= 20;
            this.score++;
        }

        game.physics.arcade.overlap(this.ball, this.blocks, mainState.restartGame, null, this);
        game.physics.arcade.overlap(this.ball, this.holes, mainState.incrementPoints, null, this);
    }
};

const game = new Phaser.Game(WIDTH, HEIGHT);

game.state.add('main', mainState); 
game.state.start('main');