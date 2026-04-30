import axios from './axios';

export const getProjects = () => axios.get('/projects');
export const getProject = (id) => axios.get(`/projects/${id}`);
export const createProject = (data) => axios.post('/projects', data);
export const updateProject = (id, data) => axios.put(`/projects/${id}`, data);
export const deleteProject = (id) => axios.delete(`/projects/${id}`);
export const joinProject = (token) => axios.post(`/projects/join/${token}`);
export const updateMemberRole = (id, userId, role) => axios.put(`/projects/${id}/members/${userId}`, { role });
export const removeMember = (id, userId) => axios.delete(`/projects/${id}/members/${userId}`);
