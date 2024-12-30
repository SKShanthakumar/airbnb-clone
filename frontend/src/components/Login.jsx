import { Link } from "react-router-dom"

function Login() {
    return (
        <div className="flex justify-around mt-20">
            <div className="w-96 border rounded-xl p-7 shadow-md">
                <h1 className="text-3xl text-center">Login</h1>
                <form className="flex flex-col mt-7">
                    <input type="email" placeholder="your@email.com" className="border rounded-2xl py-2 px-3" />
                    <input type="password" placeholder="password" className="border rounded-2xl py-2 px-3 mt-2" />
                    <button className="border bg-primary text-white rounded-2xl p-1 mt-5 mb-1">Login</button>
                    <div className="text-center text-gray-500">
                        Don't have an account? <Link to="/register" className="text-black underline">Register</Link>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Login