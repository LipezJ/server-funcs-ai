import Loader from '@components/icons/Loader';
import { FunctionContext } from '@lib/dash.hook';
import Editor, { useMonaco } from '@monaco-editor/react';
import { useContext } from 'react';

export default function CodeEditor() {
	const { func, setCode } = useContext(FunctionContext);

	const onChange = (value: string | undefined) => {
		if (value) setCode(value);
	};

	return (
		<Editor
			height="100%"
			theme="vs-dark"
			defaultLanguage="javascript"
			defaultValue="// some comment"
			value={func.code}
			onChange={onChange}
			loading={<Loader />}
		/>
	);
}
