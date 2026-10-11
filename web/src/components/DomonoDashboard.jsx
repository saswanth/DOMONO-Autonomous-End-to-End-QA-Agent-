import React, { useState } from 'react';
import PipelineCard from './PipelineCard.jsx';
import AnalyticsDashboard from './AnalyticsDashboard.jsx';

/**
 * DOMONO Web Control Dashboard (Module 0)
 * Hosts six independently runnable pipelines — one per DOMONO module
 * (1-5, plus execution) — each with its own controls, status, and logs.
 * Styled with plain CSS (see src/index.css) — no Tailwind.
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
    finalStatus: 'passed',
    codeLanguage: 'json',
    code: `{
  "story_id": "HELP-142",
  "summary": "Agent receives real-time email alert on ticket reassignment.",
  "test_cases": [
    {
      "test_id": "HELP-142-TC01",
      "title": "Agent receives email on reassignment",
      "type": "happy_path",
      "steps": [
        { "action": "Reassign ticket to Agent A", "expected_result": "Email sent to Agent A" }
      ]
    }
  ]
}`,
  },
  {
    id: 'scanner',
    icon: '🔍',
    label: 'DOM & Env Scanner',
    description: 'Maps interactive UI elements to stable locator strategies (Module 2).',
    steps: [
      'Capturing DOM snapshot / accessibility tree…',
      'Ranking locator stability (data-testid > aria-label > role+text)…',
      'Emitting mapped_elements JSON…',
    ],
    finalStatus: 'passed',
    codeLanguage: 'json',
    code: `{
  "page_url": "https://helpdesk.example.com/tickets/4821",
  "mapped_elements": [
    {
      "element_label": "Confirm Reassignment Button",
      "primary_selector": "role=button[name=\\"Confirm Reassignment\\"]",
      "fallback_selectors": ["[data-testid=\\"confirm-reassign-btn\\"]"],
      "element_type": "button"
    }
  ]
}`,
  },
  {
    id: 'generator',
    icon: '🧩',
    label: 'Playwright Generator',
    description: 'Synthesizes test plans + locators into Playwright TS specs (Module 3).',
    steps: [
      'Binding test cases to mapped selectors…',
      'Applying web-first assertions, no fixed sleeps…',
      'Writing executable .spec.ts file…',
    ],
    finalStatus: 'passed',
    codeLanguage: 'typescript',
    code: `test('HELP-142-TC01: Agent receives email on reassignment', async ({ page }) => {
  await page.getByTestId('reassign-agent-select').selectOption({ label: 'Agent A' });
  await page.getByRole('button', { name: 'Confirm Reassignment' }).click();

  await expect(page.getByTestId('notification-toast'))
    .toContainText('Email sent to Agent A');
});`,
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
    finalStatus: 'failed',
    codeLanguage: 'text',
    code: `Running 2 tests using 1 worker

  ✓  HELP-142-TC01 › reassignment sends email (842ms)
  ✘  HELP-142-TC02 › no email sent on self-reassign (1203ms)

     Error: locator('[data-testid="notification-toast"]')
     Expected: hidden
     Received: visible

1 failed, 1 passed (2 total)`,
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
    finalStatus: 'healed',
    codeLanguage: 'json',
    code: `{
  "failed_locator": "[data-testid=\\"confirm-reassign-btn\\"]",
  "healed_locator": "role=button[name=\\"Confirm Reassignment\\"]",
  "confidence_score": 0.93,
  "reasoning": "data-testid removed in latest release; accessible role/name unchanged.",
  "code_patch": "- page.locator('[data-testid=\\"confirm-reassign-btn\\"]')\\n+ page.getByRole('button', { name: 'Confirm Reassignment' })"
}`,
  },
  {
    id: 'reporting',
    icon: '📊',
    label: 'Reporting & GitHub',
    description: 'Publishes dashboard report and opens the GitHub PR (Module 5).',
    steps: [
      'Compiling execution metrics and healing audit log…',
      'Committing specs + patches to domono/qa-automation-suite…',
      'Opening Pull Request and sending PAT-authenticated email…',
    ],
    finalStatus: 'passed',
    codeLanguage: 'bash',
    code: `git checkout -b domono/qa-automation-suite
git add specs/example.spec.ts reports/HELP-142-report.md
git commit -m "feat(qa): auto-generated Playwright specs and healed locators for HELP-142"
git push -u origin domono/qa-automation-suite

# PR opened: https://github.com/acme-corp/helpdesk-app/pull/new/domono/HELP-142`,
  },
];

export default function DomonoDashboard({ onExit }) {
  const [view, setView] = useState('pipelines');

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="dashboard-header-left">
          <span className="dashboard-rocket">🚀</span>
          <div>
            <h1 className="dashboard-title">DOMONO Control Dashboard</h1>
            <p className="dashboard-subtitle">Autonomous End-to-End QA Pipeline</p>
          </div>
        </div>
        <div className="view-toggle">
          <button
            className={`view-toggle-btn ${view === 'pipelines' ? 'active' : ''}`}
            onClick={() => setView('pipelines')}
          >
            Pipelines
          </button>
          <button
            className={`view-toggle-btn ${view === 'analytics' ? 'active' : ''}`}
            onClick={() => setView('analytics')}
          >
            📈 Analytics
          </button>
        </div>
        {onExit && (
          <button className="btn btn-exit" onClick={onExit}>
            ← Landing
          </button>
        )}
      </header>

      {view === 'pipelines' ? (
        <>
          <section className="metrics-grid">
            <MetricCard label="Pass Rate" value={`${METRICS.passRate}%`} />
            <MetricCard label="Passed" value={METRICS.passed} />
            <MetricCard label="Failed" value={METRICS.failed} />
            <MetricCard label="Self-Healed" value={METRICS.healed} />
          </section>

          <section className="pipelines-grid">
            {PIPELINES.map((pipeline) => (
              <PipelineCard key={pipeline.id} {...pipeline} />
            ))}
          </section>
        </>
      ) : (
        <AnalyticsDashboard />
      )}
    </div>
  );
}

function MetricCard({ label, value }) {
  return (
    <div className="metric-card">
      <div className="metric-label">{label}</div>
      <div className="metric-value">{value}</div>
    </div>
  );
}
