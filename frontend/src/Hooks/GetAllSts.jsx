import { useQuery } from "@tanstack/react-query";
import useAxiosPublic from "./useAxiosPublic";


const GetAllSts = () => {
    let axiosPublic = useAxiosPublic();

    const { data: allStsCollection = [], isPending: isStsLoading, refetch } = useQuery({
        queryKey: ['getAllStsCollection'],
        queryFn: async () => {
            const res = await axiosPublic.get('/get-all-sts');
            return res.data;
        }
    })

    return [allStsCollection, isStsLoading, refetch];
};

export default GetAllSts;