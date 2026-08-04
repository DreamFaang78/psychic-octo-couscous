"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { apiService } from "@/lib/api";

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // Check login status on load and on route transitions
    const currentUser = apiService.getCurrentUser();
    setUser(currentUser);
  }, [pathname]);

  const handleLogout = () => {
    apiService.logout();
    setUser(null);
    setMobileMenuOpen(false);
    router.push("/");
    router.refresh();
  };

  const navItems = [
    { label: "Home", href: "/" },
    { label: "Search Listings", href: "/search" },
    { label: "What's My Home Worth?", href: "/sell" },
    { label: "About", href: "/#about" },
    { label: "Contact", href: "/contact" },
  ];

  return (
    <header className="header-wrapper">
      <div className="container header-inner">
        <Link href="/" className="brand-section">
          <Image
            src="/pinnacle-logo.png"
            alt="Royal LePage Pinnacle Real Estate Logo"
            width={240}
            height={64}
            className="brand-logo-img"
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

          <div className="auth-nav-divider"></div>

          {user ? (
            <div className="user-desktop-menu">
              {user.userRoles?.[0]?.role?.name === "ADMIN" && (
                <Link href="/admin" className="nav-link admin-nav-link">
                  Admin Console
                </Link>
              )}
              <Link href="/dashboard" className="nav-link dashboard-nav-link">
                Dashboard ({user.firstName})
              </Link>
              <button onClick={handleLogout} className="header-logout-btn">
                Logout
              </button>
            </div>
          ) : (
            <Link href="/login" className="header-login-btn">
              Sign In
            </Link>
          )}
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
          
          <div className="mobile-drawer-divider"></div>

          {user ? (
            <>
              {user.userRoles?.[0]?.role?.name === "ADMIN" && (
                <Link
                  href="/admin"
                  className="nav-link mobile-admin-link"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Admin Console
                </Link>
              )}
              <Link
                href="/dashboard"
                className="nav-link mobile-dashboard-link"
                onClick={() => setMobileMenuOpen(false)}
              >
                Dashboard ({user.firstName})
              </Link>
              <button onClick={handleLogout} className="mobile-logout-btn">
                Sign Out
              </button>
            </>
          ) : (
            <Link
              href="/login"
              className="mobile-login-btn-link"
              onClick={() => setMobileMenuOpen(false)}
            >
              Sign In
            </Link>
          )}
        </nav>
      )}

      <style jsx>{`
        .auth-nav-divider {
          width: 1px;
          height: 20px;
          background-color: var(--border-medium);
          margin: 0 0.5rem;
        }

        .user-desktop-menu {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .dashboard-nav-link {
          font-weight: 700 !important;
          color: var(--text-primary) !important;
        }

        .admin-nav-link {
          color: #b91c1c !important;
          font-weight: 700 !important;
        }

        .header-logout-btn {
          background: none;
          border: none;
          color: var(--text-muted);
          cursor: pointer;
          font-family: inherit;
          font-size: 0.9rem;
          font-weight: 500;
          padding: 0;
          transition: color 0.2s ease;
        }

        .header-logout-btn:hover {
          color: var(--text-primary);
        }

        .header-login-btn {
          background-color: var(--bg-dark);
          color: #ffffff !important;
          padding: 0.5rem 1.2rem;
          border-radius: var(--radius-sm);
          font-size: 0.88rem;
          font-weight: 600;
          text-decoration: none;
          transition: opacity 0.2s ease;
        }

        .header-login-btn:hover {
          opacity: 0.9;
        }

        .mobile-drawer-divider {
          height: 1px;
          background-color: var(--border-light);
          margin: 1rem 0;
          width: 100%;
        }

        .mobile-logout-btn {
          width: 100%;
          text-align: left;
          background: none;
          border: none;
          color: var(--text-muted);
          font-family: inherit;
          font-size: 1rem;
          padding: 0.8rem 1.5rem;
          font-weight: 500;
          cursor: pointer;
        }

        .mobile-login-btn-link {
          display: block;
          margin: 0.5rem 1.5rem;
          background-color: var(--bg-dark);
          color: #ffffff !important;
          text-align: center;
          padding: 0.75rem;
          border-radius: var(--radius-sm);
          font-weight: 600;
          text-decoration: none;
        }
      `}</style>
    </header>
  );
}
