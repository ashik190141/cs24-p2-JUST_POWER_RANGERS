import { Helmet } from "react-helmet-async";
import SectionTitle from "../../Components/SectionTitle";
import GetMyStsInfo from "../../Hooks/GetMyStsInfo";
import useAxiosPublic from "../../Hooks/useAxiosPublic";
import { useQuery } from "@tanstack/react-query";


const MyStsInfo = () => {
    let [stsId, isLoading] = GetMyStsInfo();
    let axiosPublic = useAxiosPublic();

    const { data: allManagers = [] } = useQuery({
        queryKey: ['get-all-my-sts-managers'],
        queryFn: async () => {
            const res = await axiosPublic.get(`/my-sts-managers/${stsId._id}`);
            return res.data;
        }
    });
    const { data: allVehicles = [] } = useQuery({
        queryKey: ['get-all-my-sts-vehicles'],
        queryFn: async () => {
            const res = await axiosPublic.get(`/my-sts-vehicles/${stsId._id}`);
            return res.data;
        }
    });



    return (
        <div>
            <Helmet>
                <title>EcoSync | My Sts Info</title>
            </Helmet>
            <SectionTitle title={"My Sts Info"} subTitle={"need details?"}></SectionTitle>
            <div className="w-full md:w-10/12 mx-auto">
                {
                    isLoading ? <div className="text-center h-screen">
                        <span className="loading loading-spinner loading-lg"></span>
                    </div> : <div className="text-lg">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-20 my-20 font-semibold">
                            <h1>StsName: {stsId?.name}</h1>
                            <h1>Ward Number: {stsId?.wardNumber}</h1>
                            <h1>Capacity: {stsId?.capacity}</h1>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-20 text-lg">
                            <details className="dropdown">
                                <summary className="m-1 btn text-lg">Show All Managers</summary>
                                <ul className="p-2 shadow menu dropdown-content z-[1] bg-base-100 rounded-box w-48">
                                    {
                                        allManagers?.map(manager => {
                                            return <li
                                                className="py-2 font-semibold text-lg"
                                                key={manager}>
                                                {manager}
                                            </li>
                                        })
                                    }
                                </ul>
                            </details>
                            <details className="dropdown">
                                <summary className="m-1 btn text-lg">Show All vehicles</summary>
                                <ul className="p-2 shadow menu dropdown-content z-[1] bg-base-100 rounded-box w-52">
                                    {
                                        allVehicles?.map(vehicle => {
                                            return <li
                                                className="py-2 font-semibold text-lg"
                                                key={vehicle}>
                                                {vehicle}
                                            </li>
                                        })
                                    }
                                </ul>
                            </details>
                        </div>
                    </div>
                }

            </div>

        </div>
    );
};

export default MyStsInfo;