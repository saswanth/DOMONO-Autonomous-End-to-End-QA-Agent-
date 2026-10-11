import React, { useEffect, useRef, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import CodeSnippet from './CodeSnippet';

type Status = 'queued' | 'running' | 'passed' | 'failed' | 'healed';

interface LogEntry {
  ts: string;
  message: string;
}

interface PipelineCardProps {
  icon: string;
  label: string;
  description: string;
  steps: string[];
  finalStatus?: Status;
  codeLanguage?: string;
  code?: string;
}

const STATUS_COLORS: Record<Status, { bg: string; text: string }> = {
  queued: { bg: '#334155', text: '#94a3b8' },
  running: { bg: '#78350f', text: '#fbbf24' },
  passed: { bg: '#065f46', text: '#6ee7b7' },
  failed: { bg: '#7f1d1d', text: '#fca5a5' },
  healed: { bg: '#0c4a6e', text: '#7dd3fc' },
};

/**
 * DOMONO Mobile Pipeline Card — an independently runnable pipeline for a
 * single DOMONO module, with its own Run/Stop controls, status, and logs.
 */
export default function PipelineCard({ icon, label, description, steps, finalStatus = 'passed', codeLanguage, code }: PipelineCardProps) {
  const [status, setStatus] = useState<Status>('queued');
  const [logs, setLogs] = useState<LogEntry[]>([{ ts: '00:00:00', message: `${label} pipeline ready.` }]);
  const [showCode, setShowCode] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const stepRef = useRef(0);

  const appendLog = (message: string) => {
    const ts = new Date().toISOString().slice(11, 19);
    setLogs((prev) => [...prev.slice(-49), { ts, message }]);
  };

  const run = () => {
    if (status === 'running') return;
    setStatus('running');
    stepRef.current = 0;
    appendLog(`${label} pipeline started.`);

    timerRef.current = setInterval(() => {
      const idx = stepRef.current;
      if (idx >= steps.length) {
        if (timerRef.current) clearInterval(timerRef.current);
        setStatus(finalStatus);
        appendLog(`${label} pipeline finished: ${finalStatus}.`);
        return;
      }
      appendLog(steps[idx]);
      stepRef.current += 1;
    }, 900);
  };

  const stop = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setStatus('queued');
    appendLog(`${label} pipeline stopped by user.`);
  };

  useEffect(() => () => {
    if (timerRef.current) clearInterval(timerRef.current);
  }, []);

  const colors = STATUS_COLORS[status];

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <View style={styles.titleRow}>
          <Text style={styles.icon}>{icon}</Text>
          <Text style={styles.title}>{label}</Text>
        </View>
        <View style={[styles.badge, { backgroundColor: colors.bg }]}>
          <Text style={[styles.badgeText, { color: colors.text }]}>{status}</Text>
        </View>
      </View>

      <Text style={styles.description}>{description}</Text>

      <View style={styles.logBox}>
        <ScrollView style={{ maxHeight: 90 }}>
          {logs.map((log, i) => (
            <Text key={i} style={styles.logLine}>
              <Text style={styles.logTs}>[{log.ts}] </Text>
              {log.message}
            </Text>
          ))}
        </ScrollView>
      </View>

      <View style={styles.controlsRow}>
        <TouchableOpacity
          style={[styles.button, styles.runButton, status === 'running' && styles.buttonDisabled]}
          onPress={run}
          disabled={status === 'running'}
        >
          <Text style={styles.buttonText}>▶ Run</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.stopButton, status !== 'running' && styles.buttonDisabled]}
          onPress={stop}
          disabled={status !== 'running'}
        >
          <Text style={styles.buttonText}>■ Stop</Text>
        </TouchableOpacity>
        {!!code && (
          <TouchableOpacity style={[styles.button, styles.codeButton]} onPress={() => setShowCode((v) => !v)}>
            <Text style={styles.buttonText}>{showCode ? '▲ Hide' : '</> Code'}</Text>
          </TouchableOpacity>
        )}
      </View>

      {showCode && !!code && <CodeSnippet language={codeLanguage || 'text'} code={code} />}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#1e293b',
    borderRadius: 14,
    padding: 14,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#334155',
  },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  icon: { fontSize: 16 },
  title: { color: '#f8fafc', fontWeight: '700', fontSize: 13 },
  description: { color: '#64748b', fontSize: 11, marginBottom: 8 },
  badge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 999 },
  badgeText: { fontSize: 10, fontWeight: '600', textTransform: 'capitalize' },
  logBox: { backgroundColor: '#020617', borderRadius: 8, padding: 8, marginBottom: 8 },
  logLine: { color: '#6ee7b7', fontSize: 10, fontFamily: 'Courier', marginBottom: 2 },
  logTs: { color: '#64748b' },
  controlsRow: { flexDirection: 'row', gap: 8 },
  button: { flex: 1, paddingVertical: 8, borderRadius: 8, alignItems: 'center' },
  runButton: { backgroundColor: '#059669' },
  stopButton: { backgroundColor: '#e11d48' },
  codeButton: { backgroundColor: '#334155' },
  buttonDisabled: { opacity: 0.4 },
  buttonText: { color: '#ffffff', fontWeight: '600', fontSize: 11 },
});
