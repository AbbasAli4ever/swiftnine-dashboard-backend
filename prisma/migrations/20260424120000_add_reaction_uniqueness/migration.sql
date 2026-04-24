-- Ensure reactions are idempotent per workspace member / comment / reaction face.
CREATE UNIQUE INDEX "reactions_comment_id_member_id_react_face_key"
ON "reactions"("comment_id", "member_id", "react_face");
