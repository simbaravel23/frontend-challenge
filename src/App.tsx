import { RouterProvider } from '@tanstack/react-router';
import { router } from './app/routes';

export function App() {
  return <RouterProvider router={router} />;
}

export default App;