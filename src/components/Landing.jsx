import React, { useState, useEffect } from "react";
import "./Landing.css";
import { useNavigate } from "react-router-dom";

const Landing = () => {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const features = [
    { icon: "💊", title: "Antibiotic Tracking", desc: "Log every treatment with dosage, drug name, and withdrawal period automatically calculated." },
    { icon: "⏱️", title: "Withdrawal Countdown", desc: "Real-time alerts when animals are still in withdrawal — never risk an MRL violation again." },
    { icon: "📋", title: "Digital Prescriptions", desc: "Vets issue prescriptions digitally. Farmers receive and act on them instantly." },
    { icon: "🔍", title: "Buyer Verification", desc: "Buyers scan a QR code to verify food safety compliance before purchase." },
    { icon: "🤖", title: "AI VetBot", desc: "24/7 AI assistant for disease symptoms, drug guidance, and biosecurity advice." },
    { icon: "📊", title: "Health Analytics", desc: "Track treatment history, disease trends, and herd health over time." },
  ];

  const steps = [
    { num: "01", title: "Farmer logs treatment", desc: "Record antibiotic usage, dosage, and animal details after each treatment." },
    { num: "02", title: "Vet approves prescription", desc: "Licensed veterinarians review and digitally approve treatment prescriptions." },
    { num: "03", title: "Withdrawal tracked", desc: "System automatically counts down withdrawal days and alerts when safe." },
    { num: "04", title: "Buyer verifies safety", desc: "Buyers scan QR code to confirm the animal is cleared for sale." },
  ];

  const roles = [
    {
      icon: "👨‍🌾",
      title: "Farmer",
      color: "green",
      desc: "Manage your flock, log treatments, track withdrawal periods, and generate safety certificates.",
      actions: ["Log treatments", "View withdrawal status", "Request vet consultation", "Generate certificates"],
      loginPath: "/farmer-login",
      registerPath: "/farmer-register",
    },
    {
      icon: "🩺",
      title: "Veterinarian",
      color: "blue",
      desc: "Issue digital prescriptions, review consultation requests, and monitor patient animals remotely.",
      actions: ["Issue prescriptions", "Approve/reject requests", "View patient history", "Monitor compliance"],
      loginPath: "/doctor-login",
      registerPath: "/doctor-register",
    },
    {
      icon: "🧑‍💼",
      title: "Buyer / Client",
      color: "purple",
      desc: "Verify food safety compliance instantly by scanning the animal's QR code before purchase.",
      actions: ["Scan QR codes", "View treatment history", "Check withdrawal status", "Download reports"],
      loginPath: "/buyer-login",
      registerPath: "/buyer-register",
    },
  ];

  return (
    <div className="home-root">
      {/* ── Navbar ── */}
      <nav className={`home-nav ${scrolled ? "nav-scrolled" : ""}`}>
        <div className="nav-brand">
          <span className="brand-icon">🐔</span>
          <span className="brand-name">VetSafe Tracker</span>
        </div>
        <div className="nav-links">
          <a href="#features">Features</a>
          <a href="#how-it-works">How It Works</a>
          <a href="#roles">Get Started</a>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="hero-section">
        <div className="hero-bg-blobs">
          <div className="blob blob-1" />
          <div className="blob blob-2" />
          <div className="blob blob-3" />
        </div>
        <div className="hero-content">
          <div className="hero-badge">🛡️ Trusted Livestock Safety Platform</div>
          <h1 className="hero-title">
            From Treatment<br />
            <span className="hero-highlight">to Trust</span>
          </h1>
          <p className="hero-subtitle">
            VetSafe Tracker connects farmers, veterinarians, and buyers through
            transparent antibiotic tracking, digital prescriptions, and real-time
            withdrawal period monitoring — ensuring safe food from farm to table.
          </p>
          <div className="hero-cta-group">
            <button className="cta-primary" onClick={() => document.getElementById("roles").scrollIntoView({ behavior: "smooth" })}>
              Get Started →
            </button>
            <button className="cta-secondary" onClick={() => document.getElementById("how-it-works").scrollIntoView({ behavior: "smooth" })}>
              See How It Works
            </button>
          </div>
          <div className="hero-stats">
            <div className="stat"><span className="stat-num">3</span><span className="stat-label">User Roles</span></div>
            <div className="stat-divider" />
            <div className="stat"><span className="stat-num">100%</span><span className="stat-label">MRL Compliant</span></div>
            <div className="stat-divider" />
            <div className="stat"><span className="stat-num">24/7</span><span className="stat-label">AI VetBot</span></div>
          </div>
        </div>
        <div className="hero-visual">
          <div className="hero-card-stack">
            <div className="hcard hcard-1">
              <span>⏱️</span>
              <div>
                <p className="hcard-title">Withdrawal Active</p>
                <p className="hcard-sub">Chicken #A204 — 3 days left</p>
              </div>
            </div>
            <div className="hcard hcard-2">
              <span>✅</span>
              <div>
                <p className="hcard-title">Prescription Approved</p>
                <p className="hcard-sub">Dr. Rajan approved Amoxicillin</p>
              </div>
            </div>
            <div className="hcard hcard-3">
              <span>🔍</span>
              <div>
                <p className="hcard-title">Buyer Verified</p>
                <p className="hcard-sub">Batch #B12 — Safe to purchase</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="features-section" id="features">
        <div className="section-header">
          <p className="section-tag">What We Offer</p>
          <h2 className="section-title">Everything you need for safe livestock management</h2>
        </div>
        <div className="features-grid">
          {features.map((f, i) => (
            <div className="feature-card" key={i}>
              <div className="feature-icon">{f.icon}</div>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── How It Works ── */}
      <section className="how-section" id="how-it-works">
        <div className="section-header">
          <p className="section-tag">The Process</p>
          <h2 className="section-title">How VetSafe Tracker works</h2>
        </div>
        <div className="steps-row">
          {steps.map((s, i) => (
            <div className="step-card" key={i}>
              <div className="step-num">{s.num}</div>
              <h3>{s.title}</h3>
              <p>{s.desc}</p>
              {i < steps.length - 1 && <div className="step-arrow">→</div>}
            </div>
          ))}
        </div>
      </section>

      {/* ── Roles / Get Started ── */}
      <section className="roles-section" id="roles">
        <div className="section-header">
          <p className="section-tag">Get Started</p>
          <h2 className="section-title">Choose your role</h2>
        </div>
        <div className="roles-grid">
          {roles.map((r, i) => (
            <div className={`role-card role-${r.color}`} key={i}>
              <div className="role-icon">{r.icon}</div>
              <h3>{r.title}</h3>
              <p className="role-desc">{r.desc}</p>
              <ul className="role-actions">
                {r.actions.map((a, j) => (
                  <li key={j}>✓ {a}</li>
                ))}
              </ul>
              <div className="role-btns">
                <button className={`role-login role-login-${r.color}`} onClick={() => navigate(r.loginPath)}>
                  Login
                </button>
                <button className="role-register" onClick={() => navigate(r.registerPath)}>
                  Register
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="home-footer">
        <div className="footer-brand">
          <span>🐔</span> VetSafe Tracker
        </div>
        <p className="footer-tagline">From Treatment to Trust — Ensuring safe food from farm to table.</p>
        <p className="footer-copy">© {new Date().getFullYear()} VetSafe Tracker. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Landing;
