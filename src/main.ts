import { TextureAtlas } from "./TextureAtlas"
import { Entity, Updatable, Drawable, Collidable } from "./entity"
import { AudioSystem } from "./AudioSystem"
import { KeyController } from "./KeyController"
import { Player } from "./Player"
import { GraphicsRenderer } from "./GraphicsRenderer"
import { Persistence } from "./persistence"
import { level1 } from "./Level1"
import { Projectile } from "./Projectile"
import { PointerController } from "./PointerController"
import { tileSize, worldHeight, worldWidth } from "./world"
import { GraphicsWebGL } from "./GraphicsWebGL"
import { GamepadController } from "./GamepadController"
import { ScreenShaker } from "./ScreenShake"
import { BasketPlacer, WeaponPicker, Basket } from "./Basket"
import { GraphicsContext2D } from "./GraphicsContext2d"
import { GraphicsBackend } from "./GraphicsBackend"
import { CookieNotice } from "./CookieNotice"
import { SpriteRenderer } from "./SpriteRenderer"
import { PlayerController } from "./PlayerController"
import { doRectanglesOverlap } from "./collission"
import { basketPickup } from "./sounds"
import { ParticleSystem } from "./ParticleSystem"
import { EventSystem } from "./EventSystem"
import { BulletSystem } from "./BulletSystem"
import { EnemySpawner } from "./EnemySpawner"
import { Knife } from "./Knife"
import { Pistol } from "./Pistol"
import { MachineGun } from "./MachineGun"
import { HandCannon } from "./HandCannon"
import { Controller } from "./Controller"
import { drawText, measureTextWidth } from "./TextRendering"
import { NinePatch } from "./NinePatch"
import { drawNinePatch } from "./drawNinePatch";
import { ScaleRenderer } from "./ScaleRenderer";
import { startGameLoop } from "./gameLoop";
import { GameUpdater } from "./GameUpdater";
import { tVector2, tRectangle, tLine } from "./temporaryObjects";
import { releaseTemporaryPools } from "./temporaryObjects";
import { ClipRenderer } from "./ClipRenderer";
import { TranslationRenderer } from "./TranslationRenderer";
import { Rectangle } from "./Rectangle";
import { Line } from "./Line";
/*
// TO ship
make enemy bump back when hit
make enemy take damage instead of instantly die
start menu screen
die menu screen
die animation
sound land
sound run
sound hit enemy
sound die
graphics sides

bullets need to be offset in x when created to they do not get spawned behind the weapon
reset the weapon to knife and reset the weapon picker
Support multiple texture atlases
Create concept of sprites
Should not be able to jump right after starting when still in air
*/

document.head.appendChild(document.createRange().createContextualFragment(`<meta name="viewport" content="width=device-width, initial-scale=1">`))
document.body.style.margin = "0"
document.body.style.overflow = "hidden"
const canvas = document.createElement("canvas")
document.body.style.touchAction = "none"
document.body.appendChild(canvas)
function resizeCanvas() {
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight
}
window.addEventListener("resize", resizeCanvas)
resizeCanvas()



function startNewGame() {
  // TODO BUG: if a enemy is in contact with the player when the game resets after death then the player will die again since enemies gets 'remove'd at end of frame
  for (const enemy of enemies) enemy.getHitBy(tVector2.get(0, 0), 20)
  player.dead = false
  score = 0
  player.position.x = level.playerStartLocation.x
  player.position.y = level.playerStartLocation.y
  addNewBasket()
}

const uiNinePatch = new NinePatch(
  TextureAtlas.uiTopLeft, TextureAtlas.uiTopCenter, TextureAtlas.uiTopRight,
  TextureAtlas.uiMiddleLeft, TextureAtlas.uiMiddleCenter, TextureAtlas.uiMiddleRight,
  TextureAtlas.uiBottomLeft, TextureAtlas.uiBottomCenter, TextureAtlas.uiBottomRight,
)

const bulletSystem = new BulletSystem
const level = level1

const persistence = new Persistence()
if (!persistence.allowStorage) {
  new CookieNotice(() => persistence.userAllowedStorage())
}

let score = 0
let highscore = persistence.getScore()

const audioSystem = new AudioSystem()
const pickupBasket = audioSystem.load(basketPickup)

const image = new Image
image.src = require("./assets/graphics.png")

const graphicsBackend = selectGraphicsBackend()

const renderer = new GraphicsRenderer(graphicsBackend)

const translationRenderer = new TranslationRenderer(renderer)
const scaleRenderer = new ScaleRenderer(translationRenderer)
const clipRenderer = new ClipRenderer(scaleRenderer)


updateCameraRenderer()

const spriteRenderer = new SpriteRenderer(clipRenderer, image)


const particleSystem = new ParticleSystem()
const enemies: Entity[] = []
const screenShaker = new ScreenShaker()

const weapons = [
  new Knife(spriteRenderer, enemies),
  new Pistol(spriteRenderer, bulletSystem, enemies, audioSystem),
  new MachineGun(spriteRenderer, bulletSystem, screenShaker, enemies, audioSystem),
  new HandCannon(spriteRenderer, bulletSystem, screenShaker, enemies, audioSystem)
]

const player = new Player(audioSystem, level, screenShaker, particleSystem, spriteRenderer, enemies, weapons[0])

let enemiesToRemove: Entity[] = []
export function removeEnemy(entity: Entity) {
  enemiesToRemove.push(entity)
}

let enemiesToAdd: Entity[] = []
export function addEnemy(entity: Entity) {
  enemiesToAdd.push(entity)
}
const enemySpawner = new EnemySpawner(enemies, spriteRenderer, level)
const basketPlacer = new BasketPlacer(level, player)

const weaponPicker = new WeaponPicker(weapons)
let basket: Basket | null = null

function addNewBasket() {
  const position = basketPlacer.randomLocation()
  const weapon = weaponPicker.nextWeapon()
  basket = new Basket(weapon, position)
}

addNewBasket()

function selectGraphicsBackend(): GraphicsBackend {
  try { return new GraphicsWebGL(canvas) } catch(_) {}
  try { return new GraphicsContext2D(canvas) } catch(_) {}
  throw new Error("No graphics backend supported")
}

class GameController implements Controller {
  constructor(
    private player: Player,
    private playerController: PlayerController,
  ) { }

  pressLeft() { if (!this.player.dead) this.playerController.pressLeft() }
  releaseLeft() { if (!this.player.dead) this.playerController.releaseLeft() }

  pressRight() { if (!this.player.dead) this.playerController.pressRight() }
  releaseRight() { if (!this.player.dead) this.playerController.releaseRight() }

  pressActionButton1() { if (!this.player.dead) this.playerController.pressActionButton1() }
  releaseActionButton1() { if (!this.player.dead) this.playerController.releaseActionButton1() }

  pressActionButton2() {
    if (!this.player.dead) this.playerController.pressActionButton2()
    else startNewGame()
  }
  releaseActionButton2() { if (!this.player.dead) this.playerController.releaseActionButton2() }
}

const playerController = new PlayerController(player)
const controller = new GameController(player, playerController)
new KeyController(controller,
  ["KeyA", "ArrowLeft"],
  ["KeyD", "ArrowRight"],
  ["KeyW", "KeyX", "KeyK", "ArrowUp", "Space"],
  ["KeyJ", "KeyZ"])
const pointerController = new PointerController(controller, canvas, scaleRenderer, translationRenderer)
new GamepadController(controller)

const projectiles: Projectile[] = []
const eventSystem = new EventSystem

const updatables: Updatable[] = []
const drawables: Drawable[] = []
const collidable: Collidable[] = []

updatables; drawables; collidable // TODO Do I want to do this?

export function submitScore() {
  if (score > highscore) {
    highscore = score
    persistence.saveScore(highscore)
  }
}

function drawMenu() {
  let boxWidth = 150

  drawNinePatch(tRectangle.get(worldWidth / 2 - boxWidth / 2, 50, boxWidth, 50), uiNinePatch, spriteRenderer)

  let text = "highscore"
  drawText(worldWidth / 2 - measureTextWidth(text) / 2, 60, text, spriteRenderer)

  text = highscore.toString()
  drawText(worldWidth / 2 - measureTextWidth(text) / 2, 80, text, spriteRenderer)

  drawNinePatch(tRectangle.get(worldWidth / 2 - boxWidth / 2, 110, boxWidth, 30), uiNinePatch, spriteRenderer)

  text = "Shoot to start"
  drawText(worldWidth / 2 - measureTextWidth(text) / 2, 120, text, spriteRenderer)
}

function drawBackground() {
  const background = TextureAtlas["#5fcde4"]
  const screen = tRectangle.get(0, 0, worldWidth, worldHeight)
  clipRenderer.image(screen, background, image, false)
}

export function gameDraw() {
  graphicsBackend.clear(32, 32, 32)
  clipRenderer.clip(tRectangle.get(0, 0, worldWidth, worldHeight))

  drawBackground()

  for (let row = level.map.length - 1; row >= 0; row--) {
    for (let column = 0; column < level.map[row].length; column++) {
      const sprite = level.map[row][column]
      if (sprite) spriteRenderer.sprite(column * tileSize, row * tileSize, sprite)
    }
  }

  for (const enemy of enemies) enemy.draw()
  bulletSystem.draw()
  player.draw()
  particleSystem.draw()

  for (const projectile of projectiles) spriteRenderer.sprite(projectile.x, projectile.y, TextureAtlas.pistolBullet, projectile.direction == - 1)

  drawText(worldWidth / 2 - measureTextWidth(score.toString()) / 2, 2, score.toString(), spriteRenderer)

  if (basket) spriteRenderer.sprite(basket.position.x, basket.position.y, basket.sprite)

  pointerController.draw(spriteRenderer)

  if (player.dead) drawMenu()

  graphicsBackend.present()
}

export function drawDebugCollision() {
  for (let i = 0; i < level.map[0].length; i++) {
    spriteRenderer.sprite2(tRectangle.get(i*16, 0, 1, worldHeight), TextureAtlas["#8a6f30"])
  }
  for (let i = 0; i < level.map.length; i++) {
    spriteRenderer.sprite2(tRectangle.get(0, i * 16, worldWidth, 1), TextureAtlas["#8a6f30"])
  }


  function drawLine(line: Line, sprite: Rectangle) {
    const minX = Math.min(line.p0.x, line.p1.x)
    const maxX = Math.max(line.p0.x, line.p1.x)
    const minY = Math.min(line.p0.y, line.p1.y)
    const maxY = Math.max(line.p0.y, line.p1.y)


    const p0ToP1 = tVector2.get(maxX - minX, maxY - minY)

    const width = Math.max(1, p0ToP1.x * tileSize)
    const height = Math.max(1, p0ToP1.y * tileSize)
    
    const rect = new Rectangle(
      minX * tileSize,
      minY * tileSize,
      width,
      height)
    
    spriteRenderer.sprite2(rect, sprite)
  }

  for (const line of level.collisionLines) {

    const p0ToP1 = tVector2.get(line.p1.x - line.p0.x,line.p1.y - line.p0.y)
    const ortho = tLine.get(
      line.p0,
      tVector2.get(
        line.p0.x + (p0ToP1.y),
        line.p0.y + (-p0ToP1.x)
        )
    )
    drawLine(ortho, TextureAtlas["#d77bba"])

    drawLine(line, TextureAtlas["#fbf236"])

    
  }
}


export enum GameState {
  menu, playing
}

function updateCameraRenderer() {
  scaleRenderer.scale = Math.min(window.innerWidth / worldWidth, window.innerHeight / worldHeight)
  if (scaleRenderer.scale > 1) scaleRenderer.scale = Math.floor(scaleRenderer.scale)
  translationRenderer.xOffset = Math.round(window.innerWidth / 2 - (worldWidth * scaleRenderer.scale) / 2)
  translationRenderer.yOffset = Math.round(window.innerHeight / 2 - (worldHeight * scaleRenderer.scale) / 2)
}

export let gameState = GameState.menu

export function gameUpdate(delta: number) {
  releaseTemporaryPools()

  updateCameraRenderer()
  
  eventSystem.update(delta)
  particleSystem.update(delta)

  screenShaker.update(delta)
  translationRenderer.xOffset += Math.round(screenShaker.x * scaleRenderer.scale)
  translationRenderer.yOffset += Math.round(screenShaker.y * scaleRenderer.scale)

  player.update(delta)

  // TODO this check should be done in the basket
  if (basket) {
    const playerRect = tRectangle.get(player.position.x, player.position.y, tileSize, tileSize)
    const basketRect = tRectangle.get(basket.position.x, basket.position.y, basket.sprite.width, basket.sprite.height)
    if (doRectanglesOverlap(playerRect, basketRect)) {
      audioSystem.play(pickupBasket)
      player.setWeapon(basket.weapon)
      score++
      basket = null
      eventSystem.register(1, () => addNewBasket())
    }
  }

  for (const enemy of enemies) enemy.update(delta)
  for(const enemy of enemiesToRemove) {
    const index = enemies.indexOf(enemy)
    if (index != -1) enemies.splice(index, 1)
  }
  enemiesToRemove.length = 0

  enemies.push(...enemiesToAdd)
  enemiesToAdd.length = 0

  bulletSystem.update(delta)
  if (!player.dead) enemySpawner.update(delta)
}

startGameLoop(new GameUpdater(0.016, 3))