"use client";

import { useState } from "react";

export default function SearchHero() {
  const [activeTab, setActiveTab] = useState("Buy");

  return (
    <div className="search-hero-container">
      <div className="search-tabs">
        {["Buy", "Rent"].map((tab) => (
          <button
            key={tab}
            className={`search-tab ${activeTab === tab ? "active" : ""}`}
            onClick={() => setActiveTab(tab)}
            disabled
            type="button"
            aria-disabled="true"
          >
            {tab}
          </button>
        ))}
      </div>
      
      <div className="search-box">
        <div className="search-inputs-grid">
          <div className="search-input-group">
            <label>Location</label>
            <input 
              type="text" 
              placeholder="Oakville, Burlington, GTA..." 
              disabled 
              aria-disabled="true"
            />
          </div>
          
          <div className="search-input-group">
            <label>Price Range</label>
            <select disabled aria-disabled="true">
              <option>No Min</option>
              <option>$500k</option>
              <option>$1M</option>
              <option>$2M+</option>
            </select>
          </div>
          
          <div className="search-input-group">
            <label>Beds</label>
            <select disabled aria-disabled="true">
              <option>Any</option>
              <option>1+</option>
              <option>2+</option>
              <option>3+</option>
              <option>4+</option>
            </select>
          </div>
          
          <button className="search-submit-btn" disabled type="button" aria-disabled="true">
            Search Listings
          </button>
        </div>

        <div className="search-integration-notice">
          <svg className="notice-icon" viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
          </svg>
          <span>Search will be enabled once MLS® feed integration is complete</span>
        </div>
      </div>

      <style jsx>{`
        .search-hero-container {
          width: 100%;
          max-width: 900px;
          margin: 2rem auto;
          background: #ffffff;
          border-radius: var(--radius-lg);
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.03);
          overflow: hidden;
          border: 1px solid var(--border-light);
        }

        .search-tabs {
          display: flex;
          background: var(--bg-subtle);
          border-bottom: 1px solid var(--border-light);
        }

        .search-tab {
          flex: 1;
          padding: 1.25rem;
          border: none;
          background: none;
          font-weight: 600;
          font-size: 0.95rem;
          color: var(--text-muted);
          transition: all 0.2s ease;
          cursor: not-allowed;
          opacity: 0.7;
        }

        .search-tab.active {
          background: #ffffff;
          color: var(--text-muted);
          border-bottom: 2px solid var(--border-medium);
          opacity: 0.85;
        }

        .search-box {
          padding: 2.5rem;
        }

        .search-inputs-grid {
          display: grid;
          grid-template-columns: 2fr 1fr 1fr auto;
          gap: 1.5rem;
          align-items: flex-end;
          opacity: 0.6;
        }

        .search-input-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .search-input-group label {
          font-size: 0.75rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: var(--text-muted);
        }

        .search-input-group input,
        .search-input-group select {
          padding: 0.75rem;
          border: 1px solid var(--border-medium);
          border-radius: var(--radius-sm);
          font-family: inherit;
          font-size: 0.95rem;
          background: var(--bg-subtle);
          color: var(--text-muted);
          cursor: not-allowed;
          outline: none;
        }

        .search-submit-btn {
          background: var(--border-medium);
          color: var(--text-muted);
          border: none;
          padding: 0.85rem 2rem;
          border-radius: var(--radius-sm);
          font-weight: 600;
          cursor: not-allowed;
          transition: none;
        }

        .search-integration-notice {
          margin-top: 1.5rem;
          padding: 0.85rem 1.25rem;
          background-color: var(--bg-subtle);
          border-radius: var(--radius-sm);
          border-left: 3px solid var(--border-medium);
          font-size: 0.88rem;
          color: var(--text-secondary);
          font-weight: 500;
          display: flex;
          align-items: center;
          gap: 0.65rem;
          justify-content: center;
        }

        .notice-icon {
          color: var(--text-muted);
          flex-shrink: 0;
        }

        @media (max-width: 768px) {
          .search-inputs-grid {
            grid-template-columns: 1fr;
            gap: 1rem;
          }
          
          .search-box {
            padding: 1.5rem;
          }
        }
      `}</style>
    </div>
  );
}
