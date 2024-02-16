import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import Spinner from 'react-bootstrap/esm/Spinner';
/* import { TextEditor } from './components/editor/text-editor';
import { useEffect, useState } from 'react';
import { OutputData } from '@editorjs/editorjs';
import { EditorDisplay } from './components/editor/editor-display';
import { AddEditNote } from './pages/add-edit-note'; */
import { RouterProvider } from 'react-router-dom';

import { BrowserRoutes } from './pages/layout';
/* function App() {
  const [data, setData] = useState<OutputData>();
  const [previewData, setPreviewData] = useState<OutputData>();

  useEffect(() => {
    setPreviewData(data);
  }, [data]);

  return (
    <>
      <div>
        <AddEditNote />
      </div>
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
 */

const queryClient = new QueryClient();

export const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider
        router={BrowserRoutes}
        fallbackElement={<Spinner animation='border' variant='primary' />}
      />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
};
