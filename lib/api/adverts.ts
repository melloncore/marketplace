import { apiRequest } from "./http";

export interface MarketplaceAdvert {
  id: string;
  title: string;
  description: string | null;
  imageUrl: string | null;
  imageAlt: string | null;
  linkUrl: string | null;
  active: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
}

export async function listMarketplaceAdverts(): Promise<MarketplaceAdvert[]> {
  const response = await apiRequest<ApiResponse<MarketplaceAdvert[]>>("/adverts");
  return response.data;
}
