import { useRef, useState } from "react";
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

  const taskForm = useRef<HTMLDivElement>(null);

  const handleAddTask = () => {
    const updatedTasks = addTask(myTasks, title, describe);
    setMyTasks(updatedTasks);
  };

  const closeForm = () => {
    if (taskForm.current) {
      taskForm.current.style.display = 'none';
    }
  };

  const openForm = () => {
    if (taskForm.current) {
      taskForm.current.style.display = 'block';
    }
  }

  return (
    <div className={style.continer}>
      <div ref={taskForm} className={style.addTaskForm}>
        <h6 onClick={closeForm} className={style.closeBtn}>
          X
        </h6>
        <h3 className={style.titles}>Title</h3>
        <input
          className={style.inputs}
          placeholder="Title..."
          onChange={(e) => {
            setTitle(e.target.value);
          }}
          type="text"
        />
        <h3 className={style.titles}>Description</h3>
        <input
          className={style.inputs}
          placeholder="Description..."
          onChange={(e) => {
            setDescribe(e.target.value);
          }}
          type="text"
        />
        <button className={style.button} onClick={handleAddTask}>
          Add
        </button>
      </div>

      <div>
        <h3 style={{width:"500px"}}>To Do List</h3>
        <div style={{background:"gray", width:"100%", borderRadius:"26px",marginBottom:"20px"}}>
          <button onClick={openForm} className={style.openBtn}>+</button>
        </div>
        {myTasks.map((task) => (
          <div
            className={
              task.isCompleted == false
                ? style.taskCard
                : style.taskCardCompleted
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
      </div>
    </div>
  );
};

export default TodoList;
