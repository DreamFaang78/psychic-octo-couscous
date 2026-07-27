"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";

export default function Header() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { label: "Home", href: "/" },
    { label: "About", href: "/#about" },
    { label: "Contact", href: "/contact" },
    { label: "Privacy Policy", href: "/privacy-policy" },
    { label: "Terms of Service", href: "/terms-of-service" },
  ];

  return (
    <header className="header-wrapper">
      <div className="container header-inner">
        <Link href="/" className="brand-section">
          <Image
            src="/pinnacle-logo.png"
            alt="Royal LePage Pinnacle Real Estate Logo"
            width={180}
            height={48}
            className="brand-logo-img"
            style={{ width: "auto", height: "auto" }}
            priority
          />
          <div className="brand-titles">
            <span className="agent-name">Karan Kang, REALTOR®</span>
            <span className="brokerage-name">Royal LePage Pinnacle Real Estate</span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="nav-desktop" aria-label="Main Navigation">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`nav-link ${pathname === item.href ? "active" : ""}`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Mobile Navigation Toggle */}
        <button
          className="nav-mobile-toggle"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle Navigation Menu"
        >
          {mobileMenuOpen ? "✕" : "☰"}
        </button>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <nav className="mobile-nav-drawer" aria-label="Mobile Navigation">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`nav-link ${pathname === item.href ? "active" : ""}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
