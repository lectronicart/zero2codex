import { Link } from "react-router-dom";

type SetupShellPageProps = {
  title: string;
  eyebrow: string;
  body: string;
};

export function SetupShellPage({ title, eyebrow, body }: SetupShellPageProps) {
  return (
    <section className="route-shell" aria-labelledby="setup-shell-title">
      <span className="shell-label">{eyebrow}</span>
      <h1 id="setup-shell-title">{title}</h1>
      <p>{body}</p>
      <div className="route-shell-panel">
        <h2>Implementation boundary</h2>
        <p>
          This first task intentionally stops before Supabase, email auth,
          progress sync, and protected routes. Those are the next phase.
        </p>
      </div>
      <Link className="button button-primary" to="/">
        Return to course map
      </Link>
    </section>
  );
}
