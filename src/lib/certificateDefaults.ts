import type { CertificateFormPayload } from "@/lib/api/adminApi";

export const DEFAULT_CERT_PERFORMANCE_EN =
  "For excellent performance, dedication, and good Islamic manners throughout the course.";

export const DEFAULT_CERT_PERFORMANCE_BN =
  "কোর্স চলাকালীন চমৎকার পারফরম্যান্স, নিষ্ঠা এবং উত্তম ইসলামী আচরণের জন্য।";

export function emptyCertificateForm(): CertificateFormPayload {
  const today = new Date().toISOString().slice(0, 10);
  return {
    studentName: "",
    studentNameBn: "",
    courseName: "",
    courseNameBn: "",
    studentPortalId: "",
    issueDate: today,
    courseDuration: "3 Months",
    grade: "Excellent (A+)",
    showExcellentBadge: true,
    performanceTextEn: DEFAULT_CERT_PERFORMANCE_EN,
    performanceTextBn: DEFAULT_CERT_PERFORMANCE_BN,
  };
}

export function gradeShowsBadge(grade: string): boolean {
  const g = grade.trim().toLowerCase();
  return /excellent|a\+|outstanding|distinction/.test(g);
}
