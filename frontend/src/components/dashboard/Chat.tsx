import { type Message } from 'ai/react';
import Loader from '../icons/Loader';
import { useFunctionChat } from '@/lib/chat.hook';
import ChatMessage from './ChatMessage';

import "highlight.js/styles/vs2015.min.css"

export default function Chat() {
  const { 
    status, 
    messages, 
    input, 
    submitMessage, 
    handleInputChange
  } = useFunctionChat();

  return (
    <section className="flex flex-col items-center gap-1 text-black overflow-hidden h-full">
      <div className="overflow-y-auto flex flex-col gap-2.5 pr-0.5 pb-4 w-full h-full lg:px-14">
        {
          messages.map((m: Message) => (
            <ChatMessage key={m.id} {...m} />
          ))
        }
        
        {status === 'in_progress' && <Loader />}
      </div>

      <form onSubmit={submitMessage} className="flex gap-1 w-full md:w-4/6">
        <input
          className="items-center gap-1 rounded-md border border-paragraph p-2 mr-1 h-fit w-full"
          disabled={status !== 'awaiting_message'}
          value={input}
          placeholder="What function would you like to use?"
          onChange={handleInputChange}
        />
      </form>
    </section>
  );
}