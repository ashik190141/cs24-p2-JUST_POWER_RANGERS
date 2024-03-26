
import { Navigate, useLocation } from "react-router-dom";
import PropTypes from 'prop-types';
import useAuth from "../Hooks/useAuth";


const PrivateRoutes = ({ children }) => {
    let { user, loading } = useAuth();
    let location = useLocation();
    if (loading) {
        return <div className="flex justify-center items-center min-h-[600px]">
            <span className="loading loading-spinner loading-lg"></span>
        </div>
    }
    if(user){
        return children;
    }
    return <Navigate to='/' state={{from: location}} replace></Navigate>
};
PrivateRoutes.propTypes = {
    children: PropTypes.node,
}
export default PrivateRoutes;