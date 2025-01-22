import axios from "axios";
import { useEffect, useState } from "react";
import { createContext } from "react";

export const UserContext = createContext();

export function UserContextProvider({ children }) {
    const [userName, setUserName] = useState("");
    const [userEmail, setUserEmail] = useState("");
    const [ready, setReady] = useState(false);

    useEffect(() => {
        async function fetchUser() {
            try {
                const response = await axios.get("/user/current");
                setUserName(response.data.name);
                setUserEmail(response.data.email);
                setReady(true);
            } catch (e) {
                console.log(e);
                setReady(true); 
            }
        };

        fetchUser();
    }, []);

    const updateUserContext = (newName, newEmail) => {
        setUserName(newName);
        setUserEmail(newEmail);
    };

    return (
        <UserContext.Provider value={{ userName, setUserName, ready, userEmail, setUserEmail, updateUserContext }}>
            {children}
        </UserContext.Provider>
    )
}