import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

const CreateMeetingTaskSchema = z.object({
  title: z.string().min(1, 'Task title is required').max(500),
  projectId: z.string().uuid('Invalid project ID'),
  assigneeId: z.string().uuid('Invalid assignee ID'),
  dueDate: z.string().datetime('Invalid due date').optional(),
});

const CreateMeetingSchema = z.object({
  title: z.string().min(1, 'Title is required').max(300),
  meetingDate: z.string().datetime('Invalid meeting date'),
  participantIds: z.array(z.string().uuid('Invalid user ID')).min(1, 'At least one participant is required'),
  summary: z.string().max(20000).optional(),
  decisions: z.array(z.string().min(1).max(1000)).optional(),
  tasks: z.array(CreateMeetingTaskSchema).optional(),
});

export class CreateMeetingDto extends createZodDto(CreateMeetingSchema) {}
