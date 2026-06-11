import { api as apiClient } from "./client";
import type { ApiResponse } from "@/types/api";
import type { SearchResultItem } from "@/types/models";

export const searchApi = {
  search: (q: string) =>
    apiClient
      .get<ApiResponse<SearchResultItem[]>>("/search", { params: { q } })
      .then((r) => r.data),
};
