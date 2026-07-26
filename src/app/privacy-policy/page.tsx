import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | Karan Kang, REALTOR® | KangHomes.ca",
  description: "PIPEDA-compliant Privacy Policy for KangHomes.ca operated by Karan Kang, REALTOR® with Royal LePage Pinnacle Real Estate.",
};

export default function PrivacyPolicy() {
  return (
    <div className="container policy-content">
      <div className="page-header" style={{ border: "none", padding: "1rem 0 2rem" }}>
        <span className="badge" style={{ marginBottom: "0.5rem" }}>Legal & Compliance</span>
        <h1>Privacy Policy</h1>
        <p className="subheading" style={{ marginTop: "0.25rem" }}>
          PIPEDA Compliance Statement for KangHomes.ca
        </p>
      </div>

      <div className="policy-section">
        <h3>1. Commitment to Privacy</h3>
        <p>
          KangHomes.ca, operated by Karan Kang, REALTOR® at Royal LePage Pinnacle Real Estate (&quot;Brokerage&quot;), is committed to respecting and protecting the privacy of all visitors and clients. This Privacy Policy outlines how personal information is collected, used, disclosed, and safeguarded in accordance with the Personal Information Protection and Electronic Documents Act (PIPEDA) of Canada and applicable Ontario privacy legislation.
        </p>
      </div>

      <div className="policy-section">
        <h3>2. Information We Collect</h3>
        <p>We may collect personal information that you voluntarily provide to us when communicating directly through phone, email, or digital channels. This may include:</p>
        <ul>
          <li>Contact details such as your full name, email address, phone number, and physical mailing address.</li>
          <li>Real estate preferences, inquiries regarding buyers or sellers, and transaction requirements.</li>
          <li>Technical website access data automatically logged by server infrastructure (e.g., IP address, browser type, referral pages, and access timestamps).</li>
        </ul>
      </div>

      <div className="policy-section">
        <h3>3. Purpose of Collection and Use</h3>
        <p>Your personal information is collected and used strictly for legitimate real estate business purposes, including:</p>
        <ul>
          <li>Responding to your inquiries regarding residential real estate in Oakville and the Greater Toronto Area (GTA).</li>
          <li>Providing real estate consulting, advisory, and representation services.</li>
          <li>Fulfilling professional and legal obligations mandated by the Real Estate Council of Ontario (RECO), the Canadian Real Estate Association (CREA), the Toronto Regional Real Estate Board (TRREB), and PropTx Innovations Inc.</li>
        </ul>
      </div>

      <div className="policy-section">
        <h3>4. Storage, Security & Non-Disclosure</h3>
        <p>
          We implement appropriate technical, administrative, and physical safeguards to protect your personal information against loss, theft, unauthorized access, disclosure, or modification.
        </p>
        <p style={{ fontWeight: 600, color: "var(--text-primary)" }}>
          Strict Guarantee: Personal information collected through KangHomes.ca is NEVER sold, rented, leased, or traded to third parties for commercial or marketing purposes.
        </p>
      </div>

      <div className="policy-section">
        <h3>5. TRREB & PropTx IDX Compliance</h3>
        <p>
          KangHomes.ca operates under the terms of the Data Licensing Agreement (DLA) and Internet Data Exchange (IDX) agreements with TRREB and PropTx Innovations Inc. Any data collected in connection with listing information is governed by these agreements and used solely to facilitate bona fide real estate transactions.
        </p>
      </div>

      <div className="policy-section">
        <h3>6. Your Rights & Requesting Deletion</h3>
        <p>
          Under PIPEDA, you have the right to request access to the personal information we hold about you, request corrections to inaccurate data, or request the deletion of your personal information from our records.
        </p>
        <p>
          To exercise your rights or submit a privacy-related request, please contact Karan Kang directly:
        </p>
        <div style={{ background: "var(--bg-subtle)", padding: "1rem 1.25rem", borderRadius: "var(--radius-sm)", marginTop: "0.5rem" }}>
          <p style={{ margin: 0, fontWeight: 600 }}>Karan Kang, REALTOR®</p>
          <p style={{ margin: 0, color: "var(--text-muted)" }}>Email: realtorkarankang@gmail.com</p>
          <p style={{ margin: 0, color: "var(--text-muted)" }}>Cell: 437-998-5873</p>
        </div>
      </div>

      <div className="policy-section">
        <p style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
          Last Updated: July 2026 | Royal LePage Pinnacle Real Estate — Independently Owned and Operated Brokerage.
        </p>
      </div>
    </div>
  );
}
