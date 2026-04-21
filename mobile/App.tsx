import { StatusBar } from "expo-status-bar";
import { Provider } from "react-redux";
import { NavigationContainer } from "@react-navigation/native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import RootNavigator from "./src/navigation/RootNavigator";
import { navigateRef } from "./src/navigation/navigateRef";
import { store } from "./src/stores/store";
import AuthRestore from "./src/features/auth/authComponent/AuthRestore";

export default function App() {
  return (
    <Provider store={store}>
      <AuthRestore/>
      <SafeAreaProvider>
        <NavigationContainer ref={navigateRef}>
          <RootNavigator />
        </NavigationContainer>
        <Toast />
        <StatusBar style="light" />
      </SafeAreaProvider>
    </Provider>
  );
}
