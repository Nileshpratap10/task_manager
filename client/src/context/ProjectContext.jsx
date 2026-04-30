import React, { createContext, useState, useContext } from 'react';
import { getProjects as fetchProjects, getProject as fetchProject } from '../api/projects';
import toast from 'react-hot-toast';

const ProjectContext = createContext();

export const ProjectProvider = ({ children }) => {
  const [projects, setProjects] = useState([]);
  const [currentProject, setCurrentProject] = useState(null);
  const [loading, setLoading] = useState(false);

  const getProjects = async () => {
    setLoading(true);
    try {
      const { data } = await fetchProjects();
      setProjects(data);
    } catch (error) {
      toast.error('Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  const getProject = async (id) => {
    setLoading(true);
    try {
      const { data } = await fetchProject(id);
      setCurrentProject(data);
      return data;
    } catch (error) {
      toast.error('Failed to load project details');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProjectContext.Provider 
      value={{ 
        projects, 
        currentProject, 
        loading, 
        getProjects, 
        getProject,
        setProjects,
        setCurrentProject
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
};

export const useProjects = () => useContext(ProjectContext);
