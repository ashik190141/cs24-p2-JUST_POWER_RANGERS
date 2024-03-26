import { useQuery } from "@tanstack/react-query";
import { Helmet } from "react-helmet-async";
import Swal from "sweetalert2";
import useAxiosPublic from "../../Hooks/useAxiosPublic";
import { useNavigate } from "react-router-dom";


const ManageUser = () => {
    let axiosPublic = useAxiosPublic();
    let navigate = useNavigate();

    const { data: allUser = [], refetch } = useQuery({
        queryKey: ['allUser'],
        queryFn: async () => {
            const res = await axiosPublic.get('/users');
            return res.data;
        }
    });
    console.log(allUser);

    let HandleDeleteUser = (id) => {
        Swal.fire({
            title: "Are you sure to delete user?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, Delete!"
        }).then(async(result) => {
            if (result.isConfirmed) {
                let res =await axiosPublic.delete(`/users/${id}`)
                console.log(res.data);
                if (res.data.deletedCount > 0) {
                    Swal.fire({
                        title: "Deleted!",
                        text: "User has been deleted.",
                        icon: "success"
                      });
                    refetch();
                }else{
                    Swal.fire({
                        icon: 'error',
                        title: "Unsuccessful",
                        showConfirmButton: false,
                        timer: 2000
                    })
                }
            }
        });
    };

    return (
        <div className="w-11/12 mx-auto my-10">
            <Helmet>
                <title>Dust Master | Manage User</title>
            </Helmet>
            <table className="w-full min-w-max table-auto text-left">
                <thead>
                    <tr className="">
                        <th className="border-b border-blue-gray-100 bg-blue-gray-50">Index</th>
                        <th className="border-b border-blue-gray-100 bg-blue-gray-50">User Name</th>
                        <th className="border-b border-blue-gray-100 bg-blue-gray-50">User Email</th>
                        <th className="border-b border-blue-gray-100 bg-blue-gray-50">Role</th>
                        <th className="border-b border-blue-gray-100 bg-blue-gray-50">Details</th>
                        <th className="border-b border-blue-gray-100 bg-blue-gray-50">Delete User</th>
                    </tr>
                </thead>
                <tbody>
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
                                    See Details</button>
                            </td>
                            <th className="p-4 border-b border-blue-gray-50">
                                <button className="bg-red-600 text-white rounded-md px-4 py-2"
                                    onClick={() => HandleDeleteUser(item?._id)}>Delete User</button></th>
                        </tr>
                        )}
                </tbody>
            </table>
        </div>
    )
}
export default ManageUser;