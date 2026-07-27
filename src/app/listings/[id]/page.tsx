"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function PropertyDetails() {
  const { id } = useParams();

  // Mock data for the template
  const property = {
    price: "$1,249,000",
    address: "123 Maple Grove Dr, Oakville, ON L6J 5R2",
    beds: 4,
    baths: 3,
    sqft: "2,800",
    type: "Detached House",
    description: "Stunning 4-bedroom family home in the heart of Oakville. This meticulously maintained property features a modern open-concept layout, premium hardwood flooring, and a chef-inspired kitchen with high-end appliances. The spacious backyard is perfect for entertaining, featuring a large cedar deck and mature landscaping.",
    features: [
      "Custom Kitchen Cabinetry",
      "Finished Basement with Home Theatre",
      "Master Suite with 5-piece Ensuite",
      "Double Car Garage",
      "Proximity to Top-Rated Schools",
      "Smart Home Integration"
    ]
  };

  return (
    <div className="property-details-page">
      {/* Property Hero Gallery Placeholder */}
      <section className="property-hero">
        <div className="container">
          <Link href="/" className="back-link">← Back to Listings</Link>
          <div className="main-gallery-placeholder">
            <span className="placeholder-text">High-Resolution Property Gallery (Placeholder)</span>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="details-grid">
            <div className="main-info">
              <div className="info-header">
                <span className="badge">{property.type}</span>
                <h1 className="details-price">{property.price}</h1>
                <p className="details-address">{property.address}</p>
              </div>

              <div className="details-stats">
                <div className="detail-stat">
                  <span className="stat-value">{property.beds}</span>
                  <span className="stat-label">Bedrooms</span>
                </div>
                <div className="detail-stat">
                  <span className="stat-value">{property.baths}</span>
                  <span className="stat-label">Bathrooms</span>
                </div>
                <div className="detail-stat">
                  <span className="stat-value">{property.sqft}</span>
                  <span className="stat-label">Square Feet</span>
                </div>
              </div>

              <div className="details-description">
                <h2>Description</h2>
                <p>{property.description}</p>
              </div>

              <div className="details-features">
                <h2>Key Features</h2>
                <ul className="features-list">
                  {property.features.map((feature, index) => (
                    <li key={index}>{feature}</li>
                  ))}
                </ul>
              </div>
            </div>

            <aside className="sidebar">
              <div className="sticky-form-card">
                <h3>Schedule a Viewing</h3>
                <p>Interested in this property? Send a message to Karan Kang.</p>
                <form className="viewing-form">
                  <input type="text" placeholder="Full Name" required />
                  <input type="email" placeholder="Email Address" required />
                  <input type="tel" placeholder="Phone Number" />
                  <textarea placeholder="I'm interested in viewing this property..." rows={4}></textarea>
                  <button type="submit" className="submit-btn">Send Inquiry</button>
                </form>
              </div>
            </aside>
          </div>
        </div>
      </section>

      <style jsx>{`
        .property-details-page {
          background: #fafafa;
        }

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
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid var(--border-light);
        }

        .placeholder-text {
          color: var(--text-muted);
          font-weight: 500;
        }

        .details-grid {
          display: grid;
          grid-template-columns: 1fr 360px;
          gap: 4rem;
        }

        .info-header {
          margin-bottom: 2.5rem;
        }

        .details-price {
          font-size: 2.5rem;
          font-weight: 700;
          margin: 0.5rem 0;
        }

        .details-address {
          font-size: 1.1rem;
          color: var(--text-secondary);
        }

        .details-stats {
          display: flex;
          gap: 3rem;
          padding: 2rem 0;
          border-top: 1px solid var(--border-light);
          border-bottom: 1px solid var(--border-light);
          margin-bottom: 2.5rem;
        }

        .detail-stat {
          display: flex;
          flex-direction: column;
        }

        .stat-value {
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--text-primary);
        }

        .stat-label {
          font-size: 0.8rem;
          text-transform: uppercase;
          color: var(--text-muted);
          font-weight: 700;
          letter-spacing: 0.05em;
        }

        .details-description h2,
        .details-features h2 {
          font-size: 1.5rem;
          margin-bottom: 1.25rem;
        }

        .details-description p {
          font-size: 1.05rem;
          line-height: 1.8;
          color: var(--text-secondary);
          margin-bottom: 2.5rem;
        }

        .features-list {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
          list-style: none;
          padding: 0;
        }

        .features-list li {
          font-size: 0.95rem;
          color: var(--text-secondary);
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .features-list li::before {
          content: "✓";
          color: var(--text-primary);
          font-weight: 700;
        }

        .sticky-form-card {
          position: sticky;
          top: 120px;
          background: #ffffff;
          border: 1px solid var(--border-light);
          border-radius: var(--radius-lg);
          padding: 2rem;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.03);
        }

        .sticky-form-card h3 {
          font-size: 1.25rem;
          margin-bottom: 0.75rem;
        }

        .sticky-form-card p {
          font-size: 0.85rem;
          color: var(--text-muted);
          margin-bottom: 1.5rem;
        }

        .viewing-form {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .viewing-form input,
        .viewing-form textarea {
          padding: 0.85rem;
          border: 1px solid var(--border-medium);
          border-radius: var(--radius-sm);
          font-family: inherit;
          font-size: 0.9rem;
          outline: none;
        }

        .submit-btn {
          background: var(--bg-dark);
          color: #ffffff;
          border: none;
          padding: 1rem;
          border-radius: var(--radius-sm);
          font-weight: 600;
          cursor: pointer;
          margin-top: 0.5rem;
        }

        @media (max-width: 992px) {
          .details-grid {
            grid-template-columns: 1fr;
            gap: 3rem;
          }
          
          .sticky-form-card {
            position: static;
          }
          
          .features-list {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
