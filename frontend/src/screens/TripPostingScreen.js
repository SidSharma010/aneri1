import React from 'react';
import { Text } from 'react-native';
import ScreenLayout from '../components/ScreenLayout';

export default function TripPostingScreen() {
  return (
    <ScreenLayout title="Post a Trip">
      <Text>Add your route, departure time, and capacity to receive parcel match suggestions.</Text>
    </ScreenLayout>
  );
}
