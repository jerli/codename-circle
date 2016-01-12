/**
 * Created by jerry on 2015-12-27.
 */
//this game will have only 1 state

//var game = new Phaser.Game(360, 640, Phaser.AUTO, 'game test',{ preload: preload, create: create, update: update });
var game = new Phaser.Game(window.innerWidth * window.devicePixelRatio, window.innerHeight * window.devicePixelRatio, Phaser.AUTO,
     'game test',{ preload: preload, create: create, update: update });

function preload() {

    game.load.image('ball', 'assets/sprites/ball.png');
    game.load.image('enemy', 'assets/sprites/enemy.png');
    game.load.audio('club_thump', ['assets/audio/club_thump.ogg']);


}

var sprite;
var score = 0;
var scoreText;
var hsText;
var introText;
var enemies;
var music;
var graphics;
var introBox;
var edge;
var logo;

function create() {

    //scaling options

    this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;

    //have the game centered horizontally

    this.scale.pageAlignHorizontally = true;

    this.scale.pageAlignVertically = true;

    //screen size will be set automatically

    this.scale.updateLayout(true);

    this.scale.refresh();

    game.stage.backgroundColor = '#36382E';
    edge = Math.min(game.world.width, game.world.height);
    var scale = Math.min(game.world.width, game.world.height) * .1 / 128;
    //sprite.width = game.world.width * .08
    //sprite.scale.y = sprite.scale.x;

    music = game.add.audio('club_thump');
    music.loop = true;
    music.play();
    music.mute = true;
    enemies = game.add.group();
    enemies.enableBody = true;

    introText = game.add.text(game.world.centerX, game.world.height / 4, "welcome!\ntouch to begin",
        { fontSize: 70 * scale, align: 'center', fill: '#EDE6E3'});
    introText.x = game.world.centerX - introText.width/2;
    introText.font = 'quicksandlight';


    scoreText = game.add.text(0.03*edge, 0.03*edge, 'score: 0', { fontSize: 70 * scale, fill: '#EDE6E3'});
    if (localStorage.highScore) {
        hsText =  game.add.text(0.03*edge, 0.033*edge + scoreText.height, 'top score: ' + localStorage.highScore,
            { fontSize: 70 * scale, fill: '#EDE6E3'});
    }
    else {
        hsText = game.add.text(0.03*edge, 0.033*edge + scoreText.height, 'top score: 0',
            { fontSize: 70 * scale, fill: '#EDE6E3'});
        var highScore = 0;
    }
    hsText.font = 'quicksandlight';
    scoreText.font = 'quicksandlight';

    graphics = game.add.graphics(0, 0);
    graphics.lineStyle(scale*4, 0xEDE6E3, 1);
    graphics.drawRoundedRect(0.01*edge, 0.01*edge,
        hsText.width*1.2, scoreText.height*2 + 0.05 * edge, 1.5);

    introBox = game.add.graphics(0, 0);
    introBox.lineStyle(scale*4, 0xEDE6E3, 1);
    introBox.drawRoundedRect(game.world.centerX - introText.width/2, game.world.height * 0.95/4,
        introText.width*1.1, introText.height*1.3, 1.5);
    introBox.alpha = 0;

    s = this.game.add.tween(introBox);
    s.onComplete.add(onComplete, this);


    introText.alpha = 0;
    game.add.tween(introText).to( { alpha: 1 }, 1000, "Linear", true);
    s.to({ alpha: 1 }, 1000, "Linear", true);

    }

function onComplete() {

    sprite = game.add.sprite(game.world.centerX, game.world.centerY, 'ball');
    sprite.anchor.setTo(0.5);
    edge = Math.min(game.world.width, game.world.height);

    var scale = Math.min(game.world.width, game.world.height) * .1 / 128;
    sprite.scale.setTo(scale, scale);
    game.physics.enable(sprite, Phaser.Physics.ARCADE);
    sprite.body.setSize(0.85 * sprite.width, 0.85 * sprite.width, 0.075*sprite.width, 0.075*sprite.width);
    sprite.alpha = 0;
    b = this.game.add.tween(sprite);
    b.to({ alpha: 1 }, 1000, "Linear", true);
    game.input.onDown.addOnce(summonEnemies, this);
}

function summonEnemies() {
    game.time.events.repeat(Phaser.Timer.SECOND * 0.3, 5000, createEnemy, this);
    introText.destroy();
    introBox.kill();
    music.mute = false;
    music.fadeIn(2000);
    music.loop = true;

}

function createEnemy() {
    var rand = Math.random();
    rand *= 4;
    rand = Math.floor(rand);

    var scale = Math.min(game.world.width, game.world.height) * .1 / 128;

    if (rand == 0) {
        var enemy = enemies.create(-42, game.world.randomY, 'enemy');
        //enemy.width = game.world.width * .08
        //enemy.scale.y = enemy.scale.x;
        game.physics.enable(enemy, Phaser.Physics.ARCADE);
        enemy.body.velocity.x = 500 * scale;
        enemy.body.velocity.y = (Math.random() * 2 - 1) * 300 * scale;

    }
    else if (rand == 1) {
        var enemy = enemies.create(game.world.width + 42, game.world.randomY, 'enemy');
        game.physics.enable(enemy, Phaser.Physics.ARCADE);
        enemy.body.velocity.x = -500 * scale;
        ;
        enemy.body.velocity.y = (Math.random() * 2 - 1) * 300 * scale;


    }
    else if (rand == 2) {
        var enemy = enemies.create(game.world.randomX, -42, 'enemy');
        game.physics.enable(enemy, Phaser.Physics.ARCADE);
        enemy.body.velocity.y = 500 * scale;
        enemy.body.velocity.x = (Math.random() * 2 - 1) * 300 * scale;

    }
    else if (rand == 3) {
        var enemy = enemies.create(game.world.randomX, game.world.height + 42, 'enemy');
        game.physics.enable(enemy, Phaser.Physics.ARCADE);
        enemy.body.velocity.y = -500 * scale;
        enemy.body.velocity.x = (Math.random() * 2 - 1) * 300 * scale;
    }
    enemy.scale.setTo(scale, scale);
    score += 1;

    scoreText.text = 'score: ' + score;
    enemy.events.onOutOfBounds.add( goodbye, this );

    if (this.game.device.localStorage) {
        if (localStorage.highScore) {
            if (score > localStorage.highScore) {
                localStorage.highScore = score;
                hsText.text = 'top score: ' + localStorage.highScore;
            }
        }
        else {
            localStorage.highScore = score;
        }
    }
    else if (score >= highScore) {
        highScore = score
        hsText.text = 'top score: ' + highScore;
    }


}

function update() {
    var scale = Math.min(game.world.width, game.world.height) * .1 / 128;
    //  only move when you click
    if (sprite) {
        if (game.input.pointer1.isDown || game.input.mousePointer.isDown) {


            //  if it's overlapping the mouse, don't move any more
            if (Phaser.Rectangle.contains(sprite.body, game.input.x, game.input.y)) {
                sprite.body.velocity.setTo(0, 0);
            }
            else {
                //  400 is the speed it will move towards the mouse
                game.physics.arcade.moveToPointer(sprite, 800 * scale);
            }
        }
        else {
            sprite.body.velocity.setTo(0, 0);
        }
    }
    game.physics.arcade.overlap(sprite, enemies, gameOver, null, this);


}

function goodbye(obj) {
    obj.kill();
}

function gameOver() {
    graphics.kill();
    music.fadeOut(200);
    var scale = Math.min(game.world.width, game.world.height) * .1 / 128;
    scoreText.destroy();
    hsText.destroy();
    scoreText = game.add.text(game.world.centerX, game.world.centerY,
        'score: ' + score + '\ntop score: ' + localStorage.highScore + '\n\ngame over!\ntap to restart', { fontSize: 70 * scale,align: 'center', fill: '#EDE6E3'});
    scoreText.x = game.world.centerX - scoreText.width/2;
    scoreText.y = game.world.centerY - scoreText.height/2;
    scoreText.font = 'quicksandlight';

    graphics = game.add.graphics(0, 0);
    graphics.lineStyle(scale*4, 0xEDE6E3, 1);
    graphics.drawRoundedRect(game.world.centerX - scoreText.width/2, game.world.centerY - scoreText.height*1.2/2,
        scoreText.width* 1.1, scoreText.height*1.25, 1.5);
    graphics.alpha = 0;
    scoreText.alpha = 0;

    s = this.game.add.tween(graphics);

    game.add.tween(scoreText).to( { alpha: 1 }, 1000, "Linear", true);
    s.to({ alpha: 1 }, 1000, "Linear", true);

    sprite.kill();
    enemies.destroy();
    this.game.time.removeAll();


    game.input.onDown.addOnce(restart, this);

}

function restart() {
    var scale = Math.min(game.world.width, game.world.height) * .1 / 128;

    graphics.kill();
    scoreText.destroy();
    score = 0;
    scoreText = game.add.text(0.03*edge, 0.03*edge, 'score: 0', { fontSize: 70 * scale, fill: '#EDE6E3'});
    hsText =  game.add.text(0.03*edge, 0.033*edge + scoreText.height, 'top score: ' + localStorage.highScore,
        { fontSize: 70 * scale, fill: '#EDE6E3'});
    hsText.font = 'quicksandlight';
    scoreText.font = 'quicksandlight';
    graphics = game.add.graphics(0, 0);
    graphics.lineStyle(scale*4, 0xEDE6E3, 1);
    graphics.drawRoundedRect(0.01*edge, 0.01*edge,
        hsText.width*1.2, scoreText.height*2.6, 1.5);


    sprite.revive();
    enemies = game.add.group();
    enemies.enableBody = true;
    game.time.events.repeat(Phaser.Timer.SECOND * 0.3, 5000, createEnemy, this);
    music.fadeIn(2000);
    music.loop = true;


}