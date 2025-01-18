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
            <div className="text-center border md:w-1/3 mt-5 rounded-xl mx-auto p-5 shadow-md">
                <p>Logged in as {userName} ({userEmail})</p>
                <button onClick={(e) => logout(e)} className="bg-primary text-white w-1/2 md:w-1/3 rounded-full py-1 mt-4 hover:scale-105 hover:shadow-md transition-transform duration-300 ease-in-out">Logout</button>
            </div>
        </>
    );
}