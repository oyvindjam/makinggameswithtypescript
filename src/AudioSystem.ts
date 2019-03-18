export class AudioIdentifier {
  constructor(
    readonly id: number
  ) { }
}

export class AudioSystem {
  private context = new AudioContext
  private identifierToBuffer: { [id: number]: AudioBuffer | undefined } = {}
  private nextAudioIdentifierId = 0
  private globalGainNode = this.context.createGain()
  private dest = this.globalGainNode

  constructor() {
    this.globalGainNode.connect(this.context.destination)
    this.globalGainNode.gain.value = 0.01

    this.unlockContext()
  }

  private unlockContext() {
    if (this.context.state == "suspended") {
      const resumeAudioContext = () => {
        this.context.resume()
        window.removeEventListener('click', resumeAudioContext)
        window.removeEventListener('keydown', resumeAudioContext)
      }
      window.addEventListener('click', resumeAudioContext)
      window.addEventListener('keydown', resumeAudioContext)
    }
  }

  load(uri: string | null, onLoad: (id: AudioIdentifier) => void = () => { }) {
    const id = new AudioIdentifier(this.nextAudioIdentifierId++)
    if (uri == null) return id

    fetch(uri).then(response => {
      return response.arrayBuffer()
    }).then(arrayBuffer => {
      return this.context.decodeAudioData(arrayBuffer)
    }).then(audioBuffer => {
      this.identifierToBuffer[id.id] = audioBuffer
      onLoad(id)
    }).catch((e) => {
      console.log("AudioSystem: Failed to load " + uri, e)
    })
    return id
  }

  play(identifier: AudioIdentifier) {
    const audioBuffer = this.identifierToBuffer[identifier.id]
    if (!audioBuffer) return
    const bufferSource = this.context.createBufferSource()
    bufferSource.buffer = audioBuffer
    bufferSource.connect(this.dest)
    bufferSource.start()
  }
}