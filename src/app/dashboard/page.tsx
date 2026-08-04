"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import PropertyCard from "@/components/PropertyCard";
import { apiService } from "@/lib/api";

export default function BuyerDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [savedProperties, setSavedProperties] = useState<any[]>([]);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("saved"); // saved or appointments

  useEffect(() => {
    // 1. Check if user is logged in
    const currentUser = apiService.getCurrentUser();
    if (!currentUser) {
      router.push("/login");
      return;
    }
    setUser(currentUser);

    // 2. Fetch user-related details
    async function fetchDashboardData() {
      setLoading(true);
      try {
        const savedRes = await apiService.getSavedProperties();
        if (savedRes.success) {
          setSavedProperties(savedRes.data || []);
        }

        const appRes = await apiService.getAppointments();
        if (appRes.success) {
          setAppointments(appRes.data || []);
        }
      } catch (err) {
        console.error("Failed to load dashboard details:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchDashboardData();
  }, [router]);

  const handleLogout = () => {
    apiService.logout();
    router.push("/");
    router.refresh();
  };

  if (loading || !user) {
    return (
      <div className="container section" style={{ textAlign: "center", padding: "8rem 0" }}>
        <div className="spinner"></div>
        <p style={{ marginTop: "1rem", color: "var(--text-muted)" }}>Loading your client profile...</p>
        <style jsx>{`
          .spinner {
            width: 32px;
            height: 32px;
            border: 3px solid var(--border-light);
            border-top-color: var(--text-primary);
            border-radius: 50%;
            animation: spin 1s infinite linear;
            margin: 0 auto;
          }
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      {/* Dashboard Banner */}
      <div className="page-header">
        <div className="container header-inner-flex">
          <div className="user-profile-info">
            <span className="badge">Client Dashboard</span>
            <h1>{user.firstName} {user.lastName}</h1>
            <p className="user-meta">{user.email} • Role: {user.userRoles?.[0]?.role?.name || "Client"}</p>
          </div>
          <button onClick={handleLogout} className="logout-btn">Sign Out</button>
        </div>
      </div>

      <div className="container section">
        {/* Dashboard Tabs */}
        <div className="dashboard-tabs">
          <button
            className={`tab-btn ${activeTab === "saved" ? "active" : ""}`}
            onClick={() => setActiveTab("saved")}
          >
            Saved Listings ({savedProperties.length})
          </button>
          <button
            className={`tab-btn ${activeTab === "appointments" ? "active" : ""}`}
            onClick={() => setActiveTab("appointments")}
          >
            Scheduled Viewings ({appointments.length})
          </button>
        </div>

        {/* Tab Content */}
        <div className="tab-content" style={{ marginTop: "2.5rem" }}>
          {activeTab === "saved" ? (
            savedProperties.length === 0 ? (
              <div className="empty-state-card">
                <h3>No Saved Listings Yet</h3>
                <p>Browse listings on the search page and click them to explore and save your favorites.</p>
                <Link href="/search" className="action-link-btn">Search MLS® Listings</Link>
              </div>
            ) : (
              <div className="listings-grid">
                {savedProperties.map((saved) => {
                  const prop = saved.property;
                  return (
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
                  );
                })}
              </div>
            )
          ) : (
            appointments.length === 0 ? (
              <div className="empty-state-card">
                <h3>No Scheduled Viewings</h3>
                <p>When you're interested in checking out a property in person, schedule a viewing directly on its listing details page.</p>
                <Link href="/search" className="action-link-btn">Explore Properties</Link>
              </div>
            ) : (
              <div className="appointments-list">
                {appointments.map((app) => (
                  <div key={app.id} className="appointment-card">
                    <div className="app-main-info">
                      <span className={`status-badge ${app.status.toLowerCase()}`}>{app.status}</span>
                      <h4 className="app-date">
                        {new Date(app.appointmentDate).toLocaleDateString("en-US", {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit"
                        })}
                      </h4>
                      {app.property && (
                        <p className="app-property-address">
                          Property: <Link href={`/listings/${app.property.id}`} style={{ fontWeight: 600, textDecoration: "underline" }}>{app.property.address}, {app.property.city}</Link>
                        </p>
                      )}
                    </div>
                    {app.notes && (
                      <div className="app-notes">
                        <h5>Inquiry Notes:</h5>
                        <p>{app.notes}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )
          )}
        </div>
      </div>

      <style jsx>{`
        .dashboard-page {
          background-color: var(--bg-primary);
          min-height: 80vh;
        }

        .header-inner-flex {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-top: 3rem;
          padding-bottom: 2rem;
          border-bottom: 1px solid var(--border-light);
          background-color: var(--bg-surface);
        }

        .user-profile-info h1 {
          font-size: 2rem;
          margin-top: 0.5rem;
          margin-bottom: 0.25rem;
        }

        .user-meta {
          font-size: 0.9rem;
          color: var(--text-muted);
        }

        .logout-btn {
          background-color: transparent;
          color: var(--text-primary);
          border: 1px solid var(--border-medium);
          padding: 0.6rem 1.2rem;
          font-family: inherit;
          font-size: 0.9rem;
          font-weight: 600;
          border-radius: var(--radius-sm);
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .logout-btn:hover {
          background-color: var(--bg-subtle);
          border-color: var(--text-primary);
        }

        .dashboard-tabs {
          display: flex;
          gap: 1.5rem;
          border-bottom: 1px solid var(--border-light);
        }

        .tab-btn {
          background: none;
          border: none;
          font-family: inherit;
          font-size: 1rem;
          font-weight: 600;
          padding: 1rem 0;
          color: var(--text-muted);
          cursor: pointer;
          position: relative;
        }

        .tab-btn.active {
          color: var(--text-primary);
        }

        .tab-btn.active::after {
          content: '';
          position: absolute;
          bottom: -1px;
          left: 0;
          right: 0;
          height: 2px;
          background-color: var(--text-primary);
        }

        .listings-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 2rem;
        }

        .empty-state-card {
          text-align: center;
          padding: 4rem 2rem;
          background: #ffffff;
          border: 1px solid var(--border-light);
          border-radius: var(--radius-lg);
          max-width: 600px;
          margin: 0 auto;
        }

        .empty-state-card h3 {
          margin-bottom: 0.5rem;
          font-size: 1.3rem;
        }

        .empty-state-card p {
          color: var(--text-muted);
          font-size: 0.95rem;
          margin-bottom: 1.5rem;
        }

        .action-link-btn {
          display: inline-block;
          background-color: var(--bg-dark);
          color: #ffffff;
          padding: 0.75rem 1.5rem;
          font-weight: 600;
          border-radius: var(--radius-sm);
          font-size: 0.9rem;
        }

        .appointments-list {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          max-width: 800px;
          margin: 0 auto;
        }

        .appointment-card {
          background: #ffffff;
          border: 1px solid var(--border-light);
          border-radius: var(--radius-md);
          padding: 1.75rem;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.01);
        }

        .status-badge {
          display: inline-block;
          font-size: 0.68rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          padding: 0.25rem 0.6rem;
          border-radius: 4px;
          margin-bottom: 0.75rem;
        }

        .status-badge.pending {
          background-color: #fef3c7;
          color: #d97706;
          border: 1px solid #fde68a;
        }

        .status-badge.confirmed {
          background-color: #d1fae5;
          color: #059669;
          border: 1px solid #a7f3d0;
        }

        .status-badge.cancelled {
          background-color: #fee2e2;
          color: #dc2626;
          border: 1px solid #fecaca;
        }

        .app-date {
          font-size: 1.15rem;
          font-weight: 600;
          color: var(--text-primary);
          margin-bottom: 0.25rem;
        }

        .app-property-address {
          font-size: 0.95rem;
          color: var(--text-secondary);
        }

        .app-notes {
          margin-top: 1.25rem;
          padding-top: 1rem;
          border-top: 1px solid var(--border-light);
          font-size: 0.9rem;
        }

        .app-notes h5 {
          font-weight: 700;
          color: var(--text-muted);
          margin-bottom: 0.25rem;
          text-transform: uppercase;
          font-size: 0.75rem;
          letter-spacing: 0.04em;
        }

        .app-notes p {
          color: var(--text-secondary);
          line-height: 1.5;
        }
      `}</style>
    </div>
  );
}
