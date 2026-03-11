import React from 'react';
import { Text } from 'react-native';
import ScreenLayout from '../components/ScreenLayout';

export default function ChatScreen() {
  return (
    <ScreenLayout title="Chat">
      <Text>In-app encrypted messaging between sender, traveler, and receiver.</Text>
    </ScreenLayout>
  );
}
