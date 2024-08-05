import { atom } from 'nanostores'
import { DEFAULT_CODE } from '@lib/const'

export class Mode {
  static modes = [ 'editor', 'chat' ]
  static mode = atom<typeof Mode.modes[number]>(Mode.modes[1])

  static toggle() {
    const index = Mode.modes.indexOf(Mode.mode.get())
    Mode.mode.set(Mode.modes[(index + 1) % Mode.modes.length])
  }
}

export const codeAtom = atom(DEFAULT_CODE)
