import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../Layout/MainLayout";
import Error from "../Pages/ErrorPage/Error";
import Login from "../Pages/Login/Login";
import ResetPass from "../Pages/ResetPassword/ResetPass";
import Dashboard from "../Pages/Dashboard/Dashboard";
import Profile from "../Pages/Profile/Profile";
import AboutUs from "../Pages/AboutUs/AboutUs";
import PrivateRoutes from "./PrivateRoutes";
import Home from "../Pages/Home/Home";
import AdminHome from "../Pages/AdminHome/AdminHome";
import SystemAdminRoute from "./SystemAdminRoute";
import AddNewVehicle from "../Pages/AddNewVehicle/AddNewVehicle";
import AddNewSts from "../Pages/AddNewSts/AddNewSts";
import ManageUser from "../Pages/ManageUsers/ManageUsers";
import UserDetails from "../Pages/UserDetails/UserDetails";
import AddNewLandFill from "../Pages/AddNewLandFill/AddNewLandFill";
import StsDataEntry from "../Pages/StsDataEntry/StsDataEntry";
import AddNewRole from "../Pages/AddNewRole/AddNewRole";
import AddNewUser from "../Pages/AddNewUser/AddNewUser";

const router = createBrowserRouter([
    {
        path: "/",
        errorElement: <Error></Error>,
        element: <MainLayout></MainLayout>,
        children:[
            {
                path: "/",
                element: <Home></Home>
            },
            {
                path: "/profile",
                element: <PrivateRoutes><Profile></Profile></PrivateRoutes>
            },
            {
                path: "/auth/login",
                element: <Login></Login>
            },
            {
                path: "/auth/reset-password/initiate",
                element: <ResetPass></ResetPass>
            },
            {
                path: "/about-us",
                element: <AboutUs></AboutUs>
            }
        ]
    },
    {
        path: "/dashboard",
        element: <Dashboard></Dashboard>,
        children:[
            {
                //This will be Admin Route
                path: "admin-home",
                element: <SystemAdminRoute><AdminHome></AdminHome></SystemAdminRoute>
            },
            {
                //This will be Admin Route
                path: "create-user",
                element: <SystemAdminRoute><AddNewUser></AddNewUser></SystemAdminRoute>
            },
            {
                //This will be Admin Route
                path: "create-role",
                element: <SystemAdminRoute><AddNewRole></AddNewRole></SystemAdminRoute>
            },
            {
                //This will be Admin Route
                path: "add-vehicle",
                element: <SystemAdminRoute><AddNewVehicle></AddNewVehicle></SystemAdminRoute>
            },
            {
                //This will be Admin Route
                path: "create-sts",
                element: <SystemAdminRoute><AddNewSts></AddNewSts></SystemAdminRoute>
            },
            {
                //This will be Admin Route
                path: "create-landfill",
                element: <SystemAdminRoute><AddNewLandFill></AddNewLandFill></SystemAdminRoute>
            },
            {
                //This will be Admin Route
                path: "manage-user",
                element: <SystemAdminRoute><ManageUser></ManageUser></SystemAdminRoute>
            },
            {
                //This will be Admin Route
                path: "users/:id",
                element: <SystemAdminRoute><UserDetails></UserDetails></SystemAdminRoute>,
                loader: ({params})=> fetch(`http://localhost:5000/users/${params.id}`)
            },
            {
                //This will be Sts Manager Route
                path: "data-entry-sts-manager",
                element: <StsDataEntry></StsDataEntry>
                
            },
        ]
    }
]);

export default router;