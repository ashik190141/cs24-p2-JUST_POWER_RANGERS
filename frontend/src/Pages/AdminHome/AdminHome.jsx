import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import SectionTitle from "../../Components/SectionTitle";


const AdminHome = () => {
    const [truckDetails, setTruckDetails] = useState([]);
    useEffect(() => {
        fetch("http://localhost:5000/dashboard")
            .then(res => res.json())
            .then(data => {
                console.log(data);
                setTruckDetails(data)
            });
    },[])

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