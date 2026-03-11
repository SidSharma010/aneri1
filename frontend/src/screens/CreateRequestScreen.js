import React, { useState } from 'react';
import { Button, TextInput, View } from 'react-native';
import ScreenLayout from '../components/ScreenLayout';
import { api } from '../services/api';

export default function CreateRequestScreen() {
  const [pickupAddress, setPickupAddress] = useState('Delhi');
  const [dropAddress, setDropAddress] = useState('Haridwar');

  async function submit() {
    await api.post('/delivery-requests', {
      pickupAddress,
      dropAddress,
      pickupLat: 28.6139,
      pickupLng: 77.209,
      dropLat: 29.9457,
      dropLng: 78.1642,
      weightKg: 1.2,
      category: 'documents',
      rewardInr: 450,
      pickupBy: new Date(Date.now() + 86400000).toISOString()
    });
  }

  return (
    <ScreenLayout title="Create Delivery Request">
      <View style={{ gap: 12 }}>
        <TextInput value={pickupAddress} onChangeText={setPickupAddress} placeholder="Pickup" style={{ borderWidth: 1, padding: 8 }} />
        <TextInput value={dropAddress} onChangeText={setDropAddress} placeholder="Drop" style={{ borderWidth: 1, padding: 8 }} />
        <Button title="Post Request" onPress={submit} />
      </View>
    </ScreenLayout>
  );
}
