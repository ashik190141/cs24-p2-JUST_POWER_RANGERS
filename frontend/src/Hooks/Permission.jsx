import { useQuery } from "@tanstack/react-query";
import useAuth from "./useAuth";
import useAxiosPublic from "./useAxiosPublic";


const Permission = () => {
    const { user } = useAuth();
    let info = {
        email: user?.email
    };

    let axiosPublic = useAxiosPublic();
    const { data: UserRole, isPending: isUserRoleLoading } = useQuery({
        queryKey: [user?.email, 'UserRole'],
        queryFn: async () => {
            const res = await axiosPublic.post('/rbac/permissions', info);
            return res.data.message;
        }
    })
    return [UserRole, isUserRoleLoading];
};

export default Permission;