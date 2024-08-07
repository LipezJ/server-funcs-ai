import { createContext, useEffect, useState } from 'react';

export interface FunctionData {
	func_id: string;
	code: string;
	type: string;
}

interface FunctionContextProps {
	func: FunctionData;
	upgradable: boolean;
	setCode: (code: string) => void;
	setType: (type: string) => void;
	deleteFunction: () => void;
	deploy: () => void;
	isDeploying: boolean;
	backend: string;
}

const Context = createContext<FunctionContextProps>({
	func: {
		func_id: '',
		code: '',
		type: '',
	},
	upgradable: false,
	setCode: () => {},
	setType: () => {},
	deploy: () => {},
	deleteFunction: () => {},
	isDeploying: false,
	backend: '',
});

const getFunction = async (id: string) => {
	const params = new URLSearchParams({ id });
	const res = await fetch(`/api/functions?${params}`);

	if (!res.ok) {
		window.location.href = '/dashboard';
	}

	return await res.json();
};

export default function useDashboard(props: FunctionData, backend: string) {
	const [func, setFunc] = useState<FunctionData>(props);
	const [isDeploying, setIsDeploying] = useState(false);
	const [upgradable, setUpgradable] = useState(false);

	const deploy = () => {
		if (isDeploying) return;
		if (!upgradable) return;

		setIsDeploying(true);

		fetch('/api/functions/', {
			method: 'PATCH',
			body: JSON.stringify(func),
		})
			.then((res) => {
				if (res.ok) {
					alert('Deployed!');
				} else {
					alert('Failed to deploy');
				}
			})
			.catch((err) => {
				// TODO: handle error
			})
			.finally(() => {
				setIsDeploying(false);
			});
	};

	const setCode = (code: string) => {
		setUpgradable(code !== func.code);
		setFunc((prev) => ({ ...prev, code }));
	};

	const setType = (type: string) => {
		setUpgradable(type !== func.type);
		setFunc((prev) => ({ ...prev, type }));
	};

	const deleteFunction = () => {
		fetch('/api/functions', {
			method: 'DELETE',
			body: JSON.stringify({ id: func.func_id }),
		})
			.then((res) => {
				if (res.ok) {
					alert('Deleted!');
				} else {
					alert('Failed to delete');
				}
			})
			.catch(() => alert('Failed to delete'));
	};

	return {
		state: {
			func,
			setCode,
			setType,
			upgradable,
			deleteFunction,
			deploy,
			isDeploying: isDeploying,
			backend,
		},
		Context,
	};
}

export { Context as FunctionContext };
