import { useState } from "react";
import { differenceInCalendarDays } from 'date-fns';
import axios from "axios";
import { useNavigate } from "react-router-dom";


export default function BookingWidget({ place, owner }) {
    const navigate = useNavigate();

    const [checkIn, setCheckIn] = useState('');
    const [checkOut, setCheckOut] = useState('');
    const [guests, setGuests] = useState('');
    let numberOfNights = 0;

    const [loading, setLoading] = useState(false);

    if (checkIn && checkOut) {
        numberOfNights = differenceInCalendarDays(checkOut, checkIn);
    }

    async function bookThisPlace(e) {
        e.preventDefault();
        const today = new Date();
        const chkIn = new Date(checkIn);
        const chkOut = new Date(checkOut);

        if (numberOfNights <= 0 || chkIn < today || chkOut < today) {
            alert("Enter valid check-in and check-out dates");
            return;
        }
        if (guests <= 0 || guests == '') {
            alert("Enter valid number of guests");
            return;
        }
        if (guests > place.maxGuests) {
            alert(`This place can accommodate only ${place.maxGuests} guests`);
            return;
        }

        setLoading(true);
        const data = {
            "place": place._id,
            "owner": owner.id,
            checkIn,
            checkOut,
            guests,
            nights: numberOfNights,
            price: numberOfNights * place.price
        }
        try {
            const res = await axios.post("/place/book", data);
            setLoading(false);
            if (res) {
                alert("Booking confirmed! check your mail for further details")
                navigate("/profile/bookings");
            } else {
                alert("Error in booking");
            }
            setCheckIn('');
            setCheckOut('');
            setGuests('');
        } catch (e) {
            if (e.response.status >= 400) {
                alert(e.response.data.message);
            }
            setLoading(false);
            setCheckIn('');
            setCheckOut('');
            setGuests('');
        }
    }

    return (
        <div className="shadow-xl rounded-2xl p-5 pt-4 border max-h-fit sticky top-28 mb-8 z-1 max-w-fit mt-8 mx-auto lg:mt-0">
            <p className="flex items-center font-medium text-2xl mt-1 relative right-1"><i className='bx bx-rupee relative top-0.5'></i>{place.price}<span className="font-normal text-lg">&nbsp;per night</span></p>
            <div className="border rounded-2xl mt-5">
                <div className="flex flex-col md:flex-row">
                    <div className="border-b md:border-b-0 md:border-e p-3 pt-2 flex-1 flex flex-col">
                        <label>Check-in</label>
                        <input type="date"
                            value={checkIn}
                            onChange={(e) => setCheckIn(e.target.value)} />
                    </div>
                    <div className="p-3 pt-2 flex-1 flex flex-col">
                        <label>Check-out</label>
                        <input type="date"
                            value={checkOut}
                            onChange={(e) => setCheckOut(e.target.value)} />
                    </div>
                </div>
                <div className="border-t p-3 pt-2">
                    <label>Number of guests</label>
                    <input type="number"
                        className="border rounded-2xl py-2 px-3 mt-2 w-full"
                        placeholder="1 guest"
                        value={guests}
                        onChange={(e) => { setGuests(e.target.value) }} />
                </div>
            </div>
            <button type="submit" onClick={(e) => bookThisPlace(e)} className={`${loading ? "hidden" : ""} border bg-primary text-white rounded-2xl w-full mt-5 py-2`}>Book</button>
            <div className={`${loading ? "" : "hidden"} border bg-primary text-white rounded-2xl w-full mt-5 py-2 animate-pulse text-center`}>Booking...</div>
            {numberOfNights > 0 &&
                <div className="text-center">
                    <p className="text-gray-500 my-3">You won't be charged yet</p>
                    <div className="flex justify-between px-1">
                        <p className="flex items-center"><i className='bx bx-rupee'></i>{place.price}<span className="">&nbsp;x {numberOfNights} night{numberOfNights > 1 ? "s" : ""}</span></p>
                        <p className="font-semibold text-lg"><i className='bx bx-rupee relative top-0.5'></i>{place.price * numberOfNights}</p>
                    </div>
                </div>
            }
        </div>
    )
}