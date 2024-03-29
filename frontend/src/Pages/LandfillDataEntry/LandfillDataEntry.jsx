import { Helmet } from "react-helmet-async";
import SectionTitle from "../../Components/SectionTitle";
import Swal from "sweetalert2";
import useAxiosPublic from "../../Hooks/useAxiosPublic";
import { useForm } from "react-hook-form";
import GetAllSts from "../../Hooks/GetAllSts";
import GetAllVehicle from "../../Hooks/GetAllVehicle";
import 'react-time-picker/dist/TimePicker.css';
import 'react-clock/dist/Clock.css';
import TimePicker from 'react-time-picker';
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import useAuth from "../../Hooks/useAuth";

const LandfillDataEntry = () => {
    const { register, handleSubmit, reset } = useForm();
    let axiosPublic = useAxiosPublic();
    let {user} = useAuth();
    let [allStsCollection] = GetAllSts();
    let [allVehicle] = GetAllVehicle();
    const [arrival, setArrival] = useState('00:00');
    const [departure, setDeparture] = useState('00:00');
    const [disable, setDisable] = useState(true);

    const { data: myLandfill } = useQuery({
        queryKey: ['mylandfill'],
        queryFn: async () => {
            const res = await axiosPublic.get(`/landfill-manager/${user.email}`);
            return res.data.message;
        }
    });
    console.log(myLandfill);


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
            setArrival('00:00');
            setDeparture('00:00');
            setDisable(false);
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
                <title>Dust Master | Land Manager Data Entry</title>
            </Helmet>
            <SectionTitle title={"Update Data"} subTitle={'Stay Updated?'}></SectionTitle>
            <div>
                <div className="w-10/12 mx-auto my-10">
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="flex gap-10">
                            <div className="flex-1">
                                <label className="label">
                                    <span className="label-text text-xl font-semibold">Sts Name</span>
                                </label>
                                <select defaultValue="default"
                                    {...register('stsName', { required: true })}
                                    className="w-full py-2 rounded-md">
                                    <option disabled value="default">Select a Sts</option>
                                    {
                                        allStsCollection?.map((sts) => {
                                            return (
                                                <option className="text-black" key={sts._id} value={sts?.name}>{sts?.name}</option>
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
                                    <option disabled value="default">Select a Vehicle</option>
                                    {
                                        allVehicle?.map((vehicle) => {
                                            return (
                                                <option className="text-black" key={vehicle?._id} value={vehicle?.vehicleRegNum
                                                }>{vehicle?.vehicleRegNum
                                                    }</option>
                                            )
                                        })
                                    }
                                </select>
                            </div>
                        </div>
                        <div className="flex gap-10 my-5">
                            <div className="flex-1">
                                <label className="label">
                                    <span className="label-text text-xl font-semibold">Landfill Name*</span>
                                </label>
                                <input
                                    type="text"
                                    value={myLandfill?.name}
                                    readOnly
                                    {...register('landName', { required: true })}
                                    className="w-full p-2 rounded-md placeholder:pl-2" />
                            </div>
                            <div className="flex-1">
                                <label className="label">
                                    <span className="label-text text-xl font-semibold">Weight of Waste</span>
                                </label>
                                <input
                                    type="text"
                                    placeholder="Weight of Waste"
                                    {...register('landName', { required: true })}
                                    className="w-full p-2 rounded-md placeholder:pl-2" />
                            </div>
                        </div>
                        <div className="flex gap-10 my-5">
                            <div className="flex-1">
                                <label className="label">
                                    <span className="label-text text-xl font-semibold">
                                        Truck Arrival Time
                                    </span>
                                </label>
                                <div className="w-full">
                                    <TimePicker
                                        className={"w-1/2"}
                                        onChange={setArrival}
                                        value={arrival}
                                    />
                                </div>
                            </div>
                            <div className="flex-1">
                                <label className="label">
                                    <span className="label-text text-xl font-semibold">
                                        Truck Departure Time
                                    </span>
                                </label>
                                <div className="w-full">
                                    <TimePicker
                                        className={"w-1/2"}
                                        onChange={setDeparture}
                                        value={departure}
                                    />
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
                <div className="w-10/12 mx-auto my-10">
                    <button
                        disabled={disable}
                        className="bg-blue-800 px-4 py-2 rounded-md text-white disabled:bg-gray-400"
                        type="submit">
                        Download Slip!
                    </button>
                </div>
            </div >
        </div>
    );
};

export default LandfillDataEntry;