// frontend-mobile/navigation/AppNavigator.tsx (KODE BARU)
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MainTabNavigator from './MainTabNavigator';
import InputMeterScreen from '../screens/InputMeterScreen'; // Akan kita buat

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Main"
        component={MainTabNavigator}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="InputMeter"
        component={InputMeterScreen}
        options={{ title: 'Catat Meteran' }} // Judul di header layar
      />
    </Stack.Navigator>
  );
}