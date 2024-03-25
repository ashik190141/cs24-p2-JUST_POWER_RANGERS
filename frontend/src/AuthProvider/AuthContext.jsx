import { createContext, useState } from "react";
import PropTypes from 'prop-types';

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")) || null);
    let [loading, setLoading] = useState(false);

    let info = {
        user,
        setUser,
        loading,
        setLoading
    }

    return <AuthContext.Provider value={info}>
        {children}
    </AuthContext.Provider>;
};
AuthProvider.propTypes = {
    children: PropTypes.node
}
export default AuthProvider;