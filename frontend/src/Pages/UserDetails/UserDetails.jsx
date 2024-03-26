import { useLoaderData } from "react-router-dom";


const UserDetails = () => {
    let user = useLoaderData();
    console.log(user);
    return (
        <div>
            <p>Hi! I am {user?.userName} </p>
        </div>
    );
};

export default UserDetails;