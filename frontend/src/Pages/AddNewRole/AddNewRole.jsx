import { Helmet } from "react-helmet-async";
import { useForm } from "react-hook-form";
import useAxiosPublic from "../../Hooks/useAxiosPublic";
import Swal from "sweetalert2";
import SectionTitle from "../../Components/SectionTitle";


const AddNewRole = () => {
    const { register, handleSubmit, reset } = useForm();
    let axiosPublic = useAxiosPublic();

    const onSubmit = async (data) => {

        const roleInfo = {
            roleName: data.roleName,
            allocate: parseInt(data.allocate)
        };
        let res = await axiosPublic.post('/rbac/roles', roleInfo);
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
                position: "center",
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
                <title>Dust Master | Add New Role</title>
            </Helmet>
            <SectionTitle title={"Add New Role"} subTitle={'Need More Worker?'}></SectionTitle>
            <div>
                <div className="w-10/12 mx-auto my-10">
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="flex gap-10 my-8">
                            <div className="flex-1">
                                <label className="label">
                                    <span className="label-text text-xl font-semibold">Role Name*</span>
                                </label>
                                <select
                                    defaultValue="unassigned"
                                    {...register('roleName', { required: true })}
                                    className="w-full py-2 rounded-md"
                                >
                                    <option disabled value="unassigned">Select User Role</option>
                                    <option value="Sts Manager">Sts Manager</option>
                                    <option value="Land Manager">Land Manager</option>
                                    <option value="Truck Driver">Truck Driver</option>
                                    <option value="Dust Collector">Dust Collector</option>
                                </select>
                            </div>
                            <div className="flex-1">
                                <label className="label">
                                    <span className="label-text text-xl font-semibold">Allocations number</span>
                                </label>
                                <input
                                    type="text"
                                    placeholder="Enter Number of Allocation "
                                    {...register('allocate', { required: true })}
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

export default AddNewRole;