import { useEffect, useMemo, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
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
import { usePortalTranslation } from "@/i18n/LocaleProvider";
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
      <ul className="overflow-hidden rounded border border-portal bg-portal-surface shadow-[var(--portal-card-shadow)]">
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
    <li className="border-b border-portal last:border-b-0">
      <button
        type="button"
        onClick={onClick}
        className={cn(
          "group flex w-full items-center gap-3 px-3 py-2.5 text-left transition",
          active
            ? "bg-primary/8"
            : "hover:bg-portal-surface-muted focus-visible:bg-portal-surface-muted focus-visible:outline-none"
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

export function GlobalSearch({
  role,
  variant = "compact",
  className,
}: {
  role: Role;
  /** compact = chip, bar = wide field, host = no trigger (listens for mobile open event) */
  variant?: "compact" | "bar" | "host";
  className?: string;
}) {
  const navigate = useNavigate();
  const { t, nav, locale } = usePortalTranslation();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [debounced, setDebounced] = useState("");

  useEffect(() => {
    const timer = window.setTimeout(() => setDebounced(query), 250);
    return () => window.clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      // Host is for mobile icon only — avoid double Ctrl+K handlers with desktop bar
      if (variant === "host") return;
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen(true);
      }
      if (e.key === "Escape") {
        setOpen(false);
      }
    }
    function openFromEvent() {
      // Mobile search icon dispatches this; only the host instance should open
      if (variant !== "host") return;
      setOpen(true);
    }
    function onEscape(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keydown", onEscape);
    window.addEventListener("portal:open-search", openFromEvent);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keydown", onEscape);
      window.removeEventListener("portal:open-search", openFromEvent);
    };
  }, [variant]);

  const pages = useMemo(() => {
    return filterPortalPages(role, debounced).map((page) => ({
      ...page,
      label: nav(page.path) !== page.path ? nav(page.path) : page.label,
    }));
  }, [role, debounced, nav, locale]);

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

  const modal =
    open && typeof document !== "undefined"
      ? createPortal(
          <div
            className="fixed inset-0 z-[200] flex items-start justify-center bg-black/45 p-3 pt-[10vh] backdrop-blur-sm sm:p-4 sm:pt-[12vh]"
            onClick={() => setOpen(false)}
            role="dialog"
            aria-modal="true"
            aria-label={t("search.dialogLabel")}
          >
            <div
              className="w-full max-w-lg overflow-hidden rounded-xl border border-portal bg-portal-surface shadow-[var(--portal-card-shadow)] animate-page-in"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-2 border-b border-portal px-4 py-3">
                <span className="flex size-8 shrink-0 items-center justify-center rounded bg-primary/10 text-primary">
                  <Search className="size-4" />
                </span>
                <input
                  autoFocus
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={t("search.placeholderModal")}
                  className={`${formControlClass} border-0 bg-transparent px-0 shadow-none focus-visible:ring-0`}
                />
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="rounded p-1.5 text-portal-muted transition hover:bg-portal-surface-muted hover:text-portal-heading"
                  aria-label={t("search.closeSearch")}
                >
                  <X className="size-4" />
                </button>
              </div>

              <div className="max-h-[min(60vh,420px)] overflow-y-auto p-3">
                {pages.length > 0 ? (
                  <SearchListSection title={t("search.sectionPages")}>
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
                  <SearchListSection title={t("search.sectionPrograms")}>
                    {programHits.map((program) => (
                      <SearchListRow
                        key={program.id}
                        onClick={() => go(programLink)}
                        icon={<Library className="size-4" aria-hidden />}
                        title={program.label}
                        subtitle={t("search.openProgress")}
                      />
                    ))}
                  </SearchListSection>
                ) : null}

                {debounced.trim().length >= 2 ? (
                  <SearchListSection title={t("search.sectionResults")}>
                    {isFetching ? (
                      <li className="px-3 py-4 text-sm text-portal-muted">{t("search.searching")}</li>
                    ) : apiResults.length === 0 ? (
                      <li className="px-3 py-4 text-sm text-portal-muted">
                        {t("search.noMatches", { query: debounced })}
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
                    {t("search.minChars")}
                  </p>
                )}
              </div>
            </div>
          </div>,
          document.body
        )
      : null;

  if (!open) {
    if (variant === "host") {
      return null;
    }

    if (variant === "bar") {
      return (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className={cn(
            "flex h-10 w-full min-w-0 items-center gap-2.5 rounded-xl border border-portal bg-portal-surface px-3.5 text-left text-sm text-portal-muted shadow-[var(--portal-card-shadow)] transition hover:border-primary/30 hover:text-portal-heading",
            className
          )}
          aria-label={t("search.openSearch")}
        >
          <Search className="size-4 shrink-0 text-primary" aria-hidden />
          <span className="min-w-0 flex-1 truncate font-medium">
            {t("search.placeholder")}
          </span>
          <kbd className="hidden shrink-0 rounded-md bg-[#f0fbf6] px-1.5 py-0.5 text-[10px] font-semibold text-portal-muted sm:inline-block dark:bg-white/10">
            Ctrl K
          </kbd>
        </button>
      );
    }

    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={cn(
          "hidden items-center gap-2 rounded border border-portal bg-portal-surface px-3 py-1.5 text-sm text-portal-muted shadow-[var(--portal-card-shadow)] transition hover:text-portal-heading sm:flex",
          className
        )}
        aria-label={t("search.openSearch")}
      >
        <Search className="size-4" />
        <span>{t("search.placeholderShort")}</span>
        <kbd className="rounded bg-portal-surface-muted border border-portal px-1.5 py-0.5 text-[10px] font-medium text-portal-muted">
          Ctrl K
        </kbd>
      </button>
    );
  }

  return (
    <>
      {variant === "bar" ? (
        <button
          type="button"
          className={cn(
            "pointer-events-none flex h-10 w-full min-w-0 items-center gap-2.5 rounded-xl border border-primary/40 bg-primary/5 px-3.5 text-left text-sm text-portal-heading opacity-80",
            className
          )}
          aria-hidden
          tabIndex={-1}
        >
          <Search className="size-4 shrink-0 text-primary" aria-hidden />
          <span className="min-w-0 flex-1 truncate font-medium">{t("search.placeholderOpen")}</span>
        </button>
      ) : null}
      {modal}
    </>
  );
}
