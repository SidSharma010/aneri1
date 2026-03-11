import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/HomeScreen';
import CreateRequestScreen from '../screens/CreateRequestScreen';
import TripPostingScreen from '../screens/TripPostingScreen';
import TrackingScreen from '../screens/TrackingScreen';
import WalletScreen from '../screens/WalletScreen';

const Tab = createBottomTabNavigator();

export default function AppNavigator() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Send Parcel" component={CreateRequestScreen} />
      <Tab.Screen name="Post Trip" component={TripPostingScreen} />
      <Tab.Screen name="Tracking" component={TrackingScreen} />
      <Tab.Screen name="Wallet" component={WalletScreen} />
    </Tab.Navigator>
  );
}
