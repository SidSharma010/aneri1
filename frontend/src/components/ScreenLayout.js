import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function ScreenLayout({ title, children }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.content}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#F7F8FA' },
  title: { fontSize: 24, fontWeight: '700', marginBottom: 12 },
  content: { flex: 1, backgroundColor: '#FFF', borderRadius: 12, padding: 16 }
});
