import { Navigate, useLocation } from "react-router-dom";
import PropTypes from 'prop-types';
import useAuth from "../Hooks/useAuth";
import IsAdmin from "../Hooks/IsAdmin";


const SystemAdminRoute = ({ children }) => {
    const { user, loading } = useAuth();
    const location = useLocation();
    let [isAdmin, isAdminLoading] = IsAdmin();

    if (loading || isAdminLoading) {
        return <div className="flex justify-center items-center min-h-[600px]">
            <span className="loading loading-spinner loading-lg"></span>
        </div>
    }

    if (user && isAdmin === "Admin") {
        return children;
    }
    return <Navigate to="/auth/login" state={{ from: location }} replace></Navigate>
};
SystemAdminRoute.propTypes = {
    children: PropTypes.node,
}
export default SystemAdminRoute;