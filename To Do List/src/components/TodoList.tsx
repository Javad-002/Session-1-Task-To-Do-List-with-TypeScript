import { useRef, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import style from "./style.module.css";

interface task {
  id: number;
  title: string;
  isCompleted: boolean;
  description?: string;
  priority?: "high" | "medium" | "low";
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

const TaskSchema = Yup.object().shape({
  title: Yup.string().required("عنوان الزامی است"),
});

const TodoList = () => {
  const [myTasks, setMyTasks] = useState<task[]>([]);
  const taskForm = useRef<HTMLDivElement>(null);

  const closeForm = () => {
    if (taskForm.current) {
      taskForm.current.style.display = "none";
    }
  };

  const openForm = () => {
    if (taskForm.current) {
      taskForm.current.style.display = "block";
    }
  };

  return (
    <div className={style.continer}>
      <div ref={taskForm} className={style.addTaskForm}>
        <h6 onClick={closeForm} className={style.closeBtn}>
          X
        </h6>

        <Formik
          initialValues={{ title: "", description: "" }}
          validationSchema={TaskSchema}
          onSubmit={(values, { resetForm }) => {
            const updatedTasks = addTask(
              myTasks,
              values.title,
              values.description
            );
            setMyTasks(updatedTasks);
            resetForm();
            closeForm();
          }}
        >
          {({ isSubmitting }) => (
            <Form className="flex flex-col gap-2">
              <h3 className={style.titles}>Title</h3>
              <Field
                name="title"
                placeholder="Title..."
                className={style.inputs}
              />
              <ErrorMessage
                name="title"
                component="div"
                className="text-red-500 text-sm"
              />

              <h3 className={style.titles}>Description</h3>
              <Field
                name="description"
                placeholder="Description..."
                className={style.inputs}
              />
              <ErrorMessage
                name="description"
                component="div"
                className="text-red-500 text-sm"
              />

              <button
                type="submit"
                disabled={isSubmitting}
                className={style.button}
              >
                Add
              </button>
            </Form>
          )}
        </Formik>
      </div>

      <div>
        <h3 style={{ width: "500px" }}>To Do List</h3>
        <div
          style={{
            background: "gray",
            width: "100%",
            borderRadius: "26px",
            marginBottom: "20px",
          }}
        >
          <button onClick={openForm} className={style.openBtn}>
            +
          </button>
        </div>
        {myTasks.map((task) => (
          <div
            className={
              task.isCompleted === false
                ? style.taskCard
                : style.taskCardCompleted
            }
            key={task.id}
          >
            <h4 style={{ margin: 0 }}>title: {task.title}</h4>
            <h5 style={{ margin: 0 }}>describe: {task.description}</h5>
            <h4 style={{ margin: 0, display: "inline" }}>
              status: {task.isCompleted ? "Completed" : "Not Completed"}
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
