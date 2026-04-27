import { z } from 'zod';
import { AuthUserDto } from '../../auth/dto/auth-response.dto';
declare const ClaimInviteDto_base: import("nestjs-zod").ZodDto<z.ZodObject<{
    token: z.ZodString;
    fullName: z.ZodString;
    password: z.ZodString;
}, z.core.$strip>, false>;
export declare class ClaimInviteDto extends ClaimInviteDto_base {
}
export declare class ClaimInviteResponseDto {
    user: AuthUserDto;
    accessToken: string;
    workspaceId: string;
}
export {};
