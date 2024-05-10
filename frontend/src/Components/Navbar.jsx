import { Link, NavLink } from "react-router-dom";
import img from '../../public/logo.png'
import useAuth from "../Hooks/useAuth";
import useLogout from "../Hooks/useLogout";
import Permission from "../Hooks/Permission";
import { useEffect, useState } from "react";

const Navbar = () => {
    let { user } = useAuth();
    let { logout } = useLogout();
    let [UserRole] = Permission();
    console.log("UserRole: ", UserRole);

    let [theme, setTheme] = useState(localStorage.getItem('theme') ? localStorage.getItem('theme') : 'light')

    useEffect(() => {
        localStorage.setItem('theme', theme);
        let localTheme = localStorage.getItem('theme');
        document.querySelector('html').setAttribute("data-theme", localTheme)
    }, [theme])

    let handleToggle = (e) => {
        if (e.target.checked) {
            setTheme('dark');
        }
        else {
            setTheme('light')
        }

    }

    let items = <>
        <li><NavLink to={'/'}>Home</NavLink></li>
        {
            user ? <li><NavLink to={'/profile'}>Profile</NavLink></li> : <></>
        }
        <li><NavLink to={'/about-us'}>About Us</NavLink></li>
        <li><NavLink to={'/contact-us'}>Contact Us</NavLink></li>
        {
            UserRole === 'System Admin' && <li><NavLink to={'/dashboard/admin-home'}>Dashboard</NavLink></li>
        }
        {
            UserRole === 'Land Manager' && <li><NavLink to={'/dashboard/my-landfill-info'}>Dashboard</NavLink></li>
        }
        {
            UserRole === 'Sts Manager' && <li><NavLink to={'/dashboard/my-sts-info'}>Dashboard</NavLink></li>
        }
        {
            UserRole === 'Contractor Manager' && <li><NavLink to={'/dashboard/comtractor-home'}>Dashboard</NavLink></li>
        }
    </>
    return (
        <div className="navbar bg-[#092111] text-white px-4">
            <div className="navbar-start">
                <div className="dropdown">
                    <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" /></svg>
                    </div>
                    <ul tabIndex={0} className={`menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow ${theme == 'light' ? "bg-gray-600" : "bg-base-300"} rounded-box w-40`}>
                        {items}
                    </ul>
                </div>
                <div className="flex justify-center items-center">
                    <Link to={'/'}><img className="w-10 h-10 md:w-[56px] md:h-[56px] cursor-pointer" src={img} alt="" /></Link>
                    <Link to={'/'} className="btn btn-ghost text-xl">EcoSync</Link>
                </div>
            </div>
            <div className="navbar-center hidden lg:flex">
                <ul className="menu menu-horizontal px-1">
                    {items}
                </ul>
            </div>

            {
                user ? <div className="navbar-end">
                    <label className="flex cursor-pointer gap-2 mx-3">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5" /><path d="M12 1v2M12 21v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1 12h2M21 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4" /></svg>
                        <input
                            type="checkbox"
                            onChange={handleToggle}
                            checked={theme == 'light' ? false : true}
                            className="toggle theme-controller" />
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>
                    </label>
                    <button className="bg-red-900 px-4 py-2 rounded-md text-white cursor-pointer hover:scale-105" onClick={() => logout()}>Logout</button>
                </div> : <div className="navbar-end">
                    <label className="flex cursor-pointer gap-2 mx-3">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5" /><path d="M12 1v2M12 21v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1 12h2M21 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4" /></svg>
                        <input
                            type="checkbox"
                            onChange={handleToggle}
                            checked={theme == 'light' ? false : true}
                            className="toggle theme-controller" />
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>
                    </label>
                    <Link to={"/auth/login"}>
                        <button className="bg-green-900 px-4 py-2 rounded-md text-white cursor-pointer hover:scale-105">Login</button>
                    </Link>
                </div>
            }
        </div>
    );
};

export default Navbar;