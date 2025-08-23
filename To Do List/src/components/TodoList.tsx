import { useState } from "react";
import style from "./style.module.css";
interface task {
  id: number;
  title: string;
  isCompleted: boolean;
  description?: string;
}

const GenerateId = (tasks: task[]): number => {
  if (tasks.length === 0) return 1;
  return tasks.reduce((max, t) => Math.max(max, t.id), tasks[0].id) + 1;
};

const addTask = (tasks: task[], title: string, description: string): task[] => {
  const newTask: task = {
    id: GenerateId(tasks),
    title,
    isCompleted: false,
    description,
  };
  return [...tasks, newTask];
};

function toggleTaskStatus(tasks: task[], id: number): task[] {
  return tasks.map((task) =>
    task.id === id ? { ...task, isCompleted: !task.isCompleted } : task
  );
}

const TodoList = () => {
  const [title, setTitle] = useState<string>("");
  const [describe, setDescribe] = useState<string>("");
  const [myTasks, setMyTasks] = useState<task[]>([]);

  const handleAddTask = () => {
    const updatedTasks = addTask(myTasks, title, describe);
    setMyTasks(updatedTasks);
  };
  return (
    <>
      <h3 style={{ margin: "0" }}>title</h3>
      <input
        style={{ display: "block", margin: "5px auto" }}
        placeholder="Title..."
        onChange={(e) => {
          setTitle(e.target.value);
        }}
        type="text"
      />
      <h3 style={{ margin: "0" }}>description</h3>
      <input
        style={{ display: "block", margin: "5px auto" }}
        placeholder="Description..."
        onChange={(e) => {
          setDescribe(e.target.value);
        }}
        type="text"
      />
      <button style={{marginBottom:"10px"}} onClick={handleAddTask}>
        Add Task
      </button>
      {myTasks.map((task) => (
        <div
          className={
            task.isCompleted == false ? style.taskCard : style.taskCardCompleted
          }
          key={task.id}
        >
          <h4 style={{ margin: 0 }}>title: {task.title}</h4>
          <h5 style={{ margin: 0 }}>describe: {task.description}</h5>
          <h4 style={{ margin: 0, display: "inline" }}>
            status: {task.isCompleted == true ? "Completed" : "Not Completed"}
          </h4>
          <input
            onChange={() => {
              setMyTasks(toggleTaskStatus(myTasks, task.id));
            }}
            type="checkbox"
            checked={task.isCompleted}
          />
        </div>
      ))}
    </>
  );
};

export default TodoList;
