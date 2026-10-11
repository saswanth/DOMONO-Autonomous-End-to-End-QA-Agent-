import React, { useState } from 'react';

/**
 * DOMONO Code Snippet viewer — shows the dummy generated code/artifact
 * for a given module inline within its pipeline card.
 */
export default function CodeSnippet({ language, code }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // Clipboard API unavailable — ignore silently.
    }
  };

  return (
    <div className="code-snippet">
      <div className="code-snippet-header">
        <span className="code-snippet-lang">{language}</span>
        <button className="code-snippet-copy" onClick={copy}>
          {copied ? '✓ Copied' : 'Copy'}
        </button>
      </div>
      <pre className="code-snippet-body">
        <code>{code}</code>
      </pre>
    </div>
  );
}
