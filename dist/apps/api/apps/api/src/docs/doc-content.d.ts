import type { Prisma } from '@app/database/generated/prisma/client';
export type NormalizedDocContent = {
    contentJson: Prisma.InputJsonValue;
    plaintext: string;
};
export declare function normalizeDocContent(value: unknown): NormalizedDocContent;
export declare function defaultDocContent(): NormalizedDocContent;
export declare function extractPlaintext(value: unknown): string;
export declare function assertContentSize(value: unknown): void;
