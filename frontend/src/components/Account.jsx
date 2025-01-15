import { useContext, useState } from "react"
import { UserContext } from "../userContext"
import { Link, Navigate, useNavigate, useParams } from "react-router-dom"
import axios from "axios";
import Accommodation from "./Accomodation";

export default function Account() {
    const [loggedOut, setLoggedOut] = useState(false);
    const { ready, userName, userEmail, setUserName, setUserEmail } = useContext(UserContext);
    const { subPage } = useParams();
    const navigate = useNavigate();

    if (!ready) {
        return <div>Loading...</div>;
    }

    if (!loggedOut && ready && userName === "") {
        return <Navigate to="/login" />;
    }

    function classNames(page) {
        let classes = "py-2 px-4 flex gap-2  ";
        if (subPage === page || (subPage == undefined && page == "account"))
            classes += "bg-primary text-white rounded-full shadow-md";
        else
            classes += "bg-gray-200 rounded-full"
        return classes
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
            <nav className="flex justify-center gap-5 my-3">
                <Link className={classNames("account")} to="/account">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                    </svg>
                    My Profile
                </Link>
                <Link className={classNames("bookings")} to="/account/bookings">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0ZM3.75 12h.007v.008H3.75V12Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm-.375 5.25h.007v.008H3.75v-.008Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                    </svg>
                    My Bookings
                </Link>
                <Link className={classNames("accommodations")} to="/account/accommodations">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 21v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21m0 0h4.5V3.545M12.75 21h7.5V10.75M2.25 21h1.5m18 0h-18M2.25 9l4.5-1.636M18.75 3l-1.5.545m0 6.205 3 1m1.5.5-1.5-.5M6.75 7.364V3h-3v18m3-13.636 10.5-3.819" />
                    </svg>
                    My Accommodations
                </Link>
            </nav>
            {subPage == undefined && (
                <div className="text-center border w-1/3 rounded-xl mx-auto p-5 shadow-md">
                    <p>Logged in as {userName} ({userEmail})</p>
                    <button onClick={(e) => logout(e)} className="bg-primary text-white w-1/3 rounded-full py-1 mt-4">Logout</button>
                </div>
            )}
            {subPage == 'accommodations' && (
                <Accommodation />
            )}
        </>
    );
}