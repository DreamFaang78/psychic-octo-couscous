import Link from "next/link";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer-wrapper">
      <div className="container">
        <div className="footer-top">
          <div className="footer-brand">
            <h3 style={{ fontSize: "1.1rem", marginBottom: "0.25rem" }}>
              Karan Kang, REALTOR®
            </h3>
            <p style={{ fontSize: "0.88rem", color: "var(--text-muted)", marginBottom: "0.5rem" }}>
              Royal LePage Pinnacle Real Estate — Independently Owned and Operated Brokerage
            </p>
            <p style={{ fontSize: "0.82rem", color: "var(--text-muted)" }}>
              17 - 1075 North Service Road W., Oakville, ON L6M 2G2
            </p>
          </div>

          <nav className="footer-nav" aria-label="Footer Navigation">
            <Link href="/" className="nav-link">Home</Link>
            <Link href="/contact" className="nav-link">Contact</Link>
            <Link href="/privacy-policy" className="nav-link">Privacy Policy</Link>
            <Link href="/terms-of-service" className="nav-link">Terms of Service</Link>
          </nav>
        </div>

        <div className="footer-disclaimers">
          {/* Reserved TRREB/PropTx feed status placeholder - coded for compliance */}
          <div className="trreb-data-feed-status" id="trreb-data-feed-container">
            <p className="feed-status-text">
              Data provided by TRREB/PropTx — Last updated: <span className="feed-date">[Feed Activation Pending]</span>
            </p>
            {/* 
              COMPLIANCE REQUIREMENT NOTE:
              When live MLS listing feed connects, the brokerage name "Royal LePage Pinnacle Real Estate"
              will display inside listing details in the exact same font family and size as all other details,
              never visually separated.
            */}
          </div>

          {/* CREA-Mandated Trademark Disclaimers */}
          <p className="legal-disclaimer-text">
            REALTOR®, REALTORS®, and the REALTOR® logo are certification marks owned by REALTOR® Canada Inc. and licensed to The Canadian Real Estate Association (CREA). They identify real estate professionals who are members of CREA.
          </p>
          <p className="legal-disclaimer-text">
            The trademarks MLS®, Multiple Listing Service® and the associated logos are owned by CREA and identify the quality of services provided by real estate professionals who are members of CREA.
          </p>

          <p className="legal-disclaimer-text" style={{ marginTop: "1rem" }}>
            © {currentYear} KangHomes.ca — Karan Kang, REALTOR® | Royal LePage Pinnacle Real Estate. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
