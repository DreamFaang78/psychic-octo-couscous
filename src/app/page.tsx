import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Karan Kang, REALTOR® | KangHomes.ca | Royal LePage Pinnacle Real Estate",
  description: "Official page for Karan Kang, REALTOR® at Royal LePage Pinnacle Real Estate in Oakville, ON. Serving Oakville and the Greater Toronto Area.",
};

export default function Home() {
  return (
    <>
      {/* Hero & Above the fold content */}
      <section className="section section-border" style={{ backgroundColor: "#ffffff" }}>
        <div className="container">
          <div className="hero-grid">
            <div className="headshot-frame">
              <Image
                src="/headshot.jpg"
                alt="Karan Kang, REALTOR®"
                width={320}
                height={400}
                className="headshot-img"
                priority
              />
            </div>

            <div>
              <span className="badge" style={{ marginBottom: "1rem" }}>
                Oakville & GTA Real Estate
              </span>
              <h1>Karan Kang, REALTOR®</h1>
              <p className="subheading" style={{ marginTop: "0.25rem", color: "var(--text-primary)", fontWeight: 600 }}>
                Royal LePage Pinnacle Real Estate — Independently Owned and Operated Brokerage
              </p>
              <p style={{ marginTop: "0.5rem", color: "var(--text-muted)", fontSize: "0.95rem" }}>
                📍 17 - 1075 North Service Road W., Oakville, ON L6M 2G2
              </p>

              {/* Static Contact Section */}
              <div className="contact-card">
                <h3 style={{ fontSize: "1rem", marginBottom: "1rem", color: "var(--text-primary)" }}>
                  Direct Professional Contact
                </h3>
                <div className="contact-grid">
                  <div>
                    <p className="contact-item-label">Cell Phone</p>
                    <p className="contact-item-value">437-998-5873</p>
                  </div>
                  <div>
                    <p className="contact-item-label">Office Line</p>
                    <p className="contact-item-value">905-464-3035</p>
                  </div>
                  <div>
                    <p className="contact-item-label">Email Address</p>
                    <p className="contact-item-value">realtorkarankang@gmail.com</p>
                  </div>
                  <div>
                    <p className="contact-item-label">Hours of Service</p>
                    <p className="contact-item-value">6:00 AM – 10:00 PM <span style={{ fontWeight: 400, color: "var(--text-muted)", fontSize: "0.85rem" }}>(Weekends Off)</span></p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Short About Section */}
      <section className="section section-border" id="about">
        <div className="container" style={{ maxWidth: "800px" }}>
          <h2 style={{ fontSize: "1.75rem", marginBottom: "1rem" }}>About Karan Kang</h2>
          <p style={{ fontSize: "1.1rem", lineHeight: 1.7, color: "var(--text-secondary)" }}>
            Karan Kang is a dedicated REALTOR® with Royal LePage Pinnacle Real Estate, specializing in residential property guidance across Oakville and the Greater Toronto Area (GTA). Driven by integrity, local market expertise, and personalized client service, Karan provides strategic counsel to buyers, sellers, and investors navigating local real estate transactions.
          </p>
        </div>
      </section>

      {/* MLS Search Launching Soon Section & Legal Notices */}
      <section className="section">
        <div className="container" style={{ maxWidth: "860px" }}>
          <div className="mls-placeholder-card">
            <span className="badge" style={{ marginBottom: "0.75rem" }}>TRREB / PropTx Data Feed Integration</span>
            <h2 style={{ fontSize: "1.6rem", marginTop: "0.5rem", marginBottom: "0.5rem" }}>
              MLS® Search Launching Soon
            </h2>
            <p style={{ color: "var(--text-muted)", maxWidth: "600px", margin: "0 auto 1.5rem" }}>
              KangHomes.ca is currently integrating direct MLS® listing feed capabilities in partnership with TRREB and PropTx Innovations Inc. Standard property query and listing search features will activate upon complete feed authorization.
            </p>

            {/* REQUIRED LEGAL NOTICES (Exact wording required by PropTx IDX Agreement) */}
            <div className="required-notices-box" id="proptx-idx-legal-notices">
              <p className="notice-text">
                The information provided herein is deemed reliable but is not guaranteed accurate by PROPTX.
              </p>
              <p className="notice-text">
                The information provided herein must only be used by consumers that have a bona fide interest in the purchase, sale, or lease of real estate and may not be used for any commercial purpose or any other purpose.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
