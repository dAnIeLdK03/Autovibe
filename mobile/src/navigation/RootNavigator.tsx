import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Home from "../app/Home";
import CarListScreen from "../screens/CarListScreen";
import LoginScreen from "../screens/LoginScreen";
import type { RootStackParamList } from "./types";

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="CarList" component={CarListScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
    </Stack.Navigator>
  );
}
