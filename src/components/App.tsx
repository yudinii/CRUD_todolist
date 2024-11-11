import { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import Swal from "sweetalert2";
import axios from "axios";

import Header from "./Header.tsx";
import Footer from "./Footer.tsx";
import ToDoList from "./ToDoList.tsx";
import TaskCalendar from "./Calendar.tsx";
import Add from "./Add.tsx";
import Edit from "./Edit.tsx";

interface Task {
  id: number;
  taskName: string;
  dueDate: string;
  detail: string;
  completed: boolean;
  importance: number;
}

const App = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentView, setCurrentView] = useState("list");

  useEffect(() => {
    axios
      .get("http://localhost:4000/tasks")
      .then((response) => {
        console.log("Fetched data:", response.data);
        response.data.forEach((task: any) => {
          console.log("Task Importance:", task.importance); // Log each task's importance
        });
        setTasks(response.data);
      })
      .catch((error) => {
        console.error("Error fetching tasks:", error);
      });
  }, []);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get("http://localhost:4000/tasks");
        console.log("Fetched data:", response.data); // Log the fetched data
        setTasks(response.data); // Ensure you're setting the response data correctly
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };
    fetchTasks();
  }, []);

  useEffect(() => {
    if (tasks.length > 0) {
      const sortedTasks = [...tasks].sort(
        (a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
      );
      localStorage.setItem("tasksData", JSON.stringify(sortedTasks));
    }
  }, [tasks]);

  const handleEdit = (id: number) => {
    const task = tasks.find((task) => task.id === id);
    if (task) {
      setSelectedTask(task);
      setIsEditing(true);
    } else {
      console.log("Task not found");
    }
  };

  const handleDelete = (id: number) => {
    Swal.fire({
      icon: "warning",
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, cancel!",
    }).then((result) => {
      if (result.isConfirmed) {
        const updatedTasks = tasks.filter((task) => task.id !== id);
        setTasks(updatedTasks);

        Swal.fire({
          icon: "success",
          title: "Deleted!",
          text: `Task has been deleted.`,
          showConfirmButton: false,
          timer: 1500,
        });
      }
    });
  };

  const handleComplete = (id: number) => {
    setTasks((prevTasks) => {
      const updatedTasks = prevTasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      );

      const openTasks = updatedTasks.filter((task) => !task.completed);
      const completedTasks = updatedTasks.filter((task) => task.completed);

      openTasks.sort(
        (a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
      );

      return [...openTasks, ...completedTasks];
    });
  };

  const handleSubmit = (tasksData: any) => {
    axios
      .post("http://localhost:4000/tasks", tasksData)
      .then((response) => {
        console.log("Task added:", response.data);
      })
      .catch((error) => {
        console.error("Error adding task:", error);
      });
  };

  /*return (
    <div className="container">
      {!isAdding && !isEditing && (
        <>
          <Header setIsAdding={setIsAdding} />
          <ToDoList
            tasks={tasks}
            handleEdit={handleEdit}
            handleDelete={handleDelete}
            handleComplete={handleComplete}
          />
        </>
      )}
      {isAdding &&
        ReactDOM.createPortal(
          <Add
            tasks={tasks}
            setTasks={setTasks}
            setIsAdding={setIsAdding}
            handleSubmit={handleSubmit}
          />,
          document.body
        )}
      {isEditing && selectedTask && (
        <Edit
          tasks={tasks}
          selectedTask={selectedTask}
          setTasks={setTasks}
          setIsEditing={setIsEditing}
        />
      )}
      <Footer />
    </div>
  );
};*/
  return (
    <div className="container">
      <Header setIsAdding={setIsAdding} />
      <div className="sticky-wrapper">
        <nav className="page-level-nav">
          <ul>
            <li>
              <button
                className={currentView === "list" ? "selected" : ""}
                onClick={() => setCurrentView("list")}
              >
                List View
              </button>
            </li>
            <li>
              <button
                className={currentView === "calendar" ? "selected" : ""}
                onClick={() => setCurrentView("calendar")}
              >
                Calendar View
              </button>
            </li>
          </ul>
        </nav>
      </div>

      {currentView === "list" && !isAdding && !isEditing && (
        <ToDoList
          tasks={tasks}
          handleEdit={handleEdit}
          handleDelete={handleDelete}
          handleComplete={handleComplete}
        />
      )}

      {currentView === "calendar" && !isAdding && !isEditing && (
        <TaskCalendar
          tasks={tasks}
          handleEdit={handleEdit}
          handleDelete={handleDelete}
          handleComplete={handleComplete}
        />
      )}

      {isAdding &&
        ReactDOM.createPortal(
          <Add
            tasks={tasks}
            setTasks={setTasks}
            setIsAdding={setIsAdding}
            handleSubmit={handleSubmit}
          />,
          document.body
        )}

      {isEditing && selectedTask && (
        <Edit
          tasks={tasks}
          selectedTask={selectedTask}
          setTasks={setTasks}
          setIsEditing={setIsEditing}
        />
      )}
      <Footer />
    </div>
  );
};
export default App;
