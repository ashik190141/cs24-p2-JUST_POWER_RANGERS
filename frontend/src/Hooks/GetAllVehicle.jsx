import { useQuery } from "@tanstack/react-query";
import useAxiosPublic from "./useAxiosPublic";


const GetAllVehicle = () => {
    let axiosPublic = useAxiosPublic();

    const { data: allVehicle = [], isPending: isVehiclePending, refetch } = useQuery({
        queryKey: ['allVehicle'],
        queryFn: async () => {
            const res = await axiosPublic.get('/get-all-vehicle');
            return res.data;
        }
    })

    return [allVehicle, isVehiclePending, refetch];
};

export default GetAllVehicle;