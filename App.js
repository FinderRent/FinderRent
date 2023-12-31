import { StatusBar } from 'expo-status-bar';
import { I18nManager } from 'react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Toast from 'react-native-toast-message';

import AuthStackScreens from './navigation/AuthStackScreens';
import DrawerScreens from './navigation/DrawerScreens';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // staleTime: 60 * 1000,
      staleTime: 0,
    },
  },
});

export default function App() {
  I18nManager.forceRTL(true);

  return (
    <QueryClientProvider client={queryClient}>
      <StatusBar style="dark" />
      <AuthStackScreens />
      {/* <DrawerScreens /> */}
      <Toast />
    </QueryClientProvider>
  );
}
