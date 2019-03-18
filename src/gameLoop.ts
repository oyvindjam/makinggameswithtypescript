import { GameUpdater } from "./GameUpdater";

export function startGameLoop(gameUpdater: GameUpdater) {
    let lastTimeGameLoop = performance.now() - gameUpdater.timeStepSeconds

    const gameLoop = (time: number) => {
        const delta = (time - lastTimeGameLoop) / 1000
        lastTimeGameLoop = time
        gameUpdater.update(delta)
        requestAnimationFrame(gameLoop)
    }
    gameLoop(performance.now())
}