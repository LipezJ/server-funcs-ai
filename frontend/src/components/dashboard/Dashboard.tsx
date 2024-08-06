import Button from "@components/ui/Button";
import Editor from "@components/dashboard/Editor";
import CodeForm from "@components/dashboard/CodeForm";
import useDashboard from "@lib/dash.hook";

interface Props {
  func_id: string
}

export default function Dashboard(props: Props) {

  const { state, Context } = useDashboard(props.func_id)

  return (
    <Context.Provider value={state}>
      <header
        className="flex justify-between items-center py-2 px-6 text-lg font-semibold border-b"
      >
        <div className="flex items-center gap-4">
          <h1>{state.func.func_id}</h1>
        </div>
        <div>
          <Button
            type="button"
            style="pri"
            className="py-1 px-2"
            onClick={state.deploy}
          >
            {state.isDeploying ? 'Deploying...' : 'Deploy'}
          </Button>
        </div>
      </header>
      <div
        className="flex-1 grid md:grid-cols-4 gap-0.5 overflow-hidden h-full"
      >
        <div
          className="md:col-span-1 hidden md:block overflow-hidden h-full p-2"
        >
          <CodeForm />
        </div>
        <div className="md:col-span-3 overflow-hidden h-full">
          <Editor />
        </div>
      </div>
    </Context.Provider>
  )
}
