export declare class AuthUserDto {
    id: string;
    fullName: string;
    email: string;
    avatarUrl: string | null;
    avatarColor: string;
}
export declare class AuthResponseDto {
    user: AuthUserDto;
    accessToken: string;
}
