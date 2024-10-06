import Chat from '@components/dashboard/Chat';
import CodeEditor from '@components/dashboard/CodeEditor';

import ToogleModeButton from './ToogleModeButton';
import useEditor, { GlobalChatContext, ModeContext } from '@lib/editor.hook';

export default function Editor() {
	const { mode, setMode, messages, setMessages } = useEditor();

	return (
		<GlobalChatContext.Provider value={{ messages, setMessages }}>
			<ModeContext.Provider value={{ mode, setMode }}>
				{mode === 'chat' ? (
					<section
						id="chat-editor"
						className="relative p-4 bg-sec rounded-sm text-text overflow-hidden h-full"
					>
						<ToogleModeButton />
						<Chat />
					</section>
				) : (
					<section id="code-editor" className="relative bg-[#1e1e1e] py-4 h-full">
						<ToogleModeButton />
						<CodeEditor />
					</section>
				)}
			</ModeContext.Provider>
		</GlobalChatContext.Provider>
	);
}
