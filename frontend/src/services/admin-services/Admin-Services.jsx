import useAxiosPrivate from "../../hooks/useAxiosPrivate";

const AdminService = () => {
    const axiosPrivate = useAxiosPrivate();
    /////////////////admin dasbord////////////////
    const getAdminStats = async () => {
        const response = await axiosPrivate.get("/api/admin/stats");
        return response;
    };
    //////////admin project//////////////////
    const getAllProjects = async () => {
        const response = await axiosPrivate.get("/api/admin/projects");
        return response;
    };

    const deleteProjectByAdmin = async (projectId) => {
        const response = await axiosPrivate.delete(`/api/admin/projects/${projectId}`);
        return response;
    };
    ///////////////////admin user///////////////////

    const getAllUsers = async () => {
        const response = await axiosPrivate.get("/api/admin/users");
        return response;
    };

    const deleteUserByAdmin = async (userId) => {
        const response = await axiosPrivate.delete(`/api/admin/users/${userId}`);
        return response;
    };
    ///////////////////admin versions//////////////////

    const getAllVersions = async () => {
        const response = await axiosPrivate.get("/api/admin/versions");
        return response;
    };

    const deleteVersionByAdmin = async (versionId) => {
        const response = await axiosPrivate.delete(`/api/admin/versions/${versionId}`);
        return response;
    };

    return {
        getAdminStats,
        getAllProjects,
        deleteProjectByAdmin,
        getAllUsers,
        deleteUserByAdmin,
        getAllVersions,
        deleteVersionByAdmin
    };
};

export default AdminService;
