//import Blocks, { DataProp } from 'editorjs-blocks-react-renderer';
import EditorJS, { OutputData } from '@editorjs/editorjs';
import { EDITOR_JS_TOOLS } from './tools';
import { useEffect, useRef } from 'react';
import { EditorDisplayProps } from './text-editor.types';

export const EditorDisplay = ({ data,  editorblock}: EditorDisplayProps) => {
  const ref = useRef<EditorJS>();
  const renderedData = useRef<OutputData>();

  useEffect(() => {
    if (!data || renderedData?.current === data) {
      return;
    }

    if (ref?.current?.destroy) {
      ref.current.destroy();
    }

    const editor = new EditorJS({
      holder: editorblock,
      tools: EDITOR_JS_TOOLS,
      data,
      readOnly: true
    });
    ref.current = editor;
    renderedData.current = data;
    return () => {
      if (ref?.current?.destroy) {
        ref.current.destroy();
      }
    };
  }, [data]);

  return <div id={editorblock} className='w-90' />;
};

//export default EditorDisplay;

