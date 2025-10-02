// frontend-mobile/screens/InputMeterScreen.tsx (KODE LENGKAP)
import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import api from '../api/api';

export default function InputMeterScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { warga }: any = route.params; // Menerima data warga dari layar sebelumnya

  const [meterAkhir, setMeterAkhir] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    const meterValue = parseInt(meterAkhir, 10);
    if (isNaN(meterValue) || meterValue < 0) {
      Alert.alert('Input Tidak Valid', 'Mohon masukkan angka meteran yang benar.');
      return;
    }

    setIsLoading(true);
  try {
      const today = new Date();
      const periode = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-01`;

      const payload = {
        wargaId: warga.id,
        periode_pencatatan: periode,
        meter_akhir: meterValue,
      };

      await api.post('/pencatatan-meter', payload);

      Alert.alert('Sukses', 'Data meteran berhasil dicatat.');
      navigation.goBack(); // Kembali ke layar daftar warga
    } catch (error: any) {
      const status = error?.response?.status;
      const serverMsg = (error?.response?.data?.message
        ? Array.isArray(error.response.data.message)
          ? error.response.data.message.join('\n')
          : String(error.response.data.message)
        : null) as string | null;

      let title = 'Error';
      let msg = serverMsg || 'Gagal menyimpan data. Mohon coba lagi.';

      if (status === 400) {
        title = 'Input tidak valid';
        // serverMsg likely explains the exact validation issue (e.g., meter akhir < meter awal)
      } else if (status === 401) {
        title = 'Tidak terautentikasi';
        msg = 'Sesi Anda berakhir. Silakan login kembali.';
      } else if (status === 403) {
        title = 'Akses ditolak';
        msg = 'Anda tidak memiliki hak untuk melakukan pencatatan.';
      } else if (status === 409) {
        title = 'Sudah ada pencatatan';
        msg = serverMsg || 'Pencatatan untuk periode ini sudah ada.';
      } else if (status >= 500) {
        title = 'Gangguan Server';
        // keep msg as-is or default
      }

      console.error('Submit meter failed:', status, serverMsg || error.message);
      Alert.alert(title, msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.infoBox}>
        <Text style={styles.label}>Nama Warga:</Text>
        <Text style={styles.value}>{warga.nama_lengkap}</Text>
        <Text style={styles.label}>Alamat:</Text>
        <Text style={styles.value}>
          Blok {warga.blok} No. {warga.nomor_rumah}
        </Text>
      </View>

      <Text style={styles.inputLabel}>Masukkan Angka Meteran Terakhir:</Text>
      <TextInput
        style={styles.input}
        value={meterAkhir}
        onChangeText={setMeterAkhir}
        keyboardType="number-pad" // Keyboard khusus angka
        placeholder="Contoh: 150"
      />

      {isLoading ? (
        <ActivityIndicator size="large" />
      ) : (
        <Button title="Simpan Catatan" onPress={handleSubmit} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, backgroundColor: '#f5f5f5' },
    infoBox: { backgroundColor: 'white', padding: 15, borderRadius: 8, marginBottom: 20, elevation: 2 },
    label: { fontSize: 14, color: 'gray' },
    value: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
    inputLabel: { fontSize: 16, marginBottom: 10 },
    input: { height: 50, borderColor: 'gray', borderWidth: 1, marginBottom: 20, paddingHorizontal: 10, fontSize: 18, borderRadius: 8, backgroundColor: 'white' },
});