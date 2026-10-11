/**
 * DOMONO Module 5 — Dashboard Reporting.
 * Renders execution metrics + self-healing audit log into the standard
 * DOMONO Markdown report format, and the matching PR title/commit message.
 */

/**
 * @param {object} data
 * @param {string} data.owner
 * @param {string} data.repo
 * @param {string} data.featureBranch
 * @param {string} data.storyId
 * @param {{passed:number, failed:number, passRate:number}} data.metrics
 * @param {Array<{testId:string, failed:string, healed:string, confidence:number}>} data.healingLog
 */
export function renderReport({ owner, repo, featureBranch, storyId, metrics, healingLog }) {
  const healingRows = healingLog
    .map((h) => `| ${h.testId} | \`${h.failed}\` | \`${h.healed}\` | ${h.confidence.toFixed(2)} | Merged |`)
    .join('\n');

  return `# 🚀 DOMONO Autonomous QA Execution & Dashboard Report

## 📊 Suite Execution Metrics
* **Repository:** [github.com/${owner}/${repo}](https://github.com/${owner}/${repo})
* **Target Branch:** \`${featureBranch}\`
* **Pass Rate:** ${metrics.passRate}% | **Passed:** ${metrics.passed} | **Failed:** ${metrics.failed}
* **Self-Healed Locators:** ${healingLog.length}

## 🩹 Runtime Self-Healing Audit Log
| Test Case | Failed Selector | Healed Selector | Confidence | Patch Status |
|---|---|---|---|---|
${healingRows}

## 🔗 GitHub Pull Request Summary
* **PR Title:** \`[DOMONO] Automated E2E Test Suite & Self-Healing Patches for ${storyId}\`
* **PR Link:** \`https://github.com/${owner}/${repo}/pull/new/${featureBranch}\`
* **Commit Message:** \`feat(qa): auto-generated Playwright specs and healed locators for ${storyId}\`
`;
}

export function prTitle(storyId) {
  return `[DOMONO] Automated E2E Test Suite & Self-Healing Patches for ${storyId}`;
}

export function commitMessage(storyId) {
  return `feat(qa): auto-generated Playwright specs and healed locators for ${storyId}`;
}
