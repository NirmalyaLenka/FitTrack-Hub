/**
 * Layout.jsx
 *
 * Persistent shell that wraps every page. Contains the top navigation bar
 * and the bottom tab bar for mobile screens. The main content area is
 * rendered by React Router's Outlet.
 *
 * Future improvement: the bottom tab bar is hardcoded to four primary
 * destinations. If the app grows to five or more top-level sections, replace
 * the tab bar with a side drawer on mobile and a persistent left sidebar
 * on desktop.
 */

import React from "react";
import { Outlet, NavLink, useLocation } from "react-router-dom";
import clsx from "clsx";

const navItems = [
  { to: "/", label: "Home", icon: HomeIcon },
  { to: "/log", label: "Log", icon: PlusIcon },
  { to: "/history", label: "History", icon: ListIcon },
  { to: "/progress", label: "Progress", icon: ChartIcon },
];

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      {/* Top bar — visible on all screen sizes */}
      <header className="sticky top-0 z-40 border-b border-border bg-card px-4 py-3 flex items-center justify-between">
        <span className="font-semibold tracking-tight text-primary">FitTrack</span>
        <NavLink
          to="/settings"
          className={({ isActive }) =>
            clsx("text-sm", isActive ? "text-primary" : "text-muted-foreground hover:text-foreground")
          }
          aria-label="Settings"
        >
          <SettingsIcon className="w-5 h-5" />
        </NavLink>
      </header>

      {/* Page content */}
      <main className="flex-1 overflow-y-auto pb-20 md:pb-0">
        <Outlet />
      </main>

      {/* Bottom tab bar — mobile only */}
      <nav className="fixed bottom-0 inset-x-0 z-40 border-t border-border bg-card md:hidden">
        <ul className="flex justify-around">
          {navItems.map(({ to, label, icon: Icon }) => (
            <li key={to} className="flex-1">
              <NavLink
                to={to}
                end={to === "/"}
                className={({ isActive }) =>
                  clsx(
                    "flex flex-col items-center gap-0.5 py-2 text-xs transition-colors",
                    isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
                  )
                }
              >
                <Icon className="w-5 h-5" />
                {label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Inline icon components
// Using inline SVGs rather than an icon library keeps the bundle small and
// avoids a dependency for just four icons. If the icon count grows past
// ~10, replace with lucide-react or a similar tree-shakeable library.
// ---------------------------------------------------------------------------

function HomeIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l9-9 9 9M5 10v9a1 1 0 001 1h4v-5h4v5h4a1 1 0 001-1v-9" />
    </svg>
  );
}

function PlusIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
    </svg>
  );
}

function ListIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
    </svg>
  );
}

function ChartIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
  );
}

function SettingsIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  );
}
