
import { useQuery } from "@tanstack/react-query";
import useAxiosPublic from "./useAxiosPublic";

const GetAllContractorCompany = () => {
    let axiosPublic = useAxiosPublic();

    const { data: allContractorCompany = [], isCompanyLoading, refetch } = useQuery({
        queryKey: ['all-contractor-companies'],
        queryFn: async () => {
            const res = await axiosPublic.get('/get-all-company');
            console.log(res.data)
            return res.data.data;
        }
    });

    return [allContractorCompany, isCompanyLoading, refetch];
};

export default GetAllContractorCompany;
