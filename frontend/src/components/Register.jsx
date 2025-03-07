import { useContext, useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from 'axios';
import { UserContext } from "../UserContext";
import UpdateSkeleton from "./skeletons/UpdateSkeleton";

function Register() {
    const [user, setUser] = useState({
        name: "",
        email: "",
        password: "",
        language: []
    });

    const [regLoading, setRegLoading] = useState(false);
    const [otpLoading, setOtpLoading] = useState(false);
    const [verifyLoading, setVerifyLoading] = useState(false);
    const [updateLoading, setUpdateLoading] = useState(false);

    const [lang, setLang] = useState('');
    const [checkPass, setCheckPass] = useState('');
    const [otp, setOtp] = useState("");
    const [otpSent, setOtpSent] = useState(false);
    const [otpVerified, setOtpVerified] = useState(false);
    const navigate = useNavigate();

    const location = useLocation();
    const { state } = location;
    const from = state?.from || "";
    const to = state?.to || "/login";

    const { updateUserContext } = useContext(UserContext)

    useEffect(() => {
        try {
            if (location.pathname == "/update") {
                async function fetchData() {
                    const { data } = await axios.get("/user/current");
                    setUser({
                        name: data.name,
                        email: data.email,
                        password: "",
                        language: data.language
                    })
                    setUpdateLoading(false);
                }
                setUpdateLoading(true);
                fetchData();
            }
        } catch (e) {
            if (e.response.status >= 400) {
                alert(e.response.data.message);
            }
            setUpdateLoading(false);
        }
    }, [])

    function addLang(e) {
        e.preventDefault();
        if (lang.trim() == "") {
            alert("Language cannot be empty");
            return;
        }
        setUser({ ...user, language: [...user.language, lang] });
        setLang('');
    }

    function removeLang(e, lang) {
        e.preventDefault();
        setUser({ ...user, language: user.language.filter(l => l != lang) });
    }

    async function sendOtp(e) {
        e.preventDefault();
        setOtpLoading(true);
        try {
            const { data } = await axios.post("/user/send-otp", { email: user.email });
            setOtpSent(true);
            setOtpLoading(false);
        } catch (e) {
            alert(e.response.data.message);
            setOtpLoading(false);
        }
    }

    async function verifyOtp(e) {
        e.preventDefault();
        setVerifyLoading(true);
        try {
            await axios.post("/user/verify-otp", { email: user.email, otp });
            setOtpVerified(true);
            setVerifyLoading(false);
        } catch (e) {
            alert(e.response.data.message);
            setVerifyLoading(false);
        }
    }

    async function addUser(e) {
        e.preventDefault();
        setRegLoading(true);
        if (user.name === "" || (from == "" && user.email === "") || (from == "" && user.password === "") || user.language == [] || user.name.trim().length == 0 || (from == "" && user.email.trim().length == 0) || (from == "" && user.password.trim().length == 0)) {
            alert("All fields are mandatory");
            setRegLoading(false);
            return;
        }

        try {
            if (from == "") {
                if (user.password != checkPass) {
                    alert("Passwords do not match");
                    setRegLoading(false);
                    return;
                }

                if (user.password.trim().length < 8) {
                    alert("Password should be atleast 8 characters long");
                    setRegLoading(false);
                    return;
                }

                if (!otpVerified) {
                    alert("verify your email using OTP");
                    setRegLoading(false);
                    return
                }

                await axios.post('/user/register', {
                    name: user.name,
                    email: user.email,
                    password: user.password,
                    language: user.language
                });
            } else {
                const { data } = await axios.put('/user/update', {
                    name: user.name,
                    language: user.language
                });

                updateUserContext(data.name, data.email)
            }
            setUser({
                name: "",
                email: "",
                password: "",
                language: []
            });
            setCheckPass("")
            setOtp("");
            setOtpSent(false);
            setOtpVerified(false);
            setRegLoading(false);
            navigate(to);
        } catch (e) {
            if (e.response.status === 400)
                alert("User already exists");
            else
                alert("Registration Failed");
            setUser({
                name: "",
                email: "",
                password: "",
                language: []
            });
            setCheckPass("")
            setOtp("");
            setOtpSent(false);
            setOtpVerified(false);
            setRegLoading(false);
        }
    }

    if (updateLoading) {
        return <UpdateSkeleton />
    }

    return (
        <div className="flex justify-around">
        <div className="w-96 border rounded-xl p-7 shadow-md mx-6 mt-20 max-h-fit min-w-80">
            <h1 className="text-3xl text-center">{from == "" ? "Register" : "Update"}</h1>
            <form className="flex flex-col mt-7" onSubmit={(e) => addUser(e)}>

                <input type="text"
                    placeholder="your name"
                    className="border rounded-2xl py-2 px-3"
                    value={user.name}
                    onChange={(e) => { setUser({ ...user, name: e.target.value }) }}
                />


                {from == "" && (
                    <>
                        <br />
                        <div className="grid grid-cols-3 gap-1">
                            <input type="email"
                                placeholder="your@email.com"
                                className="border rounded-2xl py-2 px-3 col-span-2 max-h-fit"
                                value={user.email}
                                onChange={(e) => { setUser({ ...user, email: e.target.value }) }}
                            />
                            <button onClick={(e) => { sendOtp(e) }} className={`${otpLoading ? "hidden" : ""} border bg-primary text-white rounded-2xl p-1 h-full`}>Send OTP</button>
                            <div className={`${otpLoading ? "" : "hidden"} border bg-primary text-white rounded-2xl p-1 pt-2 h-full items-center text-center animate-pulse cursor-pointer`}>Sending...</div>
                        </div>

                        {otpSent && !otpVerified && (
                            <>
                                <div className="flex items-center gap-1 text-green-500 px-2 mt-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                    </svg>
                                    <p>OTP sent</p>
                                </div>
                                <div className="grid grid-cols-3 gap-1 mt-2">
                                    <input type="string"
                                        placeholder="enter OTP"
                                        className="border rounded-2xl py-2 px-3 col-span-2 max-h-fit"
                                        value={otp}
                                        onChange={(e) => { setOtp(e.target.value) }}
                                    />
                                    <button onClick={(e) => { verifyOtp(e) }} className={`${verifyLoading ? "hidden" : ""} border bg-primary text-white rounded-2xl p-1 h-full`}>Verify OTP</button>
                                    <div className={`${verifyLoading ? "" : "hidden"} border bg-primary text-white rounded-2xl p-1 pt-2 h-full items-center text-center animate-pulse cursor-pointer`}>Verifying...</div>
                                </div>
                                <p className="text-justify text-gray-400 px-2 mt-2">You would have received an OTP if you have entered a valid email address</p>
                            </>
                        )}

                        {otpVerified && (
                            <div className="flex items-center gap-1 text-green-500 px-2 mt-2">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                </svg>
                                <p>email verified</p>
                            </div>

                        )}

                        <br />
                        <div>
                            <input type="password"
                                placeholder="password"
                                className="border rounded-2xl py-2 px-3 w-full"
                                value={user.password}
                                onChange={(e) => { setUser({ ...user, password: e.target.value }) }}
                            />
                            <input type="string"
                                placeholder="re-enter password"
                                className="border rounded-2xl py-2 px-3 mt-2 w-full"
                                value={checkPass}
                                onChange={(e) => { setCheckPass(e.target.value) }}
                            />
                        </div>
                    </>
                )}

                <br />
                <div className="grid grid-cols-3 gap-1">
                    <input type="string"
                        placeholder="languages known"
                        className="border rounded-2xl py-2 px-3 col-span-2 max-h-fit"
                        value={lang}
                        onChange={(e) => { setLang(e.target.value) }}
                    />
                    <button onClick={(e) => addLang(e)} className="border bg-primary text-white rounded-2xl p-1 h-full">Add</button>
                </div>
                <div className="flex gap-2 flex-wrap mx-1 mt-3">
                    {user.language.length > 0 && user.language.map((l, index) => (
                        <div className="flex items-center gap-2 border rounded-full ps-3" key={index}>
                            <p>{l}</p>
                            <div onClick={(e) => removeLang(e, l)} className="p-1 rounded-full hover:bg-red-500">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                </svg>
                            </div>
                        </div>
                    ))}
                </div>

                <button className={`${regLoading ? "hidden" : ""} border bg-primary text-white rounded-2xl p-1 mt-5 mb-1`}>{from == "" ? "Register" : "Update"}</button>
                <div className={`${regLoading ? "" : "hidden"} border bg-primary text-white rounded-2xl p-1 mt-5 mb-1 text-center animate-pulse cursor-pointer`}>{from == "" ? "Registering" : "Updating"}...</div>

                {from == "" &&
                    <div className="text-center text-gray-500">
                        Already a member? <Link to="/login" className="text-black underline">Login</Link>
                    </div>
                }
            </form>
        </div>
        </div>
    );
}

export default Register;