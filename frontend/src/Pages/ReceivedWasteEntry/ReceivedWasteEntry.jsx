import { useForm } from "react-hook-form";
import useAxiosPublic from "../../Hooks/useAxiosPublic";
import Swal from "sweetalert2";
import { Helmet } from "react-helmet-async";
import SectionTitle from "../../Components/SectionTitle";
import TimePicker from "react-time-picker";
import { useState } from "react";
import GetMyConstructor from "../../Hooks/GetMyConstructor";
import GetMyStsInfo from "../../Hooks/GetMyStsInfo";


const ReceivedWasteEntry = () => {
    const { register, handleSubmit, reset } = useForm();
    let [allConstractors, isPending] = GetMyConstructor();
    let [stsId] = GetMyStsInfo();

    let [time, setTime] = useState('00:00');
    let axiosPublic = useAxiosPublic();

    const onSubmit = async (data) => {
        const receivedWaste = {
            date: data.date,
            arrivedTime: time,
            wasteAmount: data.wasteAmount,
            constructorId:data?.constructorId,
            wasteType: data.wasteType,
            stsId: stsId?.wardNumber,
            vehicleType: data.vehicleType,
        };
        console.log(receivedWaste);
        let res = await axiosPublic.post('/received-waste', receivedWaste);
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
                <title>EcoSync | Received Waste</title>
            </Helmet>
            <SectionTitle title={"Received Waste"} subTitle={'More waste?'}></SectionTitle>
            {
                isPending ? <>
                    <div className="text-center h-screen">
                        <span className="loading loading-spinner loading-lg"></span>
                    </div>
                </> : <>
                    <div className="w-full md:w-10/12 mx-auto my-10 px-2">
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <div className="flex gap-10">
                                <div className="flex-1">
                                    <label className="label">
                                        <span className="label-text text-xl font-semibold">Waste Arrival Date*</span>
                                    </label>
                                    <input
                                        type="date"
                                        placeholder="Enter User Email"
                                        {...register('date', { required: true })}

                                        className="w-full p-2 rounded-md placeholder:pl-2" />
                                </div>
                                <div className="flex-1">
                                    <label className="label">
                                        <span className="label-text text-xl font-semibold">
                                            Time to Arrival Waste
                                        </span>
                                    </label>
                                    <div className="w-full p-2">
                                        <TimePicker
                                            className={"w-1/2"}
                                            onChange={setTime}
                                            value={time}
                                        />
                                    </div>
                                </div>

                            </div>
                            <div className="flex gap-10 my-5">
                                <div className="flex-1">
                                    <label className="label">
                                        <span className="label-text text-xl font-semibold">Waste Ammount (Kg)</span>
                                    </label>
                                    <input
                                        type="number"
                                        placeholder="Enter Amount of Waste"
                                        {...register('wasteAmount', { required: true })}
                                        className="w-full p-2 rounded-md placeholder:pl-2" />
                                </div>
                                <div className="flex-1">
                                    <label className="label">
                                        <span className="label-text text-xl font-semibold">Contractor Id</span>
                                    </label>
                                    <select
                                        defaultValue="default"
                                        {...register('constructorId', { required: true })}
                                        className="w-full py-2 rounded-md">
                                        <option disabled value="default">Select Type</option>
                                        {
                                            allConstractors?.map((constactor, index) =>
                                                <option key={index} value={constactor?.contractId}>
                                                    {constactor?.contractId}</option>
                                            )
                                        }
                                    </select>
                                </div>
                            </div>
                            <div className="flex gap-10 my-5">
                                <div className="flex-1">
                                    <label className="label">
                                        <span className="label-text text-xl font-semibold">Type of Waste</span>
                                    </label>
                                    <select
                                        defaultValue="default"
                                        {...register('wasteType', { required: true })}
                                        className="w-full py-2 rounded-md">
                                        <option disabled value="default">Select Type</option>
                                        <option value={'domestic'}>Domestic</option>
                                        <option value={'plastic'}>Plastic</option>
                                        <option value={'constructive'}>Constructive</option>
                                    </select>
                                </div>
                                <div className="flex-1">
                                    <label className="label">
                                        <span className="label-text text-xl font-semibold">Designated STS</span>
                                    </label>
                                    <input
                                        type="text"
                                        defaultValue={stsId?.name}
                                        readOnly
                                        {...register('designatedSts', { required: true })}
                                        className="w-full p-2 rounded-md placeholder:pl-2" />
                                </div>
                            </div>
                            <div className="flex gap-10 my-5">
                                <div className="flex-1">
                                    <label className="label">
                                        <span className="label-text text-xl font-semibold">Vehicle Type</span>
                                    </label>
                                    <select
                                        defaultValue="default"
                                        {...register('vehicleType', { required: true })}
                                        className="w-full md:w-[508px] py-2 rounded-md">
                                        <option disabled value="default">Select Type</option>
                                        <option value={'van'}>Van</option>
                                        <option value={'mini-truck'}>Mini Truck</option>
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
                </>
            }
        </div>
    );
};

export default ReceivedWasteEntry;