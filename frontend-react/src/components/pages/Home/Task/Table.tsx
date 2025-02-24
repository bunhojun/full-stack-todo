import { Task, TaskStatus } from '@/types/task.type.ts';

type OnEdit = () => void;
type TaskRowProps = { task: Task; onEdit: OnEdit };

const convertStatus = (status: TaskStatus) => {
  switch (status) {
    case 'inProgress':
      return 'in progress';
    case 'done':
      return 'done';
    default:
      return '';
  }
};

const TaskRow = ({ task }: TaskRowProps) => {
  // const [isEditing, setIsEditing] = useState(false);
  //
  // const { isPending, mutate } = useMutation({
  //   mutationKey: ['updateTask'],
  //   mutationFn: async (updateTaskDto: UpdateTaskDto) => {
  //     return updateTask(task.id, updateTaskDto);
  //   },
  //   onSuccess: async () => {
  //     setIsEditing(false);
  //     onEdit();
  //   },
  // });
  //
  // const [content, setContent] = useState(task.content);
  // const [status, setStatus] = useState(task.status);
  //
  // const onChangeContent = (e: ChangeEvent<HTMLInputElement>) => {
  //   setContent(e.target.value);
  // };
  //
  // const onChangeStatus = (e: ChangeEvent<HTMLSelectElement>) => {
  //   if (!isTaskStatus(e.target.value)) {
  //     throw new Error('Invalid status');
  //   }
  //   setStatus(e.target.value);
  // };
  //
  // const onSubmit = async () => {
  //   mutate({ content, status });
  // };
  //
  // const onClickEdit = () => {
  //   setIsEditing(true);
  // };
  //
  // const onClickCancel = () => {
  //   setContent(task.content);
  //   setStatus(task.status);
  //   setIsEditing(false);
  // };
  //
  // if (isEditing) {
  //   return (
  //     <tr>
  //       <td>
  //         <input type="text" value={content} onChange={onChangeContent} />
  //       </td>
  //       <td>
  //         <select value={status} onChange={onChangeStatus}>
  //           {Object.keys(TaskStatus).map((status) => (
  //             <option key={status} value={status}>
  //               {isTaskStatus(status) ? convertStatus(status) : ''}
  //             </option>
  //           ))}
  //         </select>
  //       </td>
  //       <td>
  //         <button onClick={onSubmit} disabled={isPending}>
  //           Save
  //         </button>
  //         <button onClick={onClickCancel}>Cancel</button>
  //       </td>
  //     </tr>
  //   );
  // }

  return (
    <tr>
      <td>{task.content}</td>
      <td>{convertStatus(task.status)}</td>
      {/*<td>*/}
      {/*  <button onClick={onClickEdit}>Edit</button>*/}
      {/*</td>*/}
    </tr>
  );
};

type Props = {
  tasks: Task[];
  onEdit: OnEdit;
};

export const TaskTable = ({ tasks, onEdit }: Props) => {
  return (
    <table>
      {tasks.map((task) => (
        <TaskRow task={task} key={task.id} onEdit={onEdit} />
      ))}
    </table>
  );
};
