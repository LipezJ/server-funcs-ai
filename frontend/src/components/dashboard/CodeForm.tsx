import Beaker from "@components/icons/Beaker";
import Gear from "@components/icons/Gear";
import Play from "@components/icons/Play";
import Trash from "@components/icons/Trash";
import Button from "@components/ui/Button";
import { FunctionContext } from "@lib/dash.hook";
import { useContext, useState } from "react";

function TestForm() {
  const { backend } = useContext(FunctionContext)
  const [ url, setUrl ] = useState<string>(backend)

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
          defaultValue={backend}
        />
        <Button title="send test request" type="submit" style="pri" className="p-2 h-full">
          <Play />
        </Button>
      </form>
    </>
  )
}

function SettingsForm() {
  const { func, deleteFunction, setType } = useContext(FunctionContext)

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
      <div className="flex justify-between w-full">
        <Button
          title="delete function"
          style="pri"
          type="button"
          className="p-2 bg-red-700 border-red-700 focus:ring-red-700/20"
          onClick={deleteFunction}
        >
          <Trash /> Delete
        </Button>
        <Button title="save settings" type="submit" style="pri" className="p-2">
          Save
        </Button>
      </div>
    </form>
  )
}

export default function CodeForm() {
  const [ mode, setMode ] = useState<'test' | 'settings'>('test')

  return (
    <section className="flex flex-col gap-2 h-full">
      <header className="flex gap-2">
        <Button type="button" style="sec" title="settings form"
          className="py-2 px-2" onClick={() => setMode('settings')}>
          <Gear />
        </Button>
        <Button type="button" style="sec" title="test form"
          className="py-2 px-2" onClick={() => setMode('test')}>
          <Beaker />
        </Button>
      </header>
      { mode === 'test' ? <TestForm /> : <SettingsForm /> }
    </section>
  )
}