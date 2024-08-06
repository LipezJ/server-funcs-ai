import { useState } from 'react';
import { Settings, type SettingsType } from '@lib/settings';
import { apiKey } from '@lib/settings.store';
import { useAssistant, useChat } from 'ai/react';
import { streamText, type CoreMessage } from 'ai';
import { ollama } from 'ollama-ai-provider';
import { AI_SYSTEM_PROMPT } from '@lib/const';

function useOllamaChat() {
	const [messages, setMessages] = useState<CoreMessage[]>([]);
	const [input, setInput] = useState<string>('');
	const [status, setStatus] = useState<string>('awaiting_message');

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setInput(e.target.value);
	};

	const submitMessage = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setStatus('in_progress');

		const ollamaModel = Settings.getKey('ollamaModel');

		const result = await streamText({
			model: ollama(ollamaModel),
			system: AI_SYSTEM_PROMPT,
			messages: messages,
		});

		const prev = structuredClone(messages);

		for await (const part of result.textStream) {
			setMessages(prev.concat({ role: 'assistant', content: part }));
		}

		setInput('');
		setStatus('awaiting_message');
	};

	return { status, messages, input, submitMessage, handleInputChange };
}

export async function ollamaFecth(
	input: string | RequestInfo | URL,
	init?: RequestInit | undefined,
) {
	const body = JSON.parse(init?.body?.toString() ?? '{}');
	const messages = body.messages;

	const result = await streamText({
		model: ollama(Settings.getKey('ollamaModel')),
		system: AI_SYSTEM_PROMPT,
		messages: messages,
	});

	return result.toAIStreamResponse();
}

export function useFunctionChat() {
	const providerType = Settings.getKey('type');

	if (providerType === 'openai') {
		return useAssistant({
			api: '/api/assistant',
			headers: { Authorization: apiKey.get() },
		});
	}
	const state = useChat({ fetch: ollamaFecth });
	return {
		...state,
		status: state.isLoading ? 'in_progress' : 'awaiting_message',
		submitMessage: state.handleSubmit,
	};
}
