import type { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Contact Karan Kang, REALTOR® | Royal LePage Pinnacle Real Estate | KangHomes.ca",
  description: "Contact information for Karan Kang, REALTOR® at Royal LePage Pinnacle Real Estate in Oakville, ON.",
};

export default function Contact() {
  return (
    <div className="container policy-content">
      <div className="page-header" style={{ border: "none", padding: "1rem 0 2rem" }}>
        <span className="badge" style={{ marginBottom: "0.5rem" }}>Get In Touch</span>
        <h1>Contact Professional Real Estate Services</h1>
        <p className="subheading" style={{ marginTop: "0.25rem" }}>
          Karan Kang, REALTOR® | Royal LePage Pinnacle Real Estate
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "2.5rem", marginTop: "1.5rem" }}>
        <div style={{ background: "var(--bg-surface)", border: "1px solid var(--border-light)", borderRadius: "var(--radius-lg)", padding: "2.5rem" }}>
          <h2 style={{ fontSize: "1.4rem", marginBottom: "0.5rem" }}>Karan Kang, REALTOR®</h2>
          <p style={{ fontWeight: 600, color: "var(--text-primary)", marginBottom: "1rem" }}>
            Royal LePage Pinnacle Real Estate — Independently Owned and Operated Brokerage
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem", marginTop: "1.5rem", borderTop: "1px solid var(--border-light)", paddingTop: "1.5rem" }}>
            <div>
              <p className="contact-item-label">Brokerage & Office Address</p>
              <p className="contact-item-value" style={{ fontWeight: 500 }}>
                17 - 1075 North Service Road W., Oakville, ON L6M 2G2
              </p>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1.25rem" }}>
              <div>
                <p className="contact-item-label">Direct Cell</p>
                <p className="contact-item-value">437-998-5873</p>
              </div>

              <div>
                <p className="contact-item-label">Office Telephone</p>
                <p className="contact-item-value">905-464-3035</p>
              </div>

              <div>
                <p className="contact-item-label">Email Contact</p>
                <p className="contact-item-value">realtorkarankang@gmail.com</p>
              </div>

              <div>
                <p className="contact-item-label">Service Hours</p>
                <p className="contact-item-value">6:00 AM – 10:00 PM</p>
                <p style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>(Monday – Friday, Weekends Off)</p>
              </div>
            </div>

            <div style={{ borderTop: "1px solid var(--border-light)", paddingTop: "1.25rem", marginTop: "0.5rem" }}>
              <p className="contact-item-label">Primary Service Area</p>
              <p style={{ fontSize: "0.95rem", color: "var(--text-secondary)" }}>
                Oakville, Mississauga, Burlington, and the Greater Toronto Area (GTA)
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
