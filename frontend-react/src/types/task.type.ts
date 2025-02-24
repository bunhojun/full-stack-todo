import { User } from '@/types/user.type.ts';

export type CreateTaskDto = {
  authorId: number;
  content: string;
};

export type UpdateTaskDto = {
  content?: string;
  status?: TaskStatus;
};

export const TaskStatus = {
  done: 'done',
  inProgress: 'inProgress',
};
export type TaskStatus = keyof typeof TaskStatus;

export const isTaskStatus = (status: string): status is TaskStatus => {
  return Object.keys(TaskStatus).includes(status);
};

export type Task = {
  id: number;
  content: string;
  authorId: number;
  author: User;
  status: TaskStatus;
  createdAt: Date;
  updatedAt: Date;
};
