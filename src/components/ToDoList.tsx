import { IoIosStar, IoIosStarOutline } from "react-icons/io";

interface ToDoListProps {
  tasks: {
    id: number;
    taskName: string;
    detail: string;
    dueDate: string;
    completed: boolean;
    importance: number;
  }[];
  handleEdit: (id: number) => void;
  handleDelete: (id: number) => void;
  handleComplete: (id: number) => void;
}

const ToDoList = ({
  tasks,
  handleEdit,
  handleDelete,
  handleComplete,
}: ToDoListProps) => {
  const renderStars = (importance: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        i <= importance ? (
          <IoIosStar key={i} color="#FFD700" />
        ) : (
          <IoIosStarOutline key={i} color="gray" />
        )
      );
    }
    return stars;
  };

  return (
    <div className="list-table">
      <table>
        <thead>
          <tr>
            <th>No</th>
            <th>Task Name</th>
            <th>Importance</th>
            <th>Due Date</th>
            <th>Detail</th>
            <th colSpan={3} className="text-center">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {tasks.length > 0 ? (
            tasks.map((task, i) => (
              <tr key={task.id} className={task.completed ? "completed" : ""}>
                <td>{i + 1}</td>
                <td>{task.taskName}</td>
                <td>{renderStars(task.importance)}</td>
                <td>{task.dueDate}</td>
                <td>{task.detail}</td>
                <td className="text-center">
                  <button
                    className={`complete-button ${
                      task.completed ? "undo" : "complete"
                    }`}
                    onClick={() => handleComplete(task.id)}
                  >
                    {task.completed ? "Undo" : "Complete"}
                  </button>
                </td>
                <td className="text-right">
                  <button
                    className="edit-button"
                    onClick={() => handleEdit(task.id)}
                  >
                    Edit
                  </button>
                </td>
                <td className="text-left">
                  <button
                    className="delete-button"
                    onClick={() => handleDelete(task.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={6}>No Tasks Available</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ToDoList;
