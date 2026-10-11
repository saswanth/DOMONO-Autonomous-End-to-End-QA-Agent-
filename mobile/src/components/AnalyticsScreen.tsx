import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

/**
 * DOMONO Mobile Analytics Screen — aggregated execution analytics across
 * all pipelines: KPIs, pass/fail trend, healing confidence distribution,
 * and per-module run counts. Plain React Native Views, no chart library.
 */

const TREND = [
  { day: 'Mon', passRate: 82 },
  { day: 'Tue', passRate: 88 },
  { day: 'Wed', passRate: 75 },
  { day: 'Thu', passRate: 91 },
  { day: 'Fri', passRate: 86 },
  { day: 'Sat', passRate: 94 },
  { day: 'Sun', passRate: 92 },
];

const MODULE_RUNS = [
  { label: 'Analyzer', runs: 34 },
  { label: 'Scanner', runs: 29 },
  { label: 'Generator', runs: 31 },
  { label: 'Execution', runs: 40 },
  { label: 'Self-Healer', runs: 12 },
  { label: 'Reporting', runs: 27 },
];

const HEALING_CONFIDENCE = [
  { testId: 'HELP-142-TC01', confidence: 0.93 },
  { testId: 'HELP-142-TC02', confidence: 0.81 },
  { testId: 'HELP-140-TC03', confidence: 0.67 },
  { testId: 'HELP-138-TC01', confidence: 0.58 },
];

export default function AnalyticsScreen() {
  const maxRuns = Math.max(...MODULE_RUNS.map((m) => m.runs));

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.kpiGrid}>
        <KpiCard label="Total Runs" value="173" />
        <KpiCard label="Avg Pass Rate" value="87%" />
        <KpiCard label="Avg Healing Confidence" value="75%" />
        <KpiCard label="Open PRs" value="4" />
      </View>

      <Card title="Weekly Pass Rate Trend">
        <View style={styles.trendChart}>
          {TREND.map((t) => (
            <View key={t.day} style={styles.trendCol}>
              <View style={styles.trendTrack}>
                <View style={[styles.trendBar, { height: `${t.passRate}%` }]} />
              </View>
              <Text style={styles.trendLabel}>{t.day}</Text>
            </View>
          ))}
        </View>
      </Card>

      <Card title="Pipeline Runs by Module">
        {MODULE_RUNS.map((m) => (
          <HBar key={m.label} label={m.label} value={m.runs} pct={(m.runs / maxRuns) * 100} suffix="" />
        ))}
      </Card>

      <Card title="Self-Healing Confidence">
        {HEALING_CONFIDENCE.map((h) => (
          <HBar
            key={h.testId}
            label={h.testId}
            value={`${(h.confidence * 100).toFixed(0)}%`}
            pct={h.confidence * 100}
            confidence
          />
        ))}
      </Card>
    </ScrollView>
  );
}

function KpiCard({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.kpiCard}>
      <Text style={styles.kpiLabel}>{label}</Text>
      <Text style={styles.kpiValue}>{value}</Text>
    </View>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>{title}</Text>
      {children}
    </View>
  );
}

function HBar({ label, value, pct, confidence }: { label: string; value: string | number; pct: number; suffix?: string; confidence?: boolean }) {
  return (
    <View style={styles.hbarRow}>
      <Text style={styles.hbarLabel} numberOfLines={1}>{label}</Text>
      <View style={styles.hbarTrack}>
        <View style={[styles.hbarFill, confidence && styles.hbarFillConfidence, { width: `${pct}%` }]} />
      </View>
      <Text style={styles.hbarValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, paddingBottom: 40, backgroundColor: '#0f172a' },
  kpiGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 16 },
  kpiCard: {
    flexBasis: '47%',
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: '#334155',
  },
  kpiLabel: { color: '#94a3b8', fontSize: 11 },
  kpiValue: { color: '#f8fafc', fontSize: 22, fontWeight: '800', marginTop: 6 },
  card: {
    backgroundColor: '#1e293b',
    borderRadius: 14,
    padding: 14,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#334155',
  },
  cardTitle: { color: '#f8fafc', fontWeight: '700', fontSize: 13, marginBottom: 12 },
  trendChart: { flexDirection: 'row', alignItems: 'flex-end', height: 110, gap: 8 },
  trendCol: { flex: 1, alignItems: 'center' },
  trendTrack: { height: 90, width: '100%', justifyContent: 'flex-end', alignItems: 'center' },
  trendBar: { width: 16, backgroundColor: '#38bdf8', borderRadius: 4 },
  trendLabel: { color: '#64748b', fontSize: 9, marginTop: 4 },
  hbarRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 10 },
  hbarLabel: { width: 78, color: '#cbd5e1', fontSize: 10 },
  hbarTrack: { flex: 1, height: 7, backgroundColor: '#0f172a', borderRadius: 999, overflow: 'hidden' },
  hbarFill: { height: '100%', backgroundColor: '#10b981', borderRadius: 999 },
  hbarFillConfidence: { backgroundColor: '#38bdf8' },
  hbarValue: { width: 34, color: '#94a3b8', fontSize: 10, textAlign: 'right' },
});
