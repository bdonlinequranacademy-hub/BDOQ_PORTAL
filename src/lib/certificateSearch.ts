import type { CertificateView } from "@/types/models";

export interface CertificateSearchFilters {
  nameQuery: string;
  issueDate: string;
}

export function filterCertificates(
  certificates: CertificateView[],
  filters: CertificateSearchFilters
): CertificateView[] {
  const name = filters.nameQuery.trim().toLowerCase();
  const date = filters.issueDate.trim();

  return certificates.filter((certificate) => {
    if (name) {
      const haystack = [
        certificate.studentName,
        certificate.studentNameBn,
        certificate.certificateId,
        certificate.courseName,
      ]
        .join(" ")
        .toLowerCase();

      if (!haystack.includes(name)) return false;
    }

    if (date && certificate.issueDate.slice(0, 10) !== date) {
      return false;
    }

    return true;
  });
}
