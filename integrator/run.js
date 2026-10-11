import 'dotenv/config';
import fs from 'node:fs';
import path from 'node:path';
import { GithubIntegrator } from './lib/githubIntegrator.js';
import { renderReport, prTitle, commitMessage } from './lib/reportGenerator.js';
import { sendPipelineNotification } from './lib/mailNotifier.js';

/**
 * DOMONO Module 5 orchestration entrypoint.
 * Run with: `npm start` (from integrator/), after copying .env.example -> .env
 *
 * This wires together:
 *   1. Report generation from the latest execution/healing results.
 *   2. GitHub branch/commit/PR publishing (Octokit + simple-git).
 *   3. PAT-authenticated real-time mail notification of the outcome.
 */
async function main() {
  const storyId = process.env.STORY_ID || 'HELP-142';
  const owner = process.env.GITHUB_OWNER;
  const repo = process.env.GITHUB_REPO;
  const baseBranch = process.env.GITHUB_BASE_BRANCH || 'main';
  const featureBranch = process.env.GITHUB_FEATURE_BRANCH || 'domono/qa-automation-suite';

  // In a real pipeline this comes from the test runner / self-healer (Module 4).
  const metrics = { passed: 11, failed: 1, passRate: 92 };
  const healingLog = [
    { testId: 'HELP-142-TC01', failed: '[data-testid="confirm-reassign-btn"]', healed: 'role=button[name="Confirm Reassignment"]', confidence: 0.93 },
    { testId: 'HELP-142-TC02', failed: '[data-testid="notification-toast"]', healed: 'role=status[name="Notification"]', confidence: 0.81 },
  ];

  const reportMarkdown = renderReport({ owner, repo, featureBranch, storyId, metrics, healingLog });

  const reportPath = path.resolve(process.cwd(), '..', 'reports', `${storyId}-report.md`);
  fs.writeFileSync(reportPath, reportMarkdown, 'utf8');
  console.log(`Report written to ${reportPath}`);

  const outcome = metrics.failed === 0 ? 'success' : 'failure';

  try {
    if (process.env.GITHUB_TOKEN) {
      const integrator = new GithubIntegrator({
        token: process.env.GITHUB_TOKEN,
        owner,
        repo,
        baseBranch,
        featureBranch,
        repoPath: path.resolve(process.cwd(), '..'),
      });

      const pr = await integrator.publish({
        filePaths: [path.relative(path.resolve(process.cwd(), '..'), reportPath), 'specs/example.spec.ts'],
        commitMessage: commitMessage(storyId),
        prTitle: prTitle(storyId),
        prBody: reportMarkdown,
      });

      console.log(`Pull request opened: ${pr.html_url}`);
    } else {
      console.log('GITHUB_TOKEN not set — skipping GitHub publish step.');
    }
  } catch (err) {
    console.error('GitHub publish failed:', err.message);
  }

  try {
    if (process.env.SMTP_PAT) {
      await sendPipelineNotification({ outcome, storyId, reportMarkdown });
      console.log('Notification email sent.');
    } else {
      console.log('SMTP_PAT not set — skipping mail notification.');
    }
  } catch (err) {
    console.error('Mail notification failed:', err.message);
  }
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
