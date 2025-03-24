import { createStackNavigator } from "@react-navigation/stack";

export type RootStackParamList = {
  SearchScreen: undefined;
  Results: { products: any[] };
};

export const Stack = createStackNavigator<RootStackParamList>();