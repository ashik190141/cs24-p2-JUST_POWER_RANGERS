import { Helmet } from "react-helmet-async";
import SectionTitle from "../../Components/SectionTitle";
import Swal from "sweetalert2";
import useAxiosPublic from "../../Hooks/useAxiosPublic";
import { useNavigate } from "react-router-dom";


const ResetPassword = () => {

    let navigate = useNavigate();
    let axiosPublic = useAxiosPublic();

    let SetPassword = (e) => {
        e.preventDefault();
        let newPassword = e.target.new_password.value;
        let confirmPass = e.target.confirm_password.value;

        if (newPassword !== confirmPass) {
            return Swal.fire({
                icon: 'error',
                title: 'Passwords do not match',
                showConfirmButton: false,
                timer: 1500
            })
        }
        let email = JSON.parse(localStorage.getItem("reset-email")).email;
        let info = {
            newPassword,
            email
        }

        axiosPublic.put('/auth/reset-password', info)
            .then(res => {
                if (res.data.result) {
                    Swal.fire({
                        icon: 'success',
                        title: res.data.message,
                        showConfirmButton: false,
                        timer: 1500
                    });
                    localStorage.removeItem('reset-email')
                    navigate('/auth/login');
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: res.data.message,
                        showConfirmButton: false,
                        timer: 1500
                    })
                }
            })
            .catch(err => {
                Swal.fire({
                    icon: 'error',
                    title: err.message,
                    showConfirmButton: false,
                    timer: 1500
                })
            })
    }

    return (
        <div>
            <Helmet>
                <title>EcoSync | Reset Password</title>
            </Helmet>
            <SectionTitle title={"Reset Password"} subTitle={'Always remember password!'}></SectionTitle>
            <div className="flex justify-center items-center my-5">
                <div className="bg-gray-400 w-full md:w-4/12 md:pr-10 text-center p-10 rounded-lg">
                    <h2 className="text-3xl font-bold">Set New Password</h2>
                    <form onSubmit={SetPassword}>
                        <div>
                            <p className="text-left text-lg font-semibold">New Password</p>
                            <input className="w-full p-2 pl-7 text-black rounded-lg my-3 outline-none"
                                type="password"
                                name="new_password"
                                placeholder="New Password"
                                required />
                        </div>
                        <div>
                            <p className="text-left text-lg font-semibold">Confirm Password</p>
                            <input className="w-full p-2 pl-7 text-black rounded-lg my-3 outline-none"
                                type="password"
                                name="confirm_password"
                                placeholder="Confirm Password"
                                required />
                        </div>

                        <button className="bg-green-700 text-white py-2 rounded-md w-full" type="submit">
                            Confirm</button>
                    </form>

                </div>
            </div>
        </div>
    );
};

export default ResetPassword;