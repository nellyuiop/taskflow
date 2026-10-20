"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const closeMenu = () => setIsOpen(false);
  const links = (mobile = false) => (
    <>
      <Link
        href="/"
        onClick={closeMenu}
        aria-current={pathname === "/" ? "page" : undefined}
      >
        Home
      </Link>
      <Link
        href="/dashboard"
        onClick={closeMenu}
        aria-current={pathname?.startsWith("/dashboard") ? "page" : undefined}
      >
        Dashboard
      </Link>
      <a
        href="https://taskflow-jade-beta-13.vercel.app/login"
        onClick={mobile ? closeMenu : undefined}
        className="tf-nav-admin"
      >
        Admin Panel
      </a>
    </>
  );
  return (
    <nav
      className="tf-site-nav"
      aria-label="Main navigation"
      onKeyDown={(event) => {
        if (event.key === "Escape" && isOpen) {
          setIsOpen(false);
          event.currentTarget.querySelector("button")?.focus();
        }
      }}
    >
      <div className="tf-nav-inner">
        <Link href="/" className="tf-site-brand" onClick={closeMenu}>
          TaskFlow
        </Link>
        <div className="tf-desktop-links">{links()}</div>
        <button
          type="button"
          className="tf-menu-toggle"
          onClick={() => setIsOpen((open) => !open)}
          aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={isOpen}
          aria-controls="tf-mobile-navigation"
        >
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            aria-hidden="true"
            focusable="false"
          >
            <path
              d={isOpen ? "m6 6 12 12M6 18 18 6" : "M4 6h16M4 12h16M4 18h16"}
            />
          </svg>
        </button>
      </div>
      <div
        id="tf-mobile-navigation"
        className="tf-mobile-links"
        hidden={!isOpen}
      >
        {links(true)}
      </div>
    </nav>
  );
}
