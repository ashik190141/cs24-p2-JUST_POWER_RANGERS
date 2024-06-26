import { Navigate, useLocation } from "react-router-dom";
import PropTypes from 'prop-types';
import useAuth from "../Hooks/useAuth";
import Permission from "../Hooks/Permission";


const SystemAdminRoute = ({ children }) => {
    const { user, loading } = useAuth();
    const location = useLocation();
    let [userRole, isUserRoleLoading] = Permission();

    if (loading || isUserRoleLoading) {
        return <div className="flex justify-center items-center min-h-[600px]">
            <span className="loading loading-spinner loading-lg"></span>
        </div>
    }

    if (user && userRole === "System Admin") {
        return children;
    }
    return <Navigate to="/" state={{ from: location }} replace></Navigate>
};
SystemAdminRoute.propTypes = {
    children: PropTypes.node,
}
export default SystemAdminRoute;