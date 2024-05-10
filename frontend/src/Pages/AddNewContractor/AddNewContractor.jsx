import Swal from "sweetalert2";
import useAxiosPublic from "../../Hooks/useAxiosPublic";
import GetAllSts from "../../Hooks/GetAllSts";
import { useForm } from "react-hook-form";

import SectionTitle from "../../Components/SectionTitle";
import { Helmet } from "react-helmet-async";


const AddNewContractor = () => {

    const { register, handleSubmit, reset } = useForm();
    let axiosPublic = useAxiosPublic();
    let [allStsCollection] = GetAllSts();

    const onSubmit = async (data) => {

        let contractorCompany = {
            companyName: data.companyName,
            contractId: data.contractId,
            regId : data.regId,
            regDate: data.regDate,
            tinId: data.tinId,
            contractNumber: data.contractNumber,
            workforceSize: data.workforceSize,
            payment: data.payment,
            requiredWastePerDay: data.requiredWastePerDay,
            cotractDuration: data.cotractDuration,
            areaOfCollection: data.areaOfCollection,
            stsName: data.stsName,
        }
        let res = await axiosPublic.post('/create-contractor-company', contractorCompany);
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
                <title>EcoSync | Add Contractor</title>
            </Helmet>
            <SectionTitle title={"Add Contractor"} subTitle={'Need Contract?'}></SectionTitle>
            <div>
                <div className="w-full md:w-10/12 mx-auto my-10 px-2">
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="flex gap-10">
                            <div className="flex-1">
                                <label className="label">
                                    <span className="label-text text-xl font-semibold">Company Name*</span>
                                </label>
                                <input
                                    type="text"
                                    placeholder="Enter Company Name"
                                    {...register('companyName', { required: true })}

                                    className="w-full p-2 rounded-md placeholder:pl-2" />
                            </div>
                            <div className="flex-1">
                                <label className="label">
                                    <span className="label-text text-xl font-semibold">Contract ID*</span>
                                </label>
                                <input
                                    type="text"
                                    placeholder="Enter Contract ID"
                                    {...register('contractId', { required: true })}

                                    className="w-full p-2 rounded-md placeholder:pl-2" />
                            </div>
                        </div>
                        <div className="flex gap-10 my-5">
                            <div className="flex-1">
                                <label className="label">
                                    <span className="label-text text-xl font-semibold">Registration ID*</span>
                                </label>
                                <input
                                    type="text"
                                    placeholder="Enter Registration Id"
                                    {...register('regId', { required: true })}
                                    className="w-full p-2 rounded-md placeholder:pl-2" />
                            </div>
                            <div className="flex-1">
                                <label className="label">
                                    <span className="label-text text-xl font-semibold">Registration Date*</span>
                                </label>
                                <input
                                    type="date"
                                    placeholder="Enter Registration Date"
                                    {...register('regDate', { required: true })}
                                    className="w-full p-2 rounded-md placeholder:pl-2" />
                            </div>
                        </div>
                        <div className="flex gap-10 my-5">
                            <div className="flex-1">
                                <label className="label">
                                    <span className="label-text text-xl font-semibold">TIN ID*</span>
                                </label>
                                <input
                                    type="text"
                                    placeholder="Enter TIN Id"
                                    {...register('tinId', { required: true })}
                                    required
                                    className="w-full p-2 rounded-md placeholder:pl-2" />
                            </div>
                            <div className="flex-1">
                                <label className="label">
                                    <span className="label-text text-xl font-semibold">Contract Number*</span>
                                </label>
                                <input
                                    type="text"
                                    placeholder="Enter Contract Number"
                                    {...register('contractNumber', { required: true })}
                                    required
                                    className="w-full p-2 rounded-md placeholder:pl-2" />
                            </div>
                        </div>
                        <div className="flex gap-10 my-5">
                            <div className="flex-1">
                                <label className="label">
                                    <span className="label-text text-xl font-semibold">Workforce Size*</span>
                                </label>
                                <input
                                    type="number"
                                    placeholder="Enter workforce size"
                                    {...register('workforceSize', { required: true })}
                                    required
                                    className="w-full p-2 rounded-md placeholder:pl-2" />
                            </div>
                            <div className="flex-1">
                                <label className="label">
                                    <span className="label-text text-xl font-semibold">Payment (Per Tones)*</span>
                                </label>
                                <input
                                    type="number"
                                    placeholder="Enter Payment Amount"
                                    {...register('payment', { required: true })}
                                    required
                                    className="w-full p-2 rounded-md placeholder:pl-2" />
                            </div>
                        </div>
                        <div className="flex gap-10 my-5">
                            <div className="flex-1">
                                <label className="label">
                                    <span className="label-text text-xl font-semibold">Required Waste (Per Day)*</span>
                                </label>
                                <input
                                    type="number"
                                    placeholder="Enter workforce size"
                                    {...register('requiredWastePerDay', { required: true })}
                                    required
                                    className="w-full p-2 rounded-md placeholder:pl-2" />
                            </div>
                            <div className="flex-1">
                                <label className="label">
                                    <span className="label-text text-xl font-semibold">Contract Durations*</span>
                                </label>
                                <input
                                    type="number"
                                    placeholder="Enter Contract Duration"
                                    {...register('cotractDuration', { required: true })}
                                    required
                                    className="w-full p-2 rounded-md placeholder:pl-2" />
                            </div>
                        </div>
                        <div className="flex gap-10 my-5">
                            <div className="flex-1">
                                <label className="label">
                                    <span className="label-text text-xl font-semibold">Area of Collections*</span>
                                </label>
                                <input
                                    type="text"
                                    placeholder="Enter Collection Area"
                                    {...register('areaOfCollection', { required: true })}
                                    required
                                    className="w-full p-2 rounded-md placeholder:pl-2" />
                            </div>
                            <div className="flex-1">
                                <label className="label">
                                    <span className="label-text text-xl font-semibold">Select a Sts Name*</span>
                                </label>
                                <select defaultValue="default"
                                    {...register('stsName', { required: true })}
                                    className="w-full py-2 rounded-md">
                                    <option disabled value="default">Select Sts Name</option>
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

export default AddNewContractor;