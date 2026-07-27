import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer-wrapper">
      <div className="container footer-content">
        {/* 1. Royal LePage Pinnacle Logo (Secondary) */}
        <div className="footer-logo-section">
          <Image
            src="/pinnacle-logo.png"
            alt="Royal LePage Pinnacle Real Estate"
            width={160}
            height={42}
            className="footer-brand-logo"
          />
        </div>

        {/* 2. Contact Information */}
        <div className="footer-contact-info">
          <p className="footer-agent-name">Karan Kang, REALTOR®</p>
          <p className="footer-phone">437-998-5873</p>
          <p className="footer-location">Royal LePage Realtor® Oakville</p>
          <p className="footer-tagline">Your Oakville Royal LePage Real Estate Agent</p>
        </div>

        {/* 3. Credential Line */}
        <div className="footer-credential">
          <p>Karan Kang is a Fully Licensed REALTOR® at Royal LePage Pinnacle Real Estate.</p>
        </div>

        {/* 4. Quick Links Row */}
        <nav className="footer-quick-links" aria-label="Footer Quick Links">
          <Link href="/">Home</Link>
          <span className="separator">|</span>
          <Link href="/#about">About</Link>
          <span className="separator">|</span>
          <Link href="/contact">Contact</Link>
          <span className="separator">|</span>
          <Link href="/privacy-policy">Privacy Policy</Link>
          <span className="separator">|</span>
          <Link href="/terms-of-service">Terms of Service</Link>
        </nav>

        {/* 5. Trademark Disclaimer Text */}
        <div className="footer-trademarks">
          <p className="legal-disclaimer-text">
            REALTOR®, REALTORS®, and the REALTOR® logo are certification marks that are owned by REALTOR® Canada Inc. and licensed exclusively to The Canadian Real Estate Association (CREA). These certification marks identify real estate professionals who are REALTOR® members of CREA and who must abide by CREA&apos;s By-Laws, Rules, and the REALTOR® Code. The MLS® trademark and the MLS® logo are owned by CREA and identify the quality of services provided by real estate professionals who are REALTOR® members of CREA.
          </p>
        </div>

        {/* 6. Legal/Accuracy Disclaimer */}
        <div className="footer-legal-accuracy">
          <p className="legal-disclaimer-text">
            The real estate information provided on this website is for general informational purposes only. While we strive to keep information accurate and current, we do not warrant the accuracy or completeness of any real estate information included on this site.
          </p>
        </div>

        {/* 7. Copyright Line */}
        <div className="footer-copyright">
          <p>© {currentYear} All Rights Reserved</p>
        </div>
      </div>
    </footer>
  );
}
