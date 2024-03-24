import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../Layout/MainLayout";
import Error from "../Pages/ErrorPage/Error";
import Home from "../Pages/Home/Home";
import Login from "../Pages/Login/Login";
import Register from "../Pages/Register/Register";

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
                path: "/auth/login",
                element: <Login></Login>
            },
            {
                path: "/auth/create",
                element: <Register></Register>
            },
            {
                path: "/auth/reset-password/initiate",
                element: <></>
            },
            {
                path: "/reset-password/:token",
                element: <></>
            },
            {
                path: "/dashboard",
                element: <></>
            },
            {
                path: "/profile",
                element: <></>
            }
        ]
    },
]);

export default router;