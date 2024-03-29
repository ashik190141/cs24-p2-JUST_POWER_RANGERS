import { Helmet } from "react-helmet-async";
import SectionTitle from "../../Components/SectionTitle";


const AdminHome = () => {
    return (
        <div>
            <Helmet>
                <title>Dust Master | Admin Home</title>
            </Helmet>
            <SectionTitle title={"Admin Home"} subTitle={'Real time monitoring'}></SectionTitle>
        </div>
    );
};

export default AdminHome;