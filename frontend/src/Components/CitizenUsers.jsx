import { useEffect, useState } from "react";
import { Link } from "react-router-dom";


const CitizenUsers = () => {
    let [citizen, setCitizen] = useState([]);
    useEffect(() => {
        fetch('http://localhost:5000/citizen/users', { credentials: 'include' })
            .then(res => res.json())
            .then(data => setCitizen(data.data))

    }, [])
    return (
        <div className="w-full md:w-10/12 mx-auto">
            {
                citizen?.map(user => <div
                    className="flex justify-center items-center gap-5 my-4"
                    key={user?._id}>
                    <div className="avatar">
                        <div className="w-8 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                            <img src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg" />
                        </div>
                    </div>
                    <h1>{user?.name}</h1>
                    <button>
                        <Link to={'/citizen/send-message'}>Send Message</Link>
                    </button>
                </div>)
            }
        </div>
    );
};

export default CitizenUsers;