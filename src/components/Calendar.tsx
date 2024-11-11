import { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { IoIosStar, IoIosStarOutline } from "react-icons/io";

interface Task {
  id: number;
  taskName: string;
  detail: string;
  dueDate: string;
  completed: boolean;
  importance: number;
}

interface TaskCalendarProps {
  tasks: Task[];
  handleEdit: (id: number) => void;
  handleDelete: (id: number) => void;
  handleComplete: (id: number) => void;
}

const TaskCalendar = ({
  tasks,
  handleEdit,
  handleDelete,
  handleComplete,
}: TaskCalendarProps) => {
  const [date, setDate] = useState<Date | [Date, Date] | null>(new Date());
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

  const tasksByDate = tasks.reduce((acc: { [key: string]: Task[] }, task) => {
    const taskDate = new Date(task.dueDate);
    const dateString = taskDate.toLocaleDateString("en-US");
    if (!acc[dateString]) {
      acc[dateString] = [];
    }
    acc[dateString].push(task);
    return acc;
  }, {});

  const handleDateChange = (newDate: Date | [Date, Date] | null) => {
    setDate(newDate);
  };

  const selectedDateTasks =
    date instanceof Date
      ? tasksByDate[date.toLocaleDateString("en-US")] || []
      : Array.isArray(date)
      ? date.map((d) => tasksByDate[d.toLocaleDateString("en-US")] || []).flat()
      : [];

  return (
    <div className="calendar-page">
      <div className="calendar-container">
        <Calendar
          onChange={(value) => handleDateChange(value as Date | [Date, Date])}
          value={date}
          locale="en-US"
          tileContent={({ date }) => {
            const dateString = date.toLocaleDateString("en-US");
            const tasksForTile = tasksByDate[dateString];

            return tasksForTile ? (
              <div className="tile-tasks">
                {tasksForTile.slice(0, 3).map((task) => (
                  <div key={task.id} className="task-in-tile">
                    <strong>
                      {task.taskName.length > 29
                        ? `${task.taskName.slice(0, 29)}...`
                        : task.taskName}
                    </strong>
                    <div className="tile-stars">
                      {renderStars(task.importance)}
                    </div>
                  </div>
                ))}
                {tasksForTile.length > 3 && (
                  <div className="more-tasks">
                    +{tasksForTile.length - 3} more
                  </div>
                )}
              </div>
            ) : null;
          }}
        />
      </div>
      <div className="tasks-for-day">
        <h3>
          Tasks for{" "}
          {date instanceof Date
            ? date.toLocaleDateString("en-US")
            : "Multiple Dates"}
        </h3>
        {selectedDateTasks.length > 0 ? (
          selectedDateTasks.map((task: Task) => (
            <div key={task.id} className="task-item">
              <p>
                <strong>{task.taskName}</strong>
              </p>
              <p>{task.detail}</p>
              <p>Due Date: {task.dueDate}</p>
              <p>Importance: {renderStars(task.importance)}</p>
              <div className="task-actions">
                <button
                  className="edit-button"
                  onClick={() => handleEdit(task.id)}
                >
                  Edit
                </button>
                <button
                  className="delete-button"
                  onClick={() => handleDelete(task.id)}
                >
                  Delete
                </button>
                <button
                  className={`complete-button ${
                    task.completed ? "undo" : "complete"
                  }`}
                  onClick={() => handleComplete(task.id)}
                >
                  {task.completed ? "Undo" : "Complete"}
                </button>
              </div>
            </div>
          ))
        ) : (
          <p>No tasks for this day</p>
        )}
      </div>
    </div>
  );
};

export default TaskCalendar;
