import React from 'react';
import { Text } from 'react-native';
import ScreenLayout from '../components/ScreenLayout';

export default function HomeScreen() {
  return (
    <ScreenLayout title="TravelParcel">
      <Text>Find route-matched travelers, track deliveries, and chat in real time.</Text>
    </ScreenLayout>
  );
}
