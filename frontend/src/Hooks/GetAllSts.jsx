import { useQuery } from "@tanstack/react-query";
import useAxiosPublic from "./useAxiosPublic";


const GetAllSts = () => {
    let axiosPublic = useAxiosPublic();

    const { data: allStsCollection = [] } = useQuery({
        queryKey: ['getAllStsCollection'],
        queryFn: async () => {
            const res = await axiosPublic.get('/get-all-sts');
            return res.data;
        }
    })

    return [allStsCollection];
};

export default GetAllSts;