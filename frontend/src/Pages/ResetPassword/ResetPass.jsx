import { useNavigate } from "react-router-dom";


const ResetPass = () => {
    let goto = useNavigate();

    let verifyOTP =(e) =>{
        e.preventDefault();
        let otp = e.target.otp.value;
        console.log(otp);
        ///auth/reset-password/confirm
        goto('/auth/login');


    }
    return (
        <div className="flex justify-center items-center py-10">
            <div className="bg-gray-400 w-full md:w-4/12 md:pr-10 text-center p-10 rounded-lg">
                <h2 className="text-3xl font-bold">Confirm OTP</h2>
                <form onSubmit={verifyOTP}>
                    <div>
                        <p className="text-left text-lg font-semibold">Confirm Otp</p>
                        <input className="w-full p-2 pl-7 text-black rounded-lg my-3 outline-none"
                            type="text"
                            name="otp"
                            placeholder="Type your OTP from your email"
                            required />
                    </div>

                    <button className="bg-green-700 text-white py-2 rounded-md w-full" type="submit">
                        Confirm</button>
                </form>

            </div>
        </div>
    );
};

export default ResetPass;