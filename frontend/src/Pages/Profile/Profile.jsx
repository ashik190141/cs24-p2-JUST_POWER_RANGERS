import { Helmet } from "react-helmet-async";
import SectionTitle from "../../Components/SectionTitle";
import Permission from "../../Hooks/Permission";
import useAuth from "../../Hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import useAxiosPublic from "../../Hooks/useAxiosPublic";
import { useNavigate } from "react-router-dom";


const Profile = () => {
    let [userRole] = Permission();
    let axiosPublic = useAxiosPublic();
    let { user } = useAuth();
    let navigate = useNavigate();

    const { data: userDetails, isPending } = useQuery({
        queryKey: ['userDetails'],
        queryFn: async () => {
            const res = await axiosPublic.get(`/profile?email=${user?.email}`);
            return res.data;
        }
    });

    return (
        <div>
            <Helmet>
                <title>EcoSync | Profile</title>
            </Helmet>
            <SectionTitle title={userRole} subTitle={'My Current Position?'}></SectionTitle>

            {
                isPending ? <div className="text-center h-screen">
                    <span className="loading loading-spinner loading-lg"></span>
                </div> : <div className="w-full md:w-8/12 mx-auto">
                    <div className="my-10 w-full md:w-10/12 mx-auto">
                        <div className="flex gap-20 my-5">
                            <div className="min-w-96">
                                <h1 className="text-2xl"> <span className="font-bold">Name: </span>{userDetails?.userName}</h1>
                            </div>
                            <div className="text-left">
                                <h1 className="text-2xl"><span className="font-bold">Email: </span>{userDetails?.email}</h1>
                            </div>
                        </div>
                        <div className="flex gap-20 my-5">
                            <div className="min-w-96">
                                <h1 className="text-2xl"> <span className="font-bold">Current Role: </span>{userDetails?.role}</h1>
                            </div>
                            <div className="text-left">
                                <h1 className="text-2xl"><span className="font-bold">Phone: </span>{userDetails?.phone}</h1>
                            </div>
                        </div>
                        <div className="flex gap-20 my-5">
                            <div className="min-w-96">
                                <h1 className="text-2xl"> <span className="font-bold">Date of Birth: </span>{userDetails?.dateOfBirth}</h1>
                            </div>
                            <div className="text-left">
                                <h1 className="text-2xl"><span className="font-bold">Gender: </span>{userDetails?.gender}</h1>
                            </div>
                        </div>
                        <div className="flex gap-20 my-5">
                            <div className="min-w-96">
                                <h1 className="text-2xl"> <span className="font-bold">Address: </span>{userDetails?.address}</h1>
                            </div>
                            <div className="text-left">
                                <h1 className="text-2xl"><span className="font-bold">Thana: </span>{userDetails?.thana}</h1>
                            </div>
                        </div>
                        <div className="flex gap-20 my-5">
                            <div className="min-w-96">
                                <h1 className="text-2xl"> <span className="font-bold">District: </span>{userDetails?.district}</h1>
                            </div>
                            <div className="text-left">
                                <h1 className="text-2xl"><span className="font-bold">Division: </span>{userDetails?.division}</h1>
                            </div>
                        </div>
                    </div>
                    <div className="my-16 w-full md:w-10/12 mx-auto flex justify-start items-center">
                        <div className="flex gap-20">
                            <button
                                onClick={() => navigate(`/update/${userDetails?._id}`)}
                                className="bg-green-900 text-white px-5 py-2 rounded-md">
                                Update Profile
                            </button>
                            <button
                                onClick={() => navigate('/profile/change-password')}
                                className="bg-green-900 text-white px-5 py-2 rounded-md">
                                Update Password
                            </button>
                        </div>
                    </div>
                </div>
            }
        </div>
    );
};

export default Profile;