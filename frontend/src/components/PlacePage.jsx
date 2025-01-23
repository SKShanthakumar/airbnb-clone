import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { perkIconsMap, perkTextMap } from "./formComponents/perkMaps";
import BookingWidget from "./BookingWidget";
import { UserContext } from "../userContext";
import Login from "./Login";
import PhotosGrid from "./galleryComponents/PhotosGrid";
import Gallery from "./galleryComponents/Gallery";

export default function PlacePage() {
    const { id } = useParams();
    const [place, setPlace] = useState({});
    const [owner, setOwner] = useState({ name: '', email: '', old: '' });
    const [showPhotos, setShowPhotos] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();

    const { userName, userEmail } = useContext(UserContext);

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
            <Gallery photos={place.photos} toggle={setShowPhotos} />
        )
    }

    async function removePlace(e) {
        e.preventDefault();

        const isConfirmed = confirm("Do you want to delete?");
        if (isConfirmed) {
            await axios.post(`/place/delete/${place._id}`);
            alert("Accommodation deleted");
            navigate("/profile/accommodations");
        }
    }

    return (
        <div className="container mx-auto xl:w-4/6 mt-6 px-5">
            <div className="flex justify-between">
                <div>
                    <h1 className="text-2xl font-semibold">{place.title}</h1>
                    <div className="mt-1 flex gap-1 items-center font-semibold underline">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                        </svg>
                        <a target="_blank" href={`https://maps.google.com/?q=${place.address?.city}`}>{place.address?.city}, {place.address?.country}</a>
                    </div>
                </div>
                {userEmail == owner.email &&
                    <div className="flex gap-2">
                        <Link to={"/profile/accommodations/" + place._id} className="flex gap-1 items-center border border-gray-400 hover:bg-gray-400 hover:text-white rounded-2xl px-3">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                            </svg>
                            <span className="hidden md:block">Edit</span>
                        </Link>
                        <button onClick={(e) => removePlace(e)} className="flex gap-1 items-center border border-red-500 text-red-500 hover:bg-red-500 hover:text-white rounded-2xl px-3">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                            </svg>
                            <span className="hidden md:block">Delete</span>
                        </button>
                    </div>
                }
            </div>

            {/* photos */}
            <PhotosGrid photos={place.photos} toggle={setShowPhotos} />
            {/* photos ends */}

            <div className="lg:flex justify-between">
                {/* text content */}
                <div className="lg:me-20">
                    <h2 className="text-xl font-semibold">Description</h2>
                    <p className="text-justify mt-3 mb-6 max-h-60 overflow-hidden">{place.description}</p>
                    <hr></hr>
                    <div className="flex items-center gap-4">
                        <div>
                            {(owner.profilePic != undefined && owner.profilePic != '') &&
                                <div className="w-12 rounded-full overflow-hidden">
                                    <img src={`${import.meta.env.VITE_API_DOMAIN}:${import.meta.env.VITE_PORT}/profile/${owner.profilePic}`}
                                        className="aspect-square object-cover" />
                                </div>
                            }
                            {(owner.profilePic == undefined || owner.profilePic == '') &&
                                <div className="w-12 h-12 rounded-full border border-gray-500 bg-gray-500 text-white p-1">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-9 mx-auto relative top-0.5">
                                        <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z" clipRule="evenodd" />
                                    </svg>
                                </div>
                            }
                        </div>
                        <div className="my-4">
                            <h2 className="text-xl font-semibold">Hosted by {owner.name}</h2>
                            <p>{owner.old} of hosting</p>
                        </div>
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
                {userName != "" ? <BookingWidget place={place} owner={owner} /> : <Login from="placePage" to={location.pathname} />}
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