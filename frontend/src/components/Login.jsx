import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/Login.css";
import Logo from '../assets/images.png'

function Login({ setUserId }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [incorrect, setIncorrect] = useState(false);
  const [isUserlogin, setIsUserlogin] = useState(true);
  const [admin, setAdmin] = useState("");
  const [adminPass, setAdminPass] = useState("");
  const navigate = useNavigate();

  function usersignin() {
    axios
      .post(
        "https://quickmartproject-backend.onrender.com/api/product/signin",
        { email, password },
        { withCredentials: true }
      )
      .then((result) => {
        if (result?.data?.message === "Success") {
          setUserId(result.data.uid);
          navigate("/home");
        } else {
          setIncorrect(true);
        }
      })
      .catch(() => setIncorrect(true));
  }

  function adminsignin() {
    if (admin === "admin" && adminPass === "admin") {
      navigate("/admin/dashboard");
    } else {
      setIncorrect(true);
    }
  }

  function register() {
    navigate("/register");
  }

  useEffect(() => {
    if (incorrect) {
      const t = setTimeout(() => setIncorrect(false), 1200);
      return () => clearTimeout(t);
    }
  }, [incorrect]);

  const handleSubmit = (e) => {
    e.preventDefault();
    isUserlogin ? usersignin() : adminsignin();
  };

  return (
    <div className="login-page">
      <div className="page-overlay" aria-hidden />

      <main className="login-card" role="dialog" aria-modal="true">
        <header className="login-header">
          <div className="brand">
            <img src={Logo} alt="" className="brand-logo" />
            <span className="brand-name">QuickMart</span>
          </div>

          <div className="segmented">
            <button type="button" className={`seg-btn ${isUserlogin ? "active" : ""}`} aria-pressed={isUserlogin} onClick={() => setIsUserlogin(true)}>
              User
            </button>
            <button type="button" className={`seg-btn ${!isUserlogin ? "active" : ""}`} aria-pressed={!isUserlogin} onClick={() => setIsUserlogin(false)}>
              Admin
            </button>
            <span className={`seg-indicator ${isUserlogin ? "left" : "right"}`} aria-hidden />
          </div>
        </header>

        <h1 className="card-title">{isUserlogin ? "Sign in" : "Admin sign in"}</h1>

        <form className="login-form" onSubmit={handleSubmit} noValidate>
          {isUserlogin ? (
            <>
              <div className="field">
                <label htmlFor="email">Email</label>
                <div className="input">
                  <i className="fa-solid fa-envelope" aria-hidden />
                  <input id="email" type="email" name="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" required autoFocus/>
                </div>
              </div>

              <div className="field">
                <label htmlFor="password">Password</label>
                <div className="input">
                  <i className="fa-solid fa-lock" aria-hidden />
                  <input id="password" type="password" name="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" required />
                </div>
              </div>

              <div className={`incorrectmessage ${incorrect ? "visibilityon" : "visibilityoff"}`} role="alert" aria-live="assertive" >
                <i className="fa-solid fa-circle-exclamation" aria-hidden />
                Incorrect email or password
              </div>

              <div className="actions">
                <button  type="button" className="btn google" onClick={() => window.location.href = "https://quickmartproject-backend.onrender.com/auth/google"}>
                  <i className="fa-brands fa-google"></i> Sign in with Google
                </button>
                <button type="button" className="btn ghost" onClick={register}>
                  <i className="fa-solid fa-user-plus" />
                  Create account
                </button>
                <button type="submit" className="btn primary">
                  <i className="fa-solid fa-right-to-bracket" />
                  Sign in
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="field">
                <label htmlFor="admin">Admin name</label>
                <div className="input">
                  <i className="fa-solid fa-user-shield" aria-hidden />
                  <input
                    id="admin"
                    type="text"
                    placeholder="admin"
                    value={admin}
                    onChange={(e) => setAdmin(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="field">
                <label htmlFor="adminPass">Password</label>
                <div className="input">
                  <i className="fa-solid fa-lock" aria-hidden />
                  <input
                    id="adminPass"
                    type="password"
                    placeholder="••••••••"
                    value={adminPass}
                    onChange={(e) => setAdminPass(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div
                className={`incorrectmessage ${incorrect ? "visibilityon" : "visibilityoff"}`}
                role="alert"
                aria-live="assertive"
              >
                <i className="fa-solid fa-circle-exclamation" aria-hidden />
                Incorrect admin credentials
              </div>

              <div className="actions">
                <button type="submit" className="btn primary wide">
                  <i className="fa-solid fa-right-to-bracket" />
                  Sign in
                </button>
              </div>
            </>
          )}
        </form>
      </main>
    </div>
  );
}

export default Login;
