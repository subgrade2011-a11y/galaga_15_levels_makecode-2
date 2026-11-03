namespace SpriteKind {
    export const AlienLaser = SpriteKind.create()
    export const PowerUp = SpriteKind.create()
}
sprites.onOverlap(SpriteKind.Player, SpriteKind.PowerUp, function (ship, power2) {
    power2.destroy(effects.hearts, 100)
    if (info.life() < 5) {
        info.changeLifeBy(1)
    } else {
        info.changeScoreBy(200)
    }
})
controller.B.onEvent(ControllerButtonEvent.Pressed, function () {
    if (!(waveActive) || !(specialReady)) {
        return
    }
    specialReady = false
    for (let angle = -2; angle <= 2; angle++) {
        let laser2 = sprites.createProjectileFromSprite(img`
9 9
9 9
9 9
9 9
`, player, angle * 45, -130)
        laser2.setKind(SpriteKind.Projectile)
    }
player2.startEffect(effects.trail, 400)
    pause(4000)
    specialReady = true
})
controller.A.onEvent(ControllerButtonEvent.Pressed, function () {
    if (!(waveActive)) {
        return
    }
    laser = sprites.createProjectileFromSprite(img`
        8 
        8 
        8 
        8 
        `, player2, 0, -150)
    laser.setKind(SpriteKind.Projectile)
    music.pewPew.play()
})
sprites.onOverlap(SpriteKind.Player, SpriteKind.AlienLaser, function (ship, laser) {
    laser.destroy()
    damagePlayer()
})
function damagePlayer () {
    if (shield > 0) {
        return
    }
    shield = 1
    info.changeLifeBy(-1)
    player2.startEffect(effects.spray, 300)
    pause(900)
    shield = 0
}
sprites.onOverlap(SpriteKind.Player, SpriteKind.Enemy, function (ship, enemy) {
    damagePlayer()
    finishEnemy(enemy)
})
function spawnAlien () {
    boss = level % 5 == 0 && spawned == waveSize - 1
    _type = level % 3
    alien = sprites.create(alienImage(_type), SpriteKind.Enemy)
    alien.setPosition(12 + spawned % 8 * 19, -8)
    alien.vy = 14 + level * 2
    alien.vx = (spawned % 2 == 0 ? 1 : -1) * (14 + level * 2)
    alien.setBounceOnWall(true)
    alienSprites.push(alien)
    alienHP.push(boss ? 10 + level : (level >= 10 ? 3 : level >= 5 ? 2 : 1))
    alienBoss.push(boss ? 1 : 0)
    if (boss) {
        alien.setImage(img`
            . . . . . 4 4 4 4 . . . . . 
            . . . 4 4 2 2 2 2 4 4 . . . 
            . . 4 2 2 2 2 2 2 2 2 4 . . 
            . 4 2 2 1 2 2 2 1 2 2 2 4 . 
            4 2 2 2 2 2 2 2 2 2 2 2 2 4 
            4 2 4 2 2 2 2 2 2 2 4 2 2 4 
            . 4 . 4 4 2 2 2 2 4 4 . 4 . 
            . . . . 4 . 4 4 . 4 . . . . 
            `)
        alien.vy = 10
    }
    spawned += 1
}
sprites.onOverlap(SpriteKind.Projectile, SpriteKind.Enemy, function (laser, enemy) {
    laser.destroy()
    idx2 = alienSprites.indexOf(enemy)
    if (idx2 < 0) {
        return
    }
    alienHP[idx2] -= 1
hp = alienHP[idx2]
    enemy.startEffect(effects.spray, 60)
    if (hp <= 0) {
        finishEnemy(enemy)
    }
})
function beginWave () {
    waveActive = true
    transitioning = false
    spawned = 0
    destroyed = 0
    waveSize = 6 + level * 2
    if (level % 5 == 0) {
        waveSize = 7 + level
    }
    game.splash("LEVEL " + level, level % 5 == 0 ? "BOSS WAVE!" : "Defend the galaxy!")
}
info.onLifeZero(function () {
    game.over(false, effects.dissolve)
})
function alienImage (t: number) {
    if (t == 0) {
        return img`
            . . . . . . . . . . 
            . . . . . . . . . . 
            . . . . . . . . . . 
            . . . . . . . . . . 
            . . . . . . . . . . 
            . . . . . . . . . . 
            . . . . . . . . . . 
            . . . . . . . . . . 
            `
    } else if (t == 1) {
        return img`
            . . . 7 7 7 7 . . . 
            . . 7 7 7 7 7 7 . . 
            . 7 7 1 7 7 1 7 7 . 
            7 7 7 7 7 7 7 7 7 7 
            7 7 . 7 7 7 7 . 7 7 
            . . 7 . . . . 7 . . 
            . 7 . 7 . . 7 . 7 . 
            7 . . . 7 7 . . . 7 
            `
    } else {
        return img`
            . . . . 5 5 . . . . 
            . . 5 5 5 5 5 5 . . 
            . 5 5 1 5 5 1 5 5 . 
            5 5 5 5 5 5 5 5 5 5 
            5 . 5 5 5 5 5 5 . 5 
            . . 5 . 5 5 . 5 . . 
            . 5 . . 5 5 . . 5 . 
            5 . . . . . . . . 5 
            `
    }
}
function finishEnemy (enemy: Sprite) {
    idx = alienSprites.indexOf(enemy)
    if (idx >= 0 && alienBoss[idx] == 1) {
        info.changeScoreBy(500)
    } else {
        info.changeScoreBy(50)
    }
    destroyed += 1
    enemy.destroy(effects.fire, 100)
}
let laser3: Sprite = null
let shooter: Sprite = null
let enemies: Sprite[] = []
let diver: Sprite = null
let enemies2: Sprite[] = []
let heart: Sprite = null
let idx = 0
let destroyed = 0
let transitioning = false
let hp = 0
let idx2 = 0
let alienBoss: number[] = []
let alienSprites: Sprite[] = []
let alien: Sprite = null
let _type = 0
let waveSize = 0
let boss = false
let shield = 0
let laser: Sprite = null
let waveActive = false
let player2: Sprite = null
let specialReady = false
let level = 0
let alienHP: number[] = []
let spawned = 0
level = 1
specialReady = true
player2 = sprites.create(img`
    . . . . . . 8 8 . . . . . . 
    . . . . . 8 9 9 8 . . . . . 
    . . . . 8 9 9 9 9 8 . . . . 
    . 8 . 8 9 9 9 9 9 9 8 . 8 . 
    8 8 8 8 9 9 9 9 9 9 8 8 8 8 
    8 9 9 9 9 8 8 8 8 9 9 9 9 8 
    . 8 8 8 8 . . . . 8 8 8 8 . 
    `, SpriteKind.Player)
player2.setPosition(80, 108)
player2.setStayInScreen(true)
controller.moveSprite(player2, 115, 0)
info.setLife(5)
info.setScore(0)
scene.setBackgroundColor(15)
beginWave()
game.onUpdate(function () {
    if (!(waveActive)) {
        return
    }
    for (let enemy of sprites.allOfKind(SpriteKind.Enemy)) {
        if (enemy.y > 125) {
            enemy.destroy()
            destroyed += 1
        }
    }
    if (spawned == waveSize && sprites.allOfKind(SpriteKind.Enemy).length == 0 && !(transitioning)) {
        transitioning = true
        waveActive = false
        if (level == 15) {
            game.over(true, effects.confetti)
        } else {
            level += 1
            beginWave()
        }
    }
})
game.onUpdateInterval(9000, function () {
    if (!(waveActive) || randint(1, 3) != 1) {
        return
    }
    heart = sprites.create(img`
        . 2 2 . 2 2 . 
        2 2 2 2 2 2 2 
        2 2 2 2 2 2 2 
        . 2 2 2 2 2 . 
        . . 2 2 2 . . 
        . . . 2 . . . 
        `, SpriteKind.PowerUp)
    heart.setPosition(randint(10, 150), 0)
    heart.vy = 25
    heart.setFlag(SpriteFlag.AutoDestroy, true)
})
game.onUpdateInterval(1700, function () {
    if (!(waveActive)) {
        return
    }
    enemies2 = sprites.allOfKind(SpriteKind.Enemy)
    if (enemies2.length == 0) {
        return
    }
    diver = enemies2[randint(0, enemies2.length - 1)]
    diver.vx = (player2.x - diver.x) / 2
    diver.vy = 35 + level * 3
})
game.onUpdateInterval(650, function () {
    if (!(waveActive)) {
        return
    }
    if (spawned < waveSize) {
        spawnAlien()
    }
})
game.onUpdateInterval(1100, function () {
    if (!(waveActive)) {
        return
    }
    enemies = sprites.allOfKind(SpriteKind.Enemy)
    if (enemies.length == 0) {
        return
    }
    shooter = enemies[randint(0, enemies.length - 1)]
    laser3 = sprites.create(img`
        2 2 
        2 2 
        2 2 
        `, SpriteKind.AlienLaser)
    laser3.setPosition(shooter.x, shooter.y + 6)
    laser3.vy = 45 + level * 4
    laser3.setFlag(SpriteFlag.AutoDestroy, true)
})
