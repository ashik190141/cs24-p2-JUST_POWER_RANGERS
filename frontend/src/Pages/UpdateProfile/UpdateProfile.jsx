import { Helmet } from "react-helmet-async";
import { useLoaderData, useNavigate } from "react-router-dom";
import SectionTitle from "../../Components/SectionTitle";
import useAxiosPublic from "../../Hooks/useAxiosPublic";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";

const UpdateProfile = () => {
    let userDetails = useLoaderData();

    const { register, handleSubmit, reset } = useForm();
    let axiosPublic = useAxiosPublic();
    let navigate = useNavigate();

    const onSubmit = async (data) => {
        const updatedInfo = {
            userName: data.userName,
            email: data.email,
            phone: data.phone,
            dateOfBirth: data.dateOfBirth,
            gender: data.gender,
            address: data.address,
            thana: data.thana,
            district: data.district,
            division: data.division,
        };
        let res = await axiosPublic.put(`/users/${userDetails?._id}`, updatedInfo);
        if (res.data.result) {
            Swal.fire({
                position: "center",
                icon: "success",
                title: res.data.message,
                showConfirmButton: false,
                timer: 1500
            });
            reset();
            navigate('/');
        } else {
            Swal.fire({
                position: "center",
                icon: "error",
                title: res.data.message,
                showConfirmButton: false,
                timer: 1500
            });
        }
    }
    return (
        <div className="mb-10">
            <Helmet>
                <title>EcoSync | Update Profile</title>
            </Helmet>
            <SectionTitle title={"Update Profile"} subTitle={'New Information?'}></SectionTitle>
            <div>
                <div
                    className="w-full md:w-8/12 mx-auto my-3 bg-base-content px-2 md:px-10 py-5 rounded-md">
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="flex gap-10">
                            <div className="flex-1">
                                <label className="label">
                                    <span className="label-text text-base md:text-xl font-semibold text-base-300">User Name*</span>
                                </label>
                                <input
                                    type="text"
                                    defaultValue={userDetails?.userName}
                                    {...register('userName', { required: true })}
                                    className="w-full p-2 rounded-md placeholder:pl-2" />
                            </div>
                            <div className="flex-1">
                                <label className="label">
                                    <span className="label-text text-base md:text-xl font-semibold text-base-300">User Email*</span>
                                </label>
                                <input
                                    type="email"
                                    defaultValue={userDetails?.email}
                                    {...register('email', { required: true })}
                                    className="w-full p-2 rounded-md placeholder:pl-2" />
                            </div>
                        </div>
                        <div className="flex gap-10 my-2">
                            <div className="flex-1">
                                <label className="label">
                                    <span className="label-text text-base md:text-xl font-semibold text-base-300">Current Role*</span>
                                </label>
                                <input
                                    type="text"
                                    defaultValue={userDetails?.role}
                                    readOnly
                                    {...register('role', { required: true })}
                                    className="w-full p-2 rounded-md placeholder:pl-2" />
                            </div>
                            <div className="flex-1">
                                <label className="label">
                                    <span className="label-text text-base md:text-xl font-semibold text-base-300">Phone Number*</span>
                                </label>
                                <input
                                    type="text"
                                    defaultValue={userDetails?.phone}
                                    {...register('phone', { required: true })}
                                    className="w-full p-2 rounded-md placeholder:pl-2" />
                            </div>
                        </div>
                        <div className="flex gap-10 my-2">
                            <div className="flex-1">
                                <label className="label">
                                    <span className="label-text text-base md:text-xl font-semibold text-base-300">Gender*</span>
                                </label>
                                <select
                                    defaultValue={userDetails?.gender}
                                    {...register('gender', { required: true })}
                                    className="w-full p-2 rounded-md placeholder:pl-2">
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                </select>

                            </div>
                            <div className="flex-1">
                                <label className="label">
                                    <span className="label-text text-base md:text-xl font-semibold text-base-300">Date Of Birth*</span>
                                </label>
                                <input
                                    type="date"
                                    defaultValue={userDetails?.dateOfBirth}
                                    {...register('dateOfBirth', { required: true })}
                                    className="w-full p-2 rounded-md placeholder:pl-2" />
                            </div>
                        </div>
                        <div className="flex gap-10 my-2">
                            <div className="flex-1">
                                <label className="label">
                                    <span className="label-text text-base md:text-xl font-semibold text-base-300">Address*</span>
                                </label>
                                <input
                                    type="text"
                                    defaultValue={userDetails?.address}
                                    {...register('address', { required: true })}
                                    className="w-full p-2 rounded-md placeholder:pl-2" />
                            </div>
                            <div className="flex-1">
                                <label className="label">
                                    <span className="label-text text-base md:text-xl font-semibold text-base-300">Thana Name*</span>
                                </label>
                                <input
                                    type="text"
                                    defaultValue={userDetails?.thana}
                                    {...register('thana', { required: true })}
                                    className="w-full p-2 rounded-md placeholder:pl-2" />
                            </div>
                        </div>
                        <div className="flex gap-10 my-2 mb-5">
                            <div className="flex-1">
                                <label className="label">
                                    <span className="label-text text-base md:text-xl font-semibold text-base-300">District*</span>
                                </label>
                                <input
                                    type="text"
                                    defaultValue={userDetails?.district}
                                    {...register('district', { required: true })}
                                    className="w-full p-2 rounded-md placeholder:pl-2" />
                            </div>
                            <div className="flex-1">
                                <label className="label">
                                    <span className="label-text text-base md:text-xl font-semibold text-base-300">Division*</span>
                                </label>
                                <input
                                    type="text"
                                    defaultValue={userDetails?.division}
                                    {...register('division', { required: true })}
                                    className="w-full p-2 rounded-md placeholder:pl-2" />
                            </div>
                        </div>
                        <button
                            className="bg-green-800 px-4 py-2 rounded-md text-white"
                            type="submit">
                            Update Info!
                        </button>
                    </form>
                </div>
            </div >
        </div>
    );
};

export default UpdateProfile;