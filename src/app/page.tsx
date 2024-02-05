"use client";

import { useState, useEffect } from "react";
import {
  getTasks,
  addTask,
  updateTask,
  toggleTaskCompletion,
  removeTask,
  Task,
} from "../../services/api";

const TasksPage = () => {
  const [hideCompleted, setHideCompleted] = useState(false);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [formData, setFormData] = useState({ name: "", description: "" });
  const [errorMsg, setErrorMsg] = useState("");

  const fetchTasks = async () => {
    const tasksData = await getTasks(1, "all");

    setTasks(tasksData?.data);
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData?.name || !formData?.description) {
      setErrorMsg("欄位不可為空");
      return;
    }

    const existingTaskIndex = tasks.findIndex(
      (task) => task.name === formData.name
    );
    const currentDate = new Date();
    const isoString = currentDate.toISOString();
    if (existingTaskIndex !== -1) {
      const updatedTask = {
        name: tasks[existingTaskIndex].name,
        description: formData.description,
        updated_at: isoString,
      };
      await updateTask(tasks[existingTaskIndex].id, updatedTask);
      await fetchTasks();
      setFormData({ name: "", description: "" });
    } else {
      const updatedTask = {
        name: formData.name,
        description: formData.description,
        is_completed: false,
        created_at: isoString,
        updated_at: isoString,
      };
      await addTask(updatedTask);
      await fetchTasks();
      setFormData({ name: "", description: "" });
    }
  };

  const handleStatusOnClick = async (id: number) => {
    await toggleTaskCompletion(id);
    await fetchTasks();
  };

  const handleDeleteOnClick = async (id: number) => {
    await removeTask(id);
    await fetchTasks();
  };

  return (
    <div className="flex flex-col items-center justify-center">
      {/* 切換顯示按鈕 */}
      <button
        onClick={() => {
          setHideCompleted(!hideCompleted);
        }}
        className="border-solid border-2 border-white p-2 m-5 rounded-lg hover:bg-white hover:text-black"
      >
        {hideCompleted ? "顯示已完成任務" : "隱藏已完成任務"}
      </button>
      {/* table */}
      <table className="border-solid border-2 border-sky-500 p-2 m-5">
        <tbody>
          <tr>
            <th className="border-solid border-2 border-sky-500 p-2">
              任務名稱
            </th>
            <th className="border-solid border-2 border-sky-500 p-2">
              任務描述
            </th>
            <th className="border-solid border-2 border-sky-500 p-2">狀態鈕</th>
            <th className="border-solid border-2 border-sky-500 p-2">
              創建時間
            </th>
            <th className="border-solid border-2 border-sky-500 p-2">
              更新時間
            </th>
            <th className="border-solid border-2 border-sky-500 p-2">刪除鈕</th>
          </tr>
          {tasks.map(
            (task) =>
              (!hideCompleted || !task.is_completed) && (
                <tr key={task.id}>
                  <td className="border-solid border-2 border-sky-500 p-1">
                    {task.name}
                  </td>
                  <td className="border-solid border-2 border-sky-500 p-1">
                    {task.description}
                  </td>
                  <td
                    onClick={() => handleStatusOnClick(task.id)}
                    className={
                      task.is_completed
                        ? "border-solid border-2 border-sky-500 p-1 bg-green-500 cursor-pointer hover:bg-green-300 text-center"
                        : "border-solid border-2 border-sky-500 p-1 bg-red-500 cursor-pointer hover:bg-red-300 text-center"
                    }
                  >
                    {task.is_completed ? "Ｏ" : "Ｘ"}
                  </td>
                  <td className="border-solid border-2 border-sky-500 p-1">
                    {task.created_at}
                  </td>
                  <td className="border-solid border-2 border-sky-500 p-1">
                    {task.updated_at}
                  </td>
                  <td
                    onClick={() => handleDeleteOnClick(task.id)}
                    className="border-solid  p-1 bg-red-900 border-2 border-sky-500 text-center hover:bg-red-700 cursor-pointer"
                  >
                    -
                  </td>
                </tr>
              )
          )}
        </tbody>
      </table>
      {/* 表單 */}
      <form
        onSubmit={handleFormSubmit}
        className="flex flex-col items-center justify-center"
      >
        <label>
          任務名稱
          <input
            className="m-4 text-black"
            type="text"
            value={formData?.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
        </label>
        <label>
          任務描述
          <input
            className="m-4 text-black"
            type="text"
            value={formData?.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
          />
        </label>
        {/* error */}
        <p className="text-red-500">{errorMsg}</p>

        <button
          type="submit"
          className="border-solid border-2 border-white p-2 m-5 rounded-lg hover:bg-white hover:text-black"
        >
          新增/編輯 任務
        </button>
      </form>
    </div>
  );
};

export default TasksPage;
