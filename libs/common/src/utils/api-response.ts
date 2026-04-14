export type ApiResponse<T> = {
  success: true;
  data: T;
  message: string | null;
};

export type PaginatedApiResponse<T> = {
  success: true;
  data: T[];
  meta: {
    page: number;
    limit: number;
    total: number;
    total_pages: number;
    has_next: boolean;
    has_prev: boolean;
  };
  message: string | null;
};

export function ok<T>(data: T, message: string | null = null): ApiResponse<T> {
  return { success: true, data, message };
}

export function paginated<T>(
  data: T[],
  total: number,
  page: number,
  limit: number,
  message: string | null = null,
): PaginatedApiResponse<T> {
  const total_pages = Math.ceil(total / limit);
  return {
    success: true,
    data,
    meta: {
      page,
      limit,
      total,
      total_pages,
      has_next: page < total_pages,
      has_prev: page > 1,
    },
    message,
  };
}
