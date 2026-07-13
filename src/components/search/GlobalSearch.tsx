import { useEffect, useMemo, useState, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  BookOpen,
  ChevronRight,
  CreditCard,
  GraduationCap,
  LayoutDashboard,
  Library,
  MessageCircle,
  Search,
  User,
  Users,
  X,
} from "lucide-react";
import { searchApi } from "@/lib/api/searchApi";
import { filterPortalPages } from "@/lib/portalNav";
import { isStaffAdmin } from "@/lib/assignableRoles";
import { useCurriculumTree } from "@/components/curriculum/NestedCurriculumSelect";
import type { Role, SearchResultItem } from "@/types/models";
import { formControlClass } from "@/lib/formControl";
import { cn } from "@/lib/utils/cn";

function resultIcon(type: SearchResultItem["type"]) {
  switch (type) {
    case "teacher":
      return GraduationCap;
    case "class":
      return BookOpen;
    default:
      return User;
  }
}

function pageIcon(path: string) {
  if (path.endsWith("/admin") || path.endsWith("/teacher") || path.endsWith("/student")) {
    return LayoutDashboard;
  }
  if (path.includes("whatsapp")) return MessageCircle;
  if (path.includes("users")) return Users;
  if (path.includes("payment")) return CreditCard;
  if (path.includes("curriculum") || path.includes("resource")) return Library;
  if (path.includes("class")) return BookOpen;
  return Search;
}

function SearchListSection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="mb-3 last:mb-0">
      <p className="mb-1.5 px-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-portal-muted">
        {title}
      </p>
      <ul className="overflow-hidden rounded border border-[rgb(220_235_228/0.7)] bg-white/80 shadow-[var(--portal-card-shadow)]">
        {children}
      </ul>
    </section>
  );
}

function SearchListRow({
  onClick,
  icon,
  title,
  subtitle,
  meta,
  active = false,
}: {
  onClick: () => void;
  icon: ReactNode;
  title: string;
  subtitle?: string;
  meta?: string;
  active?: boolean;
}) {
  return (
    <li className="border-b border-[rgb(220_235_228/0.55)] last:border-b-0">
      <button
        type="button"
        onClick={onClick}
        className={cn(
          "group flex w-full items-center gap-3 px-3 py-2.5 text-left transition",
          active
            ? "bg-primary/8"
            : "hover:bg-[#f6fcf9] focus-visible:bg-[#f6fcf9] focus-visible:outline-none"
        )}
      >
        <span className="flex size-9 shrink-0 items-center justify-center rounded bg-primary/10 text-primary ring-1 ring-primary/15 transition group-hover:bg-gold/15 group-hover:text-gold-dark group-hover:ring-gold/25">
          {icon}
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate text-sm font-semibold text-portal-heading">
            {title}
          </span>
          {subtitle ? (
            <span className="mt-0.5 block truncate text-xs text-portal-muted">
              {subtitle}
            </span>
          ) : null}
        </span>
        {meta ? (
          <span className="shrink-0 rounded bg-portal-surface-muted px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-portal-muted">
            {meta}
          </span>
        ) : null}
        <ChevronRight
          className="size-4 shrink-0 text-portal-muted/50 transition group-hover:translate-x-0.5 group-hover:text-gold"
          aria-hidden
        />
      </button>
    </li>
  );
}

export function GlobalSearch({ role }: { role: Role }) {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [debounced, setDebounced] = useState("");

  useEffect(() => {
    const timer = window.setTimeout(() => setDebounced(query), 250);
    return () => window.clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen(true);
      }
      if (e.key === "Escape") {
        setOpen(false);
      }
    }
    function openFromEvent() {
      setOpen(true);
    }
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("portal:open-search", openFromEvent);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("portal:open-search", openFromEvent);
    };
  }, []);

  const pages = useMemo(() => filterPortalPages(role, debounced), [role, debounced]);

  const { data: curriculumTree = [] } = useCurriculumTree(undefined, {
    enabled: open && debounced.trim().length >= 2,
  });
  const programHits = useMemo(() => {
    const q = debounced.trim().toLowerCase();
    if (q.length < 2) return [];
    return curriculumTree
      .filter((p) => p.label.toLowerCase().includes(q))
      .slice(0, 5);
  }, [curriculumTree, debounced]);

  const programLink = isStaffAdmin(role)
    ? "/admin/curriculum"
    : role === "teacher"
      ? "/teacher/progress"
      : "/student/progress";

  const { data: apiResults = [], isFetching } = useQuery({
    queryKey: ["portalSearch", debounced],
    queryFn: () => searchApi.search(debounced),
    select: (r) => r.data ?? [],
    enabled: open && debounced.trim().length >= 2,
    staleTime: 30_000,
  });

  function go(path: string) {
    setOpen(false);
    setQuery("");
    navigate(path);
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="hidden items-center gap-2 rounded border border-[rgb(220_235_228/0.7)] bg-portal-surface px-3 py-1.5 text-sm text-portal-muted shadow-[var(--portal-card-shadow)] transition hover:text-portal-heading sm:flex"
        aria-label="Open search"
      >
        <Search className="size-4" />
        <span>Search…</span>
        <kbd className="rounded bg-[#f6fcf9] px-1.5 py-0.5 text-[10px] font-medium text-portal-muted">
          Ctrl K
        </kbd>
      </button>
    );
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-start justify-center bg-black/40 p-4 pt-[12vh] backdrop-blur-sm"
      onClick={() => setOpen(false)}
    >
      <div
        className="w-full max-w-lg overflow-hidden rounded border border-[rgb(220_235_228/0.7)] bg-portal-surface shadow-[var(--portal-card-shadow)] animate-page-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-2 border-b border-[rgb(220_235_228/0.7)] px-4 py-3">
          <span className="flex size-8 shrink-0 items-center justify-center rounded bg-primary/10 text-primary">
            <Search className="size-4" />
          </span>
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search students, classes, pages…"
            className={`${formControlClass} border-0 bg-transparent px-0 shadow-none focus-visible:ring-0`}
          />
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="rounded p-1.5 text-portal-muted transition hover:bg-[#f6fcf9] hover:text-portal-heading"
            aria-label="Close search"
          >
            <X className="size-4" />
          </button>
        </div>

        <div className="max-h-[min(60vh,420px)] overflow-y-auto p-3">
          {pages.length > 0 ? (
            <SearchListSection title="Pages">
              {pages.map((page) => {
                const Icon = pageIcon(page.path);
                return (
                  <SearchListRow
                    key={page.path}
                    onClick={() => go(page.path)}
                    icon={<Icon className="size-4" aria-hidden />}
                    title={page.label}
                    subtitle={page.path}
                  />
                );
              })}
            </SearchListSection>
          ) : null}

          {programHits.length > 0 ? (
            <SearchListSection title="Study programs">
              {programHits.map((program) => (
                <SearchListRow
                  key={program.id}
                  onClick={() => go(programLink)}
                  icon={<Library className="size-4" aria-hidden />}
                  title={program.label}
                  subtitle="Open progress & curriculum"
                />
              ))}
            </SearchListSection>
          ) : null}

          {debounced.trim().length >= 2 ? (
            <SearchListSection title="Results">
              {isFetching ? (
                <li className="px-3 py-4 text-sm text-portal-muted">Searching…</li>
              ) : apiResults.length === 0 ? (
                <li className="px-3 py-4 text-sm text-portal-muted">
                  No matches for “{debounced}”.
                </li>
              ) : (
                apiResults.map((item) => {
                  const Icon = resultIcon(item.type);
                  return (
                    <SearchListRow
                      key={`${item.type}-${item.id}`}
                      onClick={() => go(item.path)}
                      icon={<Icon className="size-4" aria-hidden />}
                      title={item.title}
                      subtitle={item.subtitle}
                      meta={item.type}
                    />
                  );
                })
              )}
            </SearchListSection>
          ) : (
            <p className="px-2 py-3 text-sm text-portal-muted">
              Type at least 2 characters to search students and classes.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
