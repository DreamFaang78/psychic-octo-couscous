"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { apiService } from "@/lib/api";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await apiService.login(email, password);
      if (res.success) {
        // Force refresh header / state by pushing to dashboard
        router.push("/dashboard");
        router.refresh();
      } else {
        setError(res.message || "Invalid email or password.");
      }
    } catch (err) {
      setError("Unable to connect to the authentication server. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="container form-section section">
        <div className="form-card">
          <span className="badge" style={{ marginBottom: "1rem" }}>Secure Client Access</span>
          <h1>Welcome Back</h1>
          <p className="subheading" style={{ marginBottom: "2rem" }}>
            Sign in to manage your saved properties, alerts, and viewing appointments.
          </p>

          {error && <div className="form-error">{error}</div>}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="input-group">
              <label htmlFor="email">Email Address</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
              />
            </div>

            <div className="input-group">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>

            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? "Authenticating..." : "Sign In"}
            </button>
          </form>

          <p className="redirect-link" style={{ marginTop: "1.5rem", fontSize: "0.9rem", color: "var(--text-secondary)" }}>
            Don't have an account? <Link href="/signup" style={{ fontWeight: 600, color: "var(--text-primary)" }}>Register here</Link>
          </p>
        </div>
      </div>

      <style jsx>{`
        .login-page {
          background-color: var(--bg-primary);
          min-height: 75vh;
          display: flex;
          align-items: center;
        }

        .form-section {
          max-width: 520px;
        }

        .form-card {
          background: #ffffff;
          border: 1px solid var(--border-light);
          border-radius: var(--radius-lg);
          padding: 3rem;
          box-shadow: 0 4px 30px rgba(0, 0, 0, 0.02);
        }

        h1 {
          font-size: 2rem;
          margin-bottom: 0.5rem;
        }

        .auth-form {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .input-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .input-group label {
          font-size: 0.75rem;
          font-weight: 700;
          text-transform: uppercase;
          color: var(--text-muted);
        }

        .input-group input {
          padding: 0.85rem;
          border: 1px solid var(--border-medium);
          border-radius: var(--radius-sm);
          font-family: inherit;
          font-size: 0.95rem;
          outline: none;
          transition: border-color 0.2s ease;
        }

        .input-group input:focus {
          border-color: var(--text-primary);
        }

        .form-error {
          background-color: #fef2f2;
          border: 1px solid #f87171;
          border-radius: var(--radius-sm);
          color: #b91c1c;
          font-size: 0.88rem;
          padding: 0.85rem;
          margin-bottom: 1.5rem;
        }

        .submit-btn {
          background: var(--bg-dark);
          color: #ffffff;
          border: none;
          padding: 1rem;
          border-radius: var(--radius-sm);
          font-weight: 600;
          cursor: pointer;
          font-size: 0.95rem;
          margin-top: 0.5rem;
          transition: opacity 0.2s ease;
        }

        .submit-btn:disabled {
          background: var(--text-muted);
          cursor: not-allowed;
        }

        @media (max-width: 576px) {
          .form-card {
            padding: 2rem 1.5rem;
          }
        }
      `}</style>
    </div>
  );
}
