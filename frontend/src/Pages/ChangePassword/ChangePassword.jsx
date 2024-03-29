import { Helmet } from "react-helmet-async";
import SectionTitle from "../../Components/SectionTitle";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import useAxiosPublic from "../../Hooks/useAxiosPublic";
import useAuth from "../../Hooks/useAuth";


const ChangePassword = () => {
    let navigate = useNavigate();
    let axiosPublic = useAxiosPublic();
    let {user} = useAuth();

    let ChangePassword = async(e) => {
        e.preventDefault();
        let oldPassword = e.target.old_password.value;
        let newPassword = e.target.new_password.value;
        let confirmPass = e.target.confirm_password.value;

        if (newPassword !== confirmPass) {
            return Swal.fire({
                icon: 'error',
                title: 'New Password does not match',
                showConfirmButton: false,
                timer: 1500
            })
        }
        let passInfo = {
            email: user.email,
            oldPassword,
            newPassword,
        }
        console.log(passInfo);

        let res = await axiosPublic.put('/auth/change-password', passInfo);
        console.log(res);
        if (res.data.result) {
            Swal.fire({
                icon:'success',
                title: res.data.message,
                showConfirmButton: false,
                timer: 1500
            });
            navigate('/profile');
        }else{
            Swal.fire({
                icon: 'error',
                title: res.data.message,
                showConfirmButton: false,
                timer: 1500
            });
        }
    }
    return (
        <div>
            <Helmet>
                <title>Dust Master | Change Password</title>
            </Helmet>
            <SectionTitle title={"Change Password"} subTitle={'being more Secure!'}></SectionTitle>
            <div className="flex justify-center items-center my-10">
                <div className="bg-gray-400 w-full md:w-4/12 md:pr-10 text-center py-5 px-10 rounded-lg">
                    <form onSubmit={ChangePassword}>
                        <div>
                            <p className="text-left text-lg font-semibold">Old Password</p>
                            <input className="w-full p-2 pl-2 text-black rounded-lg my-3 outline-none"
                                type="password"
                                name="old_password"
                                placeholder="Type Old Password"
                                required />
                        </div>
                        <div>
                            <p className="text-left text-lg font-semibold">New Password</p>
                            <input className="w-full p-2 pl-2 text-black rounded-lg my-3 outline-none"
                                type="password"
                                name="new_password"
                                placeholder="New New Password"
                                required />
                        </div>
                        <div>
                            <p className="text-left text-lg font-semibold">Confirm Password</p>
                            <input className="w-full p-2 pl-2 text-black rounded-lg my-3 outline-none"
                                type="password"
                                name="confirm_password"
                                placeholder="Confirm New Password"
                                required />
                        </div>

                        <button className="bg-green-800 text-white py-2 rounded-md w-full" type="submit">
                            Confirm</button>
                    </form>

                </div>
            </div>
        </div>
    );
};

export default ChangePassword;