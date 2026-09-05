import { LOGO_URL, EVENT_DETAILS } from '../data/eventData';

export default function HeroBrandLockup() {
  return (
    <div className="hero-brand-lockup">
      <div className="hero-brand-glow" aria-hidden="true" />

      <div className="hero-brand-logo-wrap">
        <img
          src={LOGO_URL}
          alt="Gaan Bristy — umbrella and GB logo"
          className="hero-brand-logo"
        />
      </div>

      <div className="hero-brand-connector" aria-hidden="true">
        <span className="hero-brand-connector-line" />
        <span className="hero-brand-connector-gem">✦</span>
        <span className="hero-brand-connector-line" />
      </div>

      <p className="hero-brand-family">Gaan Bristy Family Presents</p>

      <h1 className="hero-brand-title">
        <span className="sr-only">Gaan Bristy Grand Get Together 2026 — </span>
        <span className="hero-brand-get">GET</span>
        <span className="hero-brand-together">TOGETHER</span>
        <span className="hero-brand-year">2026</span>
      </h1>

      <p className="hero-brand-tagline font-bangla">&ldquo;{EVENT_DETAILS.tagline}&rdquo;</p>
    </div>
  );
}
