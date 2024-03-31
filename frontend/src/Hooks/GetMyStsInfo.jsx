import { useQuery } from "@tanstack/react-query";
import useAxiosPublic from "./useAxiosPublic";
import useAuth from "./useAuth";


const GetMyStsInfo = () => {
    let axiosPublic = useAxiosPublic();
    let {user}  = useAuth();
    const { data: stsId, isPending: isLoading } = useQuery({
        queryKey: ["stsLocation"],
        queryFn: async () => {
            const res = await axiosPublic.get(`/sts-info/${user?.email}`);
            return res.data.data;
        },
    });
    return [stsId, isLoading];
};

export default GetMyStsInfo;