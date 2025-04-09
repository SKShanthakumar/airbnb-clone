import axios from "axios";
import { useEffect, useState } from "react";
import { createContext } from "react";

export const UserContext = createContext();

export function UserContextProvider({ children }) {
    const [userId, setUserId] = useState("");
    const [userName, setUserName] = useState("");
    const [userEmail, setUserEmail] = useState("");
    const [profile, setProfile] = useState('')
    const [fav, setFav] = useState([]);
    const [old, setOld] = useState('');
    const [ready, setReady] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [guestCount, setGuestCount] = useState('');

    useEffect(() => {
        async function fetchUser() {
            try {
                const response = await axios.get("/user/current");
                setUserId(response.data.id);
                setUserName(response.data.name);
                setUserEmail(response.data.email);
                setProfile(response.data.profilePic);
                setOld(response.data.old);
                setFav(response.data.favourites)
                setReady(true);
            } catch (e) {
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
        <UserContext.Provider value={{ ready, userId, setUserId, userName, setUserName, userEmail, setUserEmail, updateUserContext, profile, setProfile, old, setOld, fav, setFav, searchQuery, setSearchQuery, guestCount, setGuestCount }}>
            {children}
        </UserContext.Provider>
    )
}