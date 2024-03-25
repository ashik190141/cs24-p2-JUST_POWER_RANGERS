import { NavLink, Outlet } from 'react-router-dom';
import { FaEdit, FaEye, FaHeart, FaHome, FaUser, FaUsers, FaVoicemail, FaWineBottle } from 'react-icons/fa';
import { GiLovers } from "react-icons/gi";
import { MdOutlineWorkspacePremium } from "react-icons/md";
import Navbar from '../../Components/Navbar';
import Footer from '../../Components/Footer';
// @ts-ignore
import IsAdmin from '../../Hooks/IsAdmin';
import IsStsManager from '../../Hooks/IsStsManager';



const Dashboard = () => {
    let [isAdmin] = IsAdmin();
    let [isStsManager] = IsStsManager();
    // console.log(isAdmin);
    console.log(isStsManager);


    return (
        <div className='max-w-screen-2xl mx-auto min-h-screen sm:px-4 md:px-0 bg-white'>
            <Navbar></Navbar>
            <div className="max-w-full mx-auto flex">
                <div className="w-64 h-screen bg-[#092111] text-white sticky top-0">
                    <div className='text-center my-10'>
                        <h1 className='text-3xl font-bold'>Dust Master</h1>
                        <p className='text-xl'>Web App</p>
                    </div>

                    {
                        isAdmin && <>
                            <ul className='menu flex flex-col mt-10 px-6 space-y-3'>
                                <li >
                                    <NavLink className='flex items-center font-bold gap-2'
                                        to='admin-home' >
                                        <FaHome></FaHome>Admin Home</NavLink>
                                </li>
                                <li >
                                    <NavLink className='flex items-center font-bold gap-2'
                                        to='manage-user' >
                                        <FaUsers></FaUsers>Manage Users</NavLink>
                                </li>
                                <li >
                                    <NavLink className='flex items-center font-bold gap-2'
                                        to='approve-con-request' >
                                        <FaVoicemail></FaVoicemail>Approve Cont. Request</NavLink>
                                </li>
                                <li >
                                    <NavLink className='flex items-center font-bold gap-2'
                                        to='approve-premium' ><MdOutlineWorkspacePremium />Approve Premium</NavLink>
                                </li>
                                <li >
                                    <NavLink className='flex items-center font-bold gap-2'
                                        to='success-story' ><FaWineBottle></FaWineBottle>Success Story</NavLink>
                                </li>
                            </ul>
                        </>
                    }
                    {
                        isStsManager && <>
                            <ul className='flex flex-col mt-10 px-6 space-y-3'>
                                <li >
                                    <NavLink className='flex items-center font-bold gap-2'
                                        to='edit-biodata' >
                                        <FaEdit></FaEdit> Edit Bio-Data</NavLink>
                                </li>
                                <li >
                                    <NavLink className='flex items-center font-bold gap-2'
                                        to='view-bio-data' >
                                        <FaEye></FaEye> View Bio-Data</NavLink>
                                </li>
                                <li >
                                    <NavLink className='flex items-center font-bold gap-2'
                                        to='my-req-contacts' >
                                        <FaUser></FaUser> My Req. Contacts</NavLink>
                                </li>
                                <li >
                                    <NavLink className='flex items-center font-bold gap-2'
                                        to='favorites' ><FaHeart></FaHeart> Favorites</NavLink>
                                </li>
                                <li >
                                    <NavLink className='flex items-center font-bold gap-2'
                                        to='got-married' ><GiLovers></GiLovers>Got Married</NavLink>
                                </li>
                            </ul>
                        </>
                    }

                </div>
                <div className="flex-1 bg-gray-200 overflow-y-scroll">
                    <Outlet></Outlet>
                </div>

            </div>
            <Footer></Footer>
        </div>
    )
}
export default Dashboard;