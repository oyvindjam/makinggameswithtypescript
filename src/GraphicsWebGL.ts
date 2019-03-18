import { GraphicsBackend } from "./GraphicsBackend"
import { Rectangle } from "./Rectangle";

const vertexShaderSource = `
attribute vec2 position;
attribute vec2 texturePosition;
varying vec2 texturePositionF;

void main() {
    gl_Position = vec4(position.x, position.y, 0, 1);
    texturePositionF = texturePosition;
}
`

const fragmentShaderSource = `
precision mediump float;
uniform sampler2D textureSampler;
varying vec2 texturePositionF;

void main() {
    vec4 color = texture2D(textureSampler, texturePositionF);
    gl_FragColor = color;
}
`

const bytesInFloat = 4

export class GraphicsWebGL implements GraphicsBackend {

  private readonly imageToWebGLTexture = new Map<HTMLImageElement, WebGLTexture>()
  readonly buffer = new Float32Array(24 * 3000)

  private gl: WebGLRenderingContext

  constructor(
    canvas: HTMLCanvasElement
  ) {
    const gl = canvas.getContext("webgl", {
      alpha: false,
      antialias: false, 
      powerPreference: "high-performance",
      stencil: false,
      preserveDrawingBuffer: false
    })
    if (gl == null) throw new Error("Could not get webGL context")
    this.gl = gl

    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height)
    gl.enable(gl.BLEND)
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA)

    const vertexShader = createShader(vertexShaderSource, gl.VERTEX_SHADER, gl)
    const fragmentShader = createShader(fragmentShaderSource, gl.FRAGMENT_SHADER, gl)
    const program = createProgram([vertexShader, fragmentShader], gl)
    gl.useProgram(program)
    this.gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer())

    const positionSize = 2 * bytesInFloat
    const texturePositionSize = 2 * bytesInFloat
    const stride = positionSize + texturePositionSize
    let offset = 0

    const positionLocation = gl.getAttribLocation(program, "position")
    gl.enableVertexAttribArray(positionLocation)
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, stride, offset)
    offset += positionSize

    const texturePositionLocation = gl.getAttribLocation(program, "texturePosition")
    gl.enableVertexAttribArray(texturePositionLocation)
    gl.vertexAttribPointer(texturePositionLocation, 2, gl.FLOAT, false, stride, offset)
    offset += texturePositionSize
  }

  clear(red: number, green: number, blue: number) {
    this.gl.clearColor(red / 255, green / 255, blue / 255, 1)
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT)
  }

  private bufferIndex = 0

  present() {
    if (this.bufferIndex > 0) {
      this.gl.bufferData(this.gl.ARRAY_BUFFER, this.buffer.subarray(0, this.bufferIndex), this.gl.DYNAMIC_DRAW)
      this.gl.drawArrays(this.gl.TRIANGLES, 0, this.bufferIndex / 4)
    }
    this.bufferIndex = 0
  }

  private getTexture(image: HTMLImageElement) {
    const storedTexture = this.imageToWebGLTexture.get(image)
    if (storedTexture != null) return storedTexture

    const texture = this.createTexture(image)
    if (texture) this.imageToWebGLTexture.set(image, texture)
    return texture
  }

  draw(dest: Rectangle, src: Rectangle, image: HTMLImageElement, mirrored: boolean) {
    if (this.bufferIndex + 24 >= this.buffer.length) return

    const glTexture = this.getTexture(image)
    if (!glTexture) return

    if (mirrored) {
      src.x += src.width
      src.width *= -1
    }

    this.gl.bindTexture(this.gl.TEXTURE_2D, glTexture)

    let x = dest.x
    let width = dest.width
    let y = dest.y
    let height = dest.height

    x = 2 * x / this.gl.canvas.width - 1
    width = (width / this.gl.canvas.width) * 2

    y = -2 * y / this.gl.canvas.height + 1
    height = -(height / this.gl.canvas.height) * 2

    this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height)

    const u0 = src.x / image.width
    const u1 = u0 + src.width / image.width
    const v0 = src.y / image.height
    const v1 = v0 + src.height / image.height

    this.buffer[this.bufferIndex++] = x
    this.buffer[this.bufferIndex++] = y
    this.buffer[this.bufferIndex++] = u0
    this.buffer[this.bufferIndex++] = v0
    this.buffer[this.bufferIndex++] = x + width
    this.buffer[this.bufferIndex++] = y + height
    this.buffer[this.bufferIndex++] = u1
    this.buffer[this.bufferIndex++] = v1
    this.buffer[this.bufferIndex++] = x
    this.buffer[this.bufferIndex++] = y + height
    this.buffer[this.bufferIndex++] = u0
    this.buffer[this.bufferIndex++] = v1
    this.buffer[this.bufferIndex++] = x
    this.buffer[this.bufferIndex++] = y
    this.buffer[this.bufferIndex++] = u0
    this.buffer[this.bufferIndex++] = v0
    this.buffer[this.bufferIndex++] = x + width
    this.buffer[this.bufferIndex++] = y + height
    this.buffer[this.bufferIndex++] = u1
    this.buffer[this.bufferIndex++] = v1
    this.buffer[this.bufferIndex++] = x + width
    this.buffer[this.bufferIndex++] = y
    this.buffer[this.bufferIndex++] = u1
    this.buffer[this.bufferIndex++] = v0
  }


  private createTexture(image: HTMLImageElement) {
    if (!image.complete) return null
    const gl = this.gl
    const glTexture = gl.createTexture()
    if (glTexture == null) return null

    gl.bindTexture(gl.TEXTURE_2D, glTexture)
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA,
      gl.UNSIGNED_BYTE, image)
    const wrap = gl.CLAMP_TO_EDGE
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, wrap)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, wrap)
    const filter = gl.NEAREST
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, filter)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, filter)

    return glTexture
  }
}

function createShader(source: string, type: number, gl: WebGLRenderingContext) {
  const shader = gl.createShader(type)
  if (!shader) throw new Error("Could not create shader")
  gl.shaderSource(shader, source)
  gl.compileShader(shader)
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    let message = gl.getShaderInfoLog(shader) || ""
    throw new Error(message)
  }
  return shader
}

function createProgram(shaders: WebGLShader[], gl: WebGLRenderingContext) {
  const program = gl.createProgram()
  if (!program) throw new Error("Could not create program")
  for (const shader of shaders) gl.attachShader(program, shader)
  gl.linkProgram(program)
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    const message = gl.getProgramInfoLog(program) || ""
    throw new Error(message)
  }
  return program
}