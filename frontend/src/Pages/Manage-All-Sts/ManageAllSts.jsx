import { Helmet } from "react-helmet-async";
import GetAllSts from "../../Hooks/GetAllSts";
import SectionTitle from "../../Components/SectionTitle";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";


const ManageAllSts = () => {
    let [allSts, isStsLoading, refetch] = GetAllSts();
    let navigate = useNavigate();

    let HandleDeleteSts = (id) =>{
        console.log(id)
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire(
                    'Deleted!',
                    'Your file has been deleted.',
                   'success'
                )
                refetch();
            }
        })

    }

    return (
        <div className="w-11/12 mx-auto my-5">
            <Helmet>
                <title>EcoSync | Manage Sts</title>
            </Helmet>
            <SectionTitle title={"Manage Sts"} subTitle={'Sts Update?'}></SectionTitle>
            {
                isStsLoading ? <>
                    <div className="text-center h-screen">
                        <span className="loading loading-spinner loading-lg"></span>
                    </div>
                </> : <>
                    <div className="mt-10">
                        <table className="w-full min-w-max table-auto text-left">
                            <thead>
                                <tr className="">
                                    <th className="border-b border-blue-gray-100 bg-blue-gray-50">Index</th>
                                    <th className="border-b border-blue-gray-100 bg-blue-gray-50">Sts Name</th>
                                    <th className="border-b border-blue-gray-100 bg-blue-gray-50">Word Number</th>
                                    <th className="border-b border-blue-gray-100 bg-blue-gray-50">Capacity</th>
                                    <th className="border-b border-blue-gray-100 bg-blue-gray-50">Location</th>
                                    <th className="border-b border-blue-gray-100 bg-blue-gray-50">Update Sts</th>
                                    <th className="border-b border-blue-gray-100 bg-blue-gray-50">Delete Sts</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    allSts?.map((item, index) => <tr key={item?._id}>
                                        <th className="p-4 border-b border-blue-gray-50">{index + 1}</th>
                                        <td className=" border-b border-blue-gray-50">
                                            {item?.name}
                                        </td>
                                        <td className="p-4 border-b border-blue-gray-50">
                                            {item?.wardNumber}
                                        </td>
                                        <td className="p-4 border-b border-blue-gray-50">
                                            {item?.capacity}
                                        </td>
                                        <td className="p-4 border-b border-blue-gray-50">
                                                {item?.name}
                                        </td>
                                        <th className="p-4 border-b border-blue-gray-50">
                                            <button className="bg-blue-800 text-white rounded-md px-4 py-2"
                                                onClick={() => navigate(`/update-sts/${item?._id}`)}>
                                                Update</button>
                                        </th>
                                        <th className="p-4 border-b border-blue-gray-50">
                                            <button className="bg-red-600 text-white rounded-md px-4 py-2"
                                                onClick={() => HandleDeleteSts(item?._id)}>Delete</button>
                                        </th>
                                    </tr>
                                    )}
                            </tbody>
                        </table>
                    </div>
                </>
            }
        </div>
    );
};

export default ManageAllSts;