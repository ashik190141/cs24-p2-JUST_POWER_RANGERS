import { useQuery } from "@tanstack/react-query";
import useAxiosPublic from "./useAxiosPublic";


const GetWorkforceTracking = () => {
    let axiosPublic = useAxiosPublic();

    const { data: workforceData =  [], isPending, refetch } = useQuery({
        queryKey: ['getworkforcedata'],
        queryFn: async () => {
            const res = await axiosPublic.get('/workforce-tracking');
            return res.data.data;
        }
    })
    return [workforceData, isPending, refetch];
};
export default GetWorkforceTracking;