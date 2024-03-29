import { useQuery } from "@tanstack/react-query";
import useAxiosPublic from "../../Hooks/useAxiosPublic";
import Swal from "sweetalert2";
import { useForm } from "react-hook-form";
import { Helmet } from "react-helmet-async";
import { useState } from "react";
import TimePicker from "react-time-picker";
import SectionTitle from "../../Components/SectionTitle";


const StsDataEntry = () => {
    let axiosPublic = useAxiosPublic();
    const { data: allSts = [] } = useQuery({
        queryKey: ['get-all-Sts'],
        queryFn: async () => {
            const res = await axiosPublic.get('/get-all-sts');
            return res.data;
        }
    });
    const { data: allVehicle = [] } = useQuery({
        queryKey: ['get-all-vehicle'],
        queryFn: async () => {
            const res = await axiosPublic.get('/get-all-vehicle');
            return res.data;
        }
    });


    const { register, handleSubmit, reset } = useForm();
    const [arrival, setArrival] = useState('00:00');
    const [departure, setDeparture] = useState('00:00');

    const onSubmit = async (data) => {

        const stsDataEntryInfo = {
            stsId: data.stsId,
            vehicleNum: data.vehicleNum,
            volumeWaste: parseInt(data.volumeWaste),
            arrival: arrival,
            departure: departure
        };
        let res = await axiosPublic.post('/create-entry-vehicles-leaving', stsDataEntryInfo);
        if (res.data.result) {
            Swal.fire({
                position: "top-middle",
                icon: "success",
                title: res.data.message,
                showConfirmButton: false,
                timer: 2000
            });
            reset();
        } else {
            Swal.fire({
                position: "top-middle",
                icon: "error",
                title: res.data.message,
                showConfirmButton: false,
                timer: 2000
            });
        }
    }

    return (
        <div>
            <Helmet>
                <title>Dust Master | Sts Data Entry</title>
            </Helmet>
            <SectionTitle title={"Entry Updated Data"} subTitle={'Get Up to date'}></SectionTitle>
            <div>
                <div className="w-10/12 mx-auto my-10">
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="flex gap-10">
                            <div className="flex-1">
                                <label className="label">
                                    <span className="label-text text-xl font-semibold">Sts Id (Ward Number)</span>
                                </label>
                                <select defaultValue="default"
                                    {...register('stsId', { required: true })}
                                    className="w-full py-2 rounded-md">
                                    <option disabled value="default">Select Type</option>
                                    {
                                        allSts?.map((sts, index) => {
                                            return (
                                                <option className="text-black" key={index} value={sts?.wardNumber}>{sts?.wardNumber}</option>
                                            )
                                        })
                                    }
                                </select>
                            </div>
                            <div className="flex-1">
                                <label className="label">
                                    <span className="label-text text-xl font-semibold">Vehicle Number</span>
                                </label>
                                <select defaultValue="default"
                                    {...register('vehicleNum', { required: true })}
                                    className="w-full py-2 rounded-md">
                                    <option disabled value="default">Select Type</option>
                                    {
                                        allVehicle?.map((sts, index) => {
                                            return (
                                                <option className="text-black" key={index} value={sts?.vehicleRegNum}>{sts?.vehicleRegNum}</option>
                                            )
                                        })
                                    }
                                </select>
                            </div>
                        </div>

                        <div className="flex gap-10 my-8">
                            <div className="flex-1">
                                <label className="label">
                                    <span className="label-text text-xl font-semibold">Time to Arrival</span>
                                </label>
                                <div className="w-full">
                                    <TimePicker className={'w-1/2'} onChange={setArrival} value={arrival} />
                                </div>
                            </div>
                            <div className="flex-1">
                                <label className="label">
                                    <span className="label-text text-xl font-semibold">Time to Departure</span>
                                </label>
                                <div className="w-full">
                                    <TimePicker className={'w-1/2'} onChange={setDeparture} value={departure} />
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-10 my-5">
                            <div className="flex-1">
                                <label className="label">
                                    <span className="label-text text-xl font-semibold">Weight of Waste*</span>
                                </label>
                                <input
                                    type="text"
                                    placeholder="Enter Weight of Waste"
                                    {...register('volumeWaste', { required: true })}
                                    required
                                    className="w-[508px] p-2 rounded-md placeholder:pl-2" />
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

export default StsDataEntry;