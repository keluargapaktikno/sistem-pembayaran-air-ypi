// frontend-mobile/screens/WargaListScreen.tsx (KODE FINAL DENGAN PENCARIAN)
import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, Button, TouchableOpacity, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import api, { API_BASE_URL } from '../api/api';
import { useDebounce } from '../hooks/useDebounce';

interface Warga {
  id: string;
  nama_lengkap: string;
  blok: string;
  nomor_rumah: string;
}

export default function WargaListScreen() {
  const [warga, setWarga] = useState<Warga[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigation = useNavigation<any>();
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const fetchWarga = useCallback(async (search: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.get(`/warga?search=${search}`);
      setWarga(response.data.data); // Backend mengembalikan data dalam properti `data`
    } catch (err: any) {
      const status = err?.response?.status;
      const msg = status ? `Gagal memuat data warga (HTTP ${status}).` : 'Jaringan bermasalah.';
      console.error('Failed to fetch warga:', err?.message || err);
      setError(`${msg}`);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchWarga(debouncedSearchTerm);
  }, [debouncedSearchTerm, fetchWarga]);

  const renderItem = ({ item }: { item: Warga }) => (
    <TouchableOpacity
      style={styles.itemContainer}
      onPress={() => navigation.navigate('InputMeter', { warga: item })}
    >
      <Text style={styles.itemNama}>{item.nama_lengkap}</Text>
      <Text style={styles.itemAlamat}>
        Blok {item.blok} No. {item.nomor_rumah}
      </Text>
    </TouchableOpacity>
  );
  
  const ListHeader = () => (
    <View style={styles.searchContainer}>
      <TextInput
        style={styles.searchInput}
        placeholder="Cari warga..."
        value={searchTerm}
        onChangeText={setSearchTerm}
      />
    </View>
  );

  const ListEmptyComponent = () => {
    if (isLoading) {
      return <ActivityIndicator size="large" style={styles.centered} />;
    }
    if (error) {
      return (
        <View style={styles.centered}>
          <Text style={styles.errorText}>{error}</Text>
          <Text style={styles.hint}>API: {API_BASE_URL}</Text>
          <Button title="Coba Lagi" onPress={() => fetchWarga(debouncedSearchTerm)} />
        </View>
      );
    }
    return (
      <View style={styles.centered}>
        <Text>Tidak ada data warga.</Text>
      </View>
    );
  };

  return (
    <FlatList
      data={warga}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
      ListHeaderComponent={ListHeader}
      ListEmptyComponent={ListEmptyComponent}
      contentContainerStyle={styles.list}
    />
  );
}

const styles = StyleSheet.create({
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  list: { flexGrow: 1, backgroundColor: '#f5f5f5' },
  searchContainer: { padding: 10, backgroundColor: 'white' },
  searchInput: {
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    backgroundColor: '#f5f5f5'
  },
  itemContainer: {
    backgroundColor: 'white',
    padding: 15,
    marginHorizontal: 10,
    borderRadius: 8,
    marginBottom: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  itemNama: { fontSize: 16, fontWeight: 'bold' },
  itemAlamat: { fontSize: 14, color: 'gray', marginTop: 4 },
  errorText: { textAlign: 'center', color: 'crimson', marginBottom: 8 },
  hint: { textAlign: 'center', color: 'gray', marginBottom: 12 },
});