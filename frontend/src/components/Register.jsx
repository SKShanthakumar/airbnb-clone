import { useContext, useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from 'axios';
import { UserContext } from "../UserContext";

function Register() {
    const [user, setUser] = useState({
        name: "",
        email: "",
        phone: "",
        password: "",
        language: []
    });
    const [lang, setLang] = useState('');
    const [checkPass, setCheckPass] = useState('');
    const navigate = useNavigate();

    const location = useLocation();
    const { state } = location;
    const from = state?.from || "";
    const to = state?.to || "/login";

    const { updateUserContext } = useContext(UserContext)

    useEffect(() => {
        if (location.pathname == "/update") {
            async function fetchData() {
                const { data } = await axios.get("/user/current");
                console.log(data)
                setUser({
                    name: data.name,
                    email: data.email,
                    phone: data.phone,
                    password: "",
                    language: data.language
                })
            }
            fetchData();
        }
    }, [])

    function addLang(e) {
        e.preventDefault();
        setUser({ ...user, language: [...user.language, lang] });
        setLang('');
    }

    function removeLang(e, lang) {
        e.preventDefault();
        setUser({ ...user, language: user.language.filter(l => l != lang) });
    }

    async function addUser(e) {
        e.preventDefault();
        if (user.name === "" || user.email === "" || (from == "" && user.password === "") || user.phone === "" || user.language == [] || user.name.trim().length == 0 || user.email.trim().length == 0 || (from == "" && user.password.trim().length == 0) || user.phone.trim().length == 0) {
            alert("All fields are mandatory");
            return;
        }

        if (user.password != checkPass) {
            alert("Passwords do not match");
            return;
        }
        if (user.phone.length < 10) {
            alert("Enter valid phone number");
            return;
        }

        try {
            if (from == "") {
                await axios.post('/user/register', {
                    name: user.name,
                    email: user.email,
                    phone: user.phone,
                    password: user.password,
                    language: user.language
                });
                alert("Registration Successful");
            } else {
                const { data } = await axios.put('/user/update', {
                    name: user.name,
                    email: user.email,
                    phone: user.phone,
                    language: user.language
                });

                updateUserContext(data.name, data.email)
                alert("Update Successful");
            }
            setUser({
                name: "",
                email: "",
                phone: "",
                password: "",
                language: []
            });
            setCheckPass("")
            navigate(to);
        } catch (e) {
            if (e.response.status === 400)
                alert("User already exists");
            else
                alert("Registration Failed");
            setUser({
                name: "",
                email: "",
                phone: "",
                password: "",
                language: []
            });
            console.log(e);
        }
    }

    return (
        <div className="w-96 border rounded-xl p-7 shadow-md mx-auto mt-20 max-h-fit min-w-80">
            <h1 className="text-3xl text-center">{from == "" ? "Register" : "Update"}</h1>
            <form className="flex flex-col mt-7" onSubmit={(e) => addUser(e)}>

                <input type="text"
                    placeholder="your name"
                    className="border rounded-2xl py-2 px-3"
                    value={user.name}
                    onChange={(e) => { setUser({ ...user, name: e.target.value }) }}
                />
                <br />
                <input type="string"
                    placeholder="phone number"
                    className="border rounded-2xl py-2 px-3 mt-2"
                    value={user.phone}
                    onChange={(e) => { setUser({ ...user, phone: e.target.value }) }}
                />
                <input type="email"
                    placeholder="your@email.com"
                    className="border rounded-2xl py-2 px-3 mt-2"
                    value={user.email}
                    onChange={(e) => { setUser({ ...user, email: e.target.value }) }}
                />
                {from == "" && (
                    <div>
                        <br />
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
                    </div>)}
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

                <button className="border bg-primary text-white rounded-2xl p-1 mt-5 mb-1">{from == "" ? "Register" : "Update"}</button>

                {from == "" &&
                    <div className="text-center text-gray-500">
                        Already a member? <Link to="/login" className="text-black underline">Login</Link>
                    </div>
                }
            </form>
        </div>
    );
}

export default Register;