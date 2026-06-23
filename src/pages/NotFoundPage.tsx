import { Link } from "react-router-dom";

export function NotFoundPage() {
  return (
    <section className="empty-state" aria-labelledby="not-found-title">
      <h1 id="not-found-title">That route is not on the map yet</h1>
      <p>zero2codex is in its first scaffold phase.</p>
      <Link className="button button-primary" to="/">
        Return to course map
      </Link>
    </section>
  );
}
