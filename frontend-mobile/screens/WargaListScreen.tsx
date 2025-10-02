// frontend-mobile/screens/WargaListScreen.tsx (KODE BARU & INTERAKTIF)
import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, Button, TouchableOpacity } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import api, { API_BASE_URL } from '../api/api';
import { useAuthStore } from '../store/authStore';

interface Warga {
  id: string;
  nama_lengkap: string;
  blok: string;
  nomor_rumah: string;
}

export default function WargaListScreen() {
  const [warga, setWarga] = useState<Warga[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigation = useNavigation<any>(); // Hook untuk navigasi

  const fetchWarga = async () => {
    setIsLoading(true);
    setError(null);
    const token = useAuthStore.getState().token;
    const profile = useAuthStore.getState().profile;
    console.warn('[FETCH WARGA]', 'Token:', token ? 'present' : 'missing', 'Role:', profile?.role);
    try {
      const response = await api.get('/warga');
      setWarga(response.data);
    } catch (err: any) {
      // Tampilkan pesan error yang lebih informatif
      const status = err?.response?.status;
      const msg = status ? `Gagal memuat data warga (HTTP ${status}).` : 'Jaringan bermasalah saat memuat data warga.';
      console.error('Failed to fetch warga:', err?.message || err);
      setError(`${msg} Pastikan ponsel dan komputer satu Wi-Fi dan sudah login.`);
    } finally {
      setIsLoading(false);
    }
  };
  
  // useFocusEffect akan menjalankan fetch data setiap kali layar ini difokuskan
  useFocusEffect(
    useCallback(() => {
      fetchWarga();
    }, [])
  );

  const renderItem = ({ item }: { item: Warga }) => (
    // Bungkus dengan TouchableOpacity
    <TouchableOpacity
      style={styles.itemContainer}
      onPress={() => navigation.navigate('InputMeter', { warga: item })} // Navigasi ke InputMeter dan kirim data warga
    >
      <Text style={styles.itemNama}>{item.nama_lengkap}</Text>
      <Text style={styles.itemAlamat}>
        Blok {item.blok} No. {item.nomor_rumah}
      </Text>
    </TouchableOpacity>
  );
  
  if (isLoading) {
    return <ActivityIndicator size="large" style={styles.centered} />;
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{error}</Text>
        <Text style={styles.hint}>API: {API_BASE_URL}</Text>
        <Button title="Coba Lagi" onPress={fetchWarga} />
      </View>
    );
  }

  return (
    <FlatList
      data={warga}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.list}
    />
  );
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  list: {
    padding: 10,
  },
  itemContainer: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    // Shadow untuk iOS
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    // Shadow untuk Android
    elevation: 3,
  },
  itemNama: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  itemAlamat: {
    fontSize: 14,
    color: 'gray',
    marginTop: 4,
  },
  errorText: {
    textAlign: 'center',
    color: 'crimson',
    marginBottom: 8,
  },
  hint: {
    textAlign: 'center',
    color: 'gray',
    marginBottom: 12,
  },
});