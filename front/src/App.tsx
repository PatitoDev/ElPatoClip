import ClipPage from './components/Pages/ClipPage';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import SearchPage from './components/Pages/SearchPage';
import MainTemplate from './components/Templates/MainTemplate';
import { TosPage } from './components/Pages/InfoPages/TosPage';
import { PrivacyPage } from './components/Pages/InfoPages/PrivacyPage';
import { VideoEditorPage } from './components/Pages/VideoEditorPage';
import { LoginPage } from './components/Pages/LoginPage';
import { UserProvider } from './authContext';

const router = createBrowserRouter([
  {
    path: '/',
    element:
      <UserProvider>
        <MainTemplate withHeader>
          <SearchPage />
        </MainTemplate>
      </UserProvider>
  },
  {
    path: '/login',
    element: 
      <UserProvider>
        <LoginPage />
      </UserProvider>
  },
  {
    path: '/clips/:channelId',
    element:
      <UserProvider>
        <MainTemplate withHeader>
          <ClipPage />
        </MainTemplate>
      </UserProvider>
  },
  {
    path: '/editor/:clipId',
    element: 
      <UserProvider>
        <VideoEditorPage />
      </UserProvider>
  },
  {
    path: '/tos',
    element: 
      <UserProvider>
        <MainTemplate withHeader>
          <TosPage />
        </MainTemplate>
      </UserProvider>
  },
  {
    path: '/privacy',
    element: 
      <UserProvider>
        <MainTemplate withHeader>
          <PrivacyPage />
        </MainTemplate>
      </UserProvider>
  },
]);

const App = () => (
  <RouterProvider router={router} />
);

export default App;
