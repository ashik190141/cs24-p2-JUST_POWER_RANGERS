import Swal from "sweetalert2";
import useAxiosPublic from "../../Hooks/useAxiosPublic";
import { useForm } from "react-hook-form";

import SectionTitle from "../../Components/SectionTitle";
import { Helmet } from "react-helmet-async";
import GetAllContractorCompany from "../../Hooks/GetAllContractorCompany";


const AddNewContractorManager = () => {

    const { register, handleSubmit, reset } = useForm();
    let axiosPublic = useAxiosPublic();
    let [allContractorCompany] = GetAllContractorCompany();


    const onSubmit = async (data) => {

        let contractorManager = {
            fullName: data.fullName,
            userId: data.userId,
            email : data.email,
            dateOfAccount: data.dateOfAccount,
            phone: data.phone,
            company: data.company,
            accessLevel: data.accessLevel,
            userName: data.userName,
            password: data.password,
            role: 'Contractor Manager'
        }
        let res = await axiosPublic.post('/create-contractor-manager', contractorManager);
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
                <title>EcoSync | Add Contractor Manager</title>
            </Helmet>
            <SectionTitle title={"Add Contractor Manager"} subTitle={'Need Manager?'}></SectionTitle>
            <div>
                <div className="w-full md:w-10/12 mx-auto my-10 px-2">
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="flex gap-10">
                            <div className="flex-1">
                                <label className="label">
                                    <span className="label-text text-xl font-semibold">Full Name*</span>
                                </label>
                                <input
                                    type="text"
                                    placeholder="Enter Full Name"
                                    {...register('fullName', { required: true })}

                                    className="w-full p-2 rounded-md placeholder:pl-2" />
                            </div>
                            <div className="flex-1">
                                <label className="label">
                                    <span className="label-text text-xl font-semibold">User ID*</span>
                                </label>
                                <input
                                    type="text"
                                    placeholder="Enter User ID"
                                    {...register('userId', { required: true })}

                                    className="w-full p-2 rounded-md placeholder:pl-2" />
                            </div>
                        </div>
                        <div className="flex gap-10 my-5">
                            <div className="flex-1">
                                <label className="label">
                                    <span className="label-text text-xl font-semibold">Email Address*</span>
                                </label>
                                <input
                                    type="email"
                                    placeholder="Enter Email Address"
                                    {...register('email', { required: true })}
                                    className="w-full p-2 rounded-md placeholder:pl-2" />
                            </div>
                            <div className="flex-1">
                                <label className="label">
                                    <span className="label-text text-xl font-semibold">Account Creation Date*</span>
                                </label>
                                <input
                                    type="date"
                                    placeholder="Enter Registration Date"
                                    {...register('dateOfAccount', { required: true })}
                                    className="w-full p-2 rounded-md placeholder:pl-2" />
                            </div>
                        </div>
                        <div className="flex gap-10 my-5">
                            <div className="flex-1">
                                <label className="label">
                                    <span className="label-text text-xl font-semibold">Contact Number*</span>
                                </label>
                                <input
                                    type="number"
                                    placeholder="Enter Contact Number"
                                    {...register('phone', { required: true })}
                                    required
                                    className="w-full p-2 rounded-md placeholder:pl-2" />
                            </div>
                            <div className="flex-1">
                                <label className="label">
                                    <span className="label-text text-xl font-semibold">Select Company Name*</span>
                                </label>
                                <select defaultValue="default"
                                    {...register('company', { required: true })}
                                    className="w-full py-2 rounded-md">
                                    <option disabled value="default">Select Company Name</option>
                                    {
                                        allContractorCompany?.map((company, index) => {
                                            return (
                                                <option className="text-black" key={index} value={company?.companyName}>{company?.companyName}</option>
                                            )
                                        })
                                    }
                                </select>
                            </div>

                        </div>
                        <div className="flex gap-10 my-5">
                            <div className="flex-1">
                                <label className="label">
                                    <span className="label-text text-xl font-semibold">Access Level*</span>
                                </label>
                                <input
                                    type="text"
                                    placeholder="Enter Access Level"
                                    {...register('accessLevel', { required: true })}
                                    required
                                    className="w-full p-2 rounded-md placeholder:pl-2" />
                            </div>
                            <div className="flex-1">
                                <label className="label">
                                    <span className="label-text text-xl font-semibold">User Name*</span>
                                </label>
                                <input
                                    type="text"
                                    placeholder="Enter User Name"
                                    {...register('userName', { required: true })}
                                    required
                                    className="w-full p-2 rounded-md placeholder:pl-2" />
                            </div>
                        </div>
                        <div className="flex gap-10 my-5">
                            <div className="flex-1">
                                <label className="label">
                                    <span className="label-text text-xl font-semibold">Password*</span>
                                </label>
                                <input
                                    type="password"
                                    placeholder="Enter Password"
                                    {...register('password', { required: true })}
                                    required
                                    className="w-full p-2 rounded-md placeholder:pl-2" />
                            </div>
                            <div className="flex-1">
                                <label className="label">
                                    <span className="label-text text-xl font-semibold">User Role*</span>
                                </label>
                                <input
                                    type="text"
                                    value={'Contractor Manager'}
                                    readOnly
                                    placeholder="Enter Contract Duration"
                                    className="w-full p-2 rounded-md placeholder:pl-2" />
                            </div>
                        </div>




                        <button
                            className="bg-green-800 px-4 py-2 rounded-md text-white"
                            type="submit">
                            Submit Now!
                        </button>
                    </form>
                </div>
            </div >
        </div>
    );
};

export default AddNewContractorManager;