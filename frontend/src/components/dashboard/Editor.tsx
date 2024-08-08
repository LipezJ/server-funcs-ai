import Chat from '@components/dashboard/Chat';
import CodeEditor from '@components/dashboard/CodeEditor';
import Comment from '@components/icons/Comment';
import Pencil from '@components/icons/Pencil';
import Button from '@components/ui/Button';

import type { Message } from 'ai';
import { useState, createContext } from 'react';

export const ChatContext = createContext({
	messages: [] as Message[],
	setMessages: (messages: Message[]) => {},
})

export const ModeContext = createContext({
	mode: 'chat' as 'chat' | 'editor',
	setMode: (mode: 'chat' | 'editor') => {},
});

export default function Editor() {
	const [ messages, setMessages ] = useState<Message[]>([]);
	const [ mode, setMode ] = useState<'chat' | 'editor'>('chat');

	const togleMode = () => {
		setMode((prev) => (prev === 'chat' ? 'editor' : 'chat'));
	};

	return (
		<ModeContext.Provider value={{ mode, setMode }}>
			{mode === 'chat' ? (
				<section
					id="chat-editor"
					className="relative p-4 bg-sec rounded-sm text-text overflow-hidden h-full"
				>
					<div className="absolute right-0 mr-4 z-10">
						<Button
							type="button"
							style="sec"
							className="px-4 py-2 text-text bg-sec/20"
							onClick={togleMode}
							title="open code editor"
						>
							<Pencil />
						</Button>
					</div>
					<ChatContext.Provider value={{ messages, setMessages }}>
						<Chat />
					</ChatContext.Provider>
				</section>
			) : (
				<section id="code-editor" className="relative bg-[#1e1e1e] py-4 h-full">
					<div className="absolute right-0 mr-4 z-10">
						<Button
							type="button"
							style="sec"
							className="px-4 py-2 text-text bg-sec/20"
							onClick={togleMode}
							title="open the ai chat"
						>
							<Comment />
						</Button>
					</div>
					<CodeEditor />
				</section>
			)}
		</ModeContext.Provider>
	);
}
