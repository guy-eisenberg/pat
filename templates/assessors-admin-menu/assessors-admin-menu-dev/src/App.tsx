import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createHashRouter, RouterProvider } from 'react-router-dom';
import { AssessorPage, HomePage } from './pages';

const router = createHashRouter([
  { path: '/', index: true, element: <HomePage /> },
  { path: '/:assessorId', element: <AssessorPage /> },
]);

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: 0, staleTime: Infinity } },
});

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
};

export default App;
