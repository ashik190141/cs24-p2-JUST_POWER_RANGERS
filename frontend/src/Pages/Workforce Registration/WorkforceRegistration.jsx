import { useForm } from "react-hook-form";
import useAxiosPublic from "../../Hooks/useAxiosPublic";
import Swal from "sweetalert2";
import { Helmet } from "react-helmet-async";
import SectionTitle from "../../Components/SectionTitle";
import GetAllSts from "../../Hooks/GetAllSts";


const WorkforceRegistration = () => {
    const { register, handleSubmit, reset } = useForm();
    let axiosPublic = useAxiosPublic();
    let [allStsCollection] = GetAllSts();

    const onSubmit = async (data) => {

        let employeeInfo = {
            employeeId: data.employeeId,
            fullName: data.fullName,
            dob: data.dob,
            doh: data.doh,
            jobTitle: data.jobTitle,
            payment: data.payment,
            phone: data.phone,
            collectionRoute: data.collectionRoute,
            password: data.password,
            email: data.email
        }
        let res = await axiosPublic.post('/create-employee', employeeInfo);
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
                <title>EcoSync | Add Employee</title>
            </Helmet>
            <SectionTitle title={"Add Employee"} subTitle={'Need Member?'}></SectionTitle>
            <div>
                <div className="w-full md:w-10/12 mx-auto my-10 px-2">
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="flex gap-10">
                            <div className="flex-1">
                                <label className="label">
                                    <span className="label-text text-xl font-semibold">Employee ID*</span>
                                </label>
                                <input
                                    type="text"
                                    placeholder="Enter Employee Id"
                                    {...register('employeeId', { required: true })}

                                    className="w-full p-2 rounded-md placeholder:pl-2" />
                            </div>
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
                        </div>
                        <div className="flex gap-10 my-5">
                            <div className="flex-1">
                                <label className="label">
                                    <span className="label-text text-xl font-semibold">Date of Birth*</span>
                                </label>
                                <input
                                    type="date"
                                    placeholder="Enter Registration Id"
                                    {...register('dob', { required: true })}
                                    className="w-full p-2 rounded-md placeholder:pl-2" />
                            </div>
                            <div className="flex-1">
                                <label className="label">
                                    <span className="label-text text-xl font-semibold">Date of Hire*</span>
                                </label>
                                <input
                                    type="date"
                                    placeholder="Enter Registration Date"
                                    {...register('doh', { required: true })}
                                    className="w-full p-2 rounded-md placeholder:pl-2" />
                            </div>
                        </div>
                        <div className="flex gap-10 my-5">
                            <div className="flex-1">
                                <label className="label">
                                    <span className="label-text text-xl font-semibold">Job Title*</span>
                                </label>
                                <select defaultValue="default"
                                    {...register('jobTitle', { required: true })}
                                    className="w-full py-2 rounded-md">
                                    <option disabled value="default">Select Job Name</option>
                                    <option value="driver">Driver</option>
                                    <option value="cleaner">Cleaner</option>

                                </select>
                            </div>
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
                        </div>
                        <div className="flex gap-10 my-5">
                            <div className="flex-1">
                                <label className="label">
                                    <span className="label-text text-xl font-semibold">Payment (Per Hour)*</span>
                                </label>
                                <input
                                    type="number"
                                    placeholder="Enter Payment Amount"
                                    {...register('payment', { required: true })}
                                    required
                                    className="w-full p-2 rounded-md placeholder:pl-2" />
                            </div>
                            <div className="flex-1">
                                <label className="label">
                                    <span className="label-text text-xl font-semibold">Select a Area*</span>
                                </label>
                                <select defaultValue="default"
                                    {...register('collectionRoute', { required: true })}
                                    className="w-full py-2 rounded-md">
                                    <option disabled value="default">Select Name</option>
                                    {
                                        allStsCollection?.map((sts, index) => {
                                            return (
                                                <option className="text-black" key={index} value={sts?.name}>{sts?.name}</option>
                                            )
                                        })
                                    }

                                </select>
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
                                    required
                                    className="w-full p-2 rounded-md placeholder:pl-2" />
                            </div>
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

export default WorkforceRegistration;