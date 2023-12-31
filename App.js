import { StatusBar } from 'expo-status-bar';
import { I18nManager } from 'react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Toast from 'react-native-toast-message';

import AuthStackScreens from './navigation/AuthStackScreens';
import DrawerScreens from './navigation/DrawerScreens';
import { UserContext, useUsers } from './context/UserContext';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // staleTime: 60 * 1000,
      staleTime: 0,
    },
  },
});

export default function App() {
  const { login, logout, userData } = useUsers();
  I18nManager.forceRTL(false);

  return (
    <QueryClientProvider client={queryClient}>
      <UserContext.Provider value={{ login, logout, userData }}>
        <StatusBar style="dark" />
        {/* <AuthStackScreens /> */}
        <DrawerScreens />
        <Toast />
      </UserContext.Provider>
    </QueryClientProvider>
  );
}
