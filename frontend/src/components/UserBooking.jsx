import axios from "axios";
import { format } from "date-fns";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function UserBooking() {
    const [userBookings, setUserBookings] = useState([]);

    useEffect(() => {
        async function fetchData() {
            try {
                const res = await axios.get("/place/my-bookings");
                setUserBookings(res.data);
            } catch (e) {
                console.log(e);
            }
        }
        fetchData();
    }, [])

    async function cancelBooking(e, booking) {
        e.preventDefault();

        const isConfirmed = confirm("Do you want to cancel booking?");
        if (isConfirmed) {
            await axios.post(`/place/booking/cancel/${booking._id}`)
            setUserBookings(userBookings.filter(item => item != booking));
            alert("Booking cancelled")
        }
    }

    return (
        <div className="container mx-auto p-5 grid grid-cols-1 lg:grid-cols-2 gap-3">
            {userBookings.length > 0 && userBookings.map((booking, index) => (
                <Link key={index}
                    state={{ place: booking.place, booking }}
                    to={`/profile/bookings/${booking._id}   `}
                    className="flex border rounded-2xl overflow-hidden gap-5 bg-gray-100 w-full">
                    <div className="h-36 w-36 border-e flex-shrink-0">
                        <img
                            className="aspect-square object-cover"
                            src={`${import.meta.env.VITE_API_DOMAIN}/uploads/${booking.place.photos[0]}`}
                            alt={booking.title}
                        />
                    </div>
                    <div className="flex grow flex-col justify-between my-2 me-5">
                        <div className="flex justify-between">
                            <h3 className="text-xl truncate max-w-52 sm:max-w-80     md:max-w-96 lg:max-w-48 xl:max-w-80 2xl:max-w-full">{booking.place.title}</h3>
                            <button onClick={(e) => cancelBooking(e, booking)} className="py-2 md:py-0 flex gap-1 items-center border border-red-500 text-red-500 hover:bg-red-500 hover:text-white rounded-2xl px-3">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                                </svg>
                                <span className="hidden md:block">Cancel</span>
                            </button>
                        </div>
                        <div className="flex flex-col gap-0.5">
                            <div className="flex items-center gap-2 text-gray-500">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
                                </svg>
                                <p className="">{format(new Date(booking.checkIn), "dd-MM-yyyy")} - {format(new Date(booking.checkOut), "dd-MM-yyyy")}</p>
                            </div>
                            <div className="flex items-center gap-2 text-gray-500">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z" />
                                </svg>
                                <p>{booking.nights} nights</p>
                            </div>
                        </div>
                        <div className="flex gap-1 items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                            </svg>
                            <p>{booking.place.address.city}, {booking.place.address.country}</p>
                        </div>
                    </div>
                </Link>
            ))}
        </div>
    )
}