import { z } from 'zod';
declare const UpdateWorkspaceDto_base: import("nestjs-zod").ZodDto<z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    logoUrl: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    workspaceUse: z.ZodOptional<z.ZodEnum<{
        WORK: "WORK";
        PERSONAL: "PERSONAL";
        SCHOOL: "SCHOOL";
    }>>;
    managementType: z.ZodOptional<z.ZodEnum<{
        HR_RECRUITING: "HR_RECRUITING";
        CREATIVE_DESIGN: "CREATIVE_DESIGN";
        PROFESSIONAL_SERVICES: "PROFESSIONAL_SERVICES";
        FINANCE_ACCOUNTING: "FINANCE_ACCOUNTING";
        OPERATIONS: "OPERATIONS";
        SOFTWARE_DEVELOPMENT: "SOFTWARE_DEVELOPMENT";
        IT: "IT";
        SALES_CRM: "SALES_CRM";
        PERSONAL_USE: "PERSONAL_USE";
        SUPPORT: "SUPPORT";
        STARTUP: "STARTUP";
        PMO: "PMO";
        MARKETING: "MARKETING";
        OTHER: "OTHER";
    }>>;
}, z.core.$strip>, false>;
export declare class UpdateWorkspaceDto extends UpdateWorkspaceDto_base {
}
export {};
