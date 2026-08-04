"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { apiService } from "@/lib/api";

export default function SignupPage() {
  const router = useRouter();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"BUYER" | "SELLER">("BUYER");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await apiService.signup({
        email,
        password,
        firstName,
        lastName,
        phone: phone || undefined,
        role
      });
      if (res.success) {
        setSuccess("Registration successful! Redirecting to login page...");
        setTimeout(() => {
          router.push("/login");
        }, 2000);
      } else {
        setError(res.message || "Failed to create account. Email may already be registered.");
      }
    } catch (err) {
      setError("Unable to connect to the authentication server. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-page">
      <div className="container form-section section">
        <div className="form-card">
          <span className="badge" style={{ marginBottom: "1rem" }}>Client Registration</span>
          <h1>Create Account</h1>
          <p className="subheading" style={{ marginBottom: "2rem" }}>
            Register to save listings, book viewings, and request home evaluations.
          </p>

          {error && <div className="form-error">{error}</div>}
          {success && <div className="form-success">{success}</div>}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="name-row">
              <div className="input-group">
                <label htmlFor="first-name">First Name</label>
                <input
                  id="first-name"
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="John"
                  required
                />
              </div>

              <div className="input-group">
                <label htmlFor="last-name">Last Name</label>
                <input
                  id="last-name"
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Doe"
                  required
                />
              </div>
            </div>

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
              <label htmlFor="phone">Phone Number (Optional)</label>
              <input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="437-555-0199"
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

            <div className="input-group">
              <label htmlFor="role">I am looking to...</label>
              <select
                id="role"
                value={role}
                onChange={(e) => setRole(e.target.value as any)}
              >
                <option value="BUYER">Buy / Rent Properties (Buyer)</option>
                <option value="SELLER">Sell My Property (Seller)</option>
              </select>
            </div>

            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? "Creating Account..." : "Sign Up"}
            </button>
          </form>

          <p className="redirect-link" style={{ marginTop: "1.5rem", fontSize: "0.9rem", color: "var(--text-secondary)" }}>
            Already have an account? <Link href="/login" style={{ fontWeight: 600, color: "var(--text-primary)" }}>Sign in here</Link>
          </p>
        </div>
      </div>

      <style jsx>{`
        .signup-page {
          background-color: var(--bg-primary);
          min-height: 80vh;
          display: flex;
          align-items: center;
        }

        .form-section {
          max-width: 580px;
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
          gap: 1.25rem;
        }

        .name-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
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

        .input-group input,
        .input-group select {
          padding: 0.85rem;
          border: 1px solid var(--border-medium);
          border-radius: var(--radius-sm);
          font-family: inherit;
          font-size: 0.95rem;
          outline: none;
          background: #ffffff;
          transition: border-color 0.2s ease;
        }

        .input-group input:focus,
        .input-group select:focus {
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

        .form-success {
          background-color: #f4fbf7;
          border: 1px solid #10b981;
          border-radius: var(--radius-sm);
          color: #047857;
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
          .name-row {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
