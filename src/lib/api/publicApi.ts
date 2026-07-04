import { api as apiClient } from "./client";
import type { ApiResponse } from "@/types/api";
import type { CertificateVerifyView } from "@/types/models";

export const publicApi = {
  verifyCertificate: (certificateId: string) =>
    apiClient
      .get<ApiResponse<CertificateVerifyView>>(
        `/public/certificates/verify/${encodeURIComponent(certificateId)}`
      )
      .then((r) => r.data),
};
