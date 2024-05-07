import { Helmet } from "react-helmet-async";
import Swal from "sweetalert2";
import useAxiosPublic from "../../Hooks/useAxiosPublic";
import { useNavigate } from "react-router-dom";
import SectionTitle from "../../Components/SectionTitle";
import GetAllUsers from "../../Hooks/GetAllUsers";


const ManageUser = () => {
    let axiosPublic = useAxiosPublic();
    let navigate = useNavigate();
    let [allUser, isPending, refetch] = GetAllUsers();

    let HandleDeleteUser = (id) => {
        Swal.fire({
            title: "Are you sure to delete user?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, Delete!"
        }).then(async (result) => {
            if (result.isConfirmed) {
                let res = await axiosPublic.delete(`/users/${id}`)
                if (res.data.result) {
                    Swal.fire({
                        title: "Deleted!",
                        text: "User has been deleted.",
                        icon: "success"
                    });
                    refetch();
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: "Deleted Unsuccessful",
                        showConfirmButton: false,
                        timer: 2000
                    })
                }
            }
        });
    };

    return (
        <div className="w-full">
            <Helmet>
                <title>EcoSync | Manage User</title>
            </Helmet>
            <SectionTitle title={"Manage Users"} subTitle={'User Update?'}></SectionTitle>
            {
                isPending ? <>
                    <div className="text-center h-screen">
                        <span className="loading loading-spinner loading-lg"></span>
                    </div>
                </> : <>
                    <div className="my-10 w-full mx-auto px-2 md:px-10 max-w-[425px] md:max-w-full overflow-x-auto">
                        <table className="table table-zebra">
                            <thead>
                                <tr className="text-center">
                                    <th className="border-b border-blue-gray-100 bg-blue-gray-50">Index</th>
                                    <th className="border-b border-blue-gray-100 bg-blue-gray-50">User Name</th>
                                    <th className="border-b border-blue-gray-100 bg-blue-gray-50">User Email</th>
                                    <th className="border-b border-blue-gray-100 bg-blue-gray-50">Role</th>
                                    <th className="border-b border-blue-gray-100 bg-blue-gray-50">Change Role</th>
                                    <th className="border-b border-blue-gray-100 bg-blue-gray-50">Update User</th>
                                    <th className="border-b border-blue-gray-100 bg-blue-gray-50">Delete User</th>
                                </tr>
                            </thead>
                            <tbody className="text-center">
                                {
                                    allUser?.map((item, index) => <tr key={item?._id}>
                                        <th className="p-4 border-b border-blue-gray-50">{index + 1}</th>
                                        <td className=" border-b border-blue-gray-50">
                                            {item?.userName}
                                        </td>
                                        <td className="p-4 border-b border-blue-gray-50">
                                            {item?.email}
                                        </td>
                                        <td className="p-4 border-b border-blue-gray-50">
                                            {item?.role}
                                        </td>
                                        <td className="p-4 border-b border-blue-gray-50">
                                            <button className="bg-green-600 text-white rounded-md px-4 py-2"
                                                onClick={() => navigate(`/dashboard/users/${item?._id}`)}>
                                                Change Role</button>
                                        </td>
                                        <th className="p-4 border-b border-blue-gray-50">
                                            <button className="bg-blue-800 text-white rounded-md px-4 py-2"
                                                onClick={() => navigate(`/update/${item?._id}`)}>
                                                Update User</button>
                                        </th>
                                        <th className="p-2 md:p-4 border-b border-blue-gray-50">
                                            <button className="bg-red-600 text-white rounded-md px-4 py-2"
                                                onClick={() => HandleDeleteUser(item?._id)}>Delete User</button>
                                        </th>
                                    </tr>
                                    )}
                            </tbody>
                        </table>
                    </div>
    
                </>
            }
        </div>
    )
}
export default ManageUser;