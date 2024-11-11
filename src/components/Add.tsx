import React, { useState } from "react";
import Swal from "sweetalert2";
import Modal from "./Modal";

interface AddProps {
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  setIsAdding: React.Dispatch<React.SetStateAction<boolean>>;
  handleSubmit: (taskData: Task) => void;
}

interface Task {
  id: number;
  taskName: string;
  dueDate: string;
  detail: string;
  completed: boolean;
  importance: number;
}

const Add: React.FC<AddProps> = ({
  tasks,
  setTasks,
  setIsAdding,
  handleSubmit,
}) => {
  const [taskName, setTaskName] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [detail, setDetail] = useState("");
  const [importance, setImportance] = useState(1);

  const handleStarClick = (level: number) => {
    setImportance(level);
  };

  const handleAdd = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!taskName || !dueDate || !detail) {
      return Swal.fire({
        icon: "error",
        title: "Error!",
        text: "All fields are required.",
        showConfirmButton: true,
      });
    }

    const id = tasks.length + 1;

    const newTask: Task = {
      id,
      taskName: taskName,
      dueDate: dueDate,
      detail: detail,
      completed: false,
      importance: importance,
    };

    handleSubmit(newTask);

    const updatedTasks: Task[] = [...tasks, newTask];

    updatedTasks.sort((a, b) => {
      const dateA = new Date(a.dueDate);
      const dateB = new Date(b.dueDate);
      return dateA.getTime() - dateB.getTime();
    });

    setTasks(updatedTasks);
    localStorage.setItem("tasks", JSON.stringify(updatedTasks));
    setIsAdding(false);

    Swal.fire({
      icon: "success",
      title: "Added!",
      text: `${taskName} has been Added.`,
      showConfirmButton: false,
      timer: 1500,
    });
  };

  return (
    <Modal isVisible={true} onClose={() => setIsAdding(false)}>
      <form onSubmit={handleAdd}>
        <h1 className="modal-title">Add Task</h1>
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
          <input type="submit" value="Add" />
          <input
            style={{ marginLeft: "12px" }}
            className="muted-button"
            type="button"
            value="Cancel"
            onClick={() => setIsAdding(false)}
          />
        </div>
      </form>
    </Modal>
  );
};

export default Add;
