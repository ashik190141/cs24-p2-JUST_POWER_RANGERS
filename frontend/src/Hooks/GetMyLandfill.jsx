import { useQuery } from "@tanstack/react-query";
import useAxiosPublic from "./useAxiosPublic";
import useAuth from "./useAuth";


const GetMyLandfill = () => {
    let axiosPublic = useAxiosPublic();
    let { user } = useAuth();
    const { data: myLandfill, isPending: isLandfillPending, refetch } = useQuery({
        queryKey: ['mylandfill'],
        queryFn: async () => {
            const res = await axiosPublic.get(`/landfill-manager/${user.email}`);
            return res.data.message;
        }
    });
    return [myLandfill, isLandfillPending, refetch];
};
export default GetMyLandfill;