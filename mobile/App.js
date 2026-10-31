import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { SafeAreaProvider } from "react-native-safe-area-context";

import Login from "./screens/Login";
import Cadastro from "./screens/Cadastro";
import Home from "./screens/Home";
import Detalhes from "./screens/Detalhes";
import FormReceita from "./screens/FormReceita";

const Stack = createStackNavigator();

const headerPadrao = {
  headerStyle: {
    backgroundColor: "#FFF8F5",
    elevation: 0,
    shadowOpacity: 0,
    borderBottomWidth: 1,
    borderBottomColor: "#F0E8E4",
  },
  headerTintColor: "#E8593A",
  headerTitleStyle: {
    fontWeight: "700",
    color: "#2B2B2B",
  },
};

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Login"
          screenOptions={headerPadrao}
        >
          <Stack.Screen
            name="Login"
            component={Login}
            options={{ headerShown: false }}
          />

          <Stack.Screen
            name="Cadastro"
            component={Cadastro}
            options={{ title: "Criar conta" }}
          />

          <Stack.Screen
            name="Home"
            component={Home}
            options={{
              title: "APPetite Book",
              headerLeft: () => null,
            }}
          />

          <Stack.Screen
            name="Detalhes"
            component={Detalhes}
            options={{ title: "Detalhes da receita" }}
          />

          <Stack.Screen
            name="FormReceita"
            component={FormReceita}
            options={({ route }) => ({
              title: route.params?.inclusao
                ? "Nova receita"
                : "Editar receita",
            })}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}