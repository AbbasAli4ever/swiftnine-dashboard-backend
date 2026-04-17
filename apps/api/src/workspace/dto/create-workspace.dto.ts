import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';
import {
  WORKSPACE_MANAGEMENT_TYPE_VALUES,
  WORKSPACE_USE_VALUES,
} from '../workspace-options';

const CreateWorkspaceSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  logoUrl: z.string().url('Must be a valid URL').optional(),
  workspaceUse: z.enum(WORKSPACE_USE_VALUES),
  managementType: z.enum(WORKSPACE_MANAGEMENT_TYPE_VALUES),
});

export class CreateWorkspaceDto extends createZodDto(CreateWorkspaceSchema) {}
