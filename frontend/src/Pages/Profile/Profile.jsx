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
                </div> : <>
                    <div className="w-full mx-auto">
                        <div className="my-10 w-full md:w-10/12 mx-auto px-2">
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-8 my-5">
                                <h1 className="text-base md:text-xl bg-teal-800 p-5 rounded-md text-white"> <span className="font-bold">Name: </span>{userDetails?.userName}</h1>
                                <h1 className="text-base md:text-xl bg-teal-800 p-5 rounded-md text-white"><span className="font-bold">Email: </span>{userDetails?.email}</h1>
                                <h1 className="text-base md:text-xl bg-teal-800 p-5 rounded-md text-white"><span className="font-bold">Phone: </span>{userDetails?.phone}</h1>
                                <h1 className="text-base md:text-xl bg-teal-800 p-5 rounded-md text-white"> <span className="font-bold">Date of Birth: </span>{userDetails?.dateOfBirth}</h1>
                                <h1 className="text-base md:text-xl bg-teal-800 p-5 rounded-md text-white"><span className="font-bold">Gender: </span>{userDetails?.gender}</h1>
                                <h1 className="text-base md:text-xl bg-teal-800 p-5 rounded-md text-white"> <span className="font-bold">Address: </span>{userDetails?.address}</h1>
                                <h1 className="text-base md:text-xl bg-teal-800 p-5 rounded-md text-white"><span className="font-bold">Thana: </span>{userDetails?.thana}</h1>
                                <h1 className="text-base md:text-xl bg-teal-800 p-5 rounded-md text-white"> <span className="font-bold">District: </span>{userDetails?.district}</h1>
                                <h1 className="text-base md:text-xl bg-teal-800 p-5 rounded-md text-white"><span className="font-bold">Division: </span>{userDetails?.division}</h1>
                            </div>
                        </div>
                    </div>
                    <div className="my-16 w-full md:w-10/12 mx-auto flex justify-center items-center px-2">
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
                </>
            }
        </div>
    );
};

export default Profile;