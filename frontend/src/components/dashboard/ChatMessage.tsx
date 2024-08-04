import { codeAtom, Mode } from "@/lib/code.store";
import type { Message } from "ai";
import { useCallback } from "react";
import Markdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";

export default function ChatMessage({ role, content, data }: Message) {

  const changeMode = useCallback<React.MouseEventHandler<HTMLButtonElement>>((e) => {
    const button = e.target as HTMLButtonElement
    const parent = button.parentElement

    const code = parent?.querySelector("code")?.textContent

    codeAtom.set(code ?? "")
    Mode.toggle()
  }, [])

  const components = {
    pre({ children }: any) {
      return (
        <pre className="flex flex-col items-end relative w-full">
          {children}
          <button 
            onClick={changeMode}
            className="absolute bottom-0 font-medium text-center text-text rounded-md w-fit px-2 py-0.5 m-1
             bg-pri border border-pri focus:ring-4 focus:ring-pri/20">
            Use
          </button>
        </pre>
      );
    }
  }

  return (
    <div className="bg-main px-4 py-2 mr-2 rounded-md w-fit break-words">
      <strong>{`${role}: `}</strong>
      {
        role !== 'data' && 
        <Markdown
          rehypePlugins={[rehypeHighlight]}
          components={components}
        >
          { content }
        </Markdown>
      }
      {role === 'data' && (
        <>
          {(data as any).description}
          <br />
          <pre className={'bg-gray-200'}>
            {JSON.stringify(data, null, 2)}
          </pre>
        </>
      )}
    </div>
  )
}
