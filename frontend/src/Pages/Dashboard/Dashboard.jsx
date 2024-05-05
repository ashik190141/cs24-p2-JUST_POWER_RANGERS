import { NavLink, Outlet } from 'react-router-dom';
import { FaDatabase, FaDumpster, FaEdit, FaHome, FaInfo, FaMale, FaMap, FaPlaceOfWorship, FaTasks, FaTruck, FaUsers } from 'react-icons/fa';
import Navbar from '../../Components/Navbar';
import Footer from '../../Components/Footer';
import Permission from '../../Hooks/Permission';
import useAuth from '../../Hooks/useAuth';


const Dashboard = () => {
    let [userRole] = Permission();
    let {user} = useAuth();

    return (
        <div className='max-w-screen-2xl mx-auto min-h-screen sm:px-4 md:px-0 bg-base-300'>
            <Navbar></Navbar>
            <div className="max-w-full mx-auto flex">
                <div className="w-64 h-screen bg-[#092111] text-white sticky top-0">
                    <div className='text-center my-5'>
                        <h1 className='text-3xl font-bold'>EcoSync</h1>
                        <p className='text-xl'>Web App</p>
                    </div>

                    {
                        userRole === "System Admin" && <>
                            <ul className='menu flex flex-col mt-8 px-6 space-y-3'>
                                <li >
                                    <NavLink className='flex items-center font-bold gap-2'
                                        to='admin-home' >
                                        <FaHome></FaHome>Admin Home</NavLink>
                                </li>
                                <li >
                                    <NavLink className='flex items-center font-bold gap-2'
                                        to='create-user' >
                                        <FaMale></FaMale>Add New User</NavLink>
                                </li>
                                <li >
                                    <NavLink className='flex items-center font-bold gap-2'
                                        to='create-role' >
                                        <FaTasks />Add New Role</NavLink>
                                </li>
                                <li >
                                    <NavLink className='flex items-center font-bold gap-2'
                                        to='add-vehicle' >
                                        <FaTruck></FaTruck>Add Vehicle</NavLink>
                                </li>

                                <li >
                                    <NavLink className='flex items-center font-bold gap-2'
                                        to='create-sts' >
                                        <FaPlaceOfWorship></FaPlaceOfWorship>Add New STS</NavLink>
                                </li>
                                <li >
                                    <NavLink className='flex items-center font-bold gap-2'
                                        to='create-landfill' >
                                        <FaPlaceOfWorship></FaPlaceOfWorship>Add New Landfill</NavLink>
                                </li>
                                <li >
                                    <NavLink className='flex items-center font-bold gap-2'
                                        to='manage-user' >
                                        <FaUsers></FaUsers>Manage User</NavLink>
                                </li>
                                <li >
                                    <NavLink className='flex items-center font-bold gap-2'
                                        to='all-user-info' >
                                        <FaInfo></FaInfo>User Info</NavLink>
                                </li>
                                <li >
                                    <NavLink className='flex items-center font-bold gap-2'
                                        to='manage-all-sts' >
                                        <FaMap></FaMap>Manage All Sts</NavLink>
                                </li>
                                <li >
                                    <NavLink className='flex items-center font-bold gap-2'
                                        to='manage-all-landfill' >
                                        <FaDumpster></FaDumpster>Manage All Landfill</NavLink>
                                </li>
                            </ul>
                        </>
                    }
                    {
                        userRole === "Sts Manager" && <>
                            <ul className='flex flex-col mt-10 px-6 space-y-3'>
                                <li >
                                    <NavLink className='flex items-center font-bold gap-2'
                                        to='data-entry-sts-manager' >
                                        <FaDatabase></FaDatabase>Data Entry</NavLink>
                                </li>
                                <li >
                                    <NavLink className='flex items-center font-bold gap-2'
                                        to='view-routes' >
                                        <FaMap></FaMap>View Optimize Route</NavLink>
                                </li>
                                <li>
                                    <NavLink
                                        className="flex items-center font-bold gap-2"
                                        to={`min-vehicle-and-cost/${user?.email}`}>
                                        <FaTruck></FaTruck>Minimum Vehicle
                                    </NavLink>
                                </li>
                            </ul>
                        </>
                    }
                    {
                        userRole === "Land Manager" && <>
                            <ul className='flex flex-col mt-10 px-6 space-y-3'>
                                <li >
                                    <NavLink className='flex items-center font-bold gap-2'
                                        to='land-data-entry' >
                                        <FaEdit></FaEdit>Land Data Entry</NavLink>
                                </li>
                            </ul>
                        </>
                    }

                </div>
                <div className="flex-1 bg-base-300">
                    <Outlet></Outlet>
                </div>

            </div>
            <Footer></Footer>
        </div>
    )
}
export default Dashboard;