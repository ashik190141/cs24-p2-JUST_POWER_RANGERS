import { AiOutlineMail } from 'react-icons/ai';
import { RiLockPasswordFill } from 'react-icons/ri';
import { useState } from "react";
import { FaEyeSlash, FaEye } from 'react-icons/fa';
import Lottie from "lottie-react";
import Swal from 'sweetalert2';
import animation from '../../assets/Login/loginAnimation.json'
import { Helmet } from "react-helmet-async";
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import useAxiosPublic from '../../Hooks/useAxiosPublic';
import useAuth from '../../Hooks/useAuth';
import SectionTitle from '../../Components/SectionTitle';




const Login = () => {
    let [showPassword, setShowPassword] = useState(false);
    let { setLoading, setUser } = useAuth();
    let navigate = useNavigate();
    let axiosPublic = useAxiosPublic();
    const { register, handleSubmit, formState: { errors }, } = useForm();


    let handleLogin = async (e) => {
        e.preventDefault();
        let email = e.target.email.value;
        let password = e.target.password.value;
        let loginInfo = {
            email,
            password
        }
        let user = {
            email
        }
        setLoading(true);
        let res = await axiosPublic.post('/auth/login', loginInfo);
        console.log(res);
            if(res.data?.success){
                setUser(user);
                localStorage.setItem("user", JSON.stringify(user));
                Swal.fire({
                    position: "center",
                    icon: "success",
                    title: res.data.message,
                    showConfirmButton: false,
                    timer: 1500
                });
                setLoading(false);
                navigate('/');
            }else {
                Swal.fire({
                    icon: 'error',
                    title: res.data.message,
                    showConfirmButton: false,
                    timer: 1500
                })
            }
    }

    const resetPasswrod = (data) => {
        let email = data.resetEmail;
        let resetPassInfo = {
            email
        }
        axiosPublic.post('/auth/reset-password/initiate', resetPassInfo)
            .then(res => {
                if (res.data.result) {
                    Swal.fire({
                        icon: 'success',
                        title: res.data.message,
                        showConfirmButton: false,
                        timer: 1500
                    });
                    localStorage.setItem('reset-email', JSON.stringify(resetPassInfo))
                    navigate('/auth/reset-password/initiate');
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
        <div className='w-full md:w-10/12 mx-auto'>
            <Helmet>
                <title>EcoSync | Login</title>
            </Helmet>
            <SectionTitle title={"Login Now"} subTitle={'Need Access?'}></SectionTitle>

            <div className="flex flex-col md:flex-row-reverse justify-center items-center gap-5 px-4">
                <div className="bg-gray-400 w-full md:w-4/12 md:pr-10 text-center p-10 rounded-lg">
                    <h2 className="text-3xl font-bold">Login Now!</h2>
                    <form onSubmit={handleLogin}>
                        <div className="relative">
                            <p className="text-left text-lg font-semibold">User Email</p>
                            <AiOutlineMail className="absolute bottom-4 left-2"></AiOutlineMail>
                            <input className="w-full p-2 pl-7 text-black rounded-lg my-1"
                                type="email"
                                name="email"
                                placeholder="Type your email"
                                required />
                        </div>
                        <hr className="my-3" />
                        <div className="relative">
                            <p className="text-left text-lg font-semibold">Password</p>
                            <RiLockPasswordFill className="absolute bottom-4 left-2"></RiLockPasswordFill>
                            <input className="w-full p-2 pl-6 text-black rounded-lg my-1"
                                type={showPassword ? 'text' : 'password'}
                                name="password"
                                placeholder="Type your password"
                            />
                            <span onClick={() => setShowPassword(!showPassword)} className="absolute right-3 bottom-4">{showPassword ? <FaEyeSlash></FaEyeSlash> : <FaEye></FaEye>}</span>
                        </div>
                        <hr className="mt-3" />
                        <div>
                            <p
                                onClick={() => document.getElementById('my_modal').showModal()}
                                className='text-blue-600 text-right mb-3 cursor-pointer'>
                                Forget Password?</p>
                        </div>
                        <button className="bg-green-700 text-white py-2 rounded-md w-full" type="submit">
                            Login</button>
                    </form>

                    <dialog id="my_modal" className="modal modal-bottom sm:modal-middle">
                        <div className="modal-box">
                            <form method="dialog">
                                {/* if there is a button in form, it will close the modal */}
                                <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                            </form>
                            <form onSubmit={handleSubmit(resetPasswrod)}>
                                <div className="modal-content">
                                    <div className="modal-header">
                                        <h3 className="modal-title">Forgot Password?</h3>
                                    </div>
                                    <div className="flex flex-col">
                                        <p className="text-sm text-gray-600">Enter your email to receive a password reset OTP.</p>
                                        <input className="w-full p-2 pl-7 text-black rounded-lg my-1"
                                            type="email"
                                            {...register("resetEmail", { required: true })}
                                            placeholder="Type your email"
                                        />
                                        {errors?.email && <span className='text-red-600'>Email is required</span>}
                                    </div>
                                </div>
                                <button type="submit"
                                    className=" bg-green-700 text-white px-3 py-2 rounded-md">Confirm</button>
                            </form>
                        </div>
                    </dialog>
                </div>
                <div className="hidden md:flex">
                    <Lottie className="h-[620px] w-full md:w-10/12 " animationData={animation} loop={true}></Lottie>
                </div>
            </div>
        </div>
    );
};

export default Login;