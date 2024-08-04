export type SettingsType = 'ollama' | 'openai'

interface SettingsOptions {
  type: SettingsType
  ollamaModel: string
}

export class Settings {
  private static settings: SettingsOptions = {
    type: 'ollama',
    ollamaModel: ''
  }

  static {
    const settings = localStorage.getItem('settings')
    if (settings) {
      this.settings = JSON.parse(settings)
    } else {
      localStorage.setItem('settings', JSON.stringify(this.settings))
    }
  }

  static save() {
    localStorage.setItem('settings', JSON.stringify(this.settings))
  }

  static getType() {
    return this.settings.type
  }

  static getOllamaModel() {
    return this.settings.ollamaModel
  }

  static setType(options: string) {
    if (options !== 'ollama' && options !== 'openai') {
      throw new Error('Invalid settings type')
    }
    this.settings.type = options
    this.save()
  }

  static setOllamaModel(model: string) {
    this.settings.ollamaModel = model
    this.save()
  }
}