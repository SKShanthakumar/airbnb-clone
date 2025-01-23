import axios from "axios";
import { useEffect, useState } from "react";
import { createContext } from "react";

export const UserContext = createContext();

export function UserContextProvider({ children }) {
    const [userName, setUserName] = useState("");
    const [userEmail, setUserEmail] = useState("");
    const [profile, setProfile] = useState('')
    const [old, setOld] = useState('');
    const [ready, setReady] = useState(false);

    useEffect(() => {
        async function fetchUser() {
            try {
                const response = await axios.get("/user/current");
                setUserName(response.data.name);
                setUserEmail(response.data.email);
                setProfile(response.data.profilePic);
                setOld(response.data.old);
                setReady(true);
                console.log(response.data)
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
        <UserContext.Provider value={{ ready, userName, setUserName, userEmail, setUserEmail, updateUserContext, profile, setProfile, old, setOld }}>
            {children}
        </UserContext.Provider>
    )
}