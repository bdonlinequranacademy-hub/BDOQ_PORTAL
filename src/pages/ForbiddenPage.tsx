import { Link } from "react-router-dom";

export function ForbiddenPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-3 p-6 text-center">
      <h1 className="text-4xl text-navy">403</h1>
      <p className="text-navy-500">You do not have permission to view this page.</p>
      <Link to="/login" className="font-semibold text-gold-dark hover:underline">
        Back to sign in
      </Link>
    </div>
  );
}
