// frontend-mobile/navigation/RootNavigator.tsx (KODE BARU)
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuthStore } from '../store/authStore';

import LoginScreen from '../screens/LoginScreen';
import AppNavigator from './AppNavigator'; // <- Impor navigator tab kita

const Stack = createNativeStackNavigator();

export default function RootNavigator() {
  const { token } = useAuthStore();

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {token ? (
          // Jika ada token, tampilkan seluruh AppNavigator (dengan tab)
          <Stack.Screen
            name="App"
            component={AppNavigator}
            options={{ headerShown: false }} // Sembunyikan header ganda
          />
        ) : (
          // Jika tidak ada token, tampilkan layar login
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{ headerShown: false }}
          />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}