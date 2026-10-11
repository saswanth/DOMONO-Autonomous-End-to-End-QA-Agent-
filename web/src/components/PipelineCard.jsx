import React, { useEffect, useRef, useState } from 'react';
import CodeSnippet from './CodeSnippet.jsx';

/**
 * DOMONO Pipeline Card — an independently runnable pipeline for a single
 * DOMONO module (Modules 1-5). Each card has its own Run/Stop controls,
 * status badge, live log stream, and a dummy generated-code preview,
 * decoupled from every other module.
 */
export default function PipelineCard({ icon, label, description, steps, finalStatus = 'passed', codeLanguage, code }) {
  const [status, setStatus] = useState('queued');
  const [logs, setLogs] = useState([{ ts: '00:00:00', message: `${label} pipeline ready.` }]);
  const [showCode, setShowCode] = useState(false);
  const timerRef = useRef(null);
  const stepRef = useRef(0);

  const appendLog = (message) => {
    const ts = new Date().toISOString().slice(11, 19);
    setLogs((prev) => [...prev.slice(-99), { ts, message }]);
  };

  const run = () => {
    if (status === 'running') return;
    setStatus('running');
    stepRef.current = 0;
    appendLog(`${label} pipeline started.`);

    timerRef.current = setInterval(() => {
      const idx = stepRef.current;
      if (idx >= steps.length) {
        clearInterval(timerRef.current);
        setStatus(finalStatus);
        appendLog(`${label} pipeline finished: ${finalStatus}.`);
        return;
      }
      appendLog(steps[idx]);
      stepRef.current += 1;
    }, 900);
  };

  const stop = () => {
    clearInterval(timerRef.current);
    setStatus('queued');
    appendLog(`${label} pipeline stopped by user.`);
  };

  useEffect(() => () => clearInterval(timerRef.current), []);

  return (
    <div className="pipeline-card">
      <div className="pipeline-card-header">
        <div className="pipeline-card-title">
          <span>{icon}</span>
          <span>{label}</span>
        </div>
        <span className={`badge badge-${status}`}>{status}</span>
      </div>

      <p className="pipeline-card-footer">{description}</p>

      <div className="pipeline-log-box">
        {logs.map((log, i) => (
          <div key={i} className="pipeline-log-line">
            <span className="pipeline-log-ts">[{log.ts}]</span> {log.message}
          </div>
        ))}
      </div>

      <div className="pipeline-card-controls">
        <button
          className="btn btn-sm btn-run"
          onClick={run}
          disabled={status === 'running'}
        >
          ▶ Run
        </button>
        <button
          className="btn btn-sm btn-stop"
          onClick={stop}
          disabled={status !== 'running'}
        >
          ■ Stop
        </button>
        {code && (
          <button className="btn btn-sm btn-code" onClick={() => setShowCode((v) => !v)}>
            {showCode ? '▲ Hide Code' : '</> View Code'}
          </button>
        )}
      </div>

      {showCode && code && <CodeSnippet language={codeLanguage} code={code} />}
    </div>
  );
}
