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

}

var sprite;
var score = 0;
var scoreText;

function create() {

    //scaling options

    this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;

    //have the game centered horizontally

    this.scale.pageAlignHorizontally = true;

    this.scale.pageAlignVertically = true;

    //screen size will be set automatically

    this.scale.updateLayout(true);

    game.stage.backgroundColor = '#E5DCC5';
    sprite = game.add.sprite(game.world.centerX, game.world.centerY, 'ball');
    sprite.anchor.setTo(0.5);
    var scale = Math.min(game.world.width, game.world.height) * .1 / 128;
    //sprite.width = game.world.width * .08
    //sprite.scale.y = sprite.scale.x;
    sprite.scale.setTo(scale, scale);
    game.physics.enable(sprite, Phaser.Physics.ARCADE);

    enemies = game.add.group();
    enemies.enableBody = true;

    game.input.onDown.addOnce(summonEnemies, this);

    scoreText = game.add.text(16, 16, 'score: 0', { fontSize: 100 * scale, fill: '#C14953'})

}

function summonEnemies() {
    game.time.events.repeat(Phaser.Timer.SECOND * 0.3, 5000, createEnemy, this);
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

}

function update() {
    var scale = Math.min(game.world.width, game.world.height) * .1 / 128;
    //  only move when you click
    if (game.input.pointer1.isDown || game.input.mousePointer.isDown)
    {


        //  if it's overlapping the mouse, don't move any more
        if (Phaser.Rectangle.contains(sprite.body, game.input.x, game.input.y))
        {
            sprite.body.velocity.setTo(0, 0);
        }
        else
        {
            //  400 is the speed it will move towards the mouse
            game.physics.arcade.moveToPointer(sprite, 800 * scale);
        }
    }
    else
    {
        sprite.body.velocity.setTo(0, 0);
    }

    game.physics.arcade.overlap(sprite, enemies, gameOver, null, this);



}

function goodbye(obj) {
    obj.kill();
}

function gameOver() {

    var scale = Math.min(game.world.width, game.world.height) * .1 / 128;
    scoreText.destroy();
    scoreText = game.add.text(game.world.centerX, game.world.centerY,
        'Score:' + score + '\nGame Over!\nTap to Restart', { fontSize: 100 * scale,align: 'center', fill: '#C14953',});
    scoreText.x = game.world.centerX - scoreText.width/2
    scoreText.y = game.world.centerY - scoreText.height/2

    sprite.kill();
    this.game.time.removeAll();

    game.input.onDown.addOnce(restart, this);

}

function restart() {
    var scale = Math.min(game.world.width, game.world.height) * .1 / 128;

    scoreText.destroy();
    score = 0;
    scoreText = game.add.text(16, 16, 'score: 0', { fontSize: 100 * scale, fill: '#C14953'});

    sprite.revive();
    game.time.events.repeat(Phaser.Timer.SECOND * 0.3, 200, createEnemy, this);


}