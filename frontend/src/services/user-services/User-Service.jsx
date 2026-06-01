import useAxiosPrivate from "../../hooks/useAxiosPrivate";

const UserService = () => {

  const axiosPrivate = useAxiosPrivate()
 // ======================================== register and login ========================================

  const postRegister = async (data) => {
    const response = await axiosPrivate.post("/api/signup", data);
    return response;
  };


  const postLogin = async (data) => {
    const response = await axiosPrivate.post("/api/login", data);
    return response;
  };

  // ======================================== project actions ========================================

  const createProject = async (projectData) => {
    const response = await axiosPrivate.post("/api/projects", projectData);
    return response;
  };

  
  // ======================================== project versions ========================================

  const addProjectVersion = async (projectId, versionData) => {
    const response = await axiosPrivate.post(`/api/projects/${projectId}/versions`, versionData);
    return response;
  };
const getMyProjects = async () => {
    const response = await axiosPrivate.get("/api/projects");
    return response;
  };

  const getProjectById = async (projectId) => {
    const response = await axiosPrivate.get(`/api/projects/${projectId}`);
    return response;
  };



    const deleteProject = async (projectId) => {
    const response = await axiosPrivate.delete(`/api/projects/${projectId}`);
    return response;
  };

  const updateProjectVersion = async (projectId, versionNumber, versionData) => {
    const response = await axiosPrivate.put(`/api/projects/${projectId}/versions/${versionNumber}`, versionData);
    return response;
  };

  const deleteProjectVersion = async (projectId, versionNumber) => {
    const response = await axiosPrivate.delete(`/api/projects/${projectId}/versions/${versionNumber}`);
    return response;
  };

 

  return {
    postLogin,
    postRegister,

    createProject,
    getMyProjects,
    getProjectById,
    addProjectVersion,
    updateProjectVersion,
    deleteProjectVersion,
    deleteProject,
   
  };
};

export default UserService;