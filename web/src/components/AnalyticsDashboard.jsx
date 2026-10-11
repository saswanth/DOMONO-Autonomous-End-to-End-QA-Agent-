import React from 'react';

/**
 * DOMONO Analytics Dashboard (Module 5 extension) — aggregated execution
 * analytics across all pipelines: KPIs, pass/fail trend, healing confidence
 * distribution, and per-module run counts. Plain React + CSS, no charting
 * library or Tailwind — bars are rendered with simple CSS height/width.
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

export default function AnalyticsDashboard() {
  const maxRuns = Math.max(...MODULE_RUNS.map((m) => m.runs));

  return (
    <div className="analytics">
      <div className="analytics-kpis">
        <KpiCard label="Total Runs" value="173" />
        <KpiCard label="Avg Pass Rate" value="87%" />
        <KpiCard label="Avg Healing Confidence" value="75%" />
        <KpiCard label="Open PRs" value="4" />
      </div>

      <div className="analytics-grid">
        <section className="analytics-card">
          <h3 className="analytics-card-title">Weekly Pass Rate Trend</h3>
          <div className="trend-chart">
            {TREND.map((t) => (
              <div key={t.day} className="trend-bar-col">
                <div className="trend-bar" style={{ height: `${t.passRate}%` }} title={`${t.passRate}%`} />
                <span className="trend-bar-label">{t.day}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="analytics-card">
          <h3 className="analytics-card-title">Pipeline Runs by Module</h3>
          <div className="hbar-list">
            {MODULE_RUNS.map((m) => (
              <div key={m.label} className="hbar-row">
                <span className="hbar-label">{m.label}</span>
                <div className="hbar-track">
                  <div className="hbar-fill" style={{ width: `${(m.runs / maxRuns) * 100}%` }} />
                </div>
                <span className="hbar-value">{m.runs}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="analytics-card">
          <h3 className="analytics-card-title">Self-Healing Confidence</h3>
          <div className="hbar-list">
            {HEALING_CONFIDENCE.map((h) => (
              <div key={h.testId} className="hbar-row">
                <span className="hbar-label">{h.testId}</span>
                <div className="hbar-track">
                  <div
                    className="hbar-fill hbar-fill-confidence"
                    style={{ width: `${h.confidence * 100}%` }}
                  />
                </div>
                <span className="hbar-value">{(h.confidence * 100).toFixed(0)}%</span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

function KpiCard({ label, value }) {
  return (
    <div className="kpi-card">
      <div className="kpi-label">{label}</div>
      <div className="kpi-value">{value}</div>
    </div>
  );
}
