import { useQuery } from "@tanstack/react-query";
import GetMyStsInfo from "./GetMyStsInfo";
import useAxiosPublic from "./useAxiosPublic";


const GetMyConstructor = () => {
    let [stsId] = GetMyStsInfo();
    let axiosPublic = useAxiosPublic();
    const { data: allConstractors = [], isPending, refetch } = useQuery({
        queryKey: ['gets-sts-constractors'],
        queryFn: async () => {
            const res = await axiosPublic.get(`/sts-constructor/${stsId?.name}`);
            return res.data;
        }
    });
    return [allConstractors, isPending, refetch]
};

export default GetMyConstructor;