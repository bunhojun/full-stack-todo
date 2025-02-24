import { Link } from 'react-router';
import { routerPaths } from '@/routes/paths.ts';
import { useMutation, useQuery } from '@tanstack/react-query';
import { addTask, getTasksByAuthorId } from '@/apis/task/api.ts';
import { useAuth } from '@/hooks/useAuth.ts';
import { ChangeEvent, useState } from 'react';
import { TaskTable } from '@/components/pages/Home/Task/Table.tsx';

export const Home = () => {
  const { user } = useAuth();
  const [newTask, setNewTask] = useState('');

  const onChangeTaskInput = (e: ChangeEvent<HTMLInputElement>) => {
    setNewTask(e.target.value);
  };

  const {
    isPending,
    data: tasks,
    refetch,
  } = useQuery({
    queryKey: ['getTasksByAuthorId'],
    queryFn: async () => {
      return getTasksByAuthorId(user.id);
    },
  });

  const { isPending: isAddingTask, mutate } = useMutation({
    mutationKey: ['addTask'],
    mutationFn: async (content: string) => {
      return addTask({ authorId: user.id, content });
    },
    onSuccess: async () => {
      setNewTask('');
      await refetch();
    },
  });

  const onAddTask = async () => {
    mutate(newTask);
  };

  const onEdit = async () => {
    await refetch();
  };

  if (isPending) {
    return <div>Loading...</div>;
  }

  if (!tasks) {
    return null;
  }

  return (
    <div>
      <h1>
        <Link to={routerPaths.user}>{user.name}</Link>'s Tasks
      </h1>
      <form>
        <label>
          <span>new task</span>
          <input type="text" value={newTask} onChange={onChangeTaskInput} />
        </label>
        <button type="button" disabled={isAddingTask} onClick={onAddTask}>
          Add Task
        </button>
      </form>
      <TaskTable tasks={tasks} onEdit={onEdit} />
    </div>
  );
};
