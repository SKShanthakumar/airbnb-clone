import axios from "axios";
import { useState } from "react"
import FormPhotos from "./formComponents/FormPhotos";
import FormPerks from "./formComponents/FormPerks";

export default function AddPlace() {
    const [title, setTitle] = useState('');
    const [address, setAddress] = useState('');
    const [photos, setPhotos] = useState([]);
    const [photoLink, setPhotoLink] = useState('');
    const [description, setDescription] = useState('');
    const [perks, setPerks] = useState([]);
    const [extraInfo, setExtraInfo] = useState('');
    const [checkIn, setCheckIn] = useState('');
    const [checkOut, setCheckOut] = useState('');
    const [maxGuest, setMaxGuest] = useState(1);

    return (
        <div className="px-6">
            <form>
                <h2 className="text-2xl mt-4">Title</h2>
                <p className="text-gray-500 text-sm my-1">Title for your place, should be short and catchy as in advertisement</p>
                <input type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="border rounded-2xl py-2 px-3 w-full"
                    placeholder="example: Cozy Villa Near Eiffel Tower" />

                <h2 className="text-2xl mt-4">Address</h2>
                <p className="text-gray-500 text-sm my-1">Address to this place</p>
                <input type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="border rounded-2xl py-2 px-3 w-full"
                    placeholder="address" />

                <FormPhotos photos={photos} setPhotos={setPhotos} photoLink={photoLink} setPhotoLink={setPhotoLink} />

                <h2 className="text-2xl mt-4">Description</h2>
                <p className="text-gray-500 text-sm my-1">Add a detailed description of the place</p>
                <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="border rounded-2xl py-2 px-3 w-full"
                    rows={4} />

                <FormPerks perks={perks} setPerks={setPerks}/>

                <h2 className="text-2xl mt-4">Extra Info</h2>
                <p className="text-gray-500 text-sm my-1">House rules etc.,</p>
                <textarea
                    value={extraInfo}
                    onChange={(e) => setExtraInfo(e.target.value)}
                    className="border rounded-2xl py-2 px-3 w-full"
                    rows={3} />

                <h2 className="text-2xl mt-4">Check in & out times</h2>
                <p className="text-gray-500 text-sm my-1">Add check in & out times, remember to have some time window for cleaning the room between guests</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                    <div>
                        <h3 className="my-1">Check in time</h3>
                        <input type="text"
                            value={checkIn}
                            onChange={(e) => setCheckIn(e.target.value)}
                            className="border rounded-2xl py-2 px-3 w-full"
                            placeholder="12:00" />
                    </div>
                    <div>
                        <h3 className="my-1">Check out time</h3>
                        <input type="text"
                            value={checkOut}
                            onChange={(e) => setCheckOut(e.target.value)}
                            className="border rounded-2xl py-2 px-3 w-full"
                            placeholder="11:00" />
                    </div>
                    <div>
                        <h3 className="my-1">Max number of guests</h3>
                        <input type="number"
                            value={maxGuest}
                            onChange={(e) => setMaxGuest(e.target.value)}
                            className="border rounded-2xl py-2 px-3 w-full"
                            placeholder="1" />
                    </div>
                </div>

                <div className="text-center"><button className="bg-primary text-white w-1/3 py-2 rounded-full my-5">Save</button></div>
            </form>
        </div>
    )
}