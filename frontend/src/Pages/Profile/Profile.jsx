import { Helmet } from "react-helmet-async";
import SectionTitle from "../../Components/SectionTitle";
import Permission from "../../Hooks/Permission";


const Profile = () => {
    let [userRole] = Permission();
    return (
        <div className="min-h-screen">
            <Helmet>
                <title>Dust Master | Profile</title>
            </Helmet>
            <SectionTitle title={userRole} subTitle={'My Current Position?'}></SectionTitle>
        </div>
    );
};

export default Profile;