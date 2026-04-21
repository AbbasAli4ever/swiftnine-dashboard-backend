import { z } from 'zod';
declare const AddAssigneesDto_base: import("nestjs-zod").ZodDto<z.ZodObject<{
    userIds: z.ZodArray<z.ZodString>;
}, z.core.$strip>, false>;
export declare class AddAssigneesDto extends AddAssigneesDto_base {
}
export {};
