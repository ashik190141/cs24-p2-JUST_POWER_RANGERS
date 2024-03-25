import { useQuery } from "@tanstack/react-query";
import useAuth from "./useAuth";
import useAxiosPublic from "./useAxiosPublic";


//check StsManager
const IsStsManager = () => {
    const { user } = useAuth();
    let axiosPublic = useAxiosPublic();
    const { data: isStsManager, isPending: isStsManagerLoading } = useQuery({
        queryKey: [user?.email, 'isStsManager'],
        // enabled: !loading,
        queryFn: async () => {
            const res = await axiosPublic.get(`/users/stsmanager/${user.email}`);
            return res.data?.stsManager;
        }
    })
    return [isStsManager, isStsManagerLoading]
};

export default IsStsManager;