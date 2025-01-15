import axios from "axios";
import { useState } from "react"

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

    async function addPhotoByLink(e) {
        e.preventDefault();
        const res = await axios.post("/place/upload-by-link", {
            link: photoLink
        })
        setPhotoLink('');
        setPhotos([...photos, res.data.fileName])
    }

    async function uploadFromDevice(e) {
        const selectedFiles = e.target.files;
        if (selectedFiles.length === 0) return;

        const formData = new FormData();

        // Append all selected files to formData
        Array.from(selectedFiles).forEach(file => {
            formData.append('photos', file);
        });

        try {
            const res = await axios.post('/place/upload-from-device', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            setPhotos([...photos, ...res.data.fileNames]);
        } catch (error) {
            console.error("Error uploading files:", error);
        }
    }

    function handlePerkChange(e) {
        const { checked, name } = e.target;
        if (checked) {
            setPerks([...perks, name]);
        } else {
            setPerks(perks.filter(perk => perk != name));
        }
    }

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

                <h2 className="text-2xl mt-4">Photos</h2>
                <p className="text-gray-500 text-sm my-1">More = Better</p>
                <div className="flex gap-2">
                    <input type="text"
                        value={photoLink}
                        onChange={(e) => setPhotoLink(e.target.value)}
                        className="border rounded-2xl py-2 px-3 w-full"
                        placeholder="address" />
                    <button onClick={(e) => addPhotoByLink(e)} className="bg-gray-200 rounded-2xl px-4">Add&nbsp;Photo</button>
                </div>
                <div className="mt-2 flex gap-2">
                    {photos.length > 0 &&
                        photos.map((item) => (
                            <div key={item}>
                                <img src={`${import.meta.env.VITE_API_DOMAIN}:${import.meta.env.VITE_PORT}/uploads/${item}`} className="rounded-2xl h-20" />
                            </div>
                        ))
                    }
                    <label className="flex gap-1 justify-center p-5 items-center border rounded-2xl text-lg h-20 cursor-pointer">
                        <input type="file"
                            multiple
                            onChange={(e) => uploadFromDevice(e)}
                            className="hidden" />
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0 3 3m-3-3-3 3M6.75 19.5a4.5 4.5 0 0 1-1.41-8.775 5.25 5.25 0 0 1 10.233-2.33 3 3 0 0 1 3.758 3.848A3.752 3.752 0 0 1 18 19.5H6.75Z" />
                        </svg>
                        Upload from device
                    </label>
                </div>

                <h2 className="text-2xl mt-4">Description</h2>
                <p className="text-gray-500 text-sm my-1">Add a detailed description of the place</p>
                <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="border rounded-2xl py-2 px-3 w-full"
                    rows={4} />

                <h2 className="text-2xl mt-4">Perks</h2>
                <p className="text-gray-500 text-sm my-1">Select all the perks of your place</p>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2 mt-2">
                    <label className="flex gap-2 border rounded-2xl p-4 items-center cursor-pointer">
                        <input type="checkbox" onChange={(e) => handlePerkChange(e)} name="wifi" />
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8.288 15.038a5.25 5.25 0 0 1 7.424 0M5.106 11.856c3.807-3.808 9.98-3.808 13.788 0M1.924 8.674c5.565-5.565 14.587-5.565 20.152 0M12.53 18.22l-.53.53-.53-.53a.75.75 0 0 1 1.06 0Z" />
                        </svg>
                        <span>Wifi</span>
                    </label>
                    <label className="flex gap-2 border rounded-2xl p-4 items-center cursor-pointer">
                        <input type="checkbox" onChange={(e) => handlePerkChange(e)} name="tv" />
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 20.25h12m-7.5-3v3m3-3v3m-10.125-3h17.25c.621 0 1.125-.504 1.125-1.125V4.875c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125Z" />
                        </svg>
                        <span>TV</span>
                    </label>
                    <label className="flex gap-2 border rounded-2xl p-4 items-center cursor-pointer">
                        <input type="checkbox" onChange={(e) => handlePerkChange(e)} name="pets" />
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6.633 10.25c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 0 1 2.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 0 0 .322-1.672V2.75a.75.75 0 0 1 .75-.75 2.25 2.25 0 0 1 2.25 2.25c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282m0 0h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 0 1-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 0 0-1.423-.23H5.904m10.598-9.75H14.25M5.904 18.5c.083.205.173.405.27.602.197.4-.078.898-.523.898h-.908c-.889 0-1.713-.518-1.972-1.368a12 12 0 0 1-.521-3.507c0-1.553.295-3.036.831-4.398C3.387 9.953 4.167 9.5 5 9.5h1.053c.472 0 .745.556.5.96a8.958 8.958 0 0 0-1.302 4.665c0 1.194.232 2.333.654 3.375Z" />
                        </svg>
                        <span>Pets</span>
                    </label>
                    <label className="flex gap-2 border rounded-2xl p-4 items-center cursor-pointer">
                        <input type="checkbox" onChange={(e) => handlePerkChange(e)} name="hotWater" />
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0 1 12 21 8.25 8.25 0 0 1 6.038 7.047 8.287 8.287 0 0 0 9 9.601a8.983 8.983 0 0 1 3.361-6.867 8.21 8.21 0 0 0 3 2.48Z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 18a3.75 3.75 0 0 0 .495-7.468 5.99 5.99 0 0 0-1.925 3.547 5.975 5.975 0 0 1-2.133-1.001A3.75 3.75 0 0 0 12 18Z" />
                        </svg>
                        <span>Hot&nbsp;Water</span>
                    </label>
                    <label className="flex gap-2 border rounded-2xl p-4 items-center cursor-pointer">
                        <input type="checkbox" onChange={(e) => handlePerkChange(e)} name="freeParking" />
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 0 0-3.213-9.193 2.056 2.056 0 0 0-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 0 0-10.026 0 1.106 1.106 0 0 0-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
                        </svg>
                        <span>Free&nbsp;Parking</span>
                    </label>
                    <label className="flex gap-2 border rounded-2xl p-4 items-center cursor-pointer">
                        <input type="checkbox" onChange={(e) => handlePerkChange(e)} name="complFood" />
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 21v-7.5a.75.75 0 0 1 .75-.75h3a.75.75 0 0 1 .75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349M3.75 21V9.349m0 0a3.001 3.001 0 0 0 3.75-.615A2.993 2.993 0 0 0 9.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 0 0 2.25 1.016c.896 0 1.7-.393 2.25-1.015a3.001 3.001 0 0 0 3.75.614m-16.5 0a3.004 3.004 0 0 1-.621-4.72l1.189-1.19A1.5 1.5 0 0 1 5.378 3h13.243a1.5 1.5 0 0 1 1.06.44l1.19 1.189a3 3 0 0 1-.621 4.72M6.75 18h3.75a.75.75 0 0 0 .75-.75V13.5a.75.75 0 0 0-.75-.75H6.75a.75.75 0 0 0-.75.75v3.75c0 .414.336.75.75.75Z" />
                        </svg>
                        <span>Complimentary Food</span>
                    </label>
                </div>

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