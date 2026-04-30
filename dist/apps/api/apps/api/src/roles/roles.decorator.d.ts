import type { Role } from "../../../../libs/database/src/generated/prisma/client";
export declare const ROLES_KEY = "roles";
export declare const Roles: (...roles: Role[]) => import("@nestjs/common").CustomDecorator<string>;
