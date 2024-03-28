import { Helmet } from "react-helmet-async";
import { useForm } from "react-hook-form";
import useAxiosPublic from "../../Hooks/useAxiosPublic";
import Swal from "sweetalert2";
import { useState } from "react";
import 'react-time-picker/dist/TimePicker.css';
import 'react-clock/dist/Clock.css';
import TimePicker from 'react-time-picker';
import SectionTitle from "../../Components/SectionTitle";

const AddNewLandFill = () => {
    const { register, handleSubmit, reset } = useForm();
    let axiosPublic = useAxiosPublic();
    const [startValue, setStartValue] = useState('00:00');
    const [endValue, setEndValue] = useState('00:00');

    const onSubmit = async (data) => {

        const landFillInfo = {
            name: data.landfillName,
            capacity: parseInt(data.capacity),
            coordinate: data.coordinate,
            startTime: startValue,
            endTime: endValue,
        };
        let res = await axiosPublic.post('/create-landfill', landFillInfo);
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
                <title>Dust Master | Add Landfill</title>
            </Helmet>
            <SectionTitle title={"Add New Landfill"} subTitle={'More Waste?'}></SectionTitle>
            <div>
                <div className="w-10/12 mx-auto my-10">
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="flex gap-10 my-8">
                            <div className="flex-1">
                                <label className="label">
                                    <span className="label-text text-xl font-semibold">Landfill Name*</span>
                                </label>
                                <input
                                    type="text"
                                    placeholder="Enter Landfill Name"
                                    {...register('landfillName', { required: true })}

                                    className="w-full p-2 rounded-md placeholder:pl-2" />
                            </div>
                            <div className="flex-1">
                                <label className="label">
                                    <span className="label-text text-xl font-semibold">Waste Capacity</span>
                                </label>
                                <input
                                    type="text"
                                    placeholder="Enter Waste Capacity"
                                    {...register('capacity', { required: true })}

                                    className="w-full p-2 rounded-md placeholder:pl-2" />
                            </div>

                        </div>
                        <div className="my-8">
                            <label className="label">
                                <span className="label-text text-xl font-semibold">GPS Coordinates*</span>
                            </label>
                            <input
                                type="text"
                                placeholder="Enter GPS coordinates"
                                {...register('coordinate', { required: true })}
                                required
                                className="w-[508px] p-2 rounded-md placeholder:pl-2" />
                        </div>
                        <div className="flex gap-10 my-8">
                            <div className="flex-1">
                                <label className="label">
                                    <span className="label-text text-xl font-semibold">Landfill Start Time</span>
                                </label>
                                <div className="w-full">
                                    <TimePicker className={'w-1/2'} onChange={setStartValue} value={startValue} />
                                </div>
                            </div>
                            <div className="flex-1">
                                <label className="label">
                                    <span className="label-text text-xl font-semibold">Landfill End Time</span>
                                </label>
                                <div className="w-full">
                                    <TimePicker className={'w-1/2'} onChange={setEndValue} value={endValue} />
                                </div>
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

export default AddNewLandFill;