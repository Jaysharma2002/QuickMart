import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Logo from '../assets/images.png'
import "../styles/Register.css";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const canSubmit = name.trim() && email.trim() && password.length >= 6 && !submitting;

  const pwScore = useMemo(() => {
    let score = 0;
    if (password.length >= 6) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    return score;
  }, [password]);

  const register = async (e) => {
    e.preventDefault();
    if (!canSubmit) return;
    setSubmitting(true);
    setError("");
    try {
      const res = await axios.post("http://localhost:8000/api/product/createuser", {
        name,
        email,
        password,
      },{ withCredentials: true });
      if (res?.data) navigate("/home");
    } catch (err) {
      setError(err?.response?.data?.error || "Could not create your account. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-page register-page">
      <div className="page-overlay" aria-hidden />
      <main className="auth-card" role="dialog" aria-modal="true">
        <header className="auth-header">
          <div className="brand">
            <img src={Logo} alt="" className="brand-logo" />
            <span className="brand-name">QuickMart</span>
          </div>
        </header>

        <h1 className="card-title-register">Create your account</h1>

        <form className="auth-form" onSubmit={register} noValidate>
          <div className="field">
            <label htmlFor="name">Full name</label>
            <div className="input">
              <i className="fa-solid fa-user" aria-hidden />
              <input id="name" type="text" name="name" placeholder="Jay Sharma" value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" required autoFocus/>
            </div>
          </div>

          <div className="field">
            <label htmlFor="email">Email</label>
            <div className="input">
              <i className="fa-solid fa-envelope" aria-hidden />
              <input id="email" type="email" name="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" required/>
            </div>
          </div>

          <div className="field">
            <label htmlFor="password">Password</label>
            <div className="input">
              <i className="fa-solid fa-lock" aria-hidden />
              <input id="password" type={showPass ? "text" : "password"} name="password" placeholder="At least 6 characters" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="new-password" required minLength={6}/>
              <button type="button" className="toggle-pass" onClick={() => setShowPass((s) => !s)} aria-label={showPass ? "Hide password" : "Show password"}>
                <i className={`fa-solid ${showPass ? "fa-eye-slash" : "fa-eye"}`} />
              </button>
            </div>

            <div className="pw-meter" aria-hidden>
              <span className={`bar ${pwScore > 0 ? "on" : ""}`} />
              <span className={`bar ${pwScore > 1 ? "on" : ""}`} />
              <span className={`bar ${pwScore > 2 ? "on" : ""}`} />
              <span className={`bar ${pwScore > 3 ? "on" : ""}`} />
            </div>
            <p className="hint">Use 6+ characters with a mix of letters, numbers & symbols.</p>
          </div>

          {error && (
            <div className="alert" role="alert" aria-live="assertive">
              <i className="fa-solid fa-circle-exclamation" aria-hidden />
              {error}
            </div>
          )}

          <div className="actions">
            <button type="button" className="btn ghost" onClick={() => navigate("/")} disabled={submitting}>
              <i className="fa-solid fa-right-to-bracket" />
              Sign in
            </button>

            <button type="submit" className="btn primary" disabled={!canSubmit}>
              {submitting ? (
                <>
                  <span className="spinner" aria-hidden />
                  Creating…
                </>
              ) : (
                <>
                  <i className="fa-solid fa-user-plus" />
                  Create account
                </>
              )}
            </button>
          </div>

          <p className="terms">
            By creating an account you agree to our{" "}
            <a href="#" onClick={(e) => e.preventDefault()}>Terms</a> and{" "}
            <a href="#" onClick={(e) => e.preventDefault()}>Privacy Policy</a>.
          </p>
        </form>
      </main>
    </div>
  );
}
