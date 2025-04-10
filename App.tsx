import React, { useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { Stack, RootStackParamList } from "./navigation/StackNavigator";
import { createStackNavigator } from "@react-navigation/stack";
import SearchScreen from "./screens/SearchScreen";
import { AuthProvider } from "./Context/AuthContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ResultsScreen from "./screens/ResultsScreen";

const StackNavigator = createStackNavigator<RootStackParamList>();

export default function App() {
  return (
      <AuthProvider>
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="SearchScreen" component={SearchScreen}  options={{headerShown: false,}}/>
      </Stack.Navigator>
    </NavigationContainer>
      </AuthProvider>
  );
}