import { Helmet } from "react-helmet-async";
import SectionTitle from "../../Components/SectionTitle";

import useAxiosPublic from "../../Hooks/useAxiosPublic";
import { useQuery } from "@tanstack/react-query";
import GetMyLandfill from "../../Hooks/GetMyLandfill";


const MyLandfillInfo = () => {
    let [myLandfill, isLandfillPending] = GetMyLandfill()
    let axiosPublic = useAxiosPublic();

    const { data: allManagers = [] } = useQuery({
        queryKey: ['get-all-my-landfill-managers'],
        queryFn: async () => {
            const res = await axiosPublic.get(`/my-landfill-managers/${myLandfill._id}`);
            return res.data;
        }
    });


    return (
        <div>
            <Helmet>
                <title>EcoSync | My Landfill Info</title>
            </Helmet>
            <SectionTitle title={"My Landfill Info"} subTitle={"need details?"}></SectionTitle>
            <div className="w-full md:w-10/12 mx-auto">
                {
                    isLandfillPending ? <div className="text-center h-screen">
                        <span className="loading loading-spinner loading-lg"></span>
                    </div> : <div className="text-lg">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-20 my-20 font-semibold">
                            <h1>Landfil Name: {myLandfill?.name}</h1>
                            <h1>Waste Capacity: {myLandfill?.capacity}</h1>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-20 my-20 font-semibold">
                            <h1>Start Time: {myLandfill?.startTime}</h1>
                            <h1>End Time: {myLandfill?.endTime}</h1>
                        </div>
                        <div className="w-full mx-auto text-lg">
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
                            
                        </div>
                    </div>
                }

            </div>

        </div>
    );
};

export default MyLandfillInfo;