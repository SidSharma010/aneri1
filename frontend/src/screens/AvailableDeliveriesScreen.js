import React from 'react';
import { Text } from 'react-native';
import ScreenLayout from '../components/ScreenLayout';

export default function AvailableDeliveriesScreen() {
  return (
    <ScreenLayout title="Available Deliveries">
      <Text>Personalized suggestions sorted by route overlap and reward.</Text>
    </ScreenLayout>
  );
}
