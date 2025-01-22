import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { perkIconsMap, perkTextMap } from "./formComponents/perkMaps";
import BookingWidget from "./BookingWidget";
import { UserContext } from "../userContext";
import Login from "./Login";
import PhotosGrid from "./galleryComponents/PhotosGrid";
import Gallery from "./galleryComponents/Gallery";

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
            <Gallery photos={place.photos} toggle={setShowPhotos} />
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
            <PhotosGrid photos={place.photos} toggle={setShowPhotos} />
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