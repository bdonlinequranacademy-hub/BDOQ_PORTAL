import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { BookOpen, GraduationCap, Search, User, X, Library } from "lucide-react";
import { searchApi } from "@/lib/api/searchApi";
import { filterPortalPages } from "@/lib/portalNav";
import { isStaffAdmin } from "@/lib/assignableRoles";
import { useCurriculumTree } from "@/components/curriculum/NestedCurriculumSelect";
import type { Role, SearchResultItem } from "@/types/models";
import { formControlClass } from "@/lib/formControl";

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

  const programLink =
    isStaffAdmin(role)
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
      <>
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="hidden items-center gap-2 rounded-xl border border-portal bg-portal-muted px-3 py-1.5 text-sm text-portal-muted transition hover:text-portal-heading sm:flex"
          aria-label="Open search"
        >
          <Search className="size-4" />
          <span>Search…</span>
          <kbd className="rounded bg-portal-surface px-1.5 py-0.5 text-[10px] font-medium text-portal-muted">
            Ctrl K
          </kbd>
        </button>
      </>
    );
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-start justify-center bg-black/40 p-4 pt-[12vh] backdrop-blur-sm"
      onClick={() => setOpen(false)}
    >
      <div
        className="w-full max-w-lg overflow-hidden rounded-2xl border border-portal bg-portal-surface shadow-2xl animate-page-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-2 border-b border-portal px-4 py-3">
          <Search className="size-5 shrink-0 text-portal-muted" />
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
            className="rounded-lg p-1 text-portal-muted hover:bg-portal-muted/30"
            aria-label="Close search"
          >
            <X className="size-4" />
          </button>
        </div>

        <div className="max-h-[min(60vh,420px)] overflow-y-auto p-2">
          {pages.length > 0 ? (
            <section className="mb-3">
              <p className="px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-portal-muted">
                Pages
              </p>
              <ul>
                {pages.map((page) => (
                  <li key={page.path}>
                    <button
                      type="button"
                      onClick={() => go(page.path)}
                      className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition hover:bg-portal-muted/40"
                    >
                      <Search className="size-4 text-gold" />
                      <span className="font-medium text-portal-heading">{page.label}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          {programHits.length > 0 ? (
            <section className="mb-3">
              <p className="px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-portal-muted">
                Study programs
              </p>
              <ul>
                {programHits.map((program) => (
                  <li key={program.id}>
                    <button
                      type="button"
                      onClick={() => go(programLink)}
                      className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition hover:bg-portal-muted/40"
                    >
                      <Library className="size-4 shrink-0 text-[#C4922B]" />
                      <div className="min-w-0">
                        <p className="truncate font-medium text-portal-heading">{program.label}</p>
                        <p className="truncate text-xs text-portal-muted">Open progress & curriculum</p>
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          {debounced.trim().length >= 2 ? (
            <section>
              <p className="px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-portal-muted">
                Results
              </p>
              {isFetching ? (
                <p className="px-3 py-4 text-sm text-portal-muted">Searching…</p>
              ) : apiResults.length === 0 ? (
                <p className="px-3 py-4 text-sm text-portal-muted">No matches for “{debounced}”.</p>
              ) : (
                <ul>
                  {apiResults.map((item) => {
                    const Icon = resultIcon(item.type);
                    return (
                      <li key={`${item.type}-${item.id}`}>
                        <button
                          type="button"
                          onClick={() => go(item.path)}
                          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition hover:bg-portal-muted/40"
                        >
                          <Icon className="size-4 shrink-0 text-portal-heading" />
                          <div className="min-w-0">
                            <p className="truncate text-sm font-medium text-portal-heading">
                              {item.title}
                            </p>
                            {item.subtitle ? (
                              <p className="truncate text-xs text-portal-muted">{item.subtitle}</p>
                            ) : null}
                          </div>
                          <span className="ml-auto shrink-0 rounded-full bg-portal-muted/50 px-2 py-0.5 text-[10px] capitalize text-portal-muted">
                            {item.type}
                          </span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              )}
            </section>
          ) : (
            <p className="px-3 py-4 text-sm text-portal-muted">
              Type at least 2 characters to search students and classes.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
