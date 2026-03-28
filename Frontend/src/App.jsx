/**
 * TranslateIT — Multi-language Translator
 *
 * Self-contained single-file React component.
 * All styles live in the STYLES constant and are injected via a <style> tag.
 * Google Font "Outfit" is added to <head> via useEffect.
 */

import { useState, useCallback, useEffect, useRef } from 'react'

import { getLangCodeForTarget } from './constants/langCodes.js'
import { useTranslate } from './hooks/useTranslate.js'

const MAX_CHARS = 500

const LANGUAGES = [
  'English', 'Twi', 'Ga', 'Ewe', 'Fante',
  'Dagbani', 'Gurene', 'Yoruba', 'Kikuyu', 'Luo', 'Kimeru',
]

const GHANA_GREEN = '#006B3F'
const GHANA_GOLD  = '#FCD116'
const GHANA_RED   = '#CE1126'

const KENTE_COLORS = [GHANA_GOLD, GHANA_RED, GHANA_GREEN, GHANA_GOLD, GHANA_RED, GHANA_GREEN, GHANA_GOLD]
const SKELETON_WIDTHS = ['75%', '50%', '83%', '66%', '78%']

// ─────────────────────────────────────────────────────────────────────────────
// Stylesheet
// ─────────────────────────────────────────────────────────────────────────────
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

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
  .kasa-flag     { font-size: 2.25rem; line-height: 1; }
  .kasa-title    { font-size: clamp(1.8rem, 5vw, 2.5rem); font-weight: 700; color: ${GHANA_GOLD}; letter-spacing: -0.04em; line-height: 1; }
  .kasa-subtitle { margin-top: 0.5rem; color: rgba(255,255,255,0.7); font-size: 0.78rem; letter-spacing: 0.22em; text-transform: uppercase; font-weight: 300; }
  .kente-stripe  { display: flex; height: 6px; max-width: 280px; margin: 1.25rem auto 0; border-radius: 99px; overflow: hidden; }
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

  /* ── Panels ── */
  .panels { display: grid; grid-template-columns: 1fr 1fr; gap: 1.25rem; }
  @media (max-width: 640px) { .panels { grid-template-columns: 1fr; } }

  .panel {
    background: #fff;
    border-radius: 16px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.07);
    display: flex;
    flex-direction: column;
    overflow: visible;
    border: 2px solid transparent;
    transition: border-color 0.2s ease, box-shadow 0.2s ease;
  }
  .panel:focus-within {
    border-color: ${GHANA_GOLD};
    box-shadow: 0 0 0 4px rgba(252, 209, 22, 0.12), 0 2px 12px rgba(0,0,0,0.07);
  }
  .panel--success { border-color: rgba(0, 107, 63, 0.28); }

  /* ── Panel header ── */
  .panel-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.5rem 0.75rem;
    background: rgba(0, 107, 63, 0.05);
    border-bottom: 1px solid rgba(0, 107, 63, 0.1);
    border-radius: 14px 14px 0 0;
    flex-shrink: 0;
    gap: 0.5rem;
    position: relative;
    z-index: 10;
  }

  /* ── Custom language dropdown ── */
  .lang-dropdown { position: relative; flex-shrink: 0; }

  .lang-trigger {
    display: flex;
    align-items: center;
    gap: 0.45rem;
    padding: 0.32rem 0.6rem 0.32rem 0.5rem;
    border-radius: 8px;
    border: 1.5px solid rgba(0, 107, 63, 0.18);
    background: #fff;
    cursor: pointer;
    transition: border-color 0.15s, background 0.15s, box-shadow 0.15s;
    font-family: inherit;
    outline: none;
    user-select: none;
  }
  .lang-trigger:hover:not(:disabled) {
    border-color: ${GHANA_GREEN};
    background: rgba(0, 107, 63, 0.04);
    box-shadow: 0 2px 8px rgba(0, 107, 63, 0.1);
  }
  .lang-trigger:focus-visible {
    box-shadow: 0 0 0 3px rgba(0, 107, 63, 0.2);
    border-color: ${GHANA_GREEN};
  }
  .lang-trigger.open {
    border-color: ${GHANA_GREEN};
    background: rgba(0, 107, 63, 0.05);
    box-shadow: 0 2px 8px rgba(0, 107, 63, 0.12);
  }
  .lang-trigger:disabled { opacity: 0.45; cursor: not-allowed; }

  .lang-dot {
    width: 7px;
    height: 7px;
    border-radius: 50%;
    flex-shrink: 0;
  }
  .lang-trigger-label {
    font-size: 0.78rem;
    font-weight: 600;
    color: ${GHANA_GREEN};
    letter-spacing: 0.04em;
    min-width: 54px;
  }
  .lang-chevron {
    color: ${GHANA_GREEN};
    opacity: 0.6;
    transition: transform 0.2s ease;
    flex-shrink: 0;
    display: flex;
    align-items: center;
  }
  .lang-chevron.open { transform: rotate(180deg); }

  /* ── Dropdown list ── */
  .lang-list {
    position: absolute;
    top: calc(100% + 6px);
    left: 0;
    z-index: 200;
    background: #fff;
    border-radius: 12px;
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.14), 0 2px 8px rgba(0, 0, 0, 0.07);
    border: 1px solid rgba(0, 107, 63, 0.12);
    list-style: none;
    padding: 0.375rem;
    min-width: 148px;
    max-height: 272px;
    overflow-y: auto;
    scrollbar-width: thin;
    scrollbar-color: rgba(0,107,63,0.2) transparent;
    /* Animate in */
    animation: dropdown-in 0.15s ease;
  }
  @keyframes dropdown-in {
    from { opacity: 0; transform: translateY(-6px) scale(0.97); }
    to   { opacity: 1; transform: translateY(0)    scale(1); }
  }

  .lang-item {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 0.625rem;
    border-radius: 8px;
    font-size: 0.85rem;
    font-weight: 500;
    color: #444;
    cursor: pointer;
    transition: background 0.1s, color 0.1s;
    outline: none;
  }
  .lang-item:hover,
  .lang-item:focus-visible { background: rgba(0, 107, 63, 0.07); color: ${GHANA_GREEN}; }
  .lang-item--active {
    background: rgba(0, 107, 63, 0.1);
    color: ${GHANA_GREEN};
    font-weight: 600;
  }
  .lang-item-check {
    width: 14px;
    flex-shrink: 0;
    color: ${GHANA_GREEN};
    display: flex;
    align-items: center;
  }
  .lang-item-check--empty { width: 14px; flex-shrink: 0; }

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
    border-radius: 0;
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
  .char-bar { flex: 1; height: 4px; background: #f0f0f0; border-radius: 99px; overflow: hidden; }
  .char-bar-fill { height: 100%; border-radius: 99px; transition: width 0.25s ease, background-color 0.3s ease; }
  .char-text { font-size: 0.7rem; font-weight: 500; font-variant-numeric: tabular-nums; white-space: nowrap; color: #bbb; transition: color 0.2s; }
  .char-text--warning { color: ${GHANA_RED}; }

  /* ── Output header right group ── */
  .output-header-right {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    flex-shrink: 0;
  }
  .header-divider { width: 1px; height: 16px; background: rgba(0, 107, 63, 0.18); flex-shrink: 0; }

  /* ── Copy button ── */
  .copy-btn {
    display: flex;
    align-items: center;
    gap: 0.375rem;
    padding: 0.3rem 0.7rem;
    border-radius: 8px;
    border: none;
    font-family: inherit;
    font-size: 0.75rem;
    font-weight: 500;
    cursor: pointer;
    background: rgba(0, 107, 63, 0.1);
    color: ${GHANA_GREEN};
    transition: background 0.15s, color 0.15s, transform 0.1s;
    white-space: nowrap;
  }
  .copy-btn:hover:not(:disabled) { background: ${GHANA_GREEN}; color: #fff; }
  .copy-btn:active:not(:disabled) { transform: scale(0.95); }
  .copy-btn--copied { background: ${GHANA_GREEN}; color: #fff; }
  .copy-btn:disabled { background: #f2f2f2; color: #ccc; cursor: not-allowed; }

  /* ── Skeleton ── */
  .skeleton { padding: 1rem; display: flex; flex-direction: column; gap: 0.75rem; min-height: 200px; }
  .skeleton-line { height: 14px; background: rgba(0, 107, 63, 0.08); border-radius: 99px; animation: kasa-pulse 1.5s ease-in-out infinite; }
  @keyframes kasa-pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.35; } }

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
  .translate-btn:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(252, 209, 22, 0.48); }
  .translate-btn:active:not(:disabled) { transform: translateY(0); box-shadow: 0 4px 16px rgba(252, 209, 22, 0.38); }
  .translate-btn:disabled { opacity: 0.35; cursor: not-allowed; box-shadow: none; }
  .translate-arrow { opacity: 0.5; font-size: 1.1em; }

  /* ── Spinner ── */
  .spinner { width: 20px; height: 20px; flex-shrink: 0; animation: kasa-spin 0.75s linear infinite; }
  @keyframes kasa-spin { to { transform: rotate(360deg); } }

  /* ── Error banner ── */
  .error-banner { overflow: hidden; max-height: 0; opacity: 0; transition: max-height 0.3s ease, opacity 0.3s ease; }
  .error-banner--visible { max-height: 80px; opacity: 1; }
  .error-inner {
    display: flex; align-items: center; gap: 0.75rem;
    background: rgba(206, 17, 38, 0.07); border: 1px solid rgba(206, 17, 38, 0.25);
    color: ${GHANA_RED}; border-radius: 12px; padding: 0.875rem 1.25rem;
    font-size: 0.875rem; font-weight: 500;
  }

  /* ── Footer ── */
  .kasa-footer { padding: 1.5rem; text-align: center; font-size: 0.8rem; color: #bbb; }
  .kasa-footer strong { color: ${GHANA_GREEN}; font-weight: 600; }
`

// ─────────────────────────────────────────────────────────────────────────────
// Icons
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

function ChevronIcon({ open }) {
  return (
    <span className={`lang-chevron${open ? ' open' : ''}`}>
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <polyline points="6 9 12 15 18 9" />
      </svg>
    </span>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// LanguageDropdown — fully custom dropdown (no native <select>)
// ─────────────────────────────────────────────────────────────────────────────
function LanguageDropdown({ value, onChange, disabled, dotColor, ariaLabel, exclude }) {
  const [open, setOpen] = useState(false)
  const containerRef = useRef(null)

  // Close when the user clicks anywhere outside this dropdown
  useEffect(() => {
    if (!open) return
    const onOutsideClick = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', onOutsideClick)
    return () => document.removeEventListener('mousedown', onOutsideClick)
  }, [open])

  // Close on Escape key
  useEffect(() => {
    if (!open) return
    const onKey = (e) => { if (e.key === 'Escape') setOpen(false) }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open])

  const handleSelect = useCallback((lang) => {
    onChange(lang)
    setOpen(false)
  }, [onChange])

  return (
    <div className="lang-dropdown" ref={containerRef}>
      {/* Trigger button */}
      <button
        type="button"
        className={`lang-trigger${open ? ' open' : ''}`}
        onClick={() => !disabled && setOpen((o) => !o)}
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={ariaLabel}
      >
        <span className="lang-dot" style={{ background: dotColor }} />
        <span className="lang-trigger-label">{value}</span>
        <ChevronIcon open={open} />
      </button>

      {/* Options list */}
      {open && (
        <ul className="lang-list" role="listbox" aria-label={ariaLabel}>
          {LANGUAGES.filter((lang) => lang !== exclude).map((lang) => {
            const isActive = lang === value
            return (
              <li
                key={lang}
                role="option"
                aria-selected={isActive}
                tabIndex={0}
                className={`lang-item${isActive ? ' lang-item--active' : ''}`}
                onClick={() => handleSelect(lang)}
                onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && handleSelect(lang)}
              >
                {/* Checkmark for the selected option, empty spacer otherwise */}
                {isActive
                  ? <span className="lang-item-check"><CheckIcon /></span>
                  : <span className="lang-item-check--empty" />
                }
                {lang}
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Main component
// ─────────────────────────────────────────────────────────────────────────────

export default function TranslateITApp() {
  const [inputText,  setInputText]  = useState('')
  const [copied,     setCopied]     = useState(false)
  const [sourceLang, setSourceLang] = useState('English')
  const [targetLang, setTargetLang] = useState('Twi')

  const { translation, isLoading, error, translate, reset } = useTranslate()

  // ── Language change — clear any existing translation ────────────────────

  const handleSourceLangChange = useCallback((lang) => {
    setSourceLang(lang)
    reset()
  }, [reset])

  const handleTargetLangChange = useCallback((lang) => {
    setTargetLang(lang)
    reset()
  }, [reset])

  // ── Input / translate / copy ─────────────────────────────────────────────

  const handleInputChange = useCallback((e) => {
    const val = e.target.value.slice(0, MAX_CHARS)
    setInputText(val)
    if (translation || error) {
      reset()
    }
  }, [translation, error, reset])

  const handleTranslate = useCallback(async () => {
    if (!inputText.trim() || isLoading) return
    const langCode = getLangCodeForTarget(targetLang)
    await translate({ text: inputText.trim(), langCode })
  }, [inputText, targetLang, isLoading, translate])

  const handleCopy = useCallback(() => {
    if (!translation || copied) return
    navigator.clipboard.writeText(translation).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }, [translation, copied])

  // ── Derived ──────────────────────────────────────────────────────────────

  const isError      = error != null
  const isSuccess    = !isLoading && !isError && translation.length > 0
  const canTranslate = inputText.trim().length > 0 && !isLoading
  const charPct      = Math.min((inputText.length / MAX_CHARS) * 100, 100)
  const charWarning  = inputText.length >= MAX_CHARS * 0.9

  // ── Render ───────────────────────────────────────────────────────────────

  return (
    <>
      <style>{STYLES}</style>

      <div className="kasa-app">

        {/* ════════ HEADER ════════ */}
        <header className="kasa-header">
          <div className="kasa-title-row">
            <span className="kasa-flag" role="img" aria-label="Ghana flag">🇬🇭</span>
            <h1 className="kasa-title">TranslateIT</h1>
          </div>
          <p className="kasa-subtitle">{sourceLang} → {targetLang} Translator</p>
          <div className="kente-stripe" aria-hidden="true">
            {KENTE_COLORS.map((color, i) => <span key={i} style={{ background: color }} />)}
          </div>
        </header>

        {/* ════════ MAIN ════════ */}
        <main className="kasa-main">
          <div className="panels">

            {/* LEFT — input */}
            <div className="panel">
              <div className="panel-header">
                <LanguageDropdown
                  value={sourceLang}
                  onChange={handleSourceLangChange}
                  disabled={isLoading}
                  dotColor={GHANA_GREEN}
                  ariaLabel="Select source language"
                  exclude={targetLang}
                />
              </div>

              <textarea
                className="kasa-textarea"
                placeholder={`Type or paste your ${sourceLang} text here…`}
                value={inputText}
                onChange={handleInputChange}
                disabled={isLoading}
                aria-label={`${sourceLang} input`}
              />

              <div className="char-counter">
                <div className="char-bar">
                  <div className="char-bar-fill" style={{
                    width: `${charPct}%`,
                    background: charWarning ? GHANA_RED : GHANA_GREEN,
                  }} />
                </div>
                <span className={`char-text${charWarning ? ' char-text--warning' : ''}`}>
                  {inputText.length} / {MAX_CHARS}
                </span>
              </div>
            </div>

            {/* RIGHT — output */}
            <div className={`panel${isSuccess ? ' panel--success' : ''}`}>
              <div className="panel-header">
                {/* Target language dropdown — left side */}
                <LanguageDropdown
                  value={targetLang}
                  onChange={handleTargetLangChange}
                  disabled={isLoading}
                  dotColor={GHANA_GOLD}
                  ariaLabel="Select target language"
                  exclude={sourceLang}
                />

                {/* Divider + copy button — right side */}
                <div className="output-header-right">
                  <span className="header-divider" aria-hidden="true" />
                  <button
                    className={`copy-btn${copied ? ' copy-btn--copied' : ''}`}
                    onClick={handleCopy}
                    disabled={!isSuccess || !translation}
                    aria-label={copied ? 'Copied!' : 'Copy translation'}
                  >
                    {copied ? <CheckIcon /> : <CopyIcon />}
                    {copied ? 'Copied!' : 'Copy'}
                  </button>
                </div>
              </div>

              {isLoading ? (
                <div className="skeleton" aria-label="Translating…" aria-live="polite">
                  {SKELETON_WIDTHS.map((w, i) => (
                    <div key={i} className="skeleton-line" style={{ width: w }} />
                  ))}
                </div>
              ) : (
                <textarea
                  className="kasa-textarea"
                  placeholder={`${targetLang} translation will appear here…`}
                  value={translation}
                  readOnly
                  aria-label={`${targetLang} translation output`}
                  aria-live="polite"
                />
              )}

              <div className="panel-spacer" />
            </div>
          </div>

          {/* ── Translate button ── */}
          <div className="translate-wrap">
            <button className="translate-btn" onClick={handleTranslate} disabled={!canTranslate}>
              {isLoading && <SpinnerIcon />}
              <span>{isLoading ? 'Translating…' : 'Translate'}</span>
              {!isLoading && <span className="translate-arrow">→</span>}
            </button>
          </div>

          {/* ── Error banner ── */}
          <div
            className={`error-banner${isError ? ' error-banner--visible' : ''}`}
            aria-live="assertive"
            role="alert"
          >
            <div className="error-inner">
              <span role="img" aria-label="Warning">⚠️</span>
              <span>{error ?? 'Translation failed. Please check your connection and try again.'}</span>
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
