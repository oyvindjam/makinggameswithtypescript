const audio = document.createElement("audio")
const supportedFormats = {
  webm: audio.canPlayType("audio/webm"),
  ogg: audio.canPlayType("audio/ogg"),
}

function getSupportedFormat(alternatives: ReadonlyArray<string>) {
  for (const alternative of alternatives) {
    const suffix = alternative.split(".")[1]
    if (suffix == "webm") if (supportedFormats.webm == "maybe" || supportedFormats.webm == "probably") return alternative
    if (suffix == "ogg") if (supportedFormats.webm == "maybe" || supportedFormats.webm == "probably") return alternative
  }
  return null
}

export const playerJump = getSupportedFormat([require("./assets/player_jump.webm"), require("./assets/player_jump.ogg")])
export const playerLand = getSupportedFormat([require("./assets/crate_pickup.webm"), require("./assets/crate_pickup.ogg")])
export const playerDie = getSupportedFormat([require("./assets/crate_pickup.webm"), require("./assets/crate_pickup.ogg")])
export const playerHitWall = getSupportedFormat([require("./assets/crate_pickup.webm"), require("./assets/crate_pickup.ogg")])
export const useKnife = getSupportedFormat([require("./assets/crate_pickup.webm"), require("./assets/crate_pickup.ogg")])
export const usePistol = getSupportedFormat([require("./assets/pistol.webm"), require("./assets/pistol.ogg")])
export const useMachineGun = getSupportedFormat([require("./assets/machine_gun.webm"), require("./assets/machine_gun.ogg")])
export const useHandCannon = getSupportedFormat([require("./assets/hand_cannon.webm"), require("./assets/hand_cannon.ogg")])
export const theme = getSupportedFormat([require("./assets/crate_pickup.webm"), require("./assets/crate_pickup.ogg")])
export const basketPickup = getSupportedFormat([require("./assets/crate_pickup.webm"), require("./assets/crate_pickup.ogg")])
export const killEnemy = getSupportedFormat([require("./assets/bullet_hit.webm"), require("./assets/bullet_hit.ogg")])