import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { perkIconsMap, perkTextMap } from "./formComponents/perkMaps";
import BookingWidget from "./BookingWidget";
import { UserContext } from "../userContext";
import Login from "./Login";

export default function PlacePage() {
    const { id } = useParams();
    const [place, setPlace] = useState({});
    const [owner, setOwner] = useState({ name: '', old: '' });
    const [showPhotos, setShowPhotos] = useState(false);
    const location = useLocation();
    
    const { userName } = useContext(UserContext);

    useEffect(() => {
        async function fetchData() {
            const res = await axios.get(`/place/public/${id}`);
            const ownerRes = await axios.get(`/user/${res.data.owner}`)
            setPlace(res.data)
            setOwner(ownerRes.data);
        }
        fetchData();
    }, [])

    if (showPhotos) {
        return (
            <div className="absolute bg-white min-w-full min-h-screen overflow-y-scroll">
                <button className="m-5 fixed flex items-center rounded-full border p-2 hover:scale-105 hover:shadow-sm transition-transform duration-300 ease-in-out" onClick={(e) => { e.preventDefault(); setShowPhotos(false) }}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                    </svg>
                </button>
                <div className="container mx-auto w-4/6 mt-6 flex flex-wrap gap-4">
                    {place.photos?.length >= 0 && place.photos.map((photo, index) => (
                        <div key={index}>
                            <img
                                className="rounded-2xl"
                                src={`${import.meta.env.VITE_API_DOMAIN}:${import.meta.env.VITE_PORT}/uploads/${photo}`}
                                alt={place.title}
                            />
                        </div>
                    ))}
                </div>
            </div>
        )
    }

    return (
        <div className="container mx-auto xl:w-4/6 mt-6 px-5">
            <h1 className="text-2xl font-semibold">{place.title}</h1>
            <div className="mt-1 flex gap-1 items-center font-semibold underline">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                </svg>
                <a target="_blank" href={`https://maps.google.com/?q=${place.address?.city}`}>{place.address?.city}, {place.address?.country}</a>
            </div>

            {/* photos */}
            {place.photos?.length >= 5 && (
                <div className="w-full mx-auto my-5 relative">
                    {/* For medium and large screens */}
                    <div className="hidden md:grid md:grid-cols-2 md:gap-2 rounded-2xl overflow-hidden">
                        <div>
                            <img
                                onClick={(e) => setShowPhotos(true)}
                                className="aspect-square object-cover cursor-pointer"
                                src={`${import.meta.env.VITE_API_DOMAIN}:${import.meta.env.VITE_PORT}/uploads/${place.photos[0]}`}
                                alt={place.title}
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                            <img
                                onClick={(e) => setShowPhotos(true)}
                                className="aspect-square object-cover cursor-pointer"
                                src={`${import.meta.env.VITE_API_DOMAIN}:${import.meta.env.VITE_PORT}/uploads/${place.photos[1]}`}
                                alt={place.title}
                            />
                            <img
                                onClick={(e) => setShowPhotos(true)}
                                className="aspect-square object-cover cursor-pointer"
                                src={`${import.meta.env.VITE_API_DOMAIN}:${import.meta.env.VITE_PORT}/uploads/${place.photos[2]}`}
                                alt={place.title}
                            />
                            <img
                                onClick={(e) => setShowPhotos(true)}
                                className="aspect-square object-cover cursor-pointer"
                                src={`${import.meta.env.VITE_API_DOMAIN}:${import.meta.env.VITE_PORT}/uploads/${place.photos[3]}`}
                                alt={place.title}
                            />
                            <img
                                onClick={(e) => setShowPhotos(true)}
                                className="aspect-square object-cover cursor-pointer"
                                src={`${import.meta.env.VITE_API_DOMAIN}:${import.meta.env.VITE_PORT}/uploads/${place.photos[4]}`}
                                alt={place.title}
                            />
                        </div>
                    </div>

                    {/* For small screens */}
                    <div className="md:hidden rounded-2xl overflow-hidden">
                        <img
                            onClick={(e) => setShowPhotos(true)}
                            className="aspect-video object-cover cursor-pointer"
                            src={`${import.meta.env.VITE_API_DOMAIN}:${import.meta.env.VITE_PORT}/uploads/${place.photos[0]}`}
                            alt={place.title}
                        />
                    </div>

                    <div onClick={(e) => setShowPhotos(true)} className="absolute right-0 bottom-0 flex mb-6 me-5 bg-white rounded-lg py-1 ps-2 pe-3 gap-2 cursor-pointer hover:bg-gray-100">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6" >
                            <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                        </svg>
                        Show all photos
                    </div>
                </div>
            )}
            {/* photos ends */}

            <div className="lg:flex">
                {/* text content */}
                <div className="lg:me-20">
                    <h2 className="text-xl font-semibold">Description</h2>
                    <p className="text-justify mt-3 mb-6 max-h-60 overflow-hidden">{place.description}</p>
                    <hr></hr>
                    <div className="my-4">
                        <h2 className="text-xl font-semibold">Hosted by {owner.name}</h2>
                        <p>{owner.old} of hosting</p>
                    </div>
                    <hr></hr>
                    <div className="my-4">
                        <h2 className="text-xl font-semibold">What this place offers</h2>
                        <div className="grid grid-cols-2">
                            {place.perks?.length > 0 && place.perks.map(perk => (
                                <div key={perk} className="flex gap-2 mt-4">
                                    {perkIconsMap[perk]}
                                    {perkTextMap[perk]}
                                </div>
                            ))}
                        </div>
                    </div>
                    <hr></hr>
                    <div className="my-4">
                        <p><span className="font-semibold">Check-in:</span> {place.checkIn}:00</p>
                        <p><span className="font-semibold">Check-out:</span> {place.checkOut}:00</p>
                        <p><span className="font-semibold">Max number of guests:</span> {place.maxGuests}</p>
                    </div>
                </div>
                {/* text content ends */}

                {/* Booking component */}
                {userName != ""? <BookingWidget place={place}/>: <Login from="placePage" to={location.pathname}/>}
                
                {/* Booking component ends */}

            </div>
            <div className="bg-gray-100 px-8 py-5 mt-3">
                <p className="text-xl font-semibold">Extra info</p>
                <p className="text-justify">{place.extraInfo}</p>
            </div>

            <div className="h-60"></div>
        </div>
    )
}