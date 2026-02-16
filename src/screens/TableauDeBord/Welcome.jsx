import { Link } from "react-router-dom";

export default function Welcome() {
  return (
    <div className="welcome">
      <h1>TEKTAL</h1>
      <p>Suivez un chemin partagé en un clic, même sans application mobile.</p>
      <div className="welcome-actions">
        <Link className="btn-primary" to="/app">Entrer</Link>
        <Link className="btn-secondary" to="/share/1">Tester un lien de partage</Link>
      </div>
    </div>
  );
}
