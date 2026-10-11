import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

/**
 * DOMONO Mobile Code Snippet viewer — shows the dummy generated
 * code/artifact for a given module inline within its pipeline card.
 */
export default function CodeSnippet({ language, code }: { language: string; code: string }) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.lang}>{language}</Text>
      </View>
      <ScrollView horizontal style={styles.scrollH}>
        <ScrollView style={styles.scrollV}>
          <Text style={styles.code}>{code}</Text>
        </ScrollView>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#020617',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#1e293b',
    overflow: 'hidden',
    marginBottom: 8,
  },
  header: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: '#0b1220',
    borderBottomWidth: 1,
    borderBottomColor: '#1e293b',
  },
  lang: {
    fontSize: 9,
    color: '#64748b',
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  scrollH: { maxHeight: 160 },
  scrollV: { padding: 10 },
  code: {
    color: '#e2e8f0',
    fontFamily: 'Courier',
    fontSize: 10,
    lineHeight: 15,
  },
});
