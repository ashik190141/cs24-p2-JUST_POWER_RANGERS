import { Navigate, useLocation } from "react-router-dom";
import PropTypes from 'prop-types';
import useAuth from "../Hooks/useAuth";
import useCheckRoles from "../Hooks/useCheckRoles";


const LandfilManagerRoute = ({ children }) => {
    const {user, loading} = useAuth();
    const [isRole, isRoleLoading] = useCheckRoles();
    const location = useLocation();

    if (loading || isRoleLoading) {
        return <div className="flex justify-center items-center min-h-[600px]">
        <span className="loading loading-spinner loading-lg"></span>
    </div>
    }

    if (user && isRole ==="LandfilManager") {
        return children;
    }
    return <Navigate to="/" state={{ from: location }} replace></Navigate>
};
LandfilManagerRoute.propTypes = {
    children: PropTypes.node,
}
export default LandfilManagerRoute;