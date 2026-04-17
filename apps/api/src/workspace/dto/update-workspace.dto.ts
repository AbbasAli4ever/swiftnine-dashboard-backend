import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';
import {
  WORKSPACE_MANAGEMENT_TYPE_VALUES,
  WORKSPACE_USE_VALUES,
} from '../workspace-options';

const UpdateWorkspaceSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  logoUrl: z.string().url('Must be a valid URL').nullable().optional(),
  workspaceUse: z.enum(WORKSPACE_USE_VALUES).optional(),
  managementType: z.enum(WORKSPACE_MANAGEMENT_TYPE_VALUES).optional(),
});

export class UpdateWorkspaceDto extends createZodDto(UpdateWorkspaceSchema) {}
