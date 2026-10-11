import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import PipelineCard from './PipelineCard';
import AnalyticsScreen from './AnalyticsScreen';

/**
 * DOMONO Mobile Control Dashboard (Module 0)
 * Native companion to the web dashboard: hosts six independently
 * runnable pipelines — one per DOMONO module — each with its own
 * controls, status, and logs. Plain React Native StyleSheet, no Tailwind.
 */

const METRICS = { passed: 11, failed: 1, healed: 2, passRate: 92 };

const PIPELINES = [
  {
    id: 'analyzer',
    icon: '📝',
    label: 'User Story Analyzer',
    description: 'Converts raw user stories into structured test requirements (Module 1).',
    steps: [
      'Parsing user story and acceptance criteria…',
      'Extracting personas and edge cases…',
      'Generating structured test_cases JSON…',
    ],
    finalStatus: 'passed' as const,
    codeLanguage: 'json',
    code: '{\n  "story_id": "HELP-142",\n  "test_cases": [\n    { "test_id": "HELP-142-TC01", "type": "happy_path" }\n  ]\n}',
  },
  {
    id: 'scanner',
    icon: '🔍',
    label: 'DOM & Env Scanner',
    description: 'Maps interactive UI elements to stable locator strategies (Module 2).',
    steps: [
      'Capturing DOM snapshot / accessibility tree…',
      'Ranking locator stability…',
      'Emitting mapped_elements JSON…',
    ],
    finalStatus: 'passed' as const,
    codeLanguage: 'json',
    code: '{\n  "page_url": "https://helpdesk.example.com/tickets/4821",\n  "mapped_elements": [\n    { "element_label": "Confirm Button", "primary_selector": "role=button[name=\\"Confirm\\"]" }\n  ]\n}',
  },
  {
    id: 'generator',
    icon: '🧩',
    label: 'Playwright Generator',
    description: 'Synthesizes test plans + locators into Playwright TS specs (Module 3).',
    steps: [
      'Binding test cases to mapped selectors…',
      'Applying web-first assertions…',
      'Writing executable .spec.ts file…',
    ],
    finalStatus: 'passed' as const,
    codeLanguage: 'typescript',
    code: "test('TC01: reassignment email', async ({ page }) => {\n  await page.getByRole('button', { name: 'Confirm' }).click();\n  await expect(page.getByTestId('toast')).toContainText('Email sent');\n});",
  },
  {
    id: 'execution',
    icon: '⚙️',
    label: 'Test Execution',
    description: 'Runs the generated Playwright suite against the target environment.',
    steps: [
      'Launching browser contexts…',
      'Executing HELP-142-TC01…',
      'Executing HELP-142-TC02…',
    ],
    finalStatus: 'failed' as const,
    codeLanguage: 'text',
    code: '✓ HELP-142-TC01 passed (842ms)\n✘ HELP-142-TC02 failed (1203ms)\n\n1 failed, 1 passed (2 total)',
  },
  {
    id: 'healer',
    icon: '🩹',
    label: 'Runtime Self-Healer',
    description: 'Repairs broken locators against the live DOM state (Module 4).',
    steps: [
      'Inspecting failure stack trace…',
      'Diffing live DOM against last known selector…',
      'Computing confidence score and patch…',
    ],
    finalStatus: 'healed' as const,
    codeLanguage: 'json',
    code: '{\n  "failed_locator": "[data-testid=\\"confirm-btn\\"]",\n  "healed_locator": "role=button[name=\\"Confirm\\"]",\n  "confidence_score": 0.93\n}',
  },
  {
    id: 'reporting',
    icon: '📊',
    label: 'Reporting & GitHub',
    description: 'Publishes dashboard report and opens the GitHub PR (Module 5).',
    steps: [
      'Compiling execution metrics and healing audit log…',
      'Committing specs + patches…',
      'Opening Pull Request + sending PAT-authenticated email…',
    ],
    finalStatus: 'passed' as const,
    codeLanguage: 'bash',
    code: 'git commit -m "feat(qa): auto-generated specs for HELP-142"\ngit push -u origin domono/qa-automation-suite\n# PR opened ✓',
  },
];

export default function DomonoDashboard({ onExit }: { onExit?: () => void }) {
  const [view, setView] = useState<'pipelines' | 'analytics'>('pipelines');

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.title}>🚀 DOMONO</Text>
          <Text style={styles.subtitle}>Autonomous QA Control</Text>
        </View>
        {onExit && (
          <TouchableOpacity style={styles.exitButton} onPress={onExit}>
            <Text style={styles.exitButtonText}>← Landing</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.viewToggleRow}>
        <TouchableOpacity
          style={[styles.viewToggleBtn, view === 'pipelines' && styles.viewToggleBtnActive]}
          onPress={() => setView('pipelines')}
        >
          <Text style={styles.viewToggleText}>Pipelines</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.viewToggleBtn, view === 'analytics' && styles.viewToggleBtnActive]}
          onPress={() => setView('analytics')}
        >
          <Text style={styles.viewToggleText}>📈 Analytics</Text>
        </TouchableOpacity>
      </View>

      {view === 'pipelines' ? (
        <ScrollView contentContainerStyle={styles.container}>
          <View style={styles.metricsGrid}>
            <MetricCard label="Pass Rate" value={`${METRICS.passRate}%`} color="#34d399" />
            <MetricCard label="Passed" value={`${METRICS.passed}`} color="#34d399" />
            <MetricCard label="Failed" value={`${METRICS.failed}`} color="#f87171" />
            <MetricCard label="Self-Healed" value={`${METRICS.healed}`} color="#38bdf8" />
          </View>

          {PIPELINES.map((pipeline) => (
            <PipelineCard key={pipeline.id} {...pipeline} />
          ))}
        </ScrollView>
      ) : (
        <AnalyticsScreen />
      )}
    </SafeAreaView>
  );
}

function MetricCard({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <View style={styles.metricCard}>
      <Text style={styles.metricLabel}>{label}</Text>
      <Text style={[styles.metricValue, { color }]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#0f172a' },
  container: { padding: 16, paddingBottom: 40 },
  headerRow: { marginBottom: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  title: { fontSize: 24, fontWeight: '700', color: '#f8fafc' },
  subtitle: { fontSize: 13, color: '#94a3b8' },
  exitButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: '#1e293b',
  },
  exitButtonText: { color: '#cbd5e1', fontSize: 12, fontWeight: '600' },
  viewToggleRow: { flexDirection: 'row', gap: 8, paddingHorizontal: 16, marginBottom: 12 },
  viewToggleBtn: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 8,
    backgroundColor: '#1e293b',
  },
  viewToggleBtnActive: { backgroundColor: '#0ea5e9' },
  viewToggleText: { color: '#e2e8f0', fontSize: 12, fontWeight: '600' },
  metricsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 16 },
  metricCard: {
    flexBasis: '47%',
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 12,
  },
  metricLabel: { color: '#94a3b8', fontSize: 12 },
  metricValue: { fontSize: 20, fontWeight: '700', marginTop: 4 },
});
