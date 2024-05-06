import { Helmet } from "react-helmet-async";
import { useForm } from "react-hook-form";
import useAxiosPublic from "../../Hooks/useAxiosPublic";
import Swal from "sweetalert2";
import { useQuery } from "@tanstack/react-query";
import SectionTitle from "../../Components/SectionTitle";


const AddNewUser = () => {
    const { register, handleSubmit, reset } = useForm();
    let axiosPublic = useAxiosPublic();

    const { data: availableRole = [] } = useQuery({
        queryKey: ['get-all-availableRole'],
        queryFn: async () => {
            const res = await axiosPublic.get('/users/roles');
            return res.data;
        }
    });

    const onSubmit = async (data) => {
        const newUser = {
            userName: data.userName,
            email: data.email,
            password: data.password,
            role: data.role
        };
        let res = await axiosPublic.post('/users', newUser);
        if (res.data.result) {
            Swal.fire({
                position: "center",
                icon: "success",
                title: res.data.message,
                showConfirmButton: false,
                timer: 1500
            });
            reset();

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
        <div>
            <Helmet>
                <title>EcoSync | Add New User</title>
            </Helmet>
            <SectionTitle title={"Add New User"} subTitle={'Need More Member?'}></SectionTitle>
            <div>
                <div className="w-10/12 mx-auto my-10">
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="flex gap-10">
                            <div className="flex-1">
                                <label className="label">
                                    <span className="label-text text-xl font-semibold">User Name*</span>
                                </label>
                                <input
                                    type="text"
                                    placeholder="Enter User Name"
                                    autoComplete="off"
                                    {...register('userName', { required: true })}

                                    className="w-full p-2 rounded-md placeholder:pl-2" />
                            </div>
                            <div className="flex-1">
                                <label className="label">
                                    <span className="label-text text-xl font-semibold">User Email*</span>
                                </label>
                                <input
                                    type="email"
                                    placeholder="Enter User Email"
                                    {...register('email', { required: true })}

                                    className="w-full p-2 rounded-md placeholder:pl-2" />
                            </div>
                        </div>
                        <div className="flex gap-10 my-5">
                            <div className="flex-1">
                                <label className="label">
                                    <span className="label-text text-xl font-semibold">Password</span>
                                </label>
                                <input
                                    type="password"
                                    autoComplete="off"
                                    placeholder="Enter a password"
                                    {...register('password', { required: true })}
                                    required
                                    className="w-full p-2 rounded-md placeholder:pl-2" />
                            </div>
                            <div className="flex-1">
                                <label className="label">
                                    <span className="label-text text-xl font-semibold">User Role</span>
                                </label>
                                <select defaultValue="unassigned"
                                    {...register('role')}
                                    className="w-full py-2 rounded-md">
                                    <option disabled value="unassigned">Select User Role</option>
                                    {
                                        availableRole?.map((role) => {
                                            return (
                                                <option className="text-black" key={role._id} value={role?.roleName}>{role?.roleName}</option>
                                            )
                                        })
                                    }
                                </select>
                            </div>
                        </div>

                        <button
                            className="bg-green-800 px-4 py-2 rounded-md text-white"
                            type="submit">
                            Create New User!
                        </button>
                    </form>
                </div>
            </div >
        </div>
    );
};

export default AddNewUser;