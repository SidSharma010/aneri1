import React from 'react';
import { Text } from 'react-native';
import ScreenLayout from '../components/ScreenLayout';

export default function LoginScreen() {
  return (
    <ScreenLayout title="Login">
      <Text>Phone OTP, email magic link, and Google sign in.</Text>
    </ScreenLayout>
  );
}
