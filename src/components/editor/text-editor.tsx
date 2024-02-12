import { useEffect, useRef, ReactElement } from 'react';
import EditorJS from '@editorjs/editorjs';
import { EDITOR_JS_TOOLS } from './tools';
import { TextEditorProps } from './text-editor.types';

export const TextEditor = ({
  data,
  onChange,
  editorblock
}: TextEditorProps): ReactElement => {
  //add a reference to editor
  const ref = useRef<EditorJS>();

  //initialize editorjs
  useEffect(() => {
    //initialize editor if we don't have a reference
    if (!ref.current) {
      const editor = new EditorJS({
        holder: editorblock,
        tools: EDITOR_JS_TOOLS,
        data,
        async onChange(api, event) {
          const data = await api.saver.save();
          onChange?.(data);
        },
        hideToolbar: false
      });
      ref.current = editor;
    }

    //add a return function handle cleanup
    return () => {
      if (ref?.current?.destroy) {
        ref.current.destroy();
      }
    };
  }, []);

  return <div id={editorblock} className='w-90' />;
};
