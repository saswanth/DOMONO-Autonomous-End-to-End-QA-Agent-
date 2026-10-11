import nodemailer from 'nodemailer';

/**
 * DOMONO Module 5 — PAT-authenticated real-time mail notifications.
 *
 * Many SMTP providers (Office365, GitHub-integrated relays, custom SMTP
 * gateways) accept a Personal Access Token (PAT) in the password field of
 * standard SMTP AUTH (LOGIN/PLAIN over STARTTLS). This avoids storing a
 * real account password and lets the token be scoped/rotated/revoked
 * independently.
 *
 * Required env vars (see .env.example):
 *   SMTP_HOST, SMTP_PORT, SMTP_SECURE, SMTP_USER, SMTP_PAT,
 *   NOTIFY_EMAIL_TO, NOTIFY_EMAIL_FROM
 */
export function createPatMailTransport(env = process.env) {
  const required = ['SMTP_HOST', 'SMTP_PORT', 'SMTP_USER', 'SMTP_PAT'];
  const missing = required.filter((key) => !env[key]);
  if (missing.length) {
    throw new Error(`Missing required mail env vars: ${missing.join(', ')}`);
  }

  return nodemailer.createTransport({
    host: env.SMTP_HOST,
    port: Number(env.SMTP_PORT),
    secure: env.SMTP_SECURE === 'true',
    auth: {
      // PAT-based authentication: the token is passed as the SMTP password.
      user: env.SMTP_USER,
      pass: env.SMTP_PAT,
    },
  });
}

/**
 * Sends a real-time pipeline notification email.
 * @param {object} opts
 * @param {'success'|'failure'} opts.outcome
 * @param {string} opts.storyId
 * @param {string} opts.reportMarkdown - rendered Module 5 report body
 * @param {object} [opts.env]
 */
export async function sendPipelineNotification({ outcome, storyId, reportMarkdown, env = process.env }) {
  const transport = createPatMailTransport(env);

  const subject = outcome === 'success'
    ? `✅ DOMONO: QA suite passed for ${storyId}`
    : `❌ DOMONO: QA suite failed for ${storyId}`;

  const info = await transport.sendMail({
    from: env.NOTIFY_EMAIL_FROM,
    to: env.NOTIFY_EMAIL_TO,
    subject,
    text: reportMarkdown,
    html: `<pre style="font-family: ui-monospace, monospace; white-space: pre-wrap;">${escapeHtml(reportMarkdown)}</pre>`,
  });

  return info;
}

function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}
