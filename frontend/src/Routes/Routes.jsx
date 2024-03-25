import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../Layout/MainLayout";
import Error from "../Pages/ErrorPage/Error";
import Login from "../Pages/Login/Login";
import Register from "../Pages/Register/Register";
import ResetPass from "../Pages/ResetPassword/ResetPass";
import Dashboard from "../Pages/Dashboard/Dashboard";
import Profile from "../Pages/Profile/Profile";
import AboutUs from "../Pages/AboutUs/AboutUs";
import PrivateRoutes from "./PrivateRoutes";

const router = createBrowserRouter([
    {
        path: "/",
        errorElement: <Error></Error>,
        element: <MainLayout></MainLayout>,
        children:[
            {
                path: "/",
                element: <Profile></Profile>
            },
            {
                path: "/auth/login",
                element: <Login></Login>
            },
            {
                path: "/auth/create",
                element: <Register></Register>
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
        element: <PrivateRoutes><Dashboard></Dashboard></PrivateRoutes>
    }
]);

export default router;