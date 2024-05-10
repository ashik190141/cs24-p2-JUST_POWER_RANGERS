import { useForm } from "react-hook-form";
import { useState } from "react";
import useAxiosPublic from "../../Hooks/useAxiosPublic";
import Swal from "sweetalert2";
import SectionTitle from "../../Components/SectionTitle";
import { Helmet } from "react-helmet-async";
import TimePicker from "react-time-picker";
import useAuth from "../../Hooks/useAuth";


const CollectionPlan = () => {
    const { register, handleSubmit, reset } = useForm();
    let {user} = useAuth();

    let [time, setTime] = useState('00:00');
    let axiosPublic = useAxiosPublic();

    const onSubmit = async (data) => {
        const collectionPLan = {
            startTime: time,
            area: data.area,
            duration: data?.duration,
            laborers: data.laborers,
            vans: data.vans,
            expectedWaste: data.expectedWaste,
            email: user?.email
        };
        console.log(collectionPLan);
        let res = await axiosPublic.post('/collection-plan', collectionPLan);
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
                <title>EcoSync | Collection Plan</title>
            </Helmet>
            <SectionTitle title={"Collection Plan"} subTitle={'Need Idea?'}></SectionTitle>

            <div className="w-full md:w-10/12 mx-auto my-10 px-2">
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="flex gap-10">
                        <div className="flex-1">
                            <label className="label">
                                <span className="label-text text-xl font-semibold">Area Of Collection*</span>
                            </label>
                            <input
                                type="text"
                                placeholder="Enter Collection Area"
                                {...register('area', { required: true })}

                                className="w-full p-2 rounded-md placeholder:pl-2" />
                        </div>
                        <div className="flex-1">
                            <label className="label">
                                <span className="label-text text-xl font-semibold">
                                    Collection Start Time
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
                                <span className="label-text text-xl font-semibold">Duration For Collection</span>
                            </label>
                            <input
                                type="number"
                                placeholder="Enter collection duration"
                                {...register('duration', { required: true })}
                                className="w-full p-2 rounded-md placeholder:pl-2" />
                        </div>
                        <div className="flex-1">
                            <label className="label">
                                <span className="label-text text-xl font-semibold">Number of Laborers</span>
                            </label>
                            <input
                                type="number"
                                placeholder="Enter Number of Laborers"
                                {...register('laborers', { required: true })}
                                className="w-full p-2 rounded-md placeholder:pl-2" />
                        </div>
                    </div>
                    <div className="flex gap-10 my-5">
                        <div className="flex-1">
                            <label className="label">
                                <span className="label-text text-xl font-semibold">Number of Vans</span>
                            </label>
                            <input
                                type="number"
                                placeholder="Enter Number of Vans"
                                {...register('vans', { required: true })}
                                className="w-full p-2 rounded-md placeholder:pl-2" />
                        </div>
                        <div className="flex-1">
                            <label className="label">
                                <span className="label-text text-xl font-semibold">Expected Waste (Per Day)</span>
                            </label>
                            <input
                                type="number"
                                placeholder="Enter Expected Waste"
                                {...register('expectedWaste', { required: true })}
                                className="w-full p-2 rounded-md placeholder:pl-2" />
                        </div>
                    </div>

                    <button
                        className="bg-green-800 px-4 py-2 rounded-md text-white"
                        type="submit">
                        Create New User!
                    </button>
                </form>
            </div>

        </div>
    );
};

export default CollectionPlan;