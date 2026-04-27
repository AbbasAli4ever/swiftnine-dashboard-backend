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
export declare function ok<T>(data: T, message?: string | null): ApiResponse<T>;
export declare function paginated<T>(data: T[], total: number, page: number, limit: number, message?: string | null): PaginatedApiResponse<T>;
