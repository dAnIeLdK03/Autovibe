import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Home from "../app/Home";
import CarListScreen from "../features/cars/CarList/CarListScreen"; 
import LoginScreen from "../screens/LoginScreen";
import type { RootStackParamList } from "./types";
import Navbar from "../shared/Navbar/Navbar";
import RegisterScreen from "../screens/RegisterScreen";
import CarDetails from "../features/cars/CarDetails/CarDetailsScreen";

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: true,
        header: () => <Navbar/>,
      }}
    >
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="CarList" component={CarListScreen} />
      <Stack.Screen name="Login" component={LoginScreen} options={{headerShown: false}} />
      <Stack.Screen name="Register" component={RegisterScreen} options={{headerShown: false}} />
      <Stack.Screen name="CarDetails" component={CarDetails} />

    </Stack.Navigator>
  );
}
