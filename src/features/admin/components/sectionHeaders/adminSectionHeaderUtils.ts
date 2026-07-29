import type {
  AdminSectionHeader,
  ISectionHeaderLocaleContent,
} from "@/types/models";

export type SectionHeaderField =
  | "eyebrow"
  | "title"
  | "subtitle"
  | "titleHighlight"
  | "titleAccent"
  | "intro";

export interface ISectionHeaderConfig {
  sectionKey: string;
  label: string;
  description: string;
  fields: SectionHeaderField[];
  cmsPage?: string;
}

export const SECTION_HEADER_CONFIGS: ISectionHeaderConfig[] = [
  {
    sectionKey: "home.teachers",
    label: "Home — Teachers Preview",
    description: "Header above the mentor cards on the home page.",
    fields: ["eyebrow", "title", "subtitle"],
    cmsPage: "/admin/teacher-profiles",
  },
  {
    sectionKey: "home.whyChoose",
    label: "Home — Why Choose Us",
    description: "Header above the why-choose feature cards.",
    fields: ["eyebrow", "title", "subtitle"],
  },
  {
    sectionKey: "home.testimonials",
    label: "Home — Testimonials",
    description: "Header above student reviews on the home page.",
    fields: ["eyebrow", "title", "subtitle"],
    cmsPage: "/admin/testimonials",
  },
  {
    sectionKey: "home.faq",
    label: "Home — FAQ",
    description: "Header beside the FAQ accordion on the home page.",
    fields: ["eyebrow", "title", "titleAccent", "intro"],
    cmsPage: "/admin/faq",
  },
  {
    sectionKey: "home.globalPresence",
    label: "Home — Global Presence",
    description: "Header above the country flags section.",
    fields: ["eyebrow", "title", "subtitle"],
  },
  {
    sectionKey: "home.liveAcademy",
    label: "Home — Live Academy",
    description: "Header for the live dashboard section.",
    fields: ["eyebrow", "title", "subtitle"],
  },
  {
    sectionKey: "pages.pricing",
    label: "Pricing Page Hero",
    description: "Top hero text on the pricing page.",
    fields: ["eyebrow", "title", "subtitle"],
    cmsPage: "/admin/pricing",
  },
  {
    sectionKey: "pages.gallery",
    label: "Gallery Page Hero",
    description: "Top hero text on the gallery page.",
    fields: ["eyebrow", "title", "subtitle"],
    cmsPage: "/admin/gallery",
  },
  {
    sectionKey: "pages.courses",
    label: "Courses Page Hero",
    description: "Top hero text on the courses listing page.",
    fields: ["eyebrow", "title", "subtitle"],
    cmsPage: "/admin/courses",
  },
  {
    sectionKey: "pages.teachers",
    label: "Teachers Page Hero",
    description: "Top hero text on the teachers page.",
    fields: ["eyebrow", "title", "subtitle"],
    cmsPage: "/admin/teacher-profiles",
  },
  {
    sectionKey: "pages.reviews",
    label: "Reviews Page Hero",
    description: "Top hero text on the reviews page.",
    fields: ["eyebrow", "title", "subtitle"],
    cmsPage: "/admin/testimonials",
  },
];

export function getSectionHeaderConfig(
  sectionKey: string
): ISectionHeaderConfig | undefined {
  return SECTION_HEADER_CONFIGS.find((item) => item.sectionKey === sectionKey);
}

export const EMPTY_SECTION_LOCALE: ISectionHeaderLocaleContent = {
  title: "",
};

export function createDefaultSectionHeader(
  config: ISectionHeaderConfig
): AdminSectionHeader {
  return {
    sectionKey: config.sectionKey,
    label: config.label,
    sortOrder: 0,
    showOnWebsite: true,
    contentEn: { title: "" },
    contentBn: { title: "" },
  };
}

export function mergeSectionHeaderFromApi(
  config: ISectionHeaderConfig,
  existing?: AdminSectionHeader
): AdminSectionHeader {
  const base = createDefaultSectionHeader(config);
  if (!existing) return base;

  return {
    ...base,
    ...existing,
    contentEn: { ...base.contentEn, ...existing.contentEn },
    contentBn: { ...base.contentBn, ...existing.contentBn },
  };
}

export function canSaveSectionHeader(header: AdminSectionHeader): boolean {
  return (
    header.contentEn.title.trim().length > 0 &&
    header.contentBn.title.trim().length > 0
  );
}
