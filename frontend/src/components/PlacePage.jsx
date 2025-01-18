import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom"

export default function PlacePage() {
    const { id } = useParams();
    const [place, setPlace] = useState({});
    const [owner, setOwner] = useState({ name: '', old: '' });
    const [showPhotos, setShowPhotos] = useState(false);

    const perkIconsMap = {
        wifi: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.288 15.038a5.25 5.25 0 0 1 7.424 0M5.106 11.856c3.807-3.808 9.98-3.808 13.788 0M1.924 8.674c5.565-5.565 14.587-5.565 20.152 0M12.53 18.22l-.53.53-.53-.53a.75.75 0 0 1 1.06 0Z" />
        </svg>,
        freeParking: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 0 0-3.213-9.193 2.056 2.056 0 0 0-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 0 0-10.026 0 1.106 1.106 0 0 0-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
        </svg>,
        tv: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 20.25h12m-7.5-3v3m3-3v3m-10.125-3h17.25c.621 0 1.125-.504 1.125-1.125V4.875c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125Z" />
        </svg>,
        hotWater: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0 1 12 21 8.25 8.25 0 0 1 6.038 7.047 8.287 8.287 0 0 0 9 9.601a8.983 8.983 0 0 1 3.361-6.867 8.21 8.21 0 0 0 3 2.48Z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 18a3.75 3.75 0 0 0 .495-7.468 5.99 5.99 0 0 0-1.925 3.547 5.975 5.975 0 0 1-2.133-1.001A3.75 3.75 0 0 0 12 18Z" />
        </svg>,
        pets: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6.633 10.25c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 0 1 2.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 0 0 .322-1.672V2.75a.75.75 0 0 1 .75-.75 2.25 2.25 0 0 1 2.25 2.25c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282m0 0h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 0 1-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 0 0-1.423-.23H5.904m10.598-9.75H14.25M5.904 18.5c.083.205.173.405.27.602.197.4-.078.898-.523.898h-.908c-.889 0-1.713-.518-1.972-1.368a12 12 0 0 1-.521-3.507c0-1.553.295-3.036.831-4.398C3.387 9.953 4.167 9.5 5 9.5h1.053c.472 0 .745.556.5.96a8.958 8.958 0 0 0-1.302 4.665c0 1.194.232 2.333.654 3.375Z" />
        </svg>,
        complFood: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 21v-7.5a.75.75 0 0 1 .75-.75h3a.75.75 0 0 1 .75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349M3.75 21V9.349m0 0a3.001 3.001 0 0 0 3.75-.615A2.993 2.993 0 0 0 9.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 0 0 2.25 1.016c.896 0 1.7-.393 2.25-1.015a3.001 3.001 0 0 0 3.75.614m-16.5 0a3.004 3.004 0 0 1-.621-4.72l1.189-1.19A1.5 1.5 0 0 1 5.378 3h13.243a1.5 1.5 0 0 1 1.06.44l1.19 1.189a3 3 0 0 1-.621 4.72M6.75 18h3.75a.75.75 0 0 0 .75-.75V13.5a.75.75 0 0 0-.75-.75H6.75a.75.75 0 0 0-.75.75v3.75c0 .414.336.75.75.75Z" />
        </svg>,
    };

    const perkTextMap = {
        wifi: "Wifi",
        freeParking: "Free Parking",
        tv: "TV",
        hotWater: "Hot Water",
        pets: "Pets Allowed",
        complFood: "Complementary Food",
    };

    useEffect(() => {
        async function fetchData() {
            const res = await axios.get(`/place/${id}`);
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
        <div className="container mx-auto w-4/6 mt-6">
            <h1 className="text-2xl font-semibold">{place.title}</h1>
            <div className="mt-1 flex gap-1 items-center font-semibold underline">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                </svg>
                <a target="_blank" href={`https://maps.google.com/?q=${place.address?.city}`}>{place.address?.city}, {place.address?.country}</a>
            </div>
            {place.photos?.length >= 5 && (
                <div className="grid grid-cols-2 gap-2 rounded-2xl overflow-hidden w-full mx-auto my-5 relative">
                    <div>
                        <img onClick={(e) => setShowPhotos(true)}
                            className="aspect-square object-cover cursor-pointer"
                            src={`${import.meta.env.VITE_API_DOMAIN}:${import.meta.env.VITE_PORT}/uploads/${place.photos[0]}`}
                            alt={place.title}
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-2 as">
                        <img onClick={(e) => setShowPhotos(true)}
                            className="aspect-square object-cover cursor-pointer"
                            src={`${import.meta.env.VITE_API_DOMAIN}:${import.meta.env.VITE_PORT}/uploads/${place.photos[1]}`}
                            alt={place.title}
                        />
                        <img onClick={(e) => setShowPhotos(true)}
                            className="aspect-square object-cover cursor-pointer"
                            src={`${import.meta.env.VITE_API_DOMAIN}:${import.meta.env.VITE_PORT}/uploads/${place.photos[2]}`}
                            alt={place.title}
                        />
                        <img onClick={(e) => setShowPhotos(true)}
                            className="aspect-square object-cover cursor-pointer"
                            src={`${import.meta.env.VITE_API_DOMAIN}:${import.meta.env.VITE_PORT}/uploads/${place.photos[3]}`}
                            alt={place.title}
                        />
                        <img onClick={(e) => setShowPhotos(true)}
                            className="aspect-square object-cover cursor-pointer"
                            src={`${import.meta.env.VITE_API_DOMAIN}:${import.meta.env.VITE_PORT}/uploads/${place.photos[4]}`}
                            alt={place.title}
                        />
                    </div>
                    <div onClick={(e) => setShowPhotos(true)} className="absolute right-0 bottom-0 flex mb-6 me-5 bg-white rounded-lg py-1 ps-2 pe-3 gap-2 cursor-pointer hover:bg-gray-100">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                        </svg>
                        Show all photos
                    </div>
                </div>
            )}
            <div className="flex">
                <div className="me-20">
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

                {/* Booking component */}
                <div className="shadow-xl rounded-2xl p-5 pt-4 border max-h-fit sticky top-5 mb-8 z-1">
                    <p className="flex items-center font-medium text-2xl mt-1 relative right-1"><i className='bx bx-rupee relative top-0.5'></i>{place.price}<span className="font-normal text-lg">&nbsp;per night</span></p>
                    <div className="border rounded-2xl mt-5">
                        <div className="flex">
                            <div className="border-e p-3 pt-2">
                                <label>Check-in</label>
                                <input type="date" />
                            </div>
                            <div className="p-3 pt-2">
                                <label>Check-out</label>
                                <input type="date" />
                            </div>
                        </div>
                        <div className="border-t p-3 pt-2">
                            <label>Number of guests</label>
                            <input type="number"
                                className="border rounded-2xl py-2 px-3 mt-2 w-full"
                                placeholder="1 guest" />
                        </div>
                    </div>
                    <button className="border bg-primary text-white rounded-2xl w-full mt-5 py-2">Book</button>
                </div>
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