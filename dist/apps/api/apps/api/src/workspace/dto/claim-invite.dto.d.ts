import { AuthUserDto } from '../../auth/dto/auth-response.dto';
declare const ClaimInviteDto_base: any;
export declare class ClaimInviteDto extends ClaimInviteDto_base {
}
export declare class ClaimInviteResponseDto {
    user: AuthUserDto;
    accessToken: string;
    workspaceId: string;
}
export {};
