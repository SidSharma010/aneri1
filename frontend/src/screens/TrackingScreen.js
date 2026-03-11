import React from 'react';
import { Text } from 'react-native';
import ScreenLayout from '../components/ScreenLayout';

export default function TrackingScreen() {
  return (
    <ScreenLayout title="Parcel Tracking">
      <Text>Live route updates, pickup confirmation, and delivery OTP verification.</Text>
    </ScreenLayout>
  );
}
