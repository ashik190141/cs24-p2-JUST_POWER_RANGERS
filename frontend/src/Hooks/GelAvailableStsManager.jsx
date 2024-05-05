import { useQuery } from "@tanstack/react-query";
import useAxiosPublic from "./useAxiosPublic";


const GelAvailableStsManager = () => {
    let axiosPublic = useAxiosPublic();

    const { data: availableStsManager = [], isPending: isAvailableStsManagerPending, refetch } = useQuery({
        queryKey: ['getAvailableStsManager'],
        queryFn: async () => {
            const res = await axiosPublic.get('/available-sts-manager');
            return res.data.data;
        }
    });
    return [availableStsManager, isAvailableStsManagerPending, refetch];
};

export default GelAvailableStsManager;