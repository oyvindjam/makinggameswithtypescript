import { TextureAtlas } from "./TextureAtlas"
import { Rectangle } from "./Rectangle"
import { SpriteRenderer } from "./SpriteRenderer"

const letterSpacing = 1

const glyphs: { [id: string]: Rectangle | undefined } = {
  "a": TextureAtlas.a, "b": TextureAtlas.b, "c": TextureAtlas.c,
  "d": TextureAtlas.d, "e": TextureAtlas.e, "f": TextureAtlas.f,
  "g": TextureAtlas.g, "h": TextureAtlas.h, "i": TextureAtlas.i,
  "j": TextureAtlas.j, "k": TextureAtlas.k, "l": TextureAtlas.l,
  "m": TextureAtlas.m, "n": TextureAtlas.n, "o": TextureAtlas.o,
  "p": TextureAtlas.p, "q": TextureAtlas.q, "r": TextureAtlas.r,
  "s": TextureAtlas.s, "t": TextureAtlas.t, "u": TextureAtlas.u,
  "v": TextureAtlas.v, "w": TextureAtlas.w, "x": TextureAtlas.x,
  "y": TextureAtlas.y, "z": TextureAtlas.z,
  "0": TextureAtlas["0"], "1": TextureAtlas["1"], "2": TextureAtlas["2"],
  "3": TextureAtlas["3"], "4": TextureAtlas["5"], "5": TextureAtlas["5"],
  "6": TextureAtlas["6"], "7": TextureAtlas["7"], "8": TextureAtlas["8"],
  "9": TextureAtlas["9"],
}

const spaceWidth = 4

export function drawText(x: number, y: number, text: string, renderer: SpriteRenderer) {
  text = text.toLowerCase()

  for (let i = 0; i < text.length; i++) {
    const letter = text[i]
    if (letter == " ") {
      x += spaceWidth
    } else {
      const rectangle = glyphs[letter]
      if (rectangle) {
        renderer.sprite(x, y, rectangle)
        x += rectangle.width + letterSpacing
      }
    }
  }
}

export function measureTextWidth(text: string) {
  text = text.toLowerCase()

  let width = 0
  for (let i = 0; i < text.length; i++) {
    const letter = text[i]
    if (letter == " ") width += spaceWidth
    else {
      const rectangle = glyphs[letter]
      if (rectangle) width += rectangle.width + letterSpacing
    }

  }
  if (text.length > 0) width -= letterSpacing
  return width
}