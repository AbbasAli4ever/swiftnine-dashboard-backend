import { z } from 'zod';
export declare const REFRESH_TOKEN_TTL_MS: number;
export declare const INVALID_CREDENTIALS_MESSAGE = "Invalid email or password";
export declare const AUTHENTICATION_REQUIRED_MESSAGE = "Authentication token is required";
export declare const INVALID_ACCESS_TOKEN_MESSAGE = "Invalid or expired access token";
export declare const ACCESS_TOKEN_EXPIRED_MESSAGE = "Access token has expired";
export declare const AUTH_USER_SELECT: {
    id: true;
    fullName: true;
    email: true;
    avatarUrl: true;
    avatarColor: true;
};
export declare const ACCESS_TOKEN_PAYLOAD_SCHEMA: z.ZodObject<{
    sub: z.ZodString;
    email: z.ZodString;
    iat: z.ZodOptional<z.ZodNumber>;
    exp: z.ZodOptional<z.ZodNumber>;
}, z.core.$strip>;
export type AccessTokenPayload = z.infer<typeof ACCESS_TOKEN_PAYLOAD_SCHEMA>;
