import { NavLink, Outlet } from 'react-router-dom';
import { FaDatabase, FaDumpster, FaEdit, FaHome, FaInfo, FaMale, FaMap, FaNetworkWired, FaPlaceOfWorship, FaTasks, FaTruck, FaUsers } from 'react-icons/fa';
import Navbar from '../../Components/Navbar';
import Footer from '../../Components/Footer';
import Permission from '../../Hooks/Permission';
import useAuth from '../../Hooks/useAuth';
import { CgProfile } from "react-icons/cg";
import { VscThreeBars } from "react-icons/vsc";
import { FcManager } from "react-icons/fc";

const Dashboard = () => {
    let [userRole] = Permission();
    let { user } = useAuth();

    let systemAdmin = <>
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
                to='create-contractor' >
                <FaNetworkWired></FaNetworkWired>Add New Contarctor</NavLink>
        </li>
        <li >
            <NavLink className='flex items-center font-bold gap-2'
                to='create-contractor-manager' >
                <FcManager></FcManager>Add C.Manager</NavLink>
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
    </>
    let stsManager = <>
        <li >
            <NavLink className='flex items-center font-bold gap-2'
                to='my-sts-info' >
                <CgProfile ></CgProfile>My Sts Info</NavLink>
        </li>
        <li >
            <NavLink className='flex items-center font-bold gap-2'
                to='data-entry-sts-manager' >
                <FaDatabase></FaDatabase>Sts Data Entry</NavLink>
        </li>
        <li >
            <NavLink className='flex items-center font-bold gap-2'
                to='view-routes' >
                <FaMap></FaMap>View Route</NavLink>
        </li>
        <li>
            <NavLink
                className="flex items-center font-bold gap-2"
                to={`min-vehicle-and-cost/${user?.email}`}>
                <FaTruck></FaTruck>Minimum Cost
            </NavLink>
        </li>
    </>
    let landManager = <>
        <li >
            <NavLink className='flex items-center font-bold gap-2'
                to='my-landfill-info' >
                <CgProfile></CgProfile>My Landfill Info</NavLink>
        </li>
        <li >
            <NavLink className='flex items-center font-bold gap-2'
                to='land-data-entry' >
                <FaEdit></FaEdit>Land Data Entry</NavLink>
        </li>
    </>
    let ContractorManager = <>
        <li >
            <NavLink className='flex items-center font-bold gap-2'
                to='my-landfill-info' >
                <CgProfile></CgProfile>My Landfill Info</NavLink>
        </li>
        <li >
            <NavLink className='flex items-center font-bold gap-2'
                to='comtractor-home' >
                <FaHome></FaHome>Manager Home</NavLink>
        </li>
    </>

    return (
        <div className='max-w-screen-2xl mx-auto min-h-screen sm:px-4 md:px-0 bg-base-300'>
            <Navbar></Navbar>
            <div className="max-w-full mx-auto flex">

                {/* This is for Small device */}
                <div className="drawer md:hidden fixed z-[999]">
                    <input id="my-drawer" type="checkbox" className="drawer-toggle" />
                    <div className="drawer-content">
                        <label
                            htmlFor="my-drawer"
                            className="btn bg-gray-400 text-black rounded-full drawer-button">
                            <VscThreeBars className='text-xl' /></label>
                    </div>
                    <div className="drawer-side">
                        <label htmlFor="my-drawer" aria-label="close sidebar" className="drawer-overlay"></label>
                        <ul className="menu p-4 w-60 min-h-full bg-base-200 text-base-content flex flex-col mt-5 px-6 space-y-3">
                            {
                                userRole === "System Admin" && <>
                                    {systemAdmin}
                                </>

                            }
                            {
                                userRole === "Sts Manager" && <>
                                    {stsManager}
                                </>
                            }
                            {
                                userRole === "Land Manager" && <>
                                    {landManager}
                                </>
                            }
                            {
                                userRole === "Contractor Manager" && <>
                                    {ContractorManager}
                                </>
                            }
                        </ul>
                    </div>
                </div>

                {/* This is for Medium and Large device */}
                <div className="hidden md:inline-block w-64 min-h-screen bg-[#092111] text-white sticky top-0">
                    <div className='text-center my-5'>
                        <h1 className='text-3xl font-bold'>EcoSync</h1>
                        <p className='text-xl'>Web App</p>
                    </div>
                    {
                        userRole === "System Admin" && <>
                            <ul className='menu flex flex-col mt-5 px-6 space-y-3'>
                                {systemAdmin}
                            </ul>
                        </>
                    }
                    {
                        userRole === "Sts Manager" && <>
                            <ul className='flex flex-col mt-10 px-6 space-y-3'>
                                {stsManager}
                            </ul>
                        </>
                    }
                    {
                        userRole === "Land Manager" && <>
                            <ul className='flex flex-col mt-10 px-6 space-y-3'>
                                {landManager}
                            </ul>
                        </>
                    }
                    {
                        userRole === "Contractor Manager" && <>
                            <ul className='flex flex-col mt-10 px-6 space-y-3'>
                                {ContractorManager}
                            </ul>
                        </>
                    }

                </div>
                <div className="flex-1 bg-base-300">
                    <Outlet></Outlet>
                </div>

            </div>
            <Footer />
        </div>
    )
}
export default Dashboard;