import { useQuery } from "@tanstack/react-query";
import useAuth from "./useAuth";
import useAxiosPublic from "./useAxiosPublic";


//check LandManager
const IsLandManager = () => {
    const { user } = useAuth();
    let axiosPublic = useAxiosPublic();
    const { data: isLandManager, isPending: isLandManagerLoading } = useQuery({
        queryKey: [user?.email, 'isLandManager'],
        // enabled: !loading,
        queryFn: async () => {
            const res = await axiosPublic.get(`/users/landmanager/${user.email}`);
            return res.data?.LandManager;
        }
    })
    return [isLandManager, isLandManagerLoading]
};

export default IsLandManager;