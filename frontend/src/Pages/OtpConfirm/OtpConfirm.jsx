import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import useAxiosPublic from "../../Hooks/useAxiosPublic";
import Swal from "sweetalert2";
import SectionTitle from "../../Components/SectionTitle";


const OtpConfirm = () => {
    let navigate = useNavigate();
    let axiosPublic = useAxiosPublic();

    let verifyOTP = (e) => {
        e.preventDefault();
        let otp = e.target.otp.value;
        let email = JSON.parse(localStorage.getItem("reset-email")).email;

        let info = {
            otp,
            email
        }
        axiosPublic.put('/auth/reset-password/confirm', info)
            .then(res => {
                if (res.data.result) {
                    Swal.fire({
                        icon: 'success',
                        title: res.data.message,
                        showConfirmButton: false,
                        timer: 1500
                    });

                    navigate('/auth/reset-password/setpassword');
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
                <title>EcoSync | Confirm Otp</title>
            </Helmet>
            <SectionTitle title={"Confirm Otp"} subTitle={'check Your mail!'}></SectionTitle>

            <div className="flex justify-center items-center py-10">
                <div className="bg-base-300 w-full md:w-4/12 md:pr-10 text-center p-10 rounded-lg">
                    <form onSubmit={verifyOTP}>
                        <div>
                            <p className="text-left text-lg font-semibold ">One Time Password</p>
                            <input className="w-full p-2 pl-7 rounded-lg my-3 outline-none"
                                type="text"
                                name="otp"
                                placeholder="Type OTP from your email"
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

export default OtpConfirm;