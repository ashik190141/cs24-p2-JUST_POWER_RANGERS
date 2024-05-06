import { useQuery } from "@tanstack/react-query";
import useAxiosPublic from "./useAxiosPublic";


const GetAllUsers = () => {
    let axiosPublic = useAxiosPublic();

    const { data: allUser = [], isPending, refetch } = useQuery({
        queryKey: ['allUser'],
        queryFn: async () => {
            const res = await axiosPublic.get('/users');
            return res.data;
        }
    });

    return [allUser, isPending, refetch];
};

export default GetAllUsers;