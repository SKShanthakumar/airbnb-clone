import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useContext } from "react";
import { UserContext } from "../userContext";

function Login() {
    const [user, setUser] = useState({
        email: "",
        password: ""
    });
    const { setUserName, setUserEmail } = useContext(UserContext);
    const navigate = useNavigate();

    async function loginUser(e) {
        e.preventDefault();
        if (user.email === "" || user.password === "") {
            alert("All fields are mandatory");
            return;
        }

        try {
            const response = await axios.post("/user/login", {
                email: user.email,
                password: user.password
            });
            setUserName(response.data.name);               // context update
            setUserEmail(response.data.email);
            alert("Login Successful");
            setUser({
                email: "",
                password: ""
            });
            navigate("/");
        } catch (e) {
            alert("Login Failed")
            setUser({
                email: "",
                password: ""
            });
        }
    }

    return (
        <div className="flex justify-around mt-20">
            <div className="w-96 border rounded-xl p-7 shadow-md">
                <h1 className="text-3xl text-center">Login</h1>
                <form className="flex flex-col mt-7" onSubmit={(e) => loginUser(e)}>
                    <input type="email"
                        placeholder="your@email.com"
                        className="border rounded-2xl py-2 px-3"
                        value={user.email}
                        onChange={(e) => setUser({ ...user, email: e.target.value })}
                    />
                    <input type="password"
                        placeholder="password"
                        className="border rounded-2xl py-2 px-3 mt-2"
                        value={user.password}
                        onChange={(e) => setUser({ ...user, password: e.target.value })}
                    />
                    <button className="border bg-primary text-white rounded-2xl p-1 mt-5 mb-1">Login</button>
                    <div className="text-center text-gray-500">
                        Don't have an account? <Link to="/register" className="text-black underline">Register</Link>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Login;