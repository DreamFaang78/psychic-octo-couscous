"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function ValuationReportPage() {
  const [report, setReport] = useState<any>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedReport = sessionStorage.getItem("last_valuation");
      if (savedReport) {
        setReport(JSON.parse(savedReport));
      }
    }
  }, []);

  if (!report) {
    return (
      <div className="container section" style={{ textAlign: "center", padding: "8rem 0" }}>
        <h2>No Valuation Report Found</h2>
        <p style={{ color: "var(--text-muted)", marginBottom: "2rem" }}>
          Please submit property details on the seller page to generate an estimate.
        </p>
        <Link href="/sell" className="btn-primary">Generate Valuation</Link>
        <style jsx>{`
          .btn-primary {
            display: inline-block;
            background: var(--bg-dark);
            color: #ffffff;
            padding: 0.75rem 1.5rem;
            font-weight: 600;
            border-radius: var(--radius-sm);
          }
        `}</style>
      </div>
    );
  }

  // Format estimated numbers (e.g. min 1200000 -> $1,200,000)
  const formatCurrency = (val: number) => {
    return val ? `$${val.toLocaleString()}` : "Calculating...";
  };

  return (
    <div className="report-page">
      <div className="page-header">
        <div className="container">
          <Link href="/sell" className="back-link">← Back to Valuation Form</Link>
          <span className="badge" style={{ marginTop: "1rem" }}>Instant Analytics Report</span>
          <h1>Your Home Valuation Estimate</h1>
          <p className="subheading">
            Estimated market range for: <strong>{report.address}, {report.city}</strong>
          </p>
        </div>
      </div>

      <div className="container section main-layout">
        <div className="report-main-card">
          <div className="range-display-section">
            <span className="estimate-label">Estimated Current Market Value</span>
            <div className="price-range-wrapper">
              <h2 className="price-value">{formatCurrency(report.estimatedValueMin)}</h2>
              <span className="price-to">to</span>
              <h2 className="price-value">{formatCurrency(report.estimatedValueMax)}</h2>
            </div>
            <p className="accuracy-notice">
              Accuracy Index: ±4.5% based on local comp registrations and regional appreciation trends.
            </p>
          </div>

          <div className="property-summary-table">
            <h3>Analyzed Property Features</h3>
            <div className="table-grid">
              <div className="table-item">
                <span className="item-label">Property Address</span>
                <span className="item-value">{report.address}</span>
              </div>
              <div className="table-item">
                <span className="item-label">City / Municipality</span>
                <span className="item-value">{report.city}</span>
              </div>
              <div className="table-item">
                <span className="item-label">Bedrooms Count</span>
                <span className="item-value">{report.bedrooms} Bedrooms</span>
              </div>
              <div className="table-item">
                <span className="item-label">Bathrooms Count</span>
                <span className="item-value">{report.bathrooms} Bathrooms</span>
              </div>
            </div>
          </div>
        </div>

        <div className="report-sidebar">
          <div className="consult-card">
            <h3>Get a Fully Custom Valuation</h3>
            <p>
              Automated estimates are excellent benchmarks, but they cannot evaluate custom upgrades, landscaping value, staging impact, or premium interior finishes.
            </p>
            <p className="highlight-text">
              Schedule a direct consult with Karan Kang to review custom appraisal variables.
            </p>
            <button className="book-appraisal-btn">Book Free Professional Appraisal</button>
          </div>
        </div>
      </div>

      <style jsx>{`
        .report-page {
          background-color: var(--bg-primary);
          min-height: 80vh;
        }

        .back-link {
          display: inline-block;
          font-size: 0.9rem;
          font-weight: 500;
          color: var(--text-muted);
        }

        .main-layout {
          display: grid;
          grid-template-columns: 1fr 340px;
          gap: 3.5rem;
          align-items: flex-start;
        }

        .report-main-card {
          background: #ffffff;
          border: 1px solid var(--border-light);
          border-radius: var(--radius-lg);
          padding: 3rem;
          box-shadow: 0 4px 25px rgba(0, 0, 0, 0.02);
        }

        .range-display-section {
          text-align: center;
          background: var(--bg-subtle);
          border: 1px solid var(--border-light);
          border-radius: var(--radius-md);
          padding: 2.5rem;
          margin-bottom: 3rem;
        }

        .estimate-label {
          display: block;
          font-size: 0.75rem;
          text-transform: uppercase;
          font-weight: 700;
          letter-spacing: 0.05em;
          color: var(--text-muted);
          margin-bottom: 1rem;
        }

        .price-range-wrapper {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 1.5rem;
          margin-bottom: 1rem;
          flex-wrap: wrap;
        }

        .price-value {
          font-size: 2.75rem;
          font-weight: 800;
          color: var(--text-primary);
          letter-spacing: -0.03em;
        }

        .price-to {
          font-size: 1.25rem;
          color: var(--text-muted);
          font-weight: 600;
          text-transform: uppercase;
        }

        .accuracy-notice {
          font-size: 0.8rem;
          color: var(--text-muted);
        }

        .property-summary-table h3 {
          font-size: 1.25rem;
          margin-bottom: 1.25rem;
          border-bottom: 1px solid var(--border-light);
          padding-bottom: 0.5rem;
        }

        .table-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.5rem;
        }

        .table-item {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .item-label {
          font-size: 0.72rem;
          text-transform: uppercase;
          font-weight: 700;
          color: var(--text-muted);
          letter-spacing: 0.04em;
        }

        .item-value {
          font-size: 1rem;
          font-weight: 600;
          color: var(--text-primary);
        }

        .consult-card {
          background: var(--bg-dark);
          color: #ffffff;
          border-radius: var(--radius-lg);
          padding: 2rem;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
        }

        .consult-card h3 {
          color: #ffffff;
          font-size: 1.25rem;
          margin-bottom: 1rem;
        }

        .consult-card p {
          color: #e4e4e7;
          font-size: 0.88rem;
          line-height: 1.5;
          margin-bottom: 1.25rem;
        }

        .highlight-text {
          font-weight: 600;
          border-top: 1px solid var(--border-dark);
          padding-top: 1rem;
          color: #ffffff !important;
        }

        .book-appraisal-btn {
          width: 100%;
          background: #ffffff;
          color: var(--bg-dark);
          font-weight: 700;
          border: none;
          padding: 0.85rem;
          border-radius: var(--radius-sm);
          font-size: 0.88rem;
          cursor: pointer;
          font-family: inherit;
          margin-top: 0.5rem;
          transition: background-color 0.2s ease;
        }

        .book-appraisal-btn:hover {
          background-color: var(--bg-subtle);
        }

        @media (max-width: 992px) {
          .main-layout {
            grid-template-columns: 1fr;
            gap: 3rem;
          }
        }

        @media (max-width: 576px) {
          .price-value {
            font-size: 2rem;
          }
          .table-grid {
            grid-template-columns: 1fr;
          }
          .report-main-card {
            padding: 2rem 1.5rem;
          }
        }
      `}</style>
    </div>
  );
}
