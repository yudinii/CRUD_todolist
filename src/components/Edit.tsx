import React, { useState } from "react";
import Swal from "sweetalert2";
import Modal from "./Modal";

interface EditProps {
  tasks: Task[];
  selectedTask: Task;
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;
}

interface Task {
  id: number;
  taskName: string;
  dueDate: string;
  detail: string;
  completed: boolean;
  importance: number;
}

const Edit: React.FC<EditProps> = ({
  tasks,
  selectedTask,
  setTasks,
  setIsEditing,
}) => {
  const id = selectedTask.id;
  const [taskName, setTaskName] = useState(selectedTask.taskName);
  const [dueDate, setDueDate] = useState(selectedTask.dueDate);
  const [detail, setDetail] = useState(selectedTask.detail);
  const [importance, setImportance] = useState(selectedTask.importance || 0); // Added state for importance

  const handleStarClick = (level: number) => {
    setImportance(level);
  };

  const handleUpdate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!taskName || !dueDate || !detail) {
      return Swal.fire({
        icon: "error",
        title: "Error!",
        text: "All fields are required.",
        showConfirmButton: true,
      });
    }

    const updatedTask = {
      id,
      taskName,
      dueDate,
      detail,
      completed: false,
      importance: importance,
    };

    const updatedTasks = tasks.map((task) =>
      task.id === id ? updatedTask : task
    );

    localStorage.setItem("tasks_data", JSON.stringify(updatedTasks));
    setTasks(updatedTasks);
    setIsEditing(false);

    Swal.fire({
      icon: "success",
      title: "Updated!",
      text: `${updatedTask.taskName} has been updated.`,
      showConfirmButton: false,
      timer: 1500,
    });
  };

  return (
    <Modal isVisible={true} onClose={() => setIsEditing(false)}>
      <form onSubmit={handleUpdate}>
        <h1 className="modal-title">Edit Task</h1>
        <label htmlFor="taskName">Task Name</label>
        <input
          id="taskName"
          type="text"
          name="taskName"
          value={taskName}
          onChange={(e) => setTaskName(e.target.value)}
        />
        <label htmlFor="importance">Importance Level</label>
        <div className="importance-stars">
          {[1, 2, 3, 4, 5].map((level) => (
            <span
              key={level}
              onClick={() => handleStarClick(level)}
              style={{
                cursor: "pointer",
                color: level <= importance ? "gold" : "gray",
              }}
            >
              ★
            </span>
          ))}
        </div>
        <label htmlFor="dueDate">Due Date</label>
        <input
          id="dueDate"
          type="date"
          name="dueDate"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
        />
        <label htmlFor="detail">Details</label>
        <input
          id="detail"
          type="text"
          name="detail"
          value={detail}
          onChange={(e) => setDetail(e.target.value)}
        />
        <div style={{ marginTop: "30px" }}>
          <input type="submit" value="Update" />
          <input
            style={{ marginLeft: "12px" }}
            className="muted-button"
            type="button"
            value="Cancel"
            onClick={() => setIsEditing(false)}
          />
        </div>
      </form>
    </Modal>
  );
};

export default Edit;
