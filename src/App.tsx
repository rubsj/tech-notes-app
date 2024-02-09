import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
/* import { TextEditor } from './components/editor/text-editor';
import { useEffect, useState } from 'react';
import { OutputData } from '@editorjs/editorjs';
import { EditorDisplay } from './components/editor/editor-display';
import { AddEditNote } from './pages/add-edit-note'; */
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { Home } from './pages/home';
import { Layout } from './pages/layout';
import { ListNotes } from './pages/list-notes';
import { NoteDetail } from './pages/note-detail';
import Spinner from 'react-bootstrap/esm/Spinner';
import { ErrorPage } from './pages/error-page';
import { AddEditNote } from './pages/add-edit-note';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

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

const BrowserRoutes = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: '/',
        element: <Home />
      },
      {
        path: 'add-edit-note',
        element: <AddEditNote />
      },
      {
        path: 'list-notes',
        element: <ListNotes />
      },
      {
        path: 'list-notes/:id',
        element: <NoteDetail />
      }
    ]
  }
]);

export const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider
        router={BrowserRoutes}
        fallbackElement={<Spinner animation='border' variant="primary" />}
      />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
};
//export default App;
