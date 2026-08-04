"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SearchHero() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("Buy"); // Buy or Rent
  const [location, setLocation] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [bedrooms, setBedrooms] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const queryParams = new URLSearchParams();
    
    if (location.trim()) {
      queryParams.append("city", location.trim());
    }
    if (maxPrice && maxPrice !== "any") {
      queryParams.append("maxPrice", maxPrice);
    }
    if (bedrooms && bedrooms !== "any") {
      queryParams.append("bedrooms", bedrooms);
    }
    // Set status flag based on activeTab: "Buy" properties are "ACTIVE" and "Rent" are "LEASED" or similar, 
    // or just filter property type. Let's pass the tab mode.
    queryParams.append("mode", activeTab.toLowerCase());

    router.push(`/search?${queryParams.toString()}`);
  };

  return (
    <div className="search-hero-container">
      <div className="search-tabs">
        {["Buy", "Rent"].map((tab) => (
          <button
            key={tab}
            className={`search-tab ${activeTab === tab ? "active" : ""}`}
            onClick={() => setActiveTab(tab)}
            type="button"
          >
            {tab}
          </button>
        ))}
      </div>
      
      <form onSubmit={handleSearch} className="search-box">
        <div className="search-inputs-grid">
          <div className="search-input-group">
            <label htmlFor="search-location">Location</label>
            <input 
              id="search-location"
              type="text" 
              placeholder="Oakville, Brampton, Toronto..." 
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              autoComplete="off"
            />
          </div>
          
          <div className="search-input-group">
            <label htmlFor="search-price">Max Price</label>
            <select 
              id="search-price"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
            >
              <option value="any">No Max</option>
              <option value="500000">$500k</option>
              <option value="1000000">$1M</option>
              <option value="1500000">$1.5M</option>
              <option value="2000000">$2M+</option>
            </select>
          </div>
          
          <div className="search-input-group">
            <label htmlFor="search-beds">Beds</label>
            <select 
              id="search-beds"
              value={bedrooms}
              onChange={(e) => setBedrooms(e.target.value)}
            >
              <option value="any">Any</option>
              <option value="1">1+</option>
              <option value="2">2+</option>
              <option value="3">3+</option>
              <option value="4">4+</option>
            </select>
          </div>
          
          <button className="search-submit-btn" type="submit">
            Search Listings
          </button>
        </div>

        <div className="search-integration-notice">
          <svg className="notice-icon" viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
          </svg>
          <span>Search now connects directly to our live MLS® / TRREB property database feed</span>
        </div>
      </form>

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
          cursor: pointer;
        }

        .search-tab:hover {
          color: var(--text-primary);
          background: rgba(0, 0, 0, 0.01);
        }

        .search-tab.active {
          background: #ffffff;
          color: var(--text-primary);
          border-bottom: 2px solid var(--border-dark);
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
          background: #ffffff;
          color: var(--text-primary);
          outline: none;
          transition: border-color 0.2s ease;
        }

        .search-input-group input:focus,
        .search-input-group select:focus {
          border-color: var(--text-primary);
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

        .search-integration-notice {
          margin-top: 1.5rem;
          padding: 0.85rem 1.25rem;
          background-color: var(--bg-subtle);
          border-radius: var(--radius-sm);
          border-left: 3px solid var(--border-dark);
          font-size: 0.88rem;
          color: var(--text-secondary);
          font-weight: 500;
          display: flex;
          align-items: center;
          gap: 0.65rem;
          justify-content: center;
        }

        .notice-icon {
          color: var(--text-secondary);
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
