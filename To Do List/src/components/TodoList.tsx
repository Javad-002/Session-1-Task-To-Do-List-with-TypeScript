import { useRef, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import style from "./style.module.css";

interface task {
  id: number;
  title: string;
  isCompleted: boolean;
  description?: string;
  priority: Priority;
}

type Priority = "high" | "medium" | "low" | "none";

const priorityOrder: Record<task["priority"], number> = {
  high: 1,
  medium: 2,
  low: 3,
  none: 4,
};

const GenerateId = (tasks: task[]): number => {
  if (tasks.length === 0) return 1;
  return tasks.reduce((max, t) => Math.max(max, t.id), tasks[0].id) + 1;
};

const addTask = (
  tasks: task[],
  title: string,
  description: string,
  priority: Priority
): task[] => {
  const newTask: task = {
    id: GenerateId(tasks),
    title,
    isCompleted: false,
    description,
    priority,
  };
  return [...tasks, newTask];
};

function toggleTaskStatus(tasks: task[], id: number): task[] {
  return tasks.map((task) =>
    task.id === id ? { ...task, isCompleted: !task.isCompleted } : task
  );
}

const TaskSchema = Yup.object().shape({
  title: Yup.string().required("Title is required"),
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
          initialValues={{ title: "", description: "", priority: "none" }}
          validationSchema={TaskSchema}
          onSubmit={(values, { resetForm }) => {
            const updatedTasks = addTask(
              myTasks,
              values.title,
              values.description,
              values.priority
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

              <h3 className={style.titles}>priority</h3>
              <Field as="select" name="priority" className={style.inputs}>
                <option value="none">Select priority</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </Field>

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

        {[...myTasks]
          .sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority])
          .sort((a, b) => Number(a.isCompleted) - Number(b.isCompleted))
          .map((task) => (
            <div
              className={
                task.isCompleted === false
                  ? style.taskCard
                  : style.taskCardCompleted
              }
              key={task.id}
            >
              <h4 className="m-0 text-xl font-bold">{task.title}</h4>
              {task.description != "" ? (
                <h5 className="m-0 bg-neutral-700 p-1">{task.description}</h5>
              ) : null}
              {task.priority != "none" ? (
                <h4 className="m-0">priority: {task.priority}</h4>
              ) : null}
              <h4 className="m-0">
                status: {task.isCompleted ? "Completed" : "Not Completed"}
              </h4>
              <input
                onChange={() => {
                  setMyTasks(toggleTaskStatus(myTasks, task.id));
                }}
                type="checkbox"
                checked={task.isCompleted}
                className="absolute top-4 right-4 size-5"
              />
            </div>
          ))}
      </div>
    </div>
  );
};

export default TodoList;
