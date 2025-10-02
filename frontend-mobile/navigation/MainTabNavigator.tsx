// frontend-mobile/navigation/MainTabNavigator.tsx (KODE LENGKAP)
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import WargaListScreen from '../screens/WargaListScreen';
import HomeScreen from '../screens/HomeScreen';

const Tab = createBottomTabNavigator();

export default function MainTabNavigator() {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="Warga"
        component={WargaListScreen}
        options={{ title: 'Daftar Warga', headerShown: false }} // Sembunyikan header tab
      />
      <Tab.Screen
        name="Profile"
        component={HomeScreen}
        options={{ title: 'Profil Saya' }}
      />
    </Tab.Navigator>
  );
}