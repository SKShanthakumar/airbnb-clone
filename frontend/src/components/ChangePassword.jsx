import { useState } from "react"
import { useLocation, useNavigate } from "react-router-dom";
import axios from 'axios';

export default function ChangePassword() {
    const [curPass, setCurPass] = useState("");
    const [newPass, setNewPass] = useState("");
    const [checkNewPass, setCheckNewPass] = useState("");

    const navigate = useNavigate();
    const location = useLocation();
    const status = location.state.status;

    async function ChangePassword(e) {
        e.preventDefault();
        if (newPass != checkNewPass) {
            alert("New password does not match");
            setNewPass("");
            setCheckNewPass("");
            return;
        }

        if (status == "loggedIn") {
            try {
                const res = await axios.post("/user/change-pass", { curPass, newPass });
                navigate("/profile");
                alert(res.data.message);
            } catch (e) {
                setNewPass("");
                setCheckNewPass("");
                setCurPass("");
                alert(e.response.data.message);
            }
        }
        else if (status == "loggedOut") {
            try {
                const res = await axios.post("/user/change-pass-otp-verified", { password: newPass, email: location.state.email });
                navigate("/login");
                alert(res.data.message);

            } catch (e) {
                setNewPass("");
                setCheckNewPass("");
                alert(e.response.data.message);
                navigate("/forgotPassword")
            }
        }
    }

    return (
        <div className={`w-96 border rounded-xl p-7 mt-14 mx-auto max-h-fit min-w-80`}>
            <h1 className="text-3xl text-center">Password Reset</h1>
            <form className="flex flex-col mt-7" onSubmit={(e) => ChangePassword(e)}>

                {status == "loggedIn" && (
                    <>
                        <input type="password"
                            placeholder="Enter your current password"
                            className="border rounded-2xl py-2 px-3"
                            value={curPass}
                            onChange={(e) => setCurPass(e.target.value)}
                        />
                        <br />
                    </>
                )}

                <input type="password"
                    placeholder="Enter new password"
                    className="border rounded-2xl py-2 px-3 mt-2"
                    value={newPass}
                    onChange={(e) => setNewPass(e.target.value)}
                />
                <input type="text"
                    placeholder="Re-enter new password"
                    className="border rounded-2xl py-2 px-3 mt-2"
                    value={checkNewPass}
                    onChange={(e) => setCheckNewPass(e.target.value)}
                />
                <button type="submit" className="border bg-primary text-white rounded-2xl p-1 mt-8 mb-1 hover:shadow-md">Update</button>
            </form>
        </div>
    )
}