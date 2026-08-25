-- Adds MANAGER as a new value of the existing "Role" enum. Purely additive —
-- no existing row's role changes, and ADMIN is untouched (it already has
-- real meaning in chat/channels/project/attachments and is deliberately not
-- being renamed or reused here). Nothing in the application checks for
-- role === 'MANAGER' yet; this step only makes it a legal value to invite
-- someone as.
ALTER TYPE "Role" ADD VALUE 'MANAGER';
