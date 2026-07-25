import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Eye, Lightbulb, Save } from "lucide-react";
import {
  useAdminTeacherProfile,
  useCreateTeacherProfile,
  useUpdateTeacherProfile,
} from "@/features/admin/hooks/useAdmin";
import { PageContainer } from "@/components/layout/PageContainer";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { PageLoading } from "@/components/ui/PageLoading";
import { UserAvatar } from "@/components/ui/UserAvatar";
import { AdminPricingFormSection } from "@/features/admin/components/pricing/AdminPricingFormSection";
import { AdminCmsStatusBadge } from "@/features/admin/components/shared/AdminCmsStatusBadge";
import {
  arrayToLines,
  linesToArray,
  slugify,
} from "@/features/admin/lib/adminCmsUtils";
import {
  formControlClass,
  formHintClass,
  formLabelClass,
} from "@/lib/formControl";
import { cn } from "@/lib/utils/cn";
import { env } from "@/config/env";

export function AdminTeacherProfileFormPage() {
  const { id } = useParams<{ id: string }>();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const { data: existing, isLoading } = useAdminTeacherProfile(isEdit ? id! : "");
  const createProfile = useCreateTeacherProfile();
  const updateProfile = useUpdateTeacherProfile(id ?? "");

  const [slug, setSlug] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [bio, setBio] = useState("");
  const [about, setAbout] = useState("");
  const [gender, setGender] = useState<"male" | "female">("male");
  const [country, setCountry] = useState("");
  const [location, setLocation] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [experience, setExperience] = useState("");
  const [featured, setFeatured] = useState(false);
  const [showOnWebsite, setShowOnWebsite] = useState(true);
  const [sortOrder, setSortOrder] = useState("0");
  const [qualificationsText, setQualificationsText] = useState("");
  const [skillsText, setSkillsText] = useState("");
  const [languagesText, setLanguagesText] = useState("");
  const [courseSlugsText, setCourseSlugsText] = useState("");
  const [slugTouched, setSlugTouched] = useState(false);

  useEffect(() => {
    if (!existing) return;
    setSlug(existing.slug);
    setName(existing.name);
    setRole(existing.role);
    setBio(existing.bio);
    setAbout(existing.about ?? "");
    setGender(existing.gender);
    setCountry(existing.country ?? "");
    setLocation(existing.location ?? "");
    setAvatarUrl(existing.avatarUrl ?? "");
    setExperience(existing.experience ?? "");
    setFeatured(existing.featured);
    setShowOnWebsite(existing.showOnWebsite);
    setSortOrder(String(existing.sortOrder));
    setQualificationsText(arrayToLines(existing.qualifications));
    setSkillsText(arrayToLines(existing.skills));
    setLanguagesText(arrayToLines(existing.languages));
    setCourseSlugsText(arrayToLines(existing.courseSlugs));
    setSlugTouched(true);
  }, [existing]);

  useEffect(() => {
    if (isEdit || slugTouched || !name.trim()) return;
    setSlug(slugify(name));
  }, [isEdit, name, slugTouched]);

  async function handleSubmit(e?: React.FormEvent): Promise<void> {
    e?.preventDefault();
    if (!name.trim() || !role.trim() || !bio.trim()) return;

    const payload = {
      slug: slug.trim() || slugify(name),
      name: name.trim(),
      role: role.trim(),
      bio: bio.trim(),
      about: about.trim() || undefined,
      gender,
      country: country.trim() || undefined,
      location: location.trim() || undefined,
      avatarUrl: avatarUrl.trim() || undefined,
      experience: experience.trim() || undefined,
      featured,
      showOnWebsite,
      sortOrder: Number(sortOrder) || 0,
      qualifications: linesToArray(qualificationsText),
      skills: linesToArray(skillsText),
      languages: linesToArray(languagesText),
      courseSlugs: linesToArray(courseSlugsText),
    };

    if (isEdit) {
      await updateProfile.mutateAsync(payload);
    } else {
      await createProfile.mutateAsync(payload);
    }
    navigate("/admin/teacher-profiles");
  }

  if (isEdit && isLoading) {
    return (
      <PageContainer>
        <PageLoading label="Loading teacher profile…" />
      </PageContainer>
    );
  }

  const isSaving = createProfile.isPending || updateProfile.isPending;
  const canSave =
    name.trim().length > 0 && role.trim().length > 0 && bio.trim().length > 0;

  return (
    <PageContainer>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <button
            type="button"
            onClick={() => navigate("/admin/teacher-profiles")}
            className="inline-flex items-center gap-2 text-sm font-medium text-primary transition hover:text-primary-dark"
          >
            <ArrowLeft className="size-4" aria-hidden />
            Back to teachers
          </button>
          <h1 className="mt-3 font-display text-2xl font-bold text-primary-dark sm:text-3xl">
            {isEdit ? "Edit Teacher Profile" : "Create Teacher Profile"}
          </h1>
          <p className="mt-1.5 max-w-xl text-sm text-portal-muted">
            Public-facing teacher card and profile for the website /teachers page.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {slug ? (
            <a
              href={`${env.publicSiteUrl}/teachers`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl border border-primary px-4 py-2.5 text-sm font-semibold text-primary transition hover:bg-primary/5"
            >
              <Eye className="size-4" aria-hidden />
              Preview
            </a>
          ) : null}
          <Button
            type="button"
            disabled={!canSave || isSaving}
            onClick={() => void handleSubmit()}
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 text-white hover:bg-primary-dark"
          >
            <Save className="size-4" aria-hidden />
            {isSaving ? "Saving…" : "Save Profile"}
          </Button>
        </div>
      </div>

      <form
        onSubmit={(e) => void handleSubmit(e)}
        className="grid grid-cols-1 items-start gap-4 xl:gap-5 xl:grid-cols-[minmax(0,1fr)_300px]"
      >
        <div className="flex flex-col gap-5">
          <AdminPricingFormSection number={1} title="Basic Information">
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className={formLabelClass}>Full name *</span>
                <input
                  className={cn(formControlClass, "mt-1.5")}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Hafez Mawlana…"
                  required
                />
              </label>
              <label className="block">
                <span className={formLabelClass}>Slug *</span>
                <input
                  className={cn(formControlClass, "mt-1.5")}
                  value={slug}
                  onChange={(e) => {
                    setSlugTouched(true);
                    setSlug(e.target.value);
                  }}
                  placeholder="teacher-slug"
                  required
                />
              </label>
            </div>

            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className={formLabelClass}>Role / title *</span>
                <input
                  className={cn(formControlClass, "mt-1.5")}
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  placeholder="Quran & Tajweed Teacher"
                  required
                />
              </label>
              <label className="block">
                <span className={formLabelClass}>Gender *</span>
                <select
                  className={cn(formControlClass, "mt-1.5")}
                  value={gender}
                  onChange={(e) =>
                    setGender(e.target.value as "male" | "female")
                  }
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </label>
            </div>

            <label className="mt-4 block">
              <span className={formLabelClass}>Short bio *</span>
              <textarea
                className={cn(formControlClass, "mt-1.5 min-h-[90px]")}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="One-line summary for teacher cards…"
                required
              />
            </label>

            <label className="mt-4 block">
              <span className={formLabelClass}>About (extended)</span>
              <textarea
                className={cn(formControlClass, "mt-1.5 min-h-[120px]")}
                value={about}
                onChange={(e) => setAbout(e.target.value)}
                placeholder="Longer biography for the teacher detail section…"
              />
            </label>
          </AdminPricingFormSection>

          <AdminPricingFormSection number={2} title="Location & Media">
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className={formLabelClass}>Country</span>
                <input
                  className={cn(formControlClass, "mt-1.5")}
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  placeholder="Bangladesh"
                />
              </label>
              <label className="block">
                <span className={formLabelClass}>Location / city</span>
                <input
                  className={cn(formControlClass, "mt-1.5")}
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Dhaka"
                />
              </label>
            </div>

            <label className="mt-4 block">
              <span className={formLabelClass}>Avatar URL</span>
              <input
                className={cn(formControlClass, "mt-1.5")}
                value={avatarUrl}
                onChange={(e) => setAvatarUrl(e.target.value)}
                placeholder="https://…"
              />
            </label>

            <label className="mt-4 block">
              <span className={formLabelClass}>Experience summary</span>
              <input
                className={cn(formControlClass, "mt-1.5")}
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
                placeholder="7+ years teaching Quran online"
              />
            </label>
          </AdminPricingFormSection>

          <AdminPricingFormSection number={3} title="Qualifications & Courses">
            <label className="block">
              <span className={formLabelClass}>Qualifications</span>
              <textarea
                className={cn(formControlClass, "mt-1.5 min-h-[100px] font-mono text-sm")}
                value={qualificationsText}
                onChange={(e) => setQualificationsText(e.target.value)}
                placeholder={"Hafiz\nMufti\nIjazah in Tajweed"}
              />
              <span className={cn(formHintClass, "mt-1 block")}>One per line</span>
            </label>

            <label className="mt-4 block">
              <span className={formLabelClass}>Skills</span>
              <textarea
                className={cn(formControlClass, "mt-1.5 min-h-[100px] font-mono text-sm")}
                value={skillsText}
                onChange={(e) => setSkillsText(e.target.value)}
                placeholder={"Tajweed\nNoorani Qaida\nHifz"}
              />
            </label>

            <label className="mt-4 block">
              <span className={formLabelClass}>Languages</span>
              <textarea
                className={cn(formControlClass, "mt-1.5 min-h-[80px] font-mono text-sm")}
                value={languagesText}
                onChange={(e) => setLanguagesText(e.target.value)}
                placeholder={"Bengali\nEnglish\nArabic"}
              />
            </label>

            <label className="mt-4 block">
              <span className={formLabelClass}>Linked course slugs</span>
              <textarea
                className={cn(formControlClass, "mt-1.5 min-h-[80px] font-mono text-sm")}
                value={courseSlugsText}
                onChange={(e) => setCourseSlugsText(e.target.value)}
                placeholder={"noorani-qaida\ntajweed-male"}
              />
              <span className={cn(formHintClass, "mt-1 block")}>
                Course slugs from Courses CMS, one per line
              </span>
            </label>
          </AdminPricingFormSection>

          <AdminPricingFormSection number={4} title="Visibility & Order">
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className={formLabelClass}>Sort order</span>
                <input
                  type="number"
                  className={cn(formControlClass, "mt-1.5")}
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                />
              </label>
              <div className="space-y-3 pt-6">
                <label className="flex cursor-pointer items-start gap-3">
                  <input
                    type="checkbox"
                    className="mt-0.5 size-4 accent-primary"
                    checked={featured}
                    onChange={(e) => setFeatured(e.target.checked)}
                  />
                  <span>
                    <span className="block text-sm font-semibold text-portal-heading">
                      Featured teacher
                    </span>
                    <span className="text-xs text-portal-muted">
                      Highlight on homepage teachers section
                    </span>
                  </span>
                </label>
                <label className="flex cursor-pointer items-start gap-3">
                  <input
                    type="checkbox"
                    className="mt-0.5 size-4 accent-primary"
                    checked={showOnWebsite}
                    onChange={(e) => setShowOnWebsite(e.target.checked)}
                  />
                  <span>
                    <span className="block text-sm font-semibold text-portal-heading">
                      Show on public website
                    </span>
                    <span className="text-xs text-portal-muted">
                      Uncheck to save as draft
                    </span>
                  </span>
                </label>
              </div>
            </div>
          </AdminPricingFormSection>
        </div>

        <aside className="flex flex-col gap-4 xl:sticky xl:top-24 xl:self-start">
          <Card className="rounded-2xl border border-portal bg-portal-surface p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <UserAvatar
                name={name || "Teacher"}
                avatarUrl={avatarUrl}
                size="lg"
              />
              <div>
                <p className="font-bold text-portal-heading">
                  {name.trim() || "Teacher name"}
                </p>
                <p className="text-xs text-portal-muted">
                  {role.trim() || "Role"}
                </p>
              </div>
            </div>
            <p className="mt-3 text-sm text-portal-muted line-clamp-3">
              {bio.trim() || "Bio preview…"}
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <AdminCmsStatusBadge showOnWebsite={showOnWebsite} />
              {featured ? (
                <span className="inline-flex rounded-full bg-gold/20 px-2.5 py-1 text-xs font-semibold text-gold">
                  Featured
                </span>
              ) : null}
            </div>
          </Card>

          <Card className="rounded-2xl border border-primary/20 bg-primary/5 p-4 shadow-sm">
            <div className="flex items-center gap-2">
              <Lightbulb className="size-4 text-primary-dark" aria-hidden />
              <h2 className="text-sm font-bold text-primary-dark">Tips</h2>
            </div>
            <ul className="mt-3 list-disc space-y-1.5 pl-4 text-xs leading-relaxed text-portal-muted">
              <li>Use a square avatar image for best results on teacher cards.</li>
              <li>Featured teachers appear in the homepage preview section.</li>
              <li>Link course slugs so the profile shows related courses.</li>
            </ul>
          </Card>
        </aside>
      </form>
    </PageContainer>
  );
}
