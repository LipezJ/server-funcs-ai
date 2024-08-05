export type SettingsType = 'ollama' | 'openai';

interface SettingsOptions {
	type: SettingsType;
	ollamaModel: string;
}

export class Settings {
	private static settings: SettingsOptions = {
		type: 'ollama',
		ollamaModel: '',
	};

	static {
		const settings = localStorage.getItem('settings');
		if (settings) {
			Settings.settings = JSON.parse(settings);
		} else {
			localStorage.setItem('settings', JSON.stringify(Settings.settings));
		}
	}

	static save() {
		localStorage.setItem('settings', JSON.stringify(Settings.settings));
	}

	static getType() {
		return Settings.settings.type;
	}

	static getOllamaModel() {
		return Settings.settings.ollamaModel;
	}

	static setType(options: string) {
		if (options !== 'ollama' && options !== 'openai') {
			throw new Error('Invalid settings type');
		}
		Settings.settings.type = options;
		Settings.save();
	}

	static setOllamaModel(model: string) {
		Settings.settings.ollamaModel = model;
		Settings.save();
	}
}
