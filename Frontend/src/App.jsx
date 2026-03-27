/**
 * TranslateIT — English → Twi Translator
 *
 * Self-contained single-file React component.
 * All styles live in the STYLES constant and are injected via a <style> tag.
 * Google Font "Outfit" is added to <head> via useEffect.
 */

import { useState, useCallback, useEffect } from 'react'

// ─────────────────────────────────────────────────────────────────────────────
// API INTEGRATION POINT — the ONLY place a backend developer needs to edit
// ─────────────────────────────────────────────────────────────────────────────
//
// Replace the stub below with a real API call, for example:
//
//   const res = await fetch('/api/translate', {
//     method: 'POST',
//     headers: { 'Content-Type': 'application/json' },
//     body: JSON.stringify({ text, source: 'en', target: 'tw' }),
//   })
//   if (!res.ok) throw new Error('Translation request failed')
//   return (await res.json()).translation
//
// ─────────────────────────────────────────────────────────────────────────────
async function translateText(text) {
  // TODO: Replace this stub with a real call to POST /api/translate
  await new Promise((res) => setTimeout(res, 1500)) // simulate network delay
  return 'Ete sɛn?' // hardcoded placeholder — remove when API is wired up
}
// ─────────────────────────────────────────────────────────────────────────────

const MAX_CHARS = 500

// Kente-cloth accent colors (Ghana flag palette)
const GHANA_GREEN = '#006B3F'
const GHANA_GOLD  = '#FCD116'
const GHANA_RED   = '#CE1126'

// Decorative Kente stripe sequence
const KENTE_COLORS = [GHANA_GOLD, GHANA_RED, GHANA_GREEN, GHANA_GOLD, GHANA_RED, GHANA_GREEN, GHANA_GOLD]

// Skeleton line widths for visual variety
const SKELETON_WIDTHS = ['75%', '50%', '83%', '66%', '78%']

// ─────────────────────────────────────────────────────────────────────────────
// Stylesheet — all component styles live here, keeping the file self-contained
// ─────────────────────────────────────────────────────────────────────────────
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&display=swap');

  /* ── Reset ── */
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  /* Override the Vite scaffold's #root constraints */
  #root {
    width: 100% !important;
    max-width: 100% !important;
    margin: 0 !important;
    border: none !important;
    text-align: left !important;
    display: block !important;
  }

  /* ── App shell ── */
  .kasa-app {
    min-height: 100vh;
    background: #FFF8F0;
    font-family: 'Outfit', system-ui, sans-serif;
    display: flex;
    flex-direction: column;
    color: #1a1a1a;
  }

  /* ── Header ── */
  .kasa-header {
    background: ${GHANA_GREEN};
    padding: 2rem 1.5rem;
    text-align: center;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.18);
  }
  .kasa-title-row {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.75rem;
    margin-bottom: 0.25rem;
  }
  .kasa-flag   { font-size: 2.25rem; line-height: 1; }
  .kasa-title  { font-size: clamp(1.8rem, 5vw, 2.5rem); font-weight: 700; color: ${GHANA_GOLD}; letter-spacing: -0.04em; line-height: 1; }
  .kasa-subtitle { margin-top: 0.5rem; color: rgba(255,255,255,0.7); font-size: 0.78rem; letter-spacing: 0.22em; text-transform: uppercase; font-weight: 300; }

  /* Kente decorative stripe */
  .kente-stripe {
    display: flex;
    height: 6px;
    max-width: 280px;
    margin: 1.25rem auto 0;
    border-radius: 99px;
    overflow: hidden;
  }
  .kente-stripe span { flex: 1; }

  /* ── Main layout ── */
  .kasa-main {
    flex: 1;
    max-width: 960px;
    width: 100%;
    margin: 0 auto;
    padding: 2rem 1rem;
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  /* ── Panel grid ── */
  .panels {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1.25rem;
  }
  @media (max-width: 640px) {
    .panels { grid-template-columns: 1fr; }
  }

  /* ── Panel card ── */
  .panel {
    background: #fff;
    border-radius: 16px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.07);
    display: flex;
    flex-direction: column;
    overflow: hidden;
    border: 2px solid transparent;
    transition: border-color 0.2s ease, box-shadow 0.2s ease;
  }
  .panel:focus-within {
    border-color: ${GHANA_GOLD};
    box-shadow: 0 0 0 4px rgba(252, 209, 22, 0.12), 0 2px 12px rgba(0,0,0,0.07);
  }
  /* Green tint border when translation is ready */
  .panel--success { border-color: rgba(0, 107, 63, 0.28); }

  /* ── Panel header bar ── */
  .panel-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.6rem 1rem;
    background: rgba(0, 107, 63, 0.05);
    border-bottom: 1px solid rgba(0, 107, 63, 0.1);
    flex-shrink: 0;
  }
  .panel-label {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.7rem;
    font-weight: 600;
    color: ${GHANA_GREEN};
    letter-spacing: 0.16em;
    text-transform: uppercase;
  }
  .panel-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    flex-shrink: 0;
  }

  /* ── Textarea ── */
  .kasa-textarea {
    flex: 1;
    resize: none;
    border: none;
    outline: none;
    padding: 1rem;
    font-family: inherit;
    font-size: 1rem;
    line-height: 1.65;
    color: #1a1a1a;
    background: transparent;
    min-height: 200px;
    width: 100%;
  }
  .kasa-textarea::placeholder { color: #ccc; }
  .kasa-textarea:disabled      { opacity: 0.55; cursor: not-allowed; }

  /* ── Character counter ── */
  .char-counter {
    padding: 0 1rem 0.875rem;
    display: flex;
    align-items: center;
    gap: 0.75rem;
    flex-shrink: 0;
  }
  .char-bar {
    flex: 1;
    height: 4px;
    background: #f0f0f0;
    border-radius: 99px;
    overflow: hidden;
  }
  .char-bar-fill {
    height: 100%;
    border-radius: 99px;
    transition: width 0.25s ease, background-color 0.3s ease;
  }
  .char-text {
    font-size: 0.7rem;
    font-weight: 500;
    font-variant-numeric: tabular-nums;
    white-space: nowrap;
    color: #bbb;
    transition: color 0.2s;
  }
  .char-text--warning { color: ${GHANA_RED}; }

  /* ── Copy button ── */
  .copy-btn {
    display: flex;
    align-items: center;
    gap: 0.375rem;
    padding: 0.3rem 0.75rem;
    border-radius: 8px;
    border: none;
    font-family: inherit;
    font-size: 0.75rem;
    font-weight: 500;
    cursor: pointer;
    background: rgba(0, 107, 63, 0.1);
    color: ${GHANA_GREEN};
    transition: background 0.15s, color 0.15s, transform 0.1s;
  }
  .copy-btn:hover:not(:disabled) { background: ${GHANA_GREEN}; color: #fff; }
  .copy-btn:active:not(:disabled) { transform: scale(0.95); }
  .copy-btn--copied { background: ${GHANA_GREEN}; color: #fff; }
  .copy-btn:disabled { background: #f2f2f2; color: #ccc; cursor: not-allowed; }

  /* ── Skeleton loader ── */
  .skeleton {
    padding: 1rem;
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    min-height: 200px;
  }
  .skeleton-line {
    height: 14px;
    background: rgba(0, 107, 63, 0.08);
    border-radius: 99px;
    animation: kasa-pulse 1.5s ease-in-out infinite;
  }
  @keyframes kasa-pulse {
    0%, 100% { opacity: 1; }
    50%       { opacity: 0.35; }
  }

  /* Spacer keeps output panel height consistent with input panel */
  .panel-spacer { height: 2.875rem; flex-shrink: 0; }

  /* ── Translate button ── */
  .translate-wrap { display: flex; justify-content: center; }
  .translate-btn {
    display: flex;
    align-items: center;
    gap: 0.625rem;
    padding: 0.875rem 2.5rem;
    border-radius: 16px;
    border: none;
    font-family: inherit;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    background: ${GHANA_GOLD};
    color: ${GHANA_GREEN};
    box-shadow: 0 4px 16px rgba(252, 209, 22, 0.38);
    transition: transform 0.15s ease, box-shadow 0.15s ease, opacity 0.2s ease;
    user-select: none;
  }
  .translate-btn:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(252, 209, 22, 0.48);
  }
  .translate-btn:active:not(:disabled) {
    transform: translateY(0);
    box-shadow: 0 4px 16px rgba(252, 209, 22, 0.38);
  }
  .translate-btn:disabled { opacity: 0.35; cursor: not-allowed; box-shadow: none; }
  .translate-arrow { opacity: 0.5; font-size: 1.1em; }

  /* ── Spinner ── */
  .spinner {
    width: 20px;
    height: 20px;
    flex-shrink: 0;
    animation: kasa-spin 0.75s linear infinite;
  }
  @keyframes kasa-spin { to { transform: rotate(360deg); } }

  /* ── Error banner ── */
  .error-banner {
    overflow: hidden;
    max-height: 0;
    opacity: 0;
    transition: max-height 0.3s ease, opacity 0.3s ease;
  }
  .error-banner--visible { max-height: 80px; opacity: 1; }
  .error-inner {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    background: rgba(206, 17, 38, 0.07);
    border: 1px solid rgba(206, 17, 38, 0.25);
    color: ${GHANA_RED};
    border-radius: 12px;
    padding: 0.875rem 1.25rem;
    font-size: 0.875rem;
    font-weight: 500;
  }

  /* ── Footer ── */
  .kasa-footer { padding: 1.5rem; text-align: center; font-size: 0.8rem; color: #bbb; }
  .kasa-footer strong { color: ${GHANA_GREEN}; font-weight: 600; }
`

// ─────────────────────────────────────────────────────────────────────────────
// SVG icon components
// ─────────────────────────────────────────────────────────────────────────────

function SpinnerIcon() {
  return (
    <svg className="spinner" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" opacity="0.25" />
      <path fill="currentColor" opacity="0.75" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>
  )
}

function CopyIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="9" y="9" width="13" height="13" rx="2" />
      <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
    </svg>
  )
}

function CheckIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Main component
// ─────────────────────────────────────────────────────────────────────────────

export default function TranslateITApp() {
  const [inputText, setInputText] = useState('')
  const [outputText, setOutputText] = useState('')
  const [status, setStatus]         = useState('idle') // 'idle' | 'loading' | 'success' | 'error'
  const [copied, setCopied]         = useState(false)

  // ── Handlers ────────────────────────────────────────────────────────────────

  const handleInputChange = useCallback((e) => {
    // Enforce character limit
    const val = e.target.value.slice(0, MAX_CHARS)
    setInputText(val)
    // Clear stale results when the user edits after a completed translation
    if (status === 'success' || status === 'error') {
      setStatus('idle')
      setOutputText('')
    }
  }, [status])

  const handleTranslate = useCallback(async () => {
    if (!inputText.trim() || status === 'loading') return

    // ── loading state ──
    setStatus('loading')
    setOutputText('')

    try {
      const result = await translateText(inputText.trim())
      // ── success state ──
      setOutputText(result)
      setStatus('success')
    } catch {
      // ── error state ──
      setStatus('error')
      setOutputText('')
    }
  }, [inputText, status])

  const handleCopy = useCallback(() => {
    if (!outputText || copied) return
    navigator.clipboard.writeText(outputText).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }, [outputText, copied])

  // ── Derived values ───────────────────────────────────────────────────────────

  const isLoading    = status === 'loading'
  const isError      = status === 'error'
  const isSuccess    = status === 'success'
  const canTranslate = inputText.trim().length > 0 && !isLoading
  const charPct      = Math.min((inputText.length / MAX_CHARS) * 100, 100)
  const charWarning  = inputText.length >= MAX_CHARS * 0.9

  // ── Render ───────────────────────────────────────────────────────────────────

  return (
    <>
      {/* All component styles injected here — keeps this file fully self-contained */}
      <style>{STYLES}</style>

      <div className="kasa-app">

        {/* ════════ HEADER ════════ */}
        <header className="kasa-header">
          <div className="kasa-title-row">
            <span className="kasa-flag" role="img" aria-label="Ghana flag">🇬🇭</span>
            <h1 className="kasa-title">TranslateIT</h1>
          </div>
          <p className="kasa-subtitle">English → Twi Translator</p>

          {/* Kente decorative stripe */}
          <div className="kente-stripe" aria-hidden="true">
            {KENTE_COLORS.map((color, i) => (
              <span key={i} style={{ background: color }} />
            ))}
          </div>
        </header>

        {/* ════════ MAIN ════════ */}
        <main className="kasa-main">

          {/* ── Translation panels ── */}
          <div className="panels">

            {/* LEFT — English input */}
            <div className="panel">
              <div className="panel-header">
                <div className="panel-label">
                  <span className="panel-dot" style={{ background: GHANA_GREEN }} />
                  English
                </div>
              </div>

              <textarea
                className="kasa-textarea"
                placeholder="Type or paste your English text here…"
                value={inputText}
                onChange={handleInputChange}
                disabled={isLoading}
                aria-label="English input"
              />

              {/* Character counter with progress bar */}
              <div className="char-counter">
                <div className="char-bar">
                  <div
                    className="char-bar-fill"
                    style={{
                      width: `${charPct}%`,
                      background: charWarning ? GHANA_RED : GHANA_GREEN,
                    }}
                  />
                </div>
                <span className={`char-text${charWarning ? ' char-text--warning' : ''}`}>
                  {inputText.length} / {MAX_CHARS}
                </span>
              </div>
            </div>

            {/* RIGHT — Twi output */}
            <div className={`panel${isSuccess ? ' panel--success' : ''}`}>
              <div className="panel-header">
                <div className="panel-label">
                  <span className="panel-dot" style={{ background: GHANA_GOLD }} />
                  Twi
                </div>

                {/* Copy button — active only after a successful translation */}
                <button
                  className={`copy-btn${copied ? ' copy-btn--copied' : ''}`}
                  onClick={handleCopy}
                  disabled={!isSuccess || !outputText}
                  aria-label={copied ? 'Copied!' : 'Copy translation'}
                >
                  {copied ? <CheckIcon /> : <CopyIcon />}
                  {copied ? 'Copied!' : 'Copy'}
                </button>
              </div>

              {/* Show skeleton while loading, textarea otherwise */}
              {isLoading ? (
                <div className="skeleton" aria-label="Translating…" aria-live="polite">
                  {SKELETON_WIDTHS.map((w, i) => (
                    <div key={i} className="skeleton-line" style={{ width: w }} />
                  ))}
                </div>
              ) : (
                <textarea
                  className="kasa-textarea"
                  placeholder="Twi translation will appear here…"
                  value={outputText}
                  readOnly
                  aria-label="Twi translation output"
                  aria-live="polite"
                />
              )}

              {/* Spacer keeps panel height flush with input panel */}
              <div className="panel-spacer" />
            </div>
          </div>

          {/* ── Translate button ── */}
          <div className="translate-wrap">
            <button
              className="translate-btn"
              onClick={handleTranslate}
              disabled={!canTranslate}
            >
              {isLoading && <SpinnerIcon />}
              <span>{isLoading ? 'Translating…' : 'Translate'}</span>
              {!isLoading && <span className="translate-arrow">→</span>}
            </button>
          </div>

          {/* ── Error banner — slides in when status === 'error' ── */}
          <div
            className={`error-banner${isError ? ' error-banner--visible' : ''}`}
            aria-live="assertive"
            role="alert"
          >
            <div className="error-inner">
              <span role="img" aria-label="Warning">⚠️</span>
              <span>Translation failed. Please check your connection and try again.</span>
            </div>
          </div>

        </main>

        {/* ════════ FOOTER ════════ */}
        <footer className="kasa-footer">
          Powered by <strong>TranslateIT</strong> · Preserving Ghanaian languages 🇬🇭
        </footer>

      </div>
    </>
  )
}
