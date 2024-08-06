import Button from "@components/ui/Button";
import Editor from "@components/dashboard/Editor";
import CodeForm from "@components/dashboard/CodeForm";
import useDashboard from "@lib/dash.hook";
import Zap from "@components/icons/Zap";
import ArrowRight from "@components/icons/ArrowRight";

interface Props {
  func_id: string
}

export default function Dashboard(props: Props) {

  const { state, Context } = useDashboard(props.func_id)

  return (
    <Context.Provider value={state}>
      <header
        className="flex justify-between items-center gap-4 py-2 px-2 md:px-6 text-lg font-semibold border-b"
      >
        <nav className="flex" aria-label="Breadcrumb">
          <ol className="inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse">
            <li>
              <div className="flex items-center">
                <a href="/dashboard" className="ms-1 text-base font-medium md:ms-2 underline" title="return to functions list">
                  Functions
                </a>
              </div>
            </li>
            <li aria-current="page">
              <div className="flex items-center">
                <ArrowRight />
                <span className="ms-1 text-base font-medium md:ms-2 underline" title="function link">
                  {state.func.func_id}
                </span>
              </div>
            </li>
          </ol>
        </nav>
        <div>
          <Button
            type="button"
            style="pri"
            className="py-1 px-2 gap-1"
            onClick={state.deploy}
            title="deploy the function"
          >
            <Zap />
            {state.isDeploying ? 'Deploying...' : 'Deploy'}
          </Button>
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
  )
}
