import { BrowserRouter } from 'react-router-dom';
import { NotificationProvider } from './contexts/NotificationContext';
import { AppRoutes } from './routes/AppRoutes';

export default function App() {
  return (
    <NotificationProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </NotificationProvider>
  );
}
