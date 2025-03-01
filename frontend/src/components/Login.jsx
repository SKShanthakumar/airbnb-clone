import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useContext } from "react";
import { UserContext } from "../UserContext";

function Login({ from = "" , to = "/"}) {
    const [user, setUser] = useState({
        email: "",
        password: ""
    });
    const { setUserName, setUserEmail, setProfile, setOld, fav, setFav } = useContext(UserContext);
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);

    async function loginUser(e) {
        e.preventDefault();
        setLoading(true);
        if (user.email === "" || user.password === "") {
            alert("All fields are mandatory");
            setLoading(false);
            return;
        }

        try {
            const response = await axios.post("/user/login", {
                email: user.email,
                password: user.password
            });
            setUserName(response.data.name);               // context update
            setUserEmail(response.data.email);
            setProfile(response.data.profilePic);
            setOld(response.data.old);
            setFav(response.data.favourites);
            // alert("Login Successful");
            setUser({
                email: "",
                password: ""
            });
            setLoading(false);
            navigate(to);
        } catch (e) {
            alert("Login Failed")
            setUser({
                email: "",
                password: ""
            });
            setLoading(false);
        }
    }

    return (
        <div className="flex justify-around">
        <div className={`border rounded-xl p-7 ${from == "" ? "mt-20 shadow-md w-full sm:w-96 mx-6" : "mt-10 shadow-xl w-full"} max-h-fit min-w-80`}>
            <h1 className="text-3xl text-center ">{from == "" ? "Login" : "Login to Book"}</h1>
            <form className="flex flex-col mt-7" onSubmit={(e) => loginUser(e)}>
                <input type="email"
                    placeholder="your@email.com"
                    className="border rounded-2xl py-2 px-3"
                    value={user.email}
                    onChange={(e) => setUser({ ...user, email: e.target.value })}
                />
                <input type="password"
                    placeholder="password"
                    className="border rounded-2xl py-2 px-3 mt-3"
                    value={user.password}
                    onChange={(e) => setUser({ ...user, password: e.target.value })}
                />
                <Link to="/forgotPassword" state={{status: "loggedOut"}} className="ps-2 mt-1 text-gray-500 hover:text-black hover:underline max-w-fit">
                    Forgot password?
                </Link>

                <button className={`${loading? "hidden":""} border bg-primary text-white rounded-2xl p-1 mt-5 mb-1 hover:shadow-md`}>Login</button>
                <div className={`${loading? "":"hidden"} border bg-primary text-white rounded-2xl p-1 mt-5 mb-1 text-center animate-pulse cursor-pointer`}>Logging in...</div>

                <div className="text-center text-gray-500">
                    Don't have an account? <Link to="/register" className="text-black underline">Register</Link>
                </div>
            </form>
        </div>
        </div>
    );
}

export default Login;