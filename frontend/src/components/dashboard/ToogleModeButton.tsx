import Comment from '@components/icons/Comment';
import Pencil from '@components/icons/Pencil';
import Button from '@components/ui/Button';
import { ModeContext } from '@lib/editor.hook';
import { useContext } from 'react';

export default function ToogleModeButton() {
  const modeContext = useContext(ModeContext);

  const togleMode = () => {
    modeContext.setMode(prev => prev === 'chat' ? 'editor' : 'chat');
	};
  
  return (
    <div className="absolute right-0 mr-4 z-10">
      <Button
        type="button"
        style="sec"
        className="px-4 py-2 text-text bg-sec/20"
        onClick={togleMode}
        title="Switch between chat and code editor"
        aria-label={modeContext.mode === 'chat' ? 'Open code editor' : 'Open chat'}
      >
        { modeContext.mode === 'chat' ? <Comment /> : <Pencil /> }
      </Button>
    </div>
  );
}