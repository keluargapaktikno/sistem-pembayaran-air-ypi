// frontend-mobile/screens/HomeScreen.tsx (KODE LENGKAP)
import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { useAuthStore } from '../store/authStore';

export default function HomeScreen() {
  const { profile, logout } = useAuthStore();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Selamat Datang, {profile?.nama}!</Text>
      <Text>Peran Anda: {profile?.role}</Text>
      <View style={styles.buttonContainer}>
        <Button title="Logout" onPress={logout} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 22, fontWeight: 'bold' },
  buttonContainer: { marginTop: 20 }
});