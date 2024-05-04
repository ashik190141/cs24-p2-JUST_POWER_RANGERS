import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../Layout/MainLayout";
import Error from "../Pages/ErrorPage/Error";
import Login from "../Pages/Login/Login";
import Dashboard from "../Pages/Dashboard/Dashboard";
import Profile from "../Pages/Profile/Profile";
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
import ContactUs from "../Pages/Contact-us/ContactUs";
import AboutUs from "../Pages/About-Us/AboutUs";
import OtpConfirm from "../Pages/OtpConfirm/OtpConfirm";
import ResetPassword from "../Pages/ResetPassword/ResetPassword";
import UpdateProfile from "../Pages/UpdateProfile/UpdateProfile";
import ChangePassword from "../Pages/ChangePassword/ChangePassword";
import LandfillDataEntry from "../Pages/LandfillDataEntry/LandfillDataEntry";
import AllUserInfo from "../Pages/AllUserInfo/AllUserInfo";
import LandfillManagerRoute from "./LandfilManagerRoute";
import StsManagerRoute from "./StsManagerRoute";
import STSManagerMapRoutes from "../Pages/STSManagerMapRoutes/STSManagerMapRoutes";
import StsManagerMinimumVehicle from "../Pages/StsManagerMinimumVehicle/StsManagerMinimumVehicle";
import ManageAllSts from "../Pages/Manage-All-Sts/ManageAllSts";
import ManageAllLandfill from "../Pages/Manage-All-Landfill/ManageAllLandfill";

const router = createBrowserRouter([
    {
        path: "/",
        errorElement: <Error></Error>,
        element: <MainLayout></MainLayout>,
        children: [
            {
                path: "/",
                element: <Home></Home>
            },
            {
                path: "/profile",
                element: <PrivateRoutes><Profile></Profile></PrivateRoutes>
            },
            {
                path: "/update/:id",
                element: <PrivateRoutes><UpdateProfile></UpdateProfile></PrivateRoutes>,
                loader: ({ params }) => fetch(`http://localhost:5000/users/${params.id}`)
            },
            {
                path: "/profile/change-password",
                element: <PrivateRoutes><ChangePassword></ChangePassword></PrivateRoutes>,
            },
            {
                path: "/auth/login",
                element: <Login></Login>
            },
            {
                path: "/auth/reset-password/initiate",
                element: <OtpConfirm></OtpConfirm>
            },
            {
                path: "/auth/reset-password/setpassword",
                element: <ResetPassword></ResetPassword>
            },
            {
                path: "/about-us",
                element: <AboutUs></AboutUs>
            },
            {
                path: "/contact-us",
                element: <ContactUs></ContactUs>
            }
        ]
    },
    {
        path: "/dashboard",
        element: <PrivateRoutes><Dashboard></Dashboard></PrivateRoutes>,
        children: [
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
                path: "all-user-info",
                element: <SystemAdminRoute><AllUserInfo></AllUserInfo></SystemAdminRoute>
            },
            {
                //This will be Admin Route
                path: "manage-all-sts",
                element: <SystemAdminRoute><ManageAllSts></ManageAllSts></SystemAdminRoute>
            },
            {
                //This will be Admin Route
                path: "manage-all-landfill",
                element: <SystemAdminRoute><ManageAllLandfill></ManageAllLandfill></SystemAdminRoute>
            },
            {
                //This will be Admin Route
                path: "users/:id",
                element: <SystemAdminRoute><UserDetails></UserDetails></SystemAdminRoute>,
                loader: ({ params }) => fetch(`http://localhost:5000/users/${params.id}`)
            },
            {
                //This will be Sts Manager Route
                path: "data-entry-sts-manager",
                element: <StsManagerRoute><StsDataEntry></StsDataEntry></StsManagerRoute>

            },
            {
                //This will be Sts Manager Route
                path: "view-routes",
                element: <StsManagerRoute><STSManagerMapRoutes></STSManagerMapRoutes></StsManagerRoute>,
            },
            {
                //This will be Sts Manager Route
                path: "min-vehicle-and-cost/:email",
                element: <StsManagerRoute><StsManagerMinimumVehicle></StsManagerMinimumVehicle></StsManagerRoute>,
                loader: ({ params }) => fetch(`http://localhost:5000/minimum-vehicle-and-cost/${params?.email}`),
            },
            {
                //This will be Land Manager Route
                path: "land-data-entry",
                element: <LandfillManagerRoute><LandfillDataEntry></LandfillDataEntry></LandfillManagerRoute>

            },
        ]
    }
]);

export default router;