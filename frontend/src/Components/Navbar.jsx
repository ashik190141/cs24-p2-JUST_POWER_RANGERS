import { Link, NavLink } from "react-router-dom";
import img from '../../public/logo.png'
import useAuth from "../Hooks/useAuth";
import useLogout from "../Hooks/useLogout";

const Navbar = () => {
    let { user } = useAuth();
    let { logout } = useLogout();

    let items = <>
        <li><NavLink to={'/'}>Home</NavLink></li>
        {
            user? <li><NavLink to={'/profile'}>Profile</NavLink></li> : <></>
        }
        <li><NavLink to={'/about-us'}>About Us</NavLink></li>
        <li><NavLink to={'/contact-us'}>Contact Us</NavLink></li>
        {
            user? <li><NavLink to={'/dashboard'}>Dashboard</NavLink></li> : <></>
        }
    </>
    return (
        <div className="navbar bg-[#092111] text-white">
            <div className="navbar-start">
                <div className="dropdown">
                    <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" /></svg>
                    </div>
                    <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
                        {items}
                    </ul>
                </div>
                <div className="flex justify-center items-center">
                    <img className="w-12 h-12" src={img} alt="" />
                    <a className="btn btn-ghost text-xl">Dust Master</a>
                </div>
            </div>
            <div className="navbar-center hidden lg:flex">
                <ul className="menu menu-horizontal px-1">
                    {items}
                </ul>
            </div>
            {
                user ? <div className="navbar-end">
                    <button className="bg-red-900 px-4 py-2 rounded-md text-white cursor-pointer hover:scale-105" onClick={() => logout()}>Logout</button>
                </div> : <div className="navbar-end">
                    <Link to={"/auth/login"}>
                        <button className="bg-green-900 px-4 py-2 rounded-md text-white cursor-pointer hover:scale-105">Login</button>
                    </Link>
                </div>
            }
        </div>
    );
};

export default Navbar;