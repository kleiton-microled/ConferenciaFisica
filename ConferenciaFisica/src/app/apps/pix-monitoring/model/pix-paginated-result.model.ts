import { PixModel } from "./pix.model";

export interface PixPaginatedResult {
    data: PixModel[];
    totalCount: number;
    pageNumber: number;
    pageSize: number;
    totalPages: number;
    hasPreviousPage: boolean;
    hasNextPage: boolean;
} 