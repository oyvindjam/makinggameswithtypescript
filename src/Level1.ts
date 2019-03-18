import { TextureAtlas } from "./TextureAtlas"
import { Level } from "./Level"
import { Vector2 } from "./Vector2"
import { Line } from "./Line";

const x = null
const a = TextureAtlas.steelSideBar
const b = TextureAtlas.steelTopBar
const c = TextureAtlas.steelTopBarRight
const d = TextureAtlas.steelTopBarLeft
const e = TextureAtlas.steelBarLeft
const f = TextureAtlas.steelBarMiddle
const g = TextureAtlas.steelBarRight
const h = TextureAtlas.steelBarStandTopLeft
const i = TextureAtlas.steelBarStandTopRight
const j = TextureAtlas.steelBarStandBottomLeft
const k = TextureAtlas.steelBarStandBottomRight
const l = TextureAtlas.steelSideBarBottom
const m = TextureAtlas.groundMiddle
const n = TextureAtlas.groundRight
const o = TextureAtlas.groundLeft
const p = TextureAtlas.steelBarStandCenterLeft
const q = TextureAtlas.steelBarStandCenterRight


export const level1 = new Level(
  new Vector2(135, 95),
  [
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
  ],
  [
    [a, b, b, b, b, b, c, x, x, x, x, d, b, b, b, b, b, a],
    [a, x, x, x, x, x, x, x, x, x, x, x, x, x, x, x, x, a],
    [a, x, x, x, x, x, x, x, x, x, x, x, x, x, x, x, x, a],
    [a, x, x, x, x, x, x, x, x, x, x, x, x, x, x, x, x, a],
    [a, x, x, x, x, x, x, x, x, x, x, x, x, x, x, x, x, a],
    [a, x, x, x, e, f, f, f, f, f, f, f, f, g, x, x, x, a],
    [a, x, x, x, h, x, x, x, x, x, x, x, x, i, x, x, x, a],
    [a, x, x, x, j, x, x, x, x, x, x, x, x, k, x, x, x, a],
    [a, f, f, f, g, x, x, x, x, x, x, x, x, e, f, f, f, a],
    [a, x, x, x, i, x, x, x, x, x, x, x, x, h, x, x, x, a],
    [a, x, x, x, q, x, e, f, f, f, f, g, x, p, x, x, x, a],
    [a, x, x, x, q, x, h, x, x, x, x, i, x, p, x, x, x, a],
    [a, x, x, x, k, x, j, x, x, x, x, k, x, j, x, x, x, a],
    [l, m, m, m, m, m, n, x, x, x, x, o, m, m, m, m, m, l]
  ],
  [
    L(7, 0, 7, 1), L(7, 1, 1, 1), L(1, 0, 1, 14), L(1, 13.35, 7, 13.35), L(7, 13.35, 7, 14),
    L(11, 14, 11, 13.35), L(11, 13.35, 17, 13.35), L(17, 14, 17, 0), L(17, 1, 11, 1), L(17, 1, 11, 1), L(11, 1, 11, 0),
    
    L(4, 5.35, 14, 5.35), L(1, 8.35, 5, 8.35),  L(13, 8.35, 17, 8.35), L(6, 10.35, 12, 10.35),
  ]
)


function L(x0: number, y0: number, x1: number, y1: number) {
  return new Line(new Vector2(x0, y0), new Vector2(x1, y1))
}