import { useQuery } from "@tanstack/react-query";
import useAxiosPublic from "./useAxiosPublic";


const GetAllLandfill = () => {
    let axiosPublic = useAxiosPublic();

    const { data: allLandfill = [], isPending, refetch } = useQuery({
        queryKey: ['allLandfill'],
        queryFn: async () => {
            const res = await axiosPublic.get('/get-all-landfill');
            return res.data;
        }
    });

    return [allLandfill, isPending, refetch];
};

export default GetAllLandfill;