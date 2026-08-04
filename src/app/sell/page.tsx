"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { apiService } from "@/lib/api";

export default function HomeValuationPage() {
  const router = useRouter();
  
  // Form states
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("Oakville");
  const [bedrooms, setBedrooms] = useState("3");
  const [bathrooms, setBathrooms] = useState("2.5");
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [notes, setNotes] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const valuationData = {
      address,
      city,
      bedrooms: Number(bedrooms),
      bathrooms: Number(bathrooms),
      contactName,
      contactEmail,
      contactPhone: contactPhone || undefined,
      notes: notes || undefined
    };

    try {
      const res = await apiService.requestHomeValuation(valuationData);
      if (res.success && res.data) {
        // Store report data in sessionStorage to load in next screen
        sessionStorage.setItem("last_valuation", JSON.stringify(res.data));
        router.push("/sell/report");
      } else {
        setError(res.message || "Failed to generate home valuation. Please verify your fields.");
      }
    } catch (err) {
      setError("Unable to contact valuation service. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="valuation-page">
      <div className="page-header">
        <div className="container">
          <span className="badge">Seller Experience</span>
          <h1>What's My Home Worth?</h1>
          <p className="subheading">
            Get an instant, data-driven property valuation estimate based on recent comparable GTA sales.
          </p>
        </div>
      </div>

      <div className="container section details-grid">
        <div className="info-column">
          <h2>How Our Valuation Works</h2>
          <p style={{ marginBottom: "1.5rem" }}>
            We analyze multiple local market signals and historic MLS® data to estimate your property's value in today's real estate market:
          </p>
          <ul className="info-bullets" style={{ listStyle: "none", padding: 0 }}>
            <li>
              <strong>Active MLS® Comparables</strong>: We match your property features against houses currently listed in your immediate neighborhood.
            </li>
            <li>
              <strong>Recent Historic Sales</strong>: Our algorithms review sold property registries to see transaction prices from the last 90 days.
            </li>
            <li>
              <strong>Regional Appreciation</strong>: We integrate broad-GTA and specific municipality growth indices to fine-tune our analysis.
            </li>
          </ul>

          <div className="contact-callout">
            <h4>Need a Certified Appraisal?</h4>
            <p>For official legal or financial purposes, schedule a comprehensive, in-person property walkthrough with Karan Kang.</p>
            <p className="phone-line">Direct Professional Appraisals: <strong>437-998-5873</strong></p>
          </div>
        </div>

        <div className="form-column">
          <div className="valuation-card">
            <h3>Request Valuation Report</h3>
            <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginBottom: "1.5rem" }}>
              Please enter accurate property and contact details to receive your calculated value range.
            </p>

            {error && <div className="form-error">{error}</div>}

            <form onSubmit={handleSubmit} className="valuation-form">
              <div className="input-group">
                <label htmlFor="address">Property Address</label>
                <input
                  id="address"
                  type="text"
                  placeholder="123 Maple Grove Dr"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  required
                />
              </div>

              <div className="form-row">
                <div className="input-group">
                  <label htmlFor="city">City</label>
                  <select id="city" value={city} onChange={(e) => setCity(e.target.value)}>
                    <option value="Oakville">Oakville</option>
                    <option value="Brampton">Brampton</option>
                    <option value="Toronto">Toronto</option>
                    <option value="Burlington">Burlington</option>
                    <option value="Mississauga">Mississauga</option>
                  </select>
                </div>

                <div className="input-row-sub">
                  <div className="input-group">
                    <label htmlFor="beds">Beds</label>
                    <select id="beds" value={bedrooms} onChange={(e) => setBedrooms(e.target.value)}>
                      <option value="1">1 Bed</option>
                      <option value="2">2 Beds</option>
                      <option value="3">3 Beds</option>
                      <option value="4">4 Beds</option>
                      <option value="5">5+ Beds</option>
                    </select>
                  </div>

                  <div className="input-group">
                    <label htmlFor="baths">Baths</label>
                    <select id="baths" value={bathrooms} onChange={(e) => setBathrooms(e.target.value)}>
                      <option value="1">1 Bath</option>
                      <option value="1.5">1.5 Baths</option>
                      <option value="2">2 Baths</option>
                      <option value="2.5">2.5 Baths</option>
                      <option value="3">3 Baths</option>
                      <option value="4">4+ Baths</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="divider"></div>

              <div className="input-group">
                <label htmlFor="name">Contact Name</label>
                <input
                  id="name"
                  type="text"
                  placeholder="Your Full Name"
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  required
                />
              </div>

              <div className="input-group">
                <label htmlFor="email">Email Address</label>
                <input
                  id="email"
                  type="email"
                  placeholder="yourname@gmail.com"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  required
                />
              </div>

              <div className="input-group">
                <label htmlFor="phone">Phone Number (Optional)</label>
                <input
                  id="phone"
                  type="tel"
                  placeholder="437-555-0199"
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                />
              </div>

              <div className="input-group">
                <label htmlFor="notes">Additional Property Notes</label>
                <textarea
                  id="notes"
                  placeholder="Renovated kitchen in 2024, finished basement, cedar deck, etc."
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>

              <button type="submit" className="submit-btn" disabled={loading}>
                {loading ? "Calculating Valuation..." : "Generate Valuation Report"}
              </button>
            </form>
          </div>
        </div>
      </div>

      <style jsx>{`
        .valuation-page {
          background-color: var(--bg-primary);
        }

        .details-grid {
          display: grid;
          grid-template-columns: 1fr 480px;
          gap: 4rem;
        }

        h2 {
          font-size: 1.75rem;
          margin-bottom: 1rem;
        }

        .info-bullets li {
          font-size: 0.95rem;
          margin-bottom: 1rem;
          color: var(--text-secondary);
          position: relative;
          padding-left: 1.5rem;
          line-height: 1.6;
        }

        .info-bullets li::before {
          content: "•";
          position: absolute;
          left: 0;
          color: var(--text-primary);
          font-weight: 700;
          font-size: 1.2rem;
          top: -0.1rem;
        }

        .contact-callout {
          margin-top: 3rem;
          padding: 1.5rem;
          background: #ffffff;
          border-radius: var(--radius-md);
          border: 1px solid var(--border-light);
        }

        .contact-callout h4 {
          font-size: 1.05rem;
          margin-bottom: 0.5rem;
        }

        .contact-callout p {
          font-size: 0.88rem;
          color: var(--text-secondary);
          margin-bottom: 1rem;
        }

        .phone-line {
          border-top: 1px solid var(--border-light);
          padding-top: 0.75rem;
          font-size: 0.9rem !important;
          color: var(--text-primary) !important;
          margin-bottom: 0 !important;
        }

        .valuation-card {
          background: #ffffff;
          border: 1px solid var(--border-light);
          border-radius: var(--radius-lg);
          padding: 2.5rem;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.02);
        }

        .valuation-card h3 {
          font-size: 1.3rem;
          margin-bottom: 0.35rem;
        }

        .valuation-form {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }

        .input-row-sub {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0.75rem;
        }

        .input-group {
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
        }

        .input-group label {
          font-size: 0.7rem;
          font-weight: 700;
          text-transform: uppercase;
          color: var(--text-muted);
        }

        .input-group input,
        .input-group select,
        .input-group textarea {
          padding: 0.8rem;
          border: 1px solid var(--border-medium);
          border-radius: var(--radius-sm);
          font-family: inherit;
          font-size: 0.9rem;
          outline: none;
          background: #ffffff;
          transition: border-color 0.2s ease;
        }

        .input-group input:focus,
        .input-group select:focus,
        .input-group textarea:focus {
          border-color: var(--text-primary);
        }

        .divider {
          height: 1px;
          background-color: var(--border-light);
          margin: 0.5rem 0;
        }

        .form-error {
          background-color: #fef2f2;
          border: 1px solid #f87171;
          border-radius: var(--radius-sm);
          color: #b91c1c;
          font-size: 0.88rem;
          padding: 0.8rem;
          margin-bottom: 1rem;
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

        @media (max-width: 992px) {
          .details-grid {
            grid-template-columns: 1fr;
            gap: 3rem;
          }
        }

        @media (max-width: 576px) {
          .valuation-card {
            padding: 1.75rem;
          }
          .form-row {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
