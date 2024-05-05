import { useQuery } from "@tanstack/react-query";
import useAxiosPublic from "./useAxiosPublic";


const GetAvailableLandManager = () => {
    let axiosPublic = useAxiosPublic();

    const { data: availableLandManager = [], isPending: isAvailableLandManagerPending, refetch } = useQuery({
        queryKey: ['getAvailableLandManager'],
        queryFn: async () => {
            const res = await axiosPublic.get('/available-landfill-manager');
            return res.data.data;
        }
    })
    return [availableLandManager, isAvailableLandManagerPending, refetch];
};
export default GetAvailableLandManager;