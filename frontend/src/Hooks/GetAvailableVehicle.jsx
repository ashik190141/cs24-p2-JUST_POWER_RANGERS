import { useQuery } from "@tanstack/react-query";
import useAxiosPublic from "./useAxiosPublic";


const GetAvailableVehicle = () => {
    let axiosPublic = useAxiosPublic();
    
    const { data: allVehicle = [] } = useQuery({
        queryKey: ['allVehicle'],
        queryFn: async () => {
            const res = await axiosPublic.get('/get-all-vehicle');
            return res.data;
        }
    })
    let availableVehicle = allVehicle.filter(vehicle => vehicle.available === true);
    return [availableVehicle, allVehicle];
};

export default GetAvailableVehicle;