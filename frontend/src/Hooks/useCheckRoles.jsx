import { useQuery } from "@tanstack/react-query";
import useAuth from "./useAuth";
import useAxiosPublic from "./useAxiosPublic";


//check Role
const useCheckRoles = () => {
    const { user, loading } = useAuth();
    let axiosPublic = useAxiosPublic();
    const { data: isRole, isPending: isRoleLoading } = useQuery({
        queryKey: [user?.email, 'isRole'],
        enabled: !loading,
        queryFn: async () => {
            const res = await axiosPublic.get(`/users/admin/${user.email}`);
            // console.log(res.data);
            return res.data?.admin;
        }
    })
    return [isRole, isRoleLoading]
};

export default useCheckRoles;