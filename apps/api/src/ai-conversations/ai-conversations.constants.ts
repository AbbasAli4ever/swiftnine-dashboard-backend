export const AI_CONVERSATION_NOT_FOUND = 'Conversation not found';
export const AI_CONVERSATION_MESSAGE_NOT_FOUND = 'Message not found';

export const AI_CONVERSATION_LIST_SELECT = {
  id: true,
  title: true,
  createdAt: true,
  updatedAt: true,
} as const;

export const AI_CONVERSATION_MESSAGE_SELECT = {
  id: true,
  role: true,
  content: true,
  status: true,
  createdAt: true,
} as const;
