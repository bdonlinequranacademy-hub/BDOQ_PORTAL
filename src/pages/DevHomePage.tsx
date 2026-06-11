import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import { api } from "@/lib/api/client";
import { toast } from "@/stores/uiStore";
import { useAuthStore } from "@/stores/authStore";
import type { Role } from "@/types/models";

const swatches: { name: string; className: string }[] = [
  { name: "navy", className: "bg-navy" },
  { name: "navy-500", className: "bg-navy-500" },
  { name: "navy-50", className: "bg-navy-50" },
  { name: "gold", className: "bg-gold" },
  { name: "gold-dark", className: "bg-gold-dark" },
  { name: "cream", className: "bg-cream" },
  { name: "surface", className: "bg-surface" },
  { name: "success", className: "bg-success" },
  { name: "danger", className: "bg-danger" },
];

export function DevHomePage() {
  const [pinging, setPinging] = useState(false);
  const user = useAuthStore((s) => s.user);
  const login = useAuthStore((s) => s.login);
  const logout = useAuthStore((s) => s.logout);

  async function pingApi() {
    setPinging(true);
    try {
      await api.post("/auth/login", {});
      toast.success("API responded 2xx (unexpected for empty login)");
    } catch (error: unknown) {
      const e = error as { response?: { status?: number; data?: { message?: string } } };
      if (e.response) {
        toast.success(`API reachable: ${e.response.status} - ${e.response.data?.message ?? "no message"}`);
      } else {
        toast.error("No response - is the backend running on :5000?");
      }
    } finally {
      setPinging(false);
    }
  }

  function simulateLogin(role: Role) {
    login("dev-fake-token", {
      name: `Dev ${role}`,
      email: `${role}@dev.local`,
      role,
    });
    toast.info(`Simulated login as ${role}`);
  }

  return (
    <div className="mx-auto max-w-4xl space-y-8 p-6">
      <header>
        <h1 className="font-display text-3xl text-navy">
          Al Bayaan Portal - Step 0 Foundation
        </h1>
        <p className="mt-1 text-sm text-navy-500">
          Temporary developer page. Verifies tokens, primitives, API connectivity, and route guards.
        </p>
      </header>

      <Card>
        <h2 className="font-display text-xl text-navy">Color tokens</h2>
        <div className="mt-3 grid grid-cols-3 gap-3 sm:grid-cols-5">
          {swatches.map((s) => (
            <div key={s.name} className="text-center">
              <div className={`h-14 w-full rounded-lg border border-navy-50 ${s.className}`} />
              <span className="mt-1 block text-xs text-navy-500">{s.name}</span>
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <h2 className="font-display text-xl text-navy">Typography</h2>
        <p className="mt-3 font-display text-2xl text-navy">Playfair Display - headings</p>
        <p className="font-sans text-base text-navy">Plus Jakarta Sans - body text</p>
        <p className="font-arabic text-2xl text-navy" dir="rtl">
          بسم الله الرحمن الرحيم
        </p>
      </Card>

      <Card>
        <h2 className="font-display text-xl text-navy">Primitives gallery</h2>
        <div className="mt-3 flex flex-wrap gap-3">
          <Button variant="primary">Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="danger">Danger</Button>
          <Button disabled>Disabled</Button>
        </div>
        <div className="mt-4 max-w-sm">
          <Input label="Sample input" placeholder="Type here..." />
        </div>
        <div className="mt-4 flex flex-wrap gap-3">
          <Button variant="ghost" onClick={() => toast.success("Success toast")}>
            Toast success
          </Button>
          <Button variant="ghost" onClick={() => toast.error("Error toast")}>
            Toast error
          </Button>
          <Button variant="ghost" onClick={() => toast.info("Info toast")}>
            Toast info
          </Button>
        </div>
      </Card>

      <Card>
        <h2 className="font-display text-xl text-navy">API connectivity</h2>
        <p className="mt-1 text-sm text-navy-500">
          Posts an empty body to <code>/auth/login</code> and shows the backend response.
        </p>
        <div className="mt-3">
          <Button onClick={pingApi} disabled={pinging}>
            {pinging ? "Pinging..." : "Ping API"}
          </Button>
        </div>
      </Card>

      <Card>
        <h2 className="font-display text-xl text-navy">Auth and route guards</h2>
        <p className="mt-1 text-sm text-navy-500">
          Current: {user ? `${user.name} (${user.role})` : "logged out"}
        </p>
        <div className="mt-3 flex flex-wrap gap-3">
          <Button onClick={() => simulateLogin("student")}>Login as student</Button>
          <Button onClick={() => simulateLogin("teacher")}>Login as teacher</Button>
          <Button onClick={() => simulateLogin("admin")}>Login as admin</Button>
          <Button variant="danger" onClick={logout}>
            Logout
          </Button>
        </div>
        <div className="mt-4 flex flex-wrap gap-4 text-sm font-semibold text-gold-dark">
          <Link to="/student" className="hover:underline">/student</Link>
          <Link to="/teacher" className="hover:underline">/teacher</Link>
          <Link to="/admin" className="hover:underline">/admin</Link>
          <Link to="/login" className="hover:underline">/login</Link>
          <Link to="/does-not-exist" className="hover:underline">/404 test</Link>
        </div>
      </Card>
    </div>
  );
}
