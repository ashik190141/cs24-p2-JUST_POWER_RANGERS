
// import { Link, useNavigate } from "react-router-dom";
import { AiOutlineMail } from 'react-icons/ai';
import { RiLockPasswordFill } from 'react-icons/ri';
// import { BsFillPersonFill } from 'react-icons/bs';
import { useState } from "react";
import { FaEyeSlash, FaEye } from 'react-icons/fa';
// import Swal from 'sweetalert2';
import Lottie from "lottie-react";
import animation from '../../assets/Registration/SignUpAnimation.json'
import { Helmet } from "react-helmet-async";
import { useForm } from "react-hook-form"

const Register = () => {

    let [showPassword, setShowPassword] = useState(false);


    const { register, handleSubmit, formState: { errors }, } = useForm();
    const onSubmit = (data) => {
        console.log(data);
    };

    return (
        <div className="flex flex-col md:flex-row gap-5 px-2 justify-center items-center mt-5">
            <Helmet>
                <title>Dust Service | Register</title>
            </Helmet>
            <div className="bg-gray-400 w-full md:w-5/12 text-center p-10 rounded-lg">
                <h2 className="text-3xl font-bold mb-2">Register Now!</h2>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="relative">
                        <p className="text-left text-lg font-semibold">User Name</p>
                        {/* <BsFillPersonFill className="absolute bottom-4 left-2"></BsFillPersonFill> */}
                        <input className="w-full p-2 pl-7 text-black rounded-lg my-1"
                            type="text"
                            {...register("name", { required: true })}
                            placeholder="Type your name"
                        />
                        {errors?.name && <span className='text-red-600'>Name is required</span>}
                    </div>
                    <hr className="my-2" />
                    <div className="relative">
                        <p className="text-left text-lg font-semibold">User Email</p>
                        <AiOutlineMail className="absolute bottom-4 left-2"></AiOutlineMail>
                        <input className="w-full p-2 pl-7 text-black rounded-lg my-1"
                            type="email"
                            {...register("email", { required: true })}
                            placeholder="Type your email"
                        />
                        {errors?.email && <span className='text-red-600'>Email is required</span>}
                    </div>
                    <hr className="my-2" />
                    <div className="relative">
                        <p className="text-left text-lg font-semibold">Password</p>
                        <RiLockPasswordFill className="absolute bottom-4 left-2"></RiLockPasswordFill>
                        <input className="w-full p-2 pl-6 text-black rounded-lg my-1"
                            type={showPassword ? 'text' : 'password'}
                            {...register("password", {
                                required: true
                            })}
                            placeholder="Type your password"
                        />
                        {errors.password?.type === "required" && (
                            <span className='text-red-600'>Password is required</span>
                        )}
                        <span onClick={() => setShowPassword(!showPassword)} className="absolute right-3 bottom-4">{showPassword ? <FaEyeSlash></FaEyeSlash> : <FaEye></FaEye>}</span>
                    </div>
                    <hr className="my-2" />
                    <button
                        className="bg-gradient-to-r from-violet-500 to-fuchsia-500 w-full py-2 text-white font-semibold text-lg rounded-xl" type="submit">
                        Register</button>

                </form>
            </div>
            <div className="hidden md:flex">
                <Lottie className="h-[630px] w-full md:w-10/12 " animationData={animation} ></Lottie>
            </div>
        </div>
    );
};

export default Register;