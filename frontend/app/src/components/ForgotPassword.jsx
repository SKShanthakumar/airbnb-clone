import { useState } from "react";
import axios from 'axios';
import { Navigate } from "react-router-dom";

export default function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState("");
    const [otpSent, setOtpSent] = useState(false);
    const [otpVerified, setOtpVerified] = useState(false);

    const [loading, setLoading] = useState(false);

    async function sendOtp(e) {
        e.preventDefault();
        setLoading(true);
        try {
            await axios.post("/user/send-otp", { email });
            setOtpSent(true);
            setLoading(false);
        } catch (e) {
            alert(e.response.data.message);
            setLoading(false);
        }
    }

    async function verifyOtp(e) {
        e.preventDefault();
        setLoading(true);
        try {
            await axios.post("/user/verify-otp", { email, otp });
            setLoading(false);
            setOtpVerified(true);
        } catch (e) {
            alert(e.response.data.message);
            setLoading(false);
        }
    }

    if (otpVerified) {
        return <Navigate to="/forgotPassword/reset" state={{ status: "loggedOut", email }} />;
    }

    return (
        <div className={`w-96 border rounded-xl p-7 mt-14 mx-auto max-h-fit min-w-80`}>
            <h1 className="text-3xl text-center mb-5">Verify your identity</h1>
            <form className="flex flex-col gap-3">
                {!otpSent && (
                    <>
                        <input type="email"
                            placeholder="Enter your mail id"
                            className="border rounded-2xl py-2 px-3 mt-2"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <button type="submit" onClick={(e) => sendOtp(e)} className={`${loading ? "hidden" : ""} mt-5 border bg-primary text-white rounded-2xl p-1 mb-1 hover:shadow-md`}>Send OTP</button>
                        <div className={`${loading ? "" : "hidden"} mt-5 border text-center bg-primary text-white rounded-2xl p-1 mb-1 animate-pulse`}>Sending OTP...</div>
                    </>
                )}
                {otpSent && !otpVerified && (
                    <>
                        <p className="text-justify text-gray-400 px-2 mt-2">You would have received an OTP if you have entered a valid email address</p>
                        <input type="string"
                            placeholder="enter OTP"
                            className="border rounded-2xl py-2 px-3 col-span-2 max-h-fit"
                            value={otp}
                            onChange={(e) => { setOtp(e.target.value) }}
                        />
                        <button onClick={(e) => { verifyOtp(e) }} className={`${loading ? "hidden" : ""} border bg-primary text-white rounded-2xl p-1 mt-5`}>Verify OTP</button>
                        <div className={`${loading ? "" : "hidden"} mt-5 border text-center bg-primary text-white rounded-2xl p-1 animate-pulse`}>Verifying OTP...</div>
                    </>
                )}
            </form>
        </div>
    )
}