import Button from "@components/ui/Button";
import { FunctionContext } from "@lib/dash.hook";
import { useContext, useState } from "react";

function TestForm() {
  const [ url, setUrl ] = useState<string>('https://jsonplaceholder.typicode.com/todos/1')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const form = e.target as HTMLFormElement
    const formData = new FormData(form)
    const url = formData.get('test-url') as string

    setUrl(url)
  }

  return (
    <>
      <iframe
        title="test-iframe"
        src={url}
        className="w-full h-full row-span-8 rounded-sm" 
      />
      <form onSubmit={handleSubmit} className="flex items-end mr-1 w-full">
        <input 
          name="test-url"
          placeholder="URL to test"
          type="text" 
          className="items-center gap-1 rounded-md border border-paragraph p-2 mr-1 h-fit w-full"
        />
        <Button type="submit" style="pri" className="p-2 h-fit">Test</Button>
      </form>
    </>
  )
}

function SettingsForm() {
  const { func, setType } = useContext(FunctionContext)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const form = e.target as HTMLFormElement
    const formData = new FormData(form)
    const type = formData.get('func-type') as string

    setType(type)
  }

  return (
    <form  onSubmit={handleSubmit} className="flex flex-col justify-between w-full h-full ">
      <div className="px-4">
        <label htmlFor="ia-type" className="text-sm font-bold">returns type</label>
        <select
          name="func-type"
          className="w-full p-2 ml-2 border border-paragraph rounded-md"
          defaultValue={func.type}
        >
          <option value="json">json</option>
          <option value="html">html</option>
        </select>
      </div>
      <div className="flex justify-end w-full">
        <Button type="submit" style="pri" className="p-2">
          Save
        </Button>
      </div>
    </form>
  )
}

export default function CodeForm() {
  const [ mode, setMode ] = useState<'test' | 'settings'>('test')

  const toggleMode = () => {
    setMode(prev => prev === 'test' ? 'settings' : 'test')
  }
  
  return (
    <section className="flex flex-col gap-2 h-full">
      <header className="flex gap-2">
        <Button type="button" style="sec" className="px-2 py-0.5" onClick={toggleMode}>
          { mode === 'test' ? 'Settings' : 'Test' }
        </Button>
      </header>
      { mode === 'test' ? <TestForm /> : <SettingsForm /> }
    </section>
  )
}