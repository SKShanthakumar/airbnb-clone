import { useContext, useState } from "react"
import { UserContext } from "../userContext"
import { Navigate, useNavigate } from "react-router-dom"
import axios from "axios";

export default function Profile() {
    const [loggedOut, setLoggedOut] = useState(false);
    const { ready, userName, userEmail, setUserName, setUserEmail } = useContext(UserContext);
    const navigate = useNavigate();

    if (!ready) {
        return <div>Loading...</div>;
    }

    if (!loggedOut && ready && userName === "") {
        return <Navigate to="/login" />;
    }

    async function logout(e) {
        await axios.post("/user/logout");
        setLoggedOut(true);
        setUserName("");
        setUserEmail("");
        navigate("/");
    }

    return (
        <>
            <div className="text-center border w-1/3 rounded-xl mx-auto p-5 shadow-md">
                <p>Logged in as {userName} ({userEmail})</p>
                <button onClick={(e) => logout(e)} className="bg-primary text-white w-1/3 rounded-full py-1 mt-4">Logout</button>
            </div>
        </>
    );
}