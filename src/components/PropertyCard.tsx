"use client";

import Image from "next/image";
import Link from "next/link";

interface PropertyCardProps {
  id: string;
  price: string;
  address: string;
  beds: number;
  baths: number;
  sqft: string;
  image: string;
  tag?: string;
}

export default function PropertyCard({ id, price, address, beds, baths, sqft, image, tag }: PropertyCardProps) {
  return (
    <Link href={`/listings/${id}`} className="property-card">
      <div className="card-image-wrapper">
        <div className="image-placeholder">
          <span className="placeholder-text">Property Image</span>
        </div>
        {tag && <span className="property-tag">{tag}</span>}
      </div>
      
      <div className="card-content">
        <h3 className="property-price">{price}</h3>
        <p className="property-address">{address}</p>
        
        <div className="property-stats">
          <div className="stat-item">
            <span className="stat-label">Beds</span>
            <span className="stat-value">{beds}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Baths</span>
            <span className="stat-value">{baths}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Sq Ft</span>
            <span className="stat-value">{sqft}</span>
          </div>
        </div>
      </div>

      <style jsx>{`
        .property-card {
          display: block;
          background: #ffffff;
          border: 1px solid var(--border-light);
          border-radius: var(--radius-md);
          overflow: hidden;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
          text-decoration: none;
          color: inherit;
        }

        .property-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 30px rgba(0, 0, 0, 0.08);
        }

        .card-image-wrapper {
          position: relative;
          aspect-ratio: 16 / 10;
          background: var(--bg-subtle);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .image-placeholder {
          color: var(--text-muted);
          font-weight: 500;
          font-size: 0.85rem;
        }

        .property-tag {
          position: absolute;
          top: 1rem;
          left: 1rem;
          background: var(--bg-dark);
          color: #ffffff;
          padding: 0.4rem 0.8rem;
          font-size: 0.7rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          border-radius: 4px;
        }

        .card-content {
          padding: 1.5rem;
        }

        .property-price {
          font-size: 1.4rem;
          font-weight: 700;
          margin-bottom: 0.25rem;
          color: var(--text-primary);
        }

        .property-address {
          font-size: 0.9rem;
          color: var(--text-secondary);
          margin-bottom: 1.25rem;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .property-stats {
          display: flex;
          gap: 1.5rem;
          border-top: 1px solid var(--border-light);
          padding-top: 1rem;
        }

        .stat-item {
          display: flex;
          flex-direction: column;
        }

        .stat-label {
          font-size: 0.65rem;
          text-transform: uppercase;
          color: var(--text-muted);
          font-weight: 700;
          letter-spacing: 0.05em;
        }

        .stat-value {
          font-size: 0.9rem;
          font-weight: 600;
          color: var(--text-primary);
        }
      `}</style>
    </Link>
  );
}
