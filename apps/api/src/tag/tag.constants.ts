import type { Prisma } from '@app/database/generated/prisma/client';

export const TAG_NOT_FOUND = 'Tag not found';
export const TAG_NAME_TAKEN = 'A tag with this name already exists in this workspace';

export const TAG_SELECT = {
  id: true,
  workspaceId: true,
  name: true,
  color: true,
  createdAt: true,
  updatedAt: true,
} satisfies Prisma.TagSelect;
