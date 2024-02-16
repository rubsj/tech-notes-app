import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import Spinner from 'react-bootstrap/esm/Spinner';
import { RouterProvider } from 'react-router-dom';

import { BrowserRoutes } from './pages/layout';

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
