import { useQuery } from "@tanstack/react-query";
import useAuth from "./useAuth";
import useAxiosPublic from "./useAxiosPublic";


//check admin
const IsAdmin = () => {
    const { user } = useAuth();
    let axiosPublic = useAxiosPublic();
    const { data: isAdmin, isPending: isAdminLoading } = useQuery({
        queryKey: [user?.email, 'isAdmin'],
        // enabled: !loading,
        queryFn: async () => {
            const res = await axiosPublic.get(`/users/admin/${user.email}`);
            return res.data?.admin;
        }
    })
    return [isAdmin, isAdminLoading]
};

export default IsAdmin;