"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useState, useEffect, useCallback } from "react";
import { apiService } from "@/lib/api";

export default function PropertyDetails() {
  const { id } = useParams();

  const [property, setProperty]     = useState<any>(null);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState("");
  const [heroIndex, setHeroIndex]   = useState(0);

  // Viewing inquiry form
  const [fullName, setFullName]     = useState("");
  const [email, setEmail]           = useState("");
  const [phone, setPhone]           = useState("");
  const [viewDate, setViewDate]     = useState("");
  const [notes, setNotes]           = useState("");
  const [formSuccess, setFormSuccess] = useState("");
  const [imgErrors, setImgErrors]   = useState<Record<number, boolean>>({});

  // ── Fetch property from AMPRE via /api/ampre/properties/[id] ────────────────
  useEffect(() => {
    async function fetchProperty() {
      if (!id) return;
      setLoading(true);
      setError("");
      try {
        const res = await apiService.getAmprePropertyById(id as string);
        if (res.success && res.data) {
          setProperty(res.data);
        } else {
          // Surface the server error message (includes "IDX authentication failed")
          setError(res.message || "Property details could not be loaded.");
        }
      } catch {
        setError("Unable to connect to the property listing service. Please try again later.");
      } finally {
        setLoading(false);
      }
    }
    fetchProperty();
  }, [id]);

  const handleImgError = useCallback((idx: number) => {
    setImgErrors(prev => ({ ...prev, [idx]: true }));
  }, []);

  // ── Viewing inquiry (email-based, no backend required) ───────────────────────
  const handleViewingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const subject = encodeURIComponent(`Viewing Inquiry — ${property?.address ?? id}`);
    const body = encodeURIComponent(
      `Hello Karan,\n\nI'm interested in viewing this property:\n` +
      `Address: ${property?.address ?? id}\n` +
      `MLS#: ${property?.mlsNumber ?? id}\n` +
      `Price: $${Number(property?.price ?? 0).toLocaleString()}\n\n` +
      `Name: ${fullName}\nPhone: ${phone}\nPreferred Date/Time: ${viewDate}\n\nMessage:\n${notes}`
    );
    window.location.href = `mailto:realtorkarankang@gmail.com?subject=${subject}&body=${body}`;
    setFormSuccess("Opening your email client to send the inquiry to Karan Kang.");
  };

  // ── Loading ──────────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="container section" style={{ textAlign: "center", padding: "8rem 0" }}>
        <div className="detail-spinner" />
        <p style={{ marginTop: "1.5rem", color: "var(--text-muted)" }}>
          Loading MLS® property details...
        </p>
      </div>
    );
  }

  // ── Error ────────────────────────────────────────────────────────────────────
  if (error) {
    return (
      <div className="container section" style={{ textAlign: "center", padding: "6rem 0" }}>
        <div style={{
          maxWidth: 520, margin: "0 auto", padding: "2.5rem",
          background: "#fff", border: "1px solid var(--border-light)",
          borderRadius: "var(--radius-lg)",
        }}>
          <h2 style={{ fontSize: "1.5rem", marginBottom: "1rem" }}>Unable to Load Listing</h2>
          <p style={{ color: "var(--text-muted)", marginBottom: "1.5rem" }}>{error}</p>
          <Link href="/search" style={{
            display: "inline-block", padding: "0.75rem 1.5rem",
            background: "var(--bg-dark)", color: "#fff",
            borderRadius: "var(--radius-sm)", fontWeight: 600,
          }}>← Back to Listings</Link>
        </div>
      </div>
    );
  }

  if (!property) return null;

  const images: { url: string; caption?: string }[] = property.images ?? [];
  const hasImages = images.length > 0;
  const heroImage = hasImages ? images[heroIndex]?.url : "";

  return (
    <div className="property-details-page">

      {/* ── Hero Gallery ──────────────────────────────────────────────────── */}
      <section className="property-hero">
        <div className="container">
          <Link href="/search" className="back-link">← Back to Listings</Link>

          {/* Main hero image */}
          <div className="main-gallery-placeholder">
            {hasImages && heroImage && !imgErrors[heroIndex] ? (
              <img
                src={heroImage}
                alt={`${property.address} — photo ${heroIndex + 1}`}
                className="hero-img"
                onError={() => handleImgError(heroIndex)}
              />
            ) : (
              <div className="hero-placeholder-card">
                <svg width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
                  <path d="M3 21h18M3 10l9-7 9 7v11H3V10z" />
                  <path d="M9 14h6v7H9v-7z" />
                </svg>
                <p className="placeholder-title">
                  {hasImages ? "Photo Unavailable" : "Official MLS® Listing"}
                </p>
                <p className="placeholder-subtext">
                  {hasImages
                    ? "Please select another photo from the gallery strip below."
                    : "No photos uploaded to MLS® for this property by the listing brokerage."}
                </p>
              </div>
            )}

            {/* Photo counter */}
            {hasImages && images.length > 1 && (
              <div className="photo-counter">
                {heroIndex + 1} / {images.length}
              </div>
            )}

            {/* Prev / Next arrows */}
            {images.length > 1 && (
              <>
                <button
                  className="gallery-arrow gallery-arrow-prev"
                  onClick={() => setHeroIndex(i => (i - 1 + images.length) % images.length)}
                  aria-label="Previous photo"
                >‹</button>
                <button
                  className="gallery-arrow gallery-arrow-next"
                  onClick={() => setHeroIndex(i => (i + 1) % images.length)}
                  aria-label="Next photo"
                >›</button>
              </>
            )}
          </div>

          {/* Thumbnail strip */}
          {images.length > 1 && (
            <div className="thumbnail-strip">
              {images.slice(0, 35).map((img, idx) => (
                <button
                  key={idx}
                  className={`thumb-btn ${idx === heroIndex ? "active" : ""}`}
                  onClick={() => setHeroIndex(idx)}
                  aria-label={`View photo ${idx + 1}`}
                >
                  {!imgErrors[idx] ? (
                    <img
                      src={img.url}
                      alt={`Thumbnail ${idx + 1}`}
                      className="thumb-img"
                      onError={() => handleImgError(idx)}
                    />
                  ) : (
                    <div className="thumb-placeholder" />
                  )}
                </button>
              ))}
              {images.length > 35 && (
                <div className="thumb-more">+{images.length - 35} more</div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* ── Details + Sidebar ─────────────────────────────────────────────── */}
      <section className="section">
        <div className="container">
          <div className="details-grid">

            {/* Main info */}
            <div className="main-info">
              <div className="info-header">
                {property.propertyType && (
                  <span className="badge">{property.propertyType}</span>
                )}
                <h1 className="details-price">
                  ${Number(property.price).toLocaleString()}
                  {property.transactionType && (
                    <span className="transaction-type"> — {property.transactionType}</span>
                  )}
                </h1>
                <p className="details-address">
                  {[property.address, property.city, property.province, property.postalCode]
                    .filter(Boolean).join(", ")}
                </p>
                {property.mlsNumber && (
                  <p className="mls-tag">MLS® #{property.mlsNumber}</p>
                )}
              </div>

              {/* Stats */}
              <div className="details-stats">
                {property.bedrooms > 0 && (
                  <div className="detail-stat">
                    <span className="stat-value">{property.bedrooms}</span>
                    <span className="stat-label">Bedrooms</span>
                  </div>
                )}
                {property.bathrooms > 0 && (
                  <div className="detail-stat">
                    <span className="stat-value">{property.bathrooms}</span>
                    <span className="stat-label">Bathrooms</span>
                  </div>
                )}
                {property.squareFeet && (
                  <div className="detail-stat">
                    <span className="stat-value">
                      {Number(property.squareFeet).toLocaleString()}
                    </span>
                    <span className="stat-label">Sq Ft</span>
                  </div>
                )}
                {property.lotSize && (
                  <div className="detail-stat">
                    <span className="stat-value">
                      {Number(property.lotSize).toLocaleString()} {property.lotSizeUnits}
                    </span>
                    <span className="stat-label">Lot Size</span>
                  </div>
                )}
                {property.garage != null && property.garage > 0 && (
                  <div className="detail-stat">
                    <span className="stat-value">{property.garage}</span>
                    <span className="stat-label">Garage</span>
                  </div>
                )}
                {property.yearBuilt && (
                  <div className="detail-stat">
                    <span className="stat-value">{property.yearBuilt}</span>
                    <span className="stat-label">Year Built</span>
                  </div>
                )}
              </div>

              {/* Description */}
              {property.description && (
                <div className="details-description">
                  <h2>Description</h2>
                  <p>{property.description}</p>
                </div>
              )}
            </div>

            {/* Sidebar inquiry form */}
            <aside className="sidebar">
              <div className="sticky-form-card">
                <h3>Schedule a Viewing</h3>
                <p>Interested in this property? Send a message to Karan Kang.</p>

                {formSuccess && <div className="form-success">{formSuccess}</div>}

                <form className="viewing-form" onSubmit={handleViewingSubmit}>
                  <input
                    type="text" placeholder="Full Name"
                    value={fullName} onChange={e => setFullName(e.target.value)} required
                  />
                  <input
                    type="email" placeholder="Email Address"
                    value={email} onChange={e => setEmail(e.target.value)} required
                  />
                  <input
                    type="tel" placeholder="Phone Number"
                    value={phone} onChange={e => setPhone(e.target.value)}
                  />
                  <div className="date-input-group">
                    <label htmlFor="view-date">Preferred Date &amp; Time</label>
                    <input
                      id="view-date" type="datetime-local"
                      value={viewDate} onChange={e => setViewDate(e.target.value)} required
                    />
                  </div>
                  <textarea
                    placeholder="I'm interested in viewing this property..."
                    rows={4} value={notes} onChange={e => setNotes(e.target.value)}
                  />
                  <button type="submit" className="submit-btn">
                    Send Inquiry
                  </button>
                </form>

                <div className="direct-contact">
                  <p>Or contact Karan directly:</p>
                  <a href="tel:4379985873" className="contact-link">📞 437-998-5873</a>
                  <a href="mailto:realtorkarankang@gmail.com" className="contact-link">
                    ✉️ realtorkarankang@gmail.com
                  </a>
                </div>
              </div>
            </aside>

          </div>
        </div>
      </section>

      <style jsx>{`
        .property-details-page { background: #fafafa; }

        /* ── Loading spinner ── */
        .detail-spinner {
          width: 36px; height: 36px;
          border: 3px solid var(--border-light);
          border-top-color: var(--text-primary);
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
          margin: 0 auto;
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        /* ── Hero ── */
        .property-hero {
          padding: 2rem 0;
          background: #ffffff;
          border-bottom: 1px solid var(--border-light);
        }

        .back-link {
          display: inline-block;
          margin-bottom: 1.5rem;
          font-size: 0.9rem;
          font-weight: 500;
          color: var(--text-muted);
        }

        .main-gallery-placeholder {
          width: 100%;
          aspect-ratio: 21 / 9;
          background: var(--bg-subtle);
          border-radius: var(--radius-lg);
          border: 1px solid var(--border-light);
          position: relative;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .hero-img {
          width: 100%; height: 100%;
          object-fit: cover;
          display: block;
          position: absolute;
          inset: 0;
        }

        .hero-placeholder-card {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          gap: 0.4rem;
          padding: 2rem;
          color: var(--text-muted);
        }

        .hero-placeholder-card svg {
          color: #a1a1aa;
          margin-bottom: 0.25rem;
        }

        .placeholder-title {
          font-weight: 700;
          font-size: 1.15rem;
          color: var(--text-primary);
        }

        .placeholder-subtext {
          font-size: 0.88rem;
          color: var(--text-muted);
          max-width: 440px;
          line-height: 1.5;
        }

        .placeholder-text {
          color: var(--text-muted);
          font-weight: 500;
          font-size: 0.95rem;
        }

        .photo-counter {
          position: absolute;
          bottom: 1rem; right: 1rem;
          background: rgba(0,0,0,0.55);
          color: #fff;
          font-size: 0.8rem;
          font-weight: 600;
          padding: 0.35rem 0.75rem;
          border-radius: 9999px;
          backdrop-filter: blur(4px);
        }

        .gallery-arrow {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          background: rgba(255,255,255,0.85);
          border: none;
          border-radius: 50%;
          width: 44px; height: 44px;
          font-size: 1.6rem;
          line-height: 1;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background 0.2s;
          box-shadow: 0 2px 12px rgba(0,0,0,0.12);
        }
        .gallery-arrow:hover { background: #fff; }
        .gallery-arrow-prev { left: 1rem; }
        .gallery-arrow-next { right: 1rem; }

        /* ── Thumbnail strip ── */
        .thumbnail-strip {
          display: flex;
          gap: 0.5rem;
          margin-top: 0.75rem;
          overflow-x: auto;
          padding-bottom: 0.25rem;
          scrollbar-width: thin;
        }

        .thumb-btn {
          flex-shrink: 0;
          width: 80px; height: 56px;
          border: 2px solid transparent;
          border-radius: var(--radius-sm);
          overflow: hidden;
          cursor: pointer;
          background: var(--bg-subtle);
          padding: 0;
          transition: border-color 0.15s;
        }
        .thumb-btn.active { border-color: var(--text-primary); }
        .thumb-img {
          width: 100%; height: 100%;
          object-fit: cover; display: block;
        }
        .thumb-placeholder {
          width: 100%; height: 100%;
          background: var(--bg-subtle);
        }
        .thumb-more {
          flex-shrink: 0;
          width: 80px; height: 56px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.75rem;
          color: var(--text-muted);
          font-weight: 600;
          background: var(--bg-subtle);
          border-radius: var(--radius-sm);
        }

        /* ── Details grid ── */
        .details-grid {
          display: grid;
          grid-template-columns: 1fr 360px;
          gap: 4rem;
        }

        .info-header { margin-bottom: 2.5rem; }

        .details-price {
          font-size: 2.5rem;
          font-weight: 700;
          margin: 0.5rem 0 0.25rem;
        }
        .transaction-type {
          font-size: 1.1rem;
          font-weight: 400;
          color: var(--text-muted);
        }

        .details-address {
          font-size: 1.1rem;
          color: var(--text-secondary);
        }

        .mls-tag {
          font-size: 0.8rem;
          color: var(--text-muted);
          font-weight: 600;
          margin-top: 0.4rem;
        }

        /* ── Stats ── */
        .details-stats {
          display: flex;
          flex-wrap: wrap;
          gap: 2rem;
          padding: 2rem 0;
          border-top: 1px solid var(--border-light);
          border-bottom: 1px solid var(--border-light);
          margin-bottom: 2.5rem;
        }

        .detail-stat { display: flex; flex-direction: column; }
        .stat-value { font-size: 1.5rem; font-weight: 700; color: var(--text-primary); }
        .stat-label {
          font-size: 0.8rem; text-transform: uppercase;
          color: var(--text-muted); font-weight: 700; letter-spacing: 0.05em;
        }

        .details-description h2 { font-size: 1.5rem; margin-bottom: 1.25rem; }
        .details-description p {
          font-size: 1.05rem; line-height: 1.8;
          color: var(--text-secondary); margin-bottom: 2.5rem;
        }

        /* ── Sidebar ── */
        .sticky-form-card {
          position: sticky; top: 120px;
          background: #ffffff;
          border: 1px solid var(--border-light);
          border-radius: var(--radius-lg);
          padding: 2rem;
          box-shadow: 0 4px 20px rgba(0,0,0,0.03);
        }
        .sticky-form-card h3 { font-size: 1.25rem; margin-bottom: 0.75rem; }
        .sticky-form-card > p {
          font-size: 0.85rem; color: var(--text-muted); margin-bottom: 1.5rem;
        }

        .viewing-form { display: flex; flex-direction: column; gap: 1rem; }
        .viewing-form input, .viewing-form textarea {
          padding: 0.85rem;
          border: 1px solid var(--border-medium);
          border-radius: var(--radius-sm);
          font-family: inherit;
          font-size: 0.9rem;
          outline: none;
          background: var(--bg-primary);
          transition: border-color 0.2s;
        }
        .viewing-form input:focus, .viewing-form textarea:focus {
          border-color: var(--text-primary);
        }

        .date-input-group { display: flex; flex-direction: column; gap: 0.35rem; }
        .date-input-group label {
          font-size: 0.75rem; font-weight: 700;
          text-transform: uppercase; color: var(--text-muted);
        }

        .submit-btn {
          background: var(--bg-dark); color: #ffffff;
          border: none; padding: 1rem;
          border-radius: var(--radius-sm);
          font-weight: 600; cursor: pointer; margin-top: 0.5rem;
          transition: opacity 0.2s;
        }
        .submit-btn:hover { opacity: 0.88; }

        .form-success {
          background: #f4fbf7; border: 1px solid #10b981;
          border-radius: var(--radius-sm); color: #047857;
          font-size: 0.85rem; padding: 0.75rem; margin-bottom: 1rem;
        }

        .direct-contact {
          margin-top: 1.5rem;
          padding-top: 1.25rem;
          border-top: 1px solid var(--border-light);
          display: flex; flex-direction: column; gap: 0.5rem;
        }
        .direct-contact p {
          font-size: 0.8rem; color: var(--text-muted); font-weight: 600;
          text-transform: uppercase; letter-spacing: 0.05em;
        }
        .contact-link {
          font-size: 0.88rem; font-weight: 500;
          color: var(--text-secondary);
          text-decoration: none;
          transition: color 0.2s;
        }
        .contact-link:hover { color: var(--text-primary); }

        @media (max-width: 992px) {
          .details-grid { grid-template-columns: 1fr; gap: 3rem; }
          .sticky-form-card { position: static; }
        }
        @media (max-width: 480px) {
          .details-price { font-size: 1.8rem; }
          .main-gallery-placeholder { aspect-ratio: 4/3; }
        }
      `}</style>
    </div>
  );
}
