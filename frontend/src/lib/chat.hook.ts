import { useContext, useEffect, useRef } from 'react';
import { Settings } from '@lib/settings';
import { apiKey } from '@lib/settings.store';
import { useAssistant, useChat, type Message } from 'ai/react';
import { streamText } from 'ai';
import { ollama } from 'ollama-ai-provider';
import { AI_SYSTEM_PROMPT } from '@lib/const';
import { GlobalChatContext } from './editor.hook';

async function ollamaFecth(
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

function useAIChat(messages: Message[] = []) {
	const providerType = Settings.getKey('type');
	const threadId = useRef<string | undefined>(undefined);

	console.log('function chat', messages);

	if (providerType === 'openai') {
		const assistant = useAssistant({
			api: '/api/assistant',
			headers: { Authorization: apiKey.get() },
			body: {
				messages: messages
			},
			threadId: threadId.current,
		});
		threadId.current = assistant.threadId;
		return assistant;
	}
	const state = useChat({ fetch: ollamaFecth, initialMessages: messages });

	return {
		...state,
		status: state.isLoading ? 'in_progress' : 'awaiting_message',
		submitMessage: state.handleSubmit,
	};
}

export default function useFunctionChat() {
	const { messages: globalMessages, setMessages: setGlobalMessages } = useContext(GlobalChatContext);
	const { status, messages, input, submitMessage, handleInputChange, setMessages } = useAIChat(globalMessages);

	const messagesRef = useRef(messages);

	useEffect(() => {
		messagesRef.current = messages;
		setGlobalMessages(messages);
	}, [messages]);

	useEffect(() => {
		setMessages(globalMessages);
		return () => setGlobalMessages(messagesRef.current);
	}, []);

	return { status, messages, input, submitMessage, handleInputChange };
}
