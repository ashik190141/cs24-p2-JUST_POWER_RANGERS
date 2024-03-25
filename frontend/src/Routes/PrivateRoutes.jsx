
import { Navigate, useLocation } from "react-router-dom";
import PropTypes from 'prop-types';
import useAuth from "../Hooks/useAuth";


const PrivateRoutes = ({ children }) => {
    let { user, loading } = useAuth();
    console.log(user);
    let location = useLocation();
    if(user){
        return children;
    }
    if (loading) {
        return <div className="flex justify-center items-center min-h-[600px]">
            <span className="loading loading-spinner loading-lg"></span>
        </div>
    }
    return <Navigate to='/login' state={{from: location}} replace></Navigate>
};
PrivateRoutes.propTypes = {
    children: PropTypes.node,
}
export default PrivateRoutes;