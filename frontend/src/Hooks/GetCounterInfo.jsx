import { useQuery } from "@tanstack/react-query";
import useAxiosPublic from "./useAxiosPublic";


const GetCounterInfo = () => {
    let axiosPublic = useAxiosPublic();
    const { data: counter = [], } = useQuery({
        queryKey: ["counter-info"],
        queryFn: async () => {
            const res = await axiosPublic.get('/counter');
            return res?.data?.data;
        },
    });
    return [counter];
};

export default GetCounterInfo;