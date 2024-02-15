import { createBrowserRouter, Outlet } from 'react-router-dom';

import { AddEditNote } from './add-edit-note';
import { ErrorPage } from './error-page';
import { Home } from './home';
import { ListNotes } from './list-notes';
import { NoteDetail } from './note-detail';

export const Layout = () => {
  return <Outlet />;
};

export const BrowserRoutes = createBrowserRouter([
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

export const BreadCrumbPathMapping = new Map<string, string>()
  .set('/', 'Home')
  .set('/add-edit-note', 'Add Edit Note')
  .set('/list-notes', 'List Notes')
  .set('/list-notes/:id', 'Note Detail');
