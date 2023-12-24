import { StatusBar } from 'expo-status-bar';
import AuthStackScreens from './navigation/AuthStackScreens';

export default function App() {
  return (
    <>
      <StatusBar style="dark" />
      <AuthStackScreens />
    </>
  );
}
