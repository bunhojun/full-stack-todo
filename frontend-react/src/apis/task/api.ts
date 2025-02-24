import { CreateTaskDto, Task, UpdateTaskDto } from '@/types/task.type.ts';
import { fetcher } from '@/apis/fetcher.ts';

export const getTasksByAuthorId = async (authorId: number): Promise<Task[]> => {
  const res = await fetcher<Task[]>(`/tasks?authorId=${authorId}`);

  if (!res) {
    throw new Error('Failed to get tasks');
  }

  return res;
};

export const addTask = async (createTaskDto: CreateTaskDto): Promise<Task> => {
  const res = await fetcher<Task>('/tasks', {
    method: 'POST',
    body: new URLSearchParams({
      ...createTaskDto,
      authorId: createTaskDto.authorId.toString(),
    }),
  });

  if (!res) {
    throw new Error('Failed to add task');
  }

  return res;
};

export const updateTask = async (
  taskId: number,
  updateTaskDto: UpdateTaskDto,
): Promise<Task> => {
  const newTask = {
    ...updateTaskDto,
  };
  if (!newTask.status) {
    delete newTask.status;
  }
  if (!newTask.content) {
    delete newTask.content;
  }

  const res = await fetcher<Task>(`/tasks/${taskId}`, {
    method: 'PATCH',
    body: new URLSearchParams(newTask),
  });

  if (!res) {
    throw new Error('Failed to edit task');
  }

  return res;
};
