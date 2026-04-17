CREATE TYPE "WorkspaceUse" AS ENUM ('WORK', 'PERSONAL', 'SCHOOL');
CREATE TYPE "WorkspaceManagementType" AS ENUM (
    'HR_RECRUITING',
    'CREATIVE_DESIGN',
    'PROFESSIONAL_SERVICES',
    'FINANCE_ACCOUNTING',
    'OPERATIONS',
    'SOFTWARE_DEVELOPMENT',
    'IT',
    'SALES_CRM',
    'PERSONAL_USE',
    'SUPPORT',
    'STARTUP',
    'PMO',
    'MARKETING',
    'OTHER'
);

ALTER TABLE "workspaces"
ADD COLUMN "workspace_use" "WorkspaceUse",
ADD COLUMN "management_type" "WorkspaceManagementType";

UPDATE "workspaces"
SET
  "workspace_use" = 'WORK',
  "management_type" = 'OTHER'
WHERE "workspace_use" IS NULL
   OR "management_type" IS NULL;

ALTER TABLE "workspaces"
ALTER COLUMN "workspace_use" SET NOT NULL,
ALTER COLUMN "management_type" SET NOT NULL;
