import useAxiosPrivate from "../../hooks/useAxiosPrivate";

const SuperService = () => {
// ===========super admin user role=========== //
    const axiosPrivate = useAxiosPrivate();

    const updateUserRole = async (userId, role) => {
        const response = await axiosPrivate.put(`/api/superadmin/users/${userId}/role`, { role });
        return response;
    };

    const getSuperAdminStats = async () => {
        const response = await axiosPrivate.get("/api/superadmin/stats");
        return response;
    };
    


    return {
        updateUserRole,
        getSuperAdminStats,
      
    };
}

export default SuperService
