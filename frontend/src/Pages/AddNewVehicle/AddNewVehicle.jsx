import { Helmet } from "react-helmet-async";
import { useForm } from "react-hook-form";
import useAxiosPublic from "../../Hooks/useAxiosPublic";
import Swal from "sweetalert2";
import SectionTitle from "../../Components/SectionTitle";
import GetAllSts from "../../Hooks/GetAllSts";
import { useState } from "react";

const AddNewVehicle = () => {
    const { register, handleSubmit, reset } = useForm();
    let axiosPublic = useAxiosPublic();
    let [allStsCollection] = GetAllSts();
    let [capacity, setCapacity] = useState(3);


    let handleTruckChange = (event) => {
        if (event.target.value === "Open Truck") {
            setCapacity(3);
        }
        else if (event.target.value === "Dump Truck") {
            setCapacity(5);
        }
        else if (event.target.value === "Compactor") {
            setCapacity(7);
        }
        else if (event.target.value === "Container Carrier") {
            setCapacity(15);
        }
    }

    const onSubmit = async (data) => {

        const vehicleInfo = {
            vehicleRegNum: data.vehicleRegNum,
            type: data.type,
            capacity: parseInt(capacity),
            fualCostLoaded: parseInt(data.fualCostLoaded),
            fualCostUnloaded: parseInt(data.fualCostUnloaded),
            stsName: data.stsName,
            assigned: true
        };
        let res = await axiosPublic.post('/create-vehicles', vehicleInfo);
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
                <title>EcoSync | Add Vehicle</title>
            </Helmet>
            <SectionTitle title={"Add New Vehicle"} subTitle={'Need Transportations?'}></SectionTitle>
            <div>
                <div className="w-full md:w-10/12 mx-auto my-10 px-2">
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="flex gap-10">
                            <div className="flex-1">
                                <label className="label">
                                    <span className="label-text text-xl font-semibold">Reg No.*</span>
                                </label>
                                <input
                                    type="text"
                                    placeholder="Enter Registration Number"
                                    {...register('vehicleRegNum', { required: true })}

                                    className="w-full p-2 rounded-md placeholder:pl-2" />
                            </div>
                            <div className="flex-1">
                                <label className="label">
                                    <span className="label-text text-xl font-semibold">Truck Type*</span>
                                </label>
                                <select
                                    defaultValue="default"
                                    {...register('type', { required: true })}
                                    onChange={handleTruckChange}
                                    className="w-full py-2 rounded-md"
                                >
                                    <option disabled value="null">Select Type</option>
                                    <option value="Open Truck">Open Truck</option>
                                    <option value="Dump Truck">Dump Truck</option>
                                    <option value="Compactor">Compactor</option>
                                    <option value="Container Carrier">Container Carrier</option>
                                </select>
                            </div>
                        </div>
                        <div className="flex gap-10 my-5">
                            <div className="flex-1">
                                <label className="label">
                                    <span className="label-text text-xl font-semibold">Truck Capacity*</span>
                                </label>
                                <input
                                    type="text"
                                    readOnly
                                    value={capacity}
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
                        <div className="flex gap-10 my-5">
                            <div className="flex-1">
                                <label className="label">
                                    <span className="label-text text-xl font-semibold">Fual Cost (Loaded)*</span>
                                </label>
                                <input
                                    type="text"
                                    placeholder="Enter Fual Cost (Loaded)"
                                    {...register('fualCostLoaded', { required: true })}
                                    required
                                    className="w-full p-2 rounded-md placeholder:pl-2" />
                            </div>
                            <div className="flex-1">
                                <label className="label">
                                    <span className="label-text text-xl font-semibold">Fual Cost (UnLoaded)*</span>
                                </label>
                                <input
                                    type="text"
                                    placeholder="Enter Fual Cost (UnLoaded)"
                                    {...register('fualCostUnloaded', { required: true })}
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

export default AddNewVehicle;