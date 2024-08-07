import Button from '@components/ui/Button';
import Editor from '@components/dashboard/Editor';
import CodeForm from '@components/dashboard/CodeForm';
import useDashboard, { type FunctionData } from '@lib/dash.hook';
import Zap from '@components/icons/Zap';
import Breadcrumb from './Breadcrumb';
import Rocket from '@components/icons/Rocket';

interface Props {
	func: FunctionData;
	backend: string;
}

export default function Dashboard(props: Props) {
	const { state, Context } = useDashboard(props.func, props.backend);

	return (
		<Context.Provider value={state}>
			<header className="flex justify-between items-center gap-4 py-2 px-2 md:px-6 text-lg font-semibold border-b">
				<Breadcrumb
					elements={[
						{ name: 'Functions', href: '/dashboard' },
						{
							name: state.func.func_id,
							href: `${props.backend}?id=${props.func.func_id}`,
						},
					]}
				/>
				<div className="flex gap-2">
					<Button
						type="button"
						style="pri"
						className="py-1 px-2 gap-1"
						onClick={state.deploy}
						title="deploy the function"
					>
						<Rocket />
						{state.isDeploying ? 'Deploying...' : 'Deploy'}
					</Button>
					<a href={`${state.backend}?id=${state.func.func_id}`}>
						<Button type="button" style="pri" className="py-1 px-2 gap-1" title="go to your function">
							<Zap />
							Open
						</Button>
					</a>
				</div>
			</header>
			<div className="flex-1 grid md:grid-cols-4 overflow-hidden h-full">
				<div className="md:col-span-1 hidden md:block overflow-hidden h-full p-2">
					<CodeForm />
				</div>
				<div className="md:col-span-3 overflow-hidden h-full">
					<Editor />
				</div>
			</div>
		</Context.Provider>
	);
}
