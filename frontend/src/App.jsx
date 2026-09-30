import { useState } from "react";
import "./App.css";

const API = "https://veloop-captcha-earn-api.onrender.com/api";

export default function App() {
  const [mode, setMode] = useState("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [token, setToken] = useState("");
  const [challenge, setChallenge] = useState(null);
  const [selectedOption, setSelectedOption] = useState("");
  const [result, setResult] = useState(null);
  const [wallet, setWallet] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function request(path, options = {}) {
    const response = await fetch(`${API}${path}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers,
      },
    });

    const data = await response.json();

    if (!response.ok || data.success === false) {
      throw new Error(data.message || "Request failed");
    }

    return data;
  }

  async function handleAuth(event) {
    event.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const path =
        mode === "register" ? "/auth/register" : "/auth/login";

      const body =
        mode === "register"
          ? { name, email, password }
          : { email, password };

      const data = await request(path, {
        method: "POST",
        body: JSON.stringify(body),
      });

      setToken(data.token);
      setMessage("Login successful. Welcome to VELoop!");
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  }

  async function loadWallet(authToken = token) {
    const response = await fetch(`${API}/wallet/gems`, {
      headers: { Authorization: `Bearer ${authToken}` },
    });
    const data = await response.json();

    if (response.ok && data.success) {
      setWallet(data.wallet);
    }
  }

  async function createChallenge() {
    setLoading(true);
    setMessage("");
    setResult(null);
    setSelectedOption("");

    try {
      const data = await request("/captcha/new");
      setChallenge(data.challenge);
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  }

  async function verifyAnswer() {
    if (!selectedOption) {
      setMessage("Please select an option first.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const data = await request("/captcha/verify", {
        method: "POST",
        body: JSON.stringify({
          challengeId: challenge.challengeId,
          selectedOption,
        }),
      });

      setResult(data);
      await loadWallet();
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  }

  async function claimReward() {
    setLoading(true);
    setMessage("");

    try {
      const data = await request("/captcha/claim", {
        method: "POST",
        body: JSON.stringify({
          challengeId: challenge.challengeId,
        }),
      });

      setResult(data);
      setMessage("Reward claimed successfully!");
      await loadWallet();
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  }

  function logout() {
    setToken("");
    setChallenge(null);
    setResult(null);
    setWallet(null);
    setMessage("");
  }

  if (!token) {
    return (
      <main className="page">
        <section className="auth-card">
          <div className="brand-mark">V</div>
          <p className="eyebrow">CAPTCHA EARN</p>
          <h1>Welcome to VELoop</h1>
          <p className="muted">
            Complete CAPTCHA challenges and earn GEM rewards.
          </p>

          <div className="mode-switch">
            <button
              className={mode === "login" ? "active" : ""}
              onClick={() => setMode("login")}
            >
              Login
            </button>
            <button
              className={mode === "register" ? "active" : ""}
              onClick={() => setMode("register")}
            >
              Create account
            </button>
          </div>

          <form onSubmit={handleAuth}>
            {mode === "register" && (
              <label>
                Full name
                <input
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="Your name"
                  required
                />
              </label>
            )}

            <label>
              Email address
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@example.com"
                required
              />
            </label>

            <label>
              Password
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Enter your password"
                required
              />
            </label>

            <button className="primary-btn" disabled={loading}>
              {loading
                ? "Please wait..."
                : mode === "register"
                  ? "Create account"
                  : "Login"}
            </button>
          </form>

          {message && <p className="notice">{message}</p>}
        </section>
      </main>
    );
  }

  return (
    <main className="page">
      <header className="topbar">
        <div className="brand">
          <div className="brand-mark small">V</div>
          <span>VELoop</span>
        </div>
        <button className="text-btn" onClick={logout}>
          Log out
        </button>
      </header>

      <section className="dashboard">
        <div className="welcome-row">
          <div>
            <p className="eyebrow">YOUR REWARDS SPACE</p>
            <h1>Earn GEMs, one challenge at a time.</h1>
            <p className="muted">
              Solve a CAPTCHA and collect rewards.
            </p>
          </div>

          <div className="wallet-card">
            <span>GEM BALANCE</span>
            <strong>{wallet?.gems ?? "—"} <small>GEM</small></strong>
            <button className="wallet-refresh" onClick={() => loadWallet()}>
              Refresh balance
            </button>
          </div>
        </div>

        <section className="challenge-card">
          <div className="challenge-heading">
            <div>
              <p className="eyebrow">CAPTCHA CHALLENGE</p>
              <h2>Choose the matching code</h2>
            </div>
            <span className="status-pill">
              {result ? result.result || "Completed" : "Ready"}
            </span>
          </div>

          {!challenge ? (
            <div className="empty-state">
              <div className="captcha-symbol">✦</div>
              <p>Start a challenge to see your options.</p>
              <button
                className="primary-btn"
                onClick={createChallenge}
                disabled={loading}
              >
                {loading ? "Loading..." : "Start challenge"}
              </button>
            </div>
          ) : (
            <>
              <div className="captcha-display">
  <span>{challenge.question}</span>
  <div className="captcha-art">
    {challenge.captchaText || "?"}
  </div>
</div>

              <div className="options-grid">
                {challenge.options.map((option, index) => (
                  <button
                    key={`${option}-${index}`}
                    className={
                      selectedOption === option ? "option selected" : "option"
                    }
                    onClick={() => setSelectedOption(option)}
                    disabled={Boolean(result)}
                  >
                    <span className="option-letter">
                      {String.fromCharCode(65 + index)}
                    </span>
                    {option}
                  </button>
                ))}
              </div>

              {!result ? (
                <button
                  className="primary-btn"
                  onClick={verifyAnswer}
                  disabled={loading || !selectedOption}
                >
                  {loading ? "Checking..." : "Verify answer"}
                </button>
              ) : (
                <div className="result-box">
                  <h3>
                    {result.result === "CORRECT"
                      ? "Correct answer!"
                      : result.result === "INCORRECT"
                        ? "Answer submitted"
                        : result.message || "Challenge completed"}
                  </h3>
                  <p>
                    Reward:{" "}
                    <strong>
                      {result.reward?.amount ?? result.reward?.rewardAmount ?? "—"}{" "}
                      {result.reward?.currency ?? "GEM"}
                    </strong>
                  </p>
                  {result.reward?.status === "PENDING" && (
                    <button
                      className="primary-btn"
                      onClick={claimReward}
                      disabled={loading}
                    >
                      {loading ? "Claiming..." : "Claim reward"}
                    </button>
                  )}
                  {result.reward?.status === "CLAIMED" && (
                    <p className="claimed-label">Reward claimed ✓</p>
                  )}
                </div>
              )}

              <button
                className="secondary-btn"
                onClick={createChallenge}
                disabled={loading}
              >
                No thanks — new challenge
              </button>
            </>
          )}

          {message && <p className="notice">{message}</p>}
        </section>
      </section>
    </main>
  );
}