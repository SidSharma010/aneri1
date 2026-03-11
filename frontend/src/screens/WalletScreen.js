import React from 'react';
import { Text } from 'react-native';
import ScreenLayout from '../components/ScreenLayout';

export default function WalletScreen() {
  return (
    <ScreenLayout title="Wallet & Earnings">
      <Text>See completed deliveries, escrow status, and withdraw earnings via UPI.</Text>
    </ScreenLayout>
  );
}
