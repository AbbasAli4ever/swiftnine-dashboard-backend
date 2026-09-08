-- Deleting a User should delete every piece of associated data across the
-- app, per explicit request. These 24 FKs to users(id) previously had no
-- ON DELETE clause (Postgres default: NO ACTION / RESTRICT, blocking the
-- delete). This switches them to CASCADE.
--
-- NOTE (deliberate, discussed with the user before applying): this includes
-- Workspace.created_by, Project.created_by, and Doc.owner_id — deleting the
-- creator of a workspace/project/doc will now cascade-delete that entire
-- workspace/project/doc and everything under it for every other member, not
-- just the deleted user's own data. Comment.user_id cascading combined with
-- the existing self-referential Comment.parent_id cascade also means other
-- users' replies to a deleted user's comment disappear too. Chosen anyway,
-- with these tradeoffs understood.

ALTER TABLE "workspaces" DROP CONSTRAINT "workspaces_created_by_fkey";
ALTER TABLE "workspaces" ADD CONSTRAINT "workspaces_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "workspace_invites" DROP CONSTRAINT "workspace_invites_invited_by_fkey";
ALTER TABLE "workspace_invites" ADD CONSTRAINT "workspace_invites_invited_by_fkey" FOREIGN KEY ("invited_by") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "projects" DROP CONSTRAINT "projects_created_by_fkey";
ALTER TABLE "projects" ADD CONSTRAINT "projects_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "project_members" DROP CONSTRAINT "project_members_invited_by_fkey";
ALTER TABLE "project_members" ADD CONSTRAINT "project_members_invited_by_fkey" FOREIGN KEY ("invited_by") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "task_lists" DROP CONSTRAINT "task_lists_created_by_fkey";
ALTER TABLE "task_lists" ADD CONSTRAINT "task_lists_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "tasks" DROP CONSTRAINT "tasks_created_by_fkey";
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "task_assignees" DROP CONSTRAINT "task_assignees_user_id_fkey";
ALTER TABLE "task_assignees" ADD CONSTRAINT "task_assignees_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "task_assignees" DROP CONSTRAINT "task_assignees_assigned_by_fkey";
ALTER TABLE "task_assignees" ADD CONSTRAINT "task_assignees_assigned_by_fkey" FOREIGN KEY ("assigned_by") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "comments" DROP CONSTRAINT "comments_user_id_fkey";
ALTER TABLE "comments" ADD CONSTRAINT "comments_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "mentions" DROP CONSTRAINT "mentions_mentioned_user_id_fkey";
ALTER TABLE "mentions" ADD CONSTRAINT "mentions_mentioned_user_id_fkey" FOREIGN KEY ("mentioned_user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "attachments" DROP CONSTRAINT "attachments_uploaded_by_fkey";
ALTER TABLE "attachments" ADD CONSTRAINT "attachments_uploaded_by_fkey" FOREIGN KEY ("uploaded_by") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "time_entries" DROP CONSTRAINT "time_entries_user_id_fkey";
ALTER TABLE "time_entries" ADD CONSTRAINT "time_entries_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "activity_logs" DROP CONSTRAINT "activity_logs_performed_by_fkey";
ALTER TABLE "activity_logs" ADD CONSTRAINT "activity_logs_performed_by_fkey" FOREIGN KEY ("performed_by") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "channel_members" DROP CONSTRAINT "channel_members_user_id_fkey";
ALTER TABLE "channel_members" ADD CONSTRAINT "channel_members_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "channel_message_mentions" DROP CONSTRAINT "channel_message_mentions_mentioned_user_id_fkey";
ALTER TABLE "channel_message_mentions" ADD CONSTRAINT "channel_message_mentions_mentioned_user_id_fkey" FOREIGN KEY ("mentioned_user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "channel_message_reactions" DROP CONSTRAINT "channel_message_reactions_user_id_fkey";
ALTER TABLE "channel_message_reactions" ADD CONSTRAINT "channel_message_reactions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "channel_join_requests" DROP CONSTRAINT "channel_join_requests_user_id_fkey";
ALTER TABLE "channel_join_requests" ADD CONSTRAINT "channel_join_requests_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "docs" DROP CONSTRAINT "docs_owner_id_fkey";
ALTER TABLE "docs" ADD CONSTRAINT "docs_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "doc_versions" DROP CONSTRAINT "doc_versions_created_by_fkey";
ALTER TABLE "doc_versions" ADD CONSTRAINT "doc_versions_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "doc_permissions" DROP CONSTRAINT "doc_permissions_user_id_fkey";
ALTER TABLE "doc_permissions" ADD CONSTRAINT "doc_permissions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "doc_permissions" DROP CONSTRAINT "doc_permissions_granted_by_fkey";
ALTER TABLE "doc_permissions" ADD CONSTRAINT "doc_permissions_granted_by_fkey" FOREIGN KEY ("granted_by") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "doc_comment_threads" DROP CONSTRAINT "doc_comment_threads_created_by_fkey";
ALTER TABLE "doc_comment_threads" ADD CONSTRAINT "doc_comment_threads_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "doc_comments" DROP CONSTRAINT "doc_comments_author_id_fkey";
ALTER TABLE "doc_comments" ADD CONSTRAINT "doc_comments_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "doc_share_links" DROP CONSTRAINT "doc_share_links_created_by_fkey";
ALTER TABLE "doc_share_links" ADD CONSTRAINT "doc_share_links_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
