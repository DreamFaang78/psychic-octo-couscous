import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service | Karan Kang, REALTOR® | KangHomes.ca",
  description: "Terms of Service and legal disclaimer for KangHomes.ca operated by Karan Kang, REALTOR® with Royal LePage Pinnacle Real Estate.",
};

export default function TermsOfService() {
  return (
    <div className="container policy-content">
      <div className="page-header" style={{ border: "none", padding: "1rem 0 2rem" }}>
        <span className="badge" style={{ marginBottom: "0.5rem" }}>Legal & Terms</span>
        <h1>Terms of Service</h1>
        <p className="subheading" style={{ marginTop: "0.25rem" }}>
          Website Terms and Usage Conditions for KangHomes.ca
        </p>
      </div>

      <div className="policy-section">
        <h3>1. Acceptance of Terms</h3>
        <p>
          By accessing or using KangHomes.ca (&quot;Website&quot;), provided by Karan Kang, REALTOR® at Royal LePage Pinnacle Real Estate, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use this Website.
        </p>
      </div>

      <div className="policy-section">
        <h3>2. Acceptable Use Policy</h3>
        <p>
          This Website is provided exclusively for individual, non-commercial use by consumers who have a bona fide interest in the purchase, sale, or lease of real estate in Ontario, Canada. You agree not to:
        </p>
        <ul>
          <li>Use any automated data scraping, harvesting, or indexing tools to extract content from this Website.</li>
          <li>Use the site or listing information for any commercial purpose or unauthorized redistribution.</li>
          <li>Interfere with the proper security or functionality of the Website.</li>
        </ul>
      </div>

      <div className="policy-section">
        <h3>3. Listing Accuracy & Warranty Disclaimer</h3>
        <p>
          All information provided on KangHomes.ca is deemed reliable but is not guaranteed accurate by PROPTX, TRREB, CREA, or Royal LePage Pinnacle Real Estate. All property information, features, dimensions, prices, and specifications are subject to errors, omissions, prior sale, change, or withdrawal without notice.
        </p>
        <div className="required-notices-box" style={{ margin: "1rem 0" }}>
          <p className="notice-text">
            The information provided herein is deemed reliable but is not guaranteed accurate by PROPTX.
          </p>
          <p className="notice-text">
            The information provided herein must only be used by consumers that have a bona fide interest in the purchase, sale, or lease of real estate and may not be used for any commercial purpose or any other purpose.
          </p>
        </div>
        <p>
          Consumers are strongly advised to independently verify all property details with a licensed REALTOR® prior to entering into any binding legal agreements.
        </p>
      </div>

      <div className="policy-section">
        <h3>4. External Links Disclaimer</h3>
        <p>
          KangHomes.ca may contain links to external third-party websites for user convenience. Karan Kang and Royal LePage Pinnacle Real Estate do not endorse, monitor, or exercise control over the content, privacy practices, or availability of third-party external sites.
        </p>
      </div>

      <div className="policy-section">
        <h3>5. Intellectual Property & Trademarks</h3>
        <p>
          REALTOR®, REALTORS®, and the REALTOR® logo are certification marks owned by REALTOR® Canada Inc. and licensed to CREA. The trademarks MLS®, Multiple Listing Service®, and associated logos are owned by CREA. All other branding, graphics, and textual content are protected by Canadian intellectual property laws.
        </p>
      </div>

      <div className="policy-section">
        <h3>6. Governing Law</h3>
        <p>
          These Terms of Service are governed by and construed in accordance with the laws of the Province of Ontario and the federal laws of Canada applicable therein, without giving effect to any principles of conflicts of law.
        </p>
      </div>

      <div className="policy-section">
        <h3>7. Contact Information</h3>
        <p>Questions regarding these Terms of Service should be directed to:</p>
        <div style={{ background: "var(--bg-subtle)", padding: "1rem 1.25rem", borderRadius: "var(--radius-sm)", marginTop: "0.5rem" }}>
          <p style={{ margin: 0, fontWeight: 600 }}>Karan Kang, REALTOR®</p>
          <p style={{ margin: 0, color: "var(--text-muted)" }}>Royal LePage Pinnacle Real Estate</p>
          <p style={{ margin: 0, color: "var(--text-muted)" }}>Email: realtorkarankang@gmail.com</p>
        </div>
      </div>
    </div>
  );
}
