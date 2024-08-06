export type SettingsType = 'ollama' | 'openai';

interface SettingsOptions {
	type: SettingsType;
	ollamaModel: string;
	defaultEditorMode: 'editor' | 'chat';
	askBeforeLeaving: boolean;
	askToDeploy: boolean;
}

export class Settings {
	static settings: SettingsOptions = {
		type: 'ollama',
		ollamaModel: '',
		defaultEditorMode: 'chat',
		askBeforeLeaving: true,
		askToDeploy: false,
	}

	static {
		const settings = localStorage.getItem('settings');
		if (settings) {
			Settings.settings = JSON.parse(settings);
		} else {
			localStorage.setItem('settings', JSON.stringify(Settings.settings));
		}
	}

	static saveKey<T extends keyof SettingsOptions>(key: T, value: SettingsOptions[T]) {
		Settings.settings[key] = value;
		localStorage.setItem('settings', JSON.stringify(Settings.settings));
	}

	static getKey<T extends keyof SettingsOptions>(key: T): SettingsOptions[T] {
		return Settings.settings[key];
	}
}
