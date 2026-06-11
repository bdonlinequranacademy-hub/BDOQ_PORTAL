import { Link } from "react-router-dom";

export function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-3 p-6 text-center">
      <h1 className="font-display text-4xl text-navy">404</h1>
      <p className="text-navy-500">This page does not exist.</p>
      <Link to="/" className="font-semibold text-gold-dark hover:underline">
        Back to dev home
      </Link>
    </div>
  );
}
