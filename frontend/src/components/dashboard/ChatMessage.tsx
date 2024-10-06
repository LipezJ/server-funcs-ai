import type { Message } from 'ai';
import { useCallback, useContext } from 'react';
import Markdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';
import { FunctionContext } from '@lib/dash.hook';
import { ModeContext } from '@lib/editor.hook';

export default function ChatMessage({ role, content, data }: Message) {

	const modeContext = useContext(ModeContext);
	const functionContext = useContext(FunctionContext);

	const changeMode = useCallback<React.MouseEventHandler<HTMLButtonElement>>(
		(e) => {
			const button = e.target as HTMLButtonElement;
			const parent = button.parentElement;

			const code = parent?.querySelector('code')?.textContent;

			functionContext.setCode(code || '');
			modeContext.setMode('editor');
		},
		[ modeContext, functionContext ],
	);

	const components = {
		// biome-ignore lint/suspicious/noExplicitAny: <explanation>
		pre({ children }: any) {
			return (
				<pre className="flex flex-col relative w-full">
					{children}
					<button
						onClick={changeMode}
						className="absolute bottom-0 font-medium text-center text-text rounded-md w-fit px-2 py-0.5 m-1
             bg-pri border border-pri focus:ring-4 focus:ring-pri/20 self-end"
						type="button"
					>
						Use
					</button>
				</pre>
			);
		},
	};

	return (
		<div className="bg-main px-4 py-2 rounded-md w-fit max-w-full break-words">
			<strong>{`${role}: `}</strong>
			{role !== 'data' && (
				<Markdown rehypePlugins={[rehypeHighlight]} components={components}>
					{content}
				</Markdown>
			)}
			{role === 'data' && (
				<>
					{(data as { description: string }).description}
					<br />
					<pre className={'bg-gray-200'}>{JSON.stringify(data, null, 2)}</pre>
				</>
			)}
		</div>
	);
}
