"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { apiService } from "@/lib/api";

export default function PropertyDetails() {
  const { id } = useParams();
  const [property, setProperty] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  // Viewing form state
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [viewDate, setViewDate] = useState("");
  const [notes, setNotes] = useState("");
  const [formSuccess, setFormSuccess] = useState("");
  const [formError, setFormError] = useState("");
  const [formLoading, setFormLoading] = useState(false);

  // Fallback mock data if not found in db
  const fallbackProperty = {
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
    ],
    image: ""
  };

  useEffect(() => {
    async function fetchProperty() {
      if (!id) return;
      setLoading(true);
      try {
        const res = await apiService.getPropertyById(id as string);
        if (res.success && res.data) {
          // Format response to match display needs
          const dbProp = res.data;
          setProperty({
            price: `$${dbProp.price.toLocaleString()}`,
            address: `${dbProp.address}, ${dbProp.city}, ${dbProp.province} ${dbProp.postalCode}`,
            beds: dbProp.bedrooms,
            baths: dbProp.bathrooms,
            sqft: dbProp.squareFeet ? dbProp.squareFeet.toLocaleString() : "N/A",
            type: dbProp.propertyType,
            description: dbProp.description,
            features: dbProp.lifestyleTags ? dbProp.lifestyleTags.split(", ") : [
              "Finished Basement", "Near Parks", "Double Garage", "Custom Kitchen"
            ],
            image: dbProp.images?.[0]?.url || ""
          });
        } else {
          // If ID matches a mock or doesn't exist in DB, fallback gracefully
          setProperty(fallbackProperty);
        }
      } catch (err) {
        setProperty(fallbackProperty);
      } finally {
        setLoading(false);
      }
    }

    fetchProperty();
  }, [id]);

  const handleViewingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    setFormSuccess("");
    setFormError("");

    try {
      // Appointments in backend need: propertyId, appointmentDate, notes
      // We will parse the datetime input
      const dateToSend = viewDate ? new Date(viewDate).toISOString() : new Date(Date.now() + 86400000).toISOString();
      const res = await apiService.createAppointment({
        propertyId: id as string,
        appointmentDate: dateToSend,
        notes: `Inquiry from ${fullName} (${phone}, ${email}). Message: ${notes}`
      });

      if (res.success) {
        setFormSuccess("Viewing scheduled! Karan Kang's team will contact you shortly to confirm.");
        setFullName("");
        setEmail("");
        setPhone("");
        setViewDate("");
        setNotes("");
      } else {
        setFormError(res.message || "Failed to submit request. Please try logging in or registering first.");
      }
    } catch (err) {
      setFormError("You must log in to schedule a viewing. Please sign in or register to book visits.");
    } finally {
      setFormLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container section" style={{ textAlign: "center", padding: "8rem 0" }}>
        <p>Loading property details...</p>
      </div>
    );
  }

  const currentProperty = property || fallbackProperty;

  return (
    <div className="property-details-page">
      {/* Property Hero Gallery Placeholder */}
      <section className="property-hero">
        <div className="container">
          <Link href="/" className="back-link">← Back to Listings</Link>
          <div className="main-gallery-placeholder">
            {currentProperty.image ? (
              <Image
                src={currentProperty.image}
                alt={currentProperty.address}
                fill
                priority
                sizes="100vw"
                style={{ objectFit: "cover" }}
              />
            ) : (
              <span className="placeholder-text">High-Resolution Property Gallery (Placeholder)</span>
            )}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="details-grid">
            <div className="main-info">
              <div className="info-header">
                <span className="badge">{currentProperty.type}</span>
                <h1 className="details-price">{currentProperty.price}</h1>
                <p className="details-address">{currentProperty.address}</p>
              </div>

              <div className="details-stats">
                <div className="detail-stat">
                  <span className="stat-value">{currentProperty.beds}</span>
                  <span className="stat-label">Bedrooms</span>
                </div>
                <div className="detail-stat">
                  <span className="stat-value">{currentProperty.baths}</span>
                  <span className="stat-label">Bathrooms</span>
                </div>
                <div className="detail-stat">
                  <span className="stat-value">{currentProperty.sqft}</span>
                  <span className="stat-label">Square Feet</span>
                </div>
              </div>

              <div className="details-description">
                <h2>Description</h2>
                <p>{currentProperty.description}</p>
              </div>

              <div className="details-features">
                <h2>Key Features</h2>
                <ul className="features-list">
                  {currentProperty.features.map((feature: string, index: number) => (
                    <li key={index}>{feature}</li>
                  ))}
                </ul>
              </div>
            </div>

            <aside className="sidebar">
              <div className="sticky-form-card">
                <h3>Schedule a Viewing</h3>
                <p>Interested in this property? Send a message to Karan Kang.</p>
                
                {formSuccess && <div className="form-success">{formSuccess}</div>}
                {formError && <div className="form-error">{formError}</div>}

                <form className="viewing-form" onSubmit={handleViewingSubmit}>
                  <input 
                    type="text" 
                    placeholder="Full Name" 
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required 
                  />
                  <input 
                    type="email" 
                    placeholder="Email Address" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required 
                  />
                  <input 
                    type="tel" 
                    placeholder="Phone Number" 
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                  <div className="date-input-group">
                    <label htmlFor="view-date">Preferred Date & Time</label>
                    <input 
                      id="view-date"
                      type="datetime-local" 
                      value={viewDate}
                      onChange={(e) => setViewDate(e.target.value)}
                      required 
                    />
                  </div>
                  <textarea 
                    placeholder="I'm interested in viewing this property..." 
                    rows={4}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                  ></textarea>
                  <button type="submit" className="submit-btn" disabled={formLoading}>
                    {formLoading ? "Sending request..." : "Send Inquiry"}
                  </button>
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
          position: relative;
          overflow: hidden;
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

        .date-input-group {
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
        }

        .date-input-group label {
          font-size: 0.75rem;
          font-weight: 700;
          text-transform: uppercase;
          color: var(--text-muted);
        }

        .form-success {
          background-color: #f4fbf7;
          border: 1px solid #10b981;
          border-radius: var(--radius-sm);
          color: #047857;
          font-size: 0.85rem;
          padding: 0.75rem;
          margin-bottom: 1rem;
          line-height: 1.4;
        }

        .form-error {
          background-color: #fef2f2;
          border: 1px solid #f87171;
          border-radius: var(--radius-sm);
          color: #b91c1c;
          font-size: 0.85rem;
          padding: 0.75rem;
          margin-bottom: 1rem;
          line-height: 1.4;
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
