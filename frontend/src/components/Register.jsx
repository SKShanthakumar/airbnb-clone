import { useState } from "react";
import { Link } from "react-router-dom";
import axios from 'axios';

function Register() {
    const [user, setUser] = useState({
        name: "",
        email: "",
        password: ""
    });

    async function addUser(e) {
        e.preventDefault();
        if (user.name === "" || user.email === "" || user.password === "") {
            alert("All fields are mandatory");
            return;
        }

        try {
            await axios.post('/user/register', {
                name: user.name,
                email: user.email,
                password: user.password
            });
            alert("Registration Successful")      
            setUser({
                name: "",
                email: "",
                password: ""
            });
        } catch (e) {
            if(e.response.status === 400)
                alert("User already exists");
            else
                alert("Registration Failed");
            console.log(e);
        }
    }

    return (
        <div className="flex justify-around mt-20">
            <div className="w-96 border rounded-xl p-7 shadow-md">
                <h1 className="text-3xl text-center">Register</h1>
                <form className="flex flex-col mt-7" onSubmit={(e) => addUser(e)}>

                    <input type="text"
                        placeholder="your name"
                        className="border rounded-2xl py-2 px-3"
                        value={user.name}
                        onChange={(e) => { setUser({ ...user, name: e.target.value }) }}
                    />
                    <input type="email"
                        placeholder="your@email.com"
                        className="border rounded-2xl py-2 px-3 mt-2"
                        value={user.email}
                        onChange={(e) => { setUser({ ...user, email: e.target.value }) }}
                    />
                    <input type="password"
                        placeholder="password"
                        className="border rounded-2xl py-2 px-3 mt-2"
                        value={user.password}
                        onChange={(e) => { setUser({ ...user, password: e.target.value }) }}
                    />

                    <button className="border bg-primary text-white rounded-2xl p-1 mt-5 mb-1">Register</button>
                    <div className="text-center text-gray-500">
                        Already a member? <Link to="/login" className="text-black underline">Login</Link>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Register;