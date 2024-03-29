import { Helmet } from "react-helmet-async";
import { useForm } from "react-hook-form";
import useAxiosPublic from "../../Hooks/useAxiosPublic";
import Swal from "sweetalert2";
import SectionTitle from "../../Components/SectionTitle";

const AddNewSts = () => {
    const { register, handleSubmit, reset } = useForm();
    let axiosPublic = useAxiosPublic();

    const onSubmit = async (data) => {

        const stsInfo = {
            name: data.stsName,
            wardNumber: data.wardNumber,
            capacity: parseInt(data.capacity),
            coordinate: data.coordinate,
        };
        let res = await axiosPublic.post('/create-sts', stsInfo);
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
                <title>Dust Master | Add Sts</title>
            </Helmet>
            <SectionTitle title={"Add New Sts"} subTitle={'More Waste in City?'}></SectionTitle>
            <div>
                <div className="w-10/12 mx-auto my-10">
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="flex gap-10 my-8">
                            <div className="flex-1">
                                <label className="label">
                                    <span className="label-text text-xl font-semibold">Sts Name*</span>
                                </label>
                                <input
                                    type="text"
                                    placeholder="Enter Sts Name"
                                    {...register('stsName', { required: true })}

                                    className="w-full p-2 rounded-md placeholder:pl-2" />
                            </div>
                            <div className="flex-1">
                                <label className="label">
                                    <span className="label-text text-xl font-semibold">Ward number</span>
                                </label>
                                <input
                                    type="text"
                                    placeholder="Enter Ward Number"
                                    {...register('wardNumber', { required: true })}

                                    className="w-full p-2 rounded-md placeholder:pl-2" />
                            </div>

                        </div>
                        <div className="flex gap-10 my-8">
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
                            <div className="flex-1">
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

export default AddNewSts;