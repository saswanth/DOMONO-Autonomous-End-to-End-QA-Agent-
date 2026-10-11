import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Animated,
  Easing,
} from 'react-native';

/**
 * DOMONO Mobile Landing Screen — rocket-launch themed hero screen,
 * native companion to the web LandingPage.
 */
export default function LandingScreen({ onLaunch }: { onLaunch: () => void }) {
  const floatAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: -14,
          duration: 1500,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 1500,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [floatAnim]);

  const modules = [
    'User Story Analyzer',
    'DOM Scanner',
    'Playwright Generator',
    'Self-Healer',
    'Dashboard & GitHub',
    'Web + Native UI',
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Animated.Text style={[styles.rocket, { transform: [{ translateY: floatAnim }] }]}>
          🚀
        </Animated.Text>
        <Text style={styles.title}>DOMONO</Text>
        <Text style={styles.subtitle}>
          Autonomous End-to-End QA Agent — story analysis, DOM scanning, Playwright
          generation, runtime self-healing, and GitHub-integrated reporting, all in one
          mission control.
        </Text>

        <TouchableOpacity style={styles.launchButton} onPress={onLaunch} activeOpacity={0.85}>
          <Text style={styles.launchButtonText}>🚀 Launch Mission Control</Text>
        </TouchableOpacity>

        <View style={styles.pillRow}>
          {modules.map((m) => (
            <View key={m} style={styles.pill}>
              <Text style={styles.pillText}>{m}</Text>
            </View>
          ))}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#020617' },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  rocket: { fontSize: 64, marginBottom: 12 },
  title: {
    fontSize: 36,
    fontWeight: '800',
    color: '#e0e7ff',
    letterSpacing: 1,
  },
  subtitle: {
    marginTop: 10,
    fontSize: 13,
    color: '#94a3b8',
    textAlign: 'center',
    lineHeight: 19,
  },
  launchButton: {
    marginTop: 32,
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 999,
    backgroundColor: '#059669',
    shadowColor: '#0ea5e9',
    shadowOpacity: 0.5,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  launchButtonText: { color: '#ffffff', fontWeight: '700', fontSize: 14 },
  pillRow: {
    marginTop: 36,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
  },
  pill: {
    borderWidth: 1,
    borderColor: '#334155',
    backgroundColor: 'rgba(30,41,59,0.5)',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginBottom: 6,
  },
  pillText: { color: '#94a3b8', fontSize: 10 },
});
