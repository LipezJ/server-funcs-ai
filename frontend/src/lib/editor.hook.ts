import { createContext, useState } from "react";
import type { Message } from 'ai';

export const GlobalChatContext = createContext<{
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
}>({
  messages: [],
  setMessages: () => [],
});

export const ModeContext = createContext<{
  mode: 'chat' | 'editor';
  setMode: React.Dispatch<React.SetStateAction<'chat' | 'editor'>>;
}>({
  mode: 'chat',
  setMode: () => {},
});

export default function useEditor() {
  const [ messages, setMessages ] = useState<Message[]>([]);
	const [ mode, setMode ] = useState<'chat' | 'editor'>('chat');

  return { messages, setMessages, mode, setMode };
}