import type { ReactNode } from "react";
import { NavLink } from "react-router-dom";

type AppShellProps = {
  children: ReactNode;
};

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="app-shell">
      <a className="skip-link" href="#main">
        Skip to course map
      </a>
      <header className="site-header">
        <div className="header-inner">
          <NavLink className="brand-lockup" to="/" aria-label="zero2codex home">
            <span className="brand-mark" aria-hidden="true">
              z2c
            </span>
            <span>
              <strong>zero2codex</strong>
              <small>terminal-first Codex course</small>
            </span>
          </NavLink>

          <nav className="site-nav" aria-label="Primary navigation">
            <a href="/#course-map">Course map</a>
            <a href="/#mvp-slice">MVP slice</a>
            <NavLink to="/login">Sign in</NavLink>
            <NavLink className="nav-cta" to="/register">
              Create account
            </NavLink>
          </nav>
        </div>
      </header>

      <main id="main" className="page-main">
        {children}
      </main>
    </div>
  );
}
