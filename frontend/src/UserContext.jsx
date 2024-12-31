import axios from "axios";
import { useEffect, useState } from "react";
import { createContext } from "react";

export const UserContext = createContext();

export function UserContextProvider({ children }) {
    const [userName, setUserName] = useState("");

    useEffect(() => {
        async function fetchUser(){
            try {
                const response = await axios.get("/user/current");
                setUserName(response.data.name)
            } catch (e) {
                console.log(e);
            }
        };

        fetchUser();
    }, []);

    return (
        <UserContext.Provider value={{ userName, setUserName }}>
            {children}
        </UserContext.Provider>
    )
}