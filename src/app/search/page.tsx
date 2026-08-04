"use client";

import { useSearchParams } from "next/navigation";
import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import PropertyCard from "@/components/PropertyCard";
import { apiService } from "@/lib/api";

function SearchResultsContent() {
  const searchParams = useSearchParams();
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  // AI assistant states
  const [aiPrompt, setAiPrompt] = useState("");
  const [aiResponse, setAiResponse] = useState("");
  const [aiLoading, setAiLoading] = useState(false);

  // Parse filters from query string
  const city = searchParams.get("city") || "";
  const maxPrice = searchParams.get("maxPrice") || "";
  const bedrooms = searchParams.get("bedrooms") || "";
  const mode = searchParams.get("mode") || "buy";

  useEffect(() => {
    async function fetchProperties() {
      setLoading(true);
      setError("");
      try {
        const filters: any = {};
        if (city) filters.city = city;
        if (maxPrice && maxPrice !== "any") filters.maxPrice = Number(maxPrice);
        if (bedrooms && bedrooms !== "any") filters.bedrooms = Number(bedrooms);
        
        const res = await apiService.getProperties(filters);
        if (res.success) {
          setProperties(res.data || []);
        } else {
          setError(res.message || "Failed to load properties.");
        }
      } catch (err: any) {
        setError("Unable to connect to the properties database server.");
      } finally {
        setLoading(false);
      }
    }

    fetchProperties();
  }, [city, maxPrice, bedrooms, mode]);

  const handleAiSearchSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiPrompt.trim()) return;

    setAiLoading(true);
    setAiResponse("");
    try {
      // Step 1: Query the AI Assistant
      const res = await apiService.queryAIAssistant(aiPrompt);
      if (res.success) {
        setAiResponse(res.data?.response || res.message);
        
        // Step 2: Parse prompt into filters if possible and update listings
        const parseRes = await apiService.parseAISearch(aiPrompt);
        if (parseRes.success && parseRes.data?.filters) {
          const parsedFilters = parseRes.data.filters;
          // Apply parsed filters
          const searchRes = await apiService.getProperties(parsedFilters);
          if (searchRes.success) {
            setProperties(searchRes.data || []);
          }
        }
      } else {
        setAiResponse("Sorry, I was unable to parse that request. Please try again with details like 'detached home with 3 bedrooms under $1.5M'.");
      }
    } catch (err) {
      setAiResponse("The AI Assistant is currently offline. Please try again later or use the manual search options above.");
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <div className="search-results-page">
      <div className="page-header">
        <div className="container">
          <Link href="/" className="back-link">← Back to Home</Link>
          <h1>Search MLS® Listings</h1>
          <p className="subheading">
            Showing properties in the Greater Toronto Area (GTA) and surrounding regions.
          </p>
        </div>
      </div>

      <div className="container content-grid section">
        {/* Main listings list */}
        <div className="listings-section">
          <div className="listings-header">
            <h2>
              {loading ? "Searching Listings..." : `${properties.length} Active Listings Found`}
            </h2>
            {city && <span className="badge">Location: {city}</span>}
            {bedrooms && bedrooms !== "any" && <span className="badge">Beds: {bedrooms}+</span>}
            {maxPrice && maxPrice !== "any" && <span className="badge">Max Price: ${(Number(maxPrice)/1000).toFixed(0)}k</span>}
          </div>

          {loading ? (
            <div className="loading-state">
              <div className="spinner"></div>
              <p>Scanning the MLS® property database...</p>
            </div>
          ) : error ? (
            <div className="error-card">
              <p>{error}</p>
            </div>
          ) : properties.length === 0 ? (
            <div className="empty-listings">
              <h3>No Properties Match Your Search</h3>
              <p>Try modifying your location, filters, or maximum price threshold to see more listings.</p>
              <Link href="/" className="btn-secondary">Clear Filters</Link>
            </div>
          ) : (
            <div className="listings-grid">
              {properties.map((prop) => (
                <PropertyCard
                  key={prop.id}
                  id={prop.id}
                  price={`$${prop.price.toLocaleString()}`}
                  address={`${prop.address}, ${prop.city}, ${prop.province}`}
                  beds={prop.bedrooms}
                  baths={prop.bathrooms}
                  sqft={prop.squareFeet ? prop.squareFeet.toString() : "N/A"}
                  image={prop.images?.[0]?.url || ""}
                  tag={prop.propertyType}
                />
              ))}
            </div>
          )}
        </div>

        {/* AI Search Assistant Sidebar */}
        <aside className="ai-assistant-sidebar">
          <div className="ai-card">
            <div className="ai-header-badge">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                <path d="M12 2c5.52 0 10 4.48 10 10s-4.48 10-10 10S2 17.52 2 12 6.48 2 12 2zm1 10h3l-4-5-4 5h3v4h2v-4z"/>
              </svg>
              <span>AI Real Estate Assistant</span>
            </div>
            <h3>Smart Natural Language Search</h3>
            <p className="ai-instructions">
              Describe your dream home in your own words (e.g., "Show me detached properties in Brampton with 4 bedrooms under $1.5M").
            </p>

            <form onSubmit={handleAiSearchSubmit} className="ai-form">
              <textarea
                placeholder="Type your request here..."
                rows={3}
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                required
              />
              <button type="submit" className="ai-submit-btn" disabled={aiLoading}>
                {aiLoading ? "Analyzing Request..." : "Search with AI"}
              </button>
            </form>

            {aiResponse && (
              <div className="ai-response-box">
                <h4>Assistant Guidance:</h4>
                <p>{aiResponse}</p>
              </div>
            )}
          </div>
        </aside>
      </div>

      <style jsx>{`
        .search-results-page {
          background-color: var(--bg-primary);
          min-height: 80vh;
        }

        .back-link {
          display: inline-block;
          margin-bottom: 1rem;
          font-size: 0.9rem;
          font-weight: 500;
          color: var(--text-muted);
        }

        .content-grid {
          display: grid;
          grid-template-columns: 1fr 340px;
          gap: 3rem;
          padding-top: 2rem;
          padding-bottom: 4rem;
        }

        .listings-header {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 2rem;
          flex-wrap: wrap;
        }

        .listings-header h2 {
          font-size: 1.5rem;
          font-weight: 600;
          margin-right: auto;
        }

        .listings-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 2rem;
        }

        .loading-state, .empty-listings, .error-card {
          text-align: center;
          padding: 5rem 2rem;
          background: #ffffff;
          border: 1px solid var(--border-light);
          border-radius: var(--radius-lg);
          box-shadow: 0 4px 12px rgba(0,0,0,0.01);
        }

        .loading-state p {
          color: var(--text-muted);
          margin-top: 1rem;
        }

        .empty-listings h3 {
          margin-bottom: 0.5rem;
        }

        .empty-listings p {
          color: var(--text-muted);
          margin-bottom: 1.5rem;
        }

        .btn-secondary {
          display: inline-block;
          padding: 0.75rem 1.5rem;
          background: var(--bg-dark);
          color: #ffffff;
          border-radius: var(--radius-sm);
          font-weight: 600;
        }

        .spinner {
          width: 32px;
          height: 32px;
          border: 3px solid var(--border-light);
          border-top-color: var(--text-primary);
          border-radius: 50%;
          animation: spin 1s infinite linear;
          margin: 0 auto;
        }

        .ai-assistant-sidebar {
          position: sticky;
          top: 120px;
          align-self: flex-start;
        }

        .ai-card {
          background: #ffffff;
          border: 1px solid var(--border-light);
          border-radius: var(--radius-lg);
          padding: 1.75rem;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.02);
        }

        .ai-header-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.35rem 0.75rem;
          background: var(--bg-subtle);
          border: 1px solid var(--border-light);
          border-radius: 9999px;
          font-size: 0.75rem;
          font-weight: 700;
          color: var(--text-primary);
          margin-bottom: 1.25rem;
        }

        .ai-card h3 {
          font-size: 1.15rem;
          margin-bottom: 0.5rem;
        }

        .ai-instructions {
          font-size: 0.85rem;
          color: var(--text-secondary);
          line-height: 1.5;
          margin-bottom: 1.5rem;
        }

        .ai-form {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .ai-form textarea {
          padding: 0.85rem;
          border: 1px solid var(--border-medium);
          border-radius: var(--radius-sm);
          font-family: inherit;
          font-size: 0.9rem;
          outline: none;
          resize: none;
          background: var(--bg-primary);
        }

        .ai-form textarea:focus {
          border-color: var(--text-primary);
        }

        .ai-submit-btn {
          background: var(--bg-dark);
          color: #ffffff;
          border: none;
          padding: 0.85rem;
          border-radius: var(--radius-sm);
          font-weight: 600;
          cursor: pointer;
          font-size: 0.9rem;
          transition: opacity 0.2s ease;
        }

        .ai-submit-btn:disabled {
          background: var(--text-muted);
          cursor: not-allowed;
        }

        .ai-response-box {
          margin-top: 1.5rem;
          padding: 1rem;
          background: var(--bg-subtle);
          border-radius: var(--radius-sm);
          border-left: 3px solid var(--text-primary);
          font-size: 0.88rem;
          line-height: 1.5;
          color: var(--text-secondary);
        }

        .ai-response-box h4 {
          font-size: 0.85rem;
          font-weight: 700;
          color: var(--text-primary);
          margin-bottom: 0.4rem;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @media (max-width: 992px) {
          .content-grid {
            grid-template-columns: 1fr;
            gap: 3rem;
          }
          
          .ai-assistant-sidebar {
            position: static;
          }
        }
      `}</style>
    </div>
  );
}

export default function SearchResultsPage() {
  return (
    <Suspense fallback={
      <div className="container section" style={{ textAlign: "center", padding: "5rem 0" }}>
        <p>Loading Search Filters...</p>
      </div>
    }>
      <SearchResultsContent />
    </Suspense>
  );
}
