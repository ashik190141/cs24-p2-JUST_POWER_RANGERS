import { Helmet } from "react-helmet-async";
import { useLoaderData } from "react-router-dom";
import SectionTitle from "../../Components/SectionTitle";
import useAxiosPublic from "../../Hooks/useAxiosPublic";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";


const UserDetails = () => {
    let user = useLoaderData();

    const { data: userDetails = null, refetch } = useQuery({
        queryKey: ['user-details'],
        queryFn: async () => {
            const res = await axiosPublic.get(`/users/${user._id}`);
            return res.data;
        }
    });

    const { data: availableRole = [] } = useQuery({
        queryKey: ['get-all-availableRole'],
        queryFn: async () => {
            const res = await axiosPublic.get('/users/roles');
            return res.data;
        }
    });

    const { register, handleSubmit, reset } = useForm();
    let axiosPublic = useAxiosPublic();
    const [userRole, setUserRole] = useState('');
    const [locations, setLocations] = useState([]);
    const [selectedLocation, setSelectedLocation] = useState(null);


    useEffect(() => {
        if (userRole === 'Sts Manager') {
            axiosPublic.get('/get-all-sts')
                .then(response => {
                    setLocations(response.data);
                })
                .catch(error => {
                    console.error('Error fetching STS locations:', error);
                });
        } else if (userRole === 'Land Manager') {
            axiosPublic.get('/get-all-landfill')
                .then(response => {
                    setLocations(response.data);
                })
                .catch(error => {
                    console.error('Error fetching landfill locations:', error);
                });
        }
    }, [userRole, axiosPublic]);

    const handleUserRoleChange = (event) => {
        setUserRole(event.target.value);
        setSelectedLocation('');
    };

    const handleLocationChange = (event) => {
        setSelectedLocation(event.target.value);
    };


    const onSubmit = async (data) => {

        let email = user.email;
        let role = data.updatedRole;
        let place = selectedLocation;

        if (data.updatedRole !== 'Sts Manager' && data.updatedRole !== 'Land Manager') {
            place = null;
        }
        else {
            place = selectedLocation;
        }
        let updatedRole = {
            email,
            role,
            place
        }

        if (updatedRole.role == 'null') {
            return Swal.fire({
                position: "center",
                icon: "error",
                title: "Please Select a role",
                showConfirmButton: false,
                timer: 1500
            });
        }
        if ((updatedRole.role == 'Sts Manager' || updatedRole.role == 'Land Manager') && updatedRole.place == false) {
            return Swal.fire({
                position: "center",
                icon: "error",
                title: "Please Select Location",
                showConfirmButton: false,
                timer: 1500
            });
        }
        let res = await axiosPublic.put(`/users/${user._id}/roles`, updatedRole)
        if (res.data.result) {
            Swal.fire({
                position: "center",
                icon: "success",
                title: res.data.message,
                showConfirmButton: false,
                timer: 1500
            });
            reset();
            refetch();
        } else {
            Swal.fire({
                position: "center",
                icon: "error",
                title: res.data.message,
                showConfirmButton: false,
                timer: 1500
            });
        }

    }
    return (
        <div className="w-full md:w-10/12 mx-auto px-2 my-10">
            <Helmet>
                <title>EcoSync | User Profile</title>
            </Helmet>
            <SectionTitle title={"Update Role"} subTitle={'Get Change'}></SectionTitle>
            <div className="text-lg">
                <div className="my-5 grid grid-cols-2 md:grid-cols-3 gap-10 font-semibold text-white">
                    <h1 className="bg-green-800 text-xl p-8 text-center rounded-lg">User Name: <span className="font-bold">{userDetails?.userName}</span></h1>
                    <h1 className="bg-violet-950 text-xl p-8 text-center rounded-lg">User Email: <span className="font-bold">{userDetails?.email}</span></h1>
                    <h1 className="bg-yellow-800 text-xl p-8 text-center rounded-lg">Current Role: <span className="font-bold">{userDetails?.role}</span></h1>
                </div>
                <div>
                    <h1 className="text-3xl text-rose-900 text-center mt-10 mb-5 font-bold">Update User Role</h1>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="flex gap-10 mb-5">
                            <div className="flex-1">
                                <label className="label">
                                    <span className="label-text text-xl font-semibold">User New Role</span>
                                </label>
                                <select defaultValue="null"
                                    required
                                    {...register('updatedRole', { required: true })}
                                    onChange={handleUserRoleChange}
                                    className="w-full py-2 rounded-md">
                                    <option disabled value="null">Select New Role</option>
                                    {
                                        user.role != 'unassigned' && <option value="unassigned">Un-Assigned</option>
                                    }
                                    {
                                        availableRole?.map((role) => {
                                            return (
                                                <option className="text-black" key={role._id} value={role?.roleName}>{role?.roleName}</option>
                                            )
                                        })
                                    }
                                </select>
                            </div>
                            <div className="flex-1">
                                {userRole === 'Land Manager' || userRole === 'Sts Manager' ? (
                                    <div>
                                        <label className="label">
                                            <span className="label-text text-xl font-semibold">Locations*</span>
                                        </label>
                                        <select id="location"
                                            required
                                            {...register('place', { required: true })}
                                            value={selectedLocation}
                                            onChange={handleLocationChange}
                                            className="w-full py-2 rounded-md">
                                            <option value="null">Select Location</option>
                                            {locations.map(location => (
                                                <option key={location?._id} value={location?.name}>{location?.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                ) : null}
                            </div>

                        </div>
                        <button
                            className="bg-green-800 px-4 py-2 rounded-md text-white"
                            type="submit">
                            Submit Now!
                        </button>
                    </form>
                </div>
            </div>

        </div>
    );
};

export default UserDetails;