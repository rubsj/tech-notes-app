import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { TextEditor } from './components/core/text-editor/text-editor';
import { useEffect, useState } from 'react';
import { OutputData } from '@editorjs/editorjs';
import { EditorDisplay } from './components/core/text-editor/editor-display';

function App() {
  const [data, setData] = useState<OutputData>();
  const [previewData, setPreviewData] = useState<OutputData>();

  useEffect(() => {
    setPreviewData(data);
  }, [data]);

  return (
    <>
      <div className='grid text-center'>
        <div className='g-col-6'>
          <div className='d-flex flex-column'>
            <h1>Editor</h1>
            <div className='border border-primary rounded'>
              <TextEditor
                data={data}
                onChange={setData}
                editorblock='editorjs-container'
              />
            </div>
          </div>
        </div>
        <div className='g-col-6'>
          <div className='d-flex flex-column'>
            <h1>Preview</h1>
            <div className='border border-secondary rounded'>
              {previewData && (
                <EditorDisplay
                  data={previewData}
                  editorblock='editorjs-display-container'
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
