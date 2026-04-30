import axios from './axios';

export const getTasks = (projectId, params) => 
  axios.get(`/tasks/project/${projectId}`, { params });

export const createTask = (projectId, data) => 
  axios.post(`/tasks/project/${projectId}`, data);

export const updateTask = (id, data) => 
  axios.put(`/tasks/${id}`, data);

export const deleteTask = (id) => 
  axios.delete(`/tasks/${id}`);

export const updateTaskStatus = (id, status) => 
  axios.patch(`/tasks/${id}/status`, { status });
