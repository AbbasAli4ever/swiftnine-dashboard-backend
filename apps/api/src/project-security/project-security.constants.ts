import { BadRequestException, NotFoundException } from '@nestjs/common';
import type { Prisma } from '@app/database/generated/prisma/client';

export const PROJECT_NOT_FOUND = 'Project not found';
export const USER_NOT_PROJECT_MEMBER =
  'One or more users are not members of this private project';

export const PROJECT_SECURITY_PROJECT_SELECT = {
  id: true,
  workspaceId: true,
  name: true,
  createdBy: true,
  visibility: true,
  deletedAt: true,
} satisfies Prisma.ProjectSelect;

export type ProjectSecurityProject = Prisma.ProjectGetPayload<{
  select: typeof PROJECT_SECURITY_PROJECT_SELECT;
}>;

export type ProjectSecurityErrorCode =
  | 'PROJECT_NOT_FOUND'
  | 'USER_NOT_PROJECT_MEMBER';

export function projectSecurityError(
  code: ProjectSecurityErrorCode,
  message: string,
) {
  return { code, message };
}

export function projectNotFoundException(): NotFoundException {
  return new NotFoundException(
    projectSecurityError('PROJECT_NOT_FOUND', PROJECT_NOT_FOUND),
  );
}

export function userNotProjectMemberException(): BadRequestException {
  return new BadRequestException(
    projectSecurityError('USER_NOT_PROJECT_MEMBER', USER_NOT_PROJECT_MEMBER),
  );
}
