import axios, { AxiosResponse } from "axios";

export interface GetTasksResponse {
  status: string;
  total: number;
  data: Task[];
}

export type TaskType = "completed" | "uncompleted" | "all";

export interface Task {
  id: number;
  name: string;
  description: string;
  is_completed: boolean;
  created_at: string;
  updated_at: string;
}

export const getTasks = async (
  page: number = 1,
  type: TaskType = "all"
): Promise<GetTasksResponse> => {
  const response: AxiosResponse<GetTasksResponse> = await axios.get(
    `${process.env.API_BASE_URL}/task/?page=${page}&type=${type}`
  );

  return response.data;
};

export const addTask = async (taskData: Omit<Task, "id">): Promise<Task> => {
  const response: AxiosResponse<Task> = await axios.post(
    `${process.env.API_BASE_URL}/task`,
    taskData
  );
  return response.data;
};

export const updateTask = async (
  taskId: number,
  taskData: Pick<Task, "name" | "description" | "updated_at">
): Promise<Task> => {
  const response: AxiosResponse<Task> = await axios.put(
    `${process.env.API_BASE_URL}/task/${taskId}`,
    taskData
  );
  return response.data;
};

export const toggleTaskCompletion = async (taskId: number): Promise<Task> => {
  const response: AxiosResponse<Task> = await axios.patch(
    `${process.env.API_BASE_URL}/task/${taskId}`
  );
  return response.data;
};

export const removeTask = async (taskId: number): Promise<void> => {
  await axios.delete(`${process.env.API_BASE_URL}/task/${taskId}`);
};
