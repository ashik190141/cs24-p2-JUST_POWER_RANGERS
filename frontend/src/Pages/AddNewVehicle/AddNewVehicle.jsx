import { Helmet } from "react-helmet-async";
import { useForm } from "react-hook-form";
import useAxiosPublic from "../../Hooks/useAxiosPublic";
import Swal from "sweetalert2";
// import useAxiosPublic from "../../Hooks/useAxiosPublic";

const AddNewVehicle = () => {
    const { register, handleSubmit, reset } = useForm();
    let axiosPublic = useAxiosPublic();

    const onSubmit = async (data) => {

        const vehicleInfo = {
            vehicleRegNum: data.vehicleRegNum,
            type: data.type,
            capacity: parseInt(data.capacity),
            fualCostLoaded: parseInt(data.fualCostLoaded),
            fualCostUnloaded: parseInt(data.fualCostUnloaded)
        };
        let res = await axiosPublic.post('/create-vehicles',vehicleInfo);
        if(res.data.result){
            Swal.fire({
                position: "top-middle",
                icon: "success",
                title: res.data.message,
                showConfirmButton: false,
                timer: 1500
            });
            reset();
        }else{
            Swal.fire({
                position: "top-middle",
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
                <title>Dust Master | Add Vehicle</title>
            </Helmet>
            <div>
                <div className="w-10/12 mx-auto my-10">
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="flex gap-10">
                            {/* "fualCostUnloaded":80 */}
                            <div className="flex-1">
                                <label className="label">
                                    <span className="label-text">Reg No.</span>
                                </label>
                                <input
                                    type="text"
                                    placeholder="Enter Registration Number"
                                    {...register('vehicleRegNum', { required: true })}

                                    className="w-full p-2 rounded-md placeholder:pl-2" />
                            </div>
                            <div className="flex-1">
                                <label className="label">
                                    <span className="label-text">Truck Type*</span>
                                </label>
                                <select defaultValue="default"
                                    {...register('type', { required: true })}
                                    className="w-full py-2 rounded-md">
                                    <option disabled value="default">Select Type</option>
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
                                    <span className="label-text">Truck Capacity*</span>
                                </label>
                                <select defaultValue="default"
                                    {...register('capacity', { required: true })}
                                    className="w-full py-2 rounded-md">
                                    <option disabled value="default">Select Capacity</option>
                                    <option value="3">3 Tones</option>
                                    <option value="5">5 Tones</option>
                                    <option value="7">7 Tones</option>

                                </select>
                            </div>
                            <div className="flex-1">
                                <label className="label">
                                    <span className="label-text">Fual Cost (Loaded)*</span>
                                </label>
                                <input
                                    type="text"
                                    placeholder="Enter Fual Cost (Loaded)"
                                    {...register('fualCostLoaded', { required: true })}
                                    required
                                    className="w-full p-2 rounded-md placeholder:pl-2" />
                            </div>
                        </div>
                        <div className="mb-8">
                            <label className="label">
                                <span className="label-text">Fual Cost (UnLoaded)*</span>
                            </label>
                            <input
                                type="text"
                                placeholder="Enter Fual Cost (UnLoaded)"
                                {...register('fualCostUnloaded', { required: true })}
                                required
                                className="w-[508px] p-2 rounded-md placeholder:pl-2" />
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