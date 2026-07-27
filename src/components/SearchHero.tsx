"use client";

import { useState } from "react";

export default function SearchHero() {
  const [activeTab, setActiveTab] = useState("Buy");

  return (
    <div className="search-hero-container">
      <div className="search-tabs">
        {["Buy", "Rent", "Sold"].map((tab) => (
          <button
            key={tab}
            className={`search-tab ${activeTab === tab ? "active" : ""}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>
      
      <div className="search-box">
        <div className="search-inputs-grid">
          <div className="search-input-group">
            <label>Location</label>
            <input type="text" placeholder="Oakville, Burlington, GTA..." />
          </div>
          
          <div className="search-input-group">
            <label>Price Range</label>
            <select>
              <option>No Min</option>
              <option>$500k</option>
              <option>$1M</option>
              <option>$2M+</option>
            </select>
          </div>
          
          <div className="search-input-group">
            <label>Beds</label>
            <select>
              <option>Any</option>
              <option>1+</option>
              <option>2+</option>
              <option>3+</option>
              <option>4+</option>
            </select>
          </div>
          
          <button className="search-submit-btn">
            Search Listings
          </button>
        </div>
      </div>

      <style jsx>{`
        .search-hero-container {
          width: 100%;
          max-width: 900px;
          margin: 2rem auto;
          background: #ffffff;
          border-radius: var(--radius-lg);
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.05);
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
          cursor: pointer;
          color: var(--text-muted);
          transition: all 0.2s ease;
        }

        .search-tab.active {
          background: #ffffff;
          color: var(--text-primary);
          border-bottom: 2px solid var(--text-primary);
        }

        .search-box {
          padding: 2.5rem;
        }

        .search-inputs-grid {
          display: grid;
          grid-template-columns: 2fr 1fr 1fr auto;
          gap: 1.5rem;
          align-items: flex-end;
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
          outline: none;
        }

        .search-submit-btn {
          background: var(--bg-dark);
          color: #ffffff;
          border: none;
          padding: 0.85rem 2rem;
          border-radius: var(--radius-sm);
          font-weight: 600;
          cursor: pointer;
          transition: opacity 0.2s ease;
        }

        .search-submit-btn:hover {
          opacity: 0.9;
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
