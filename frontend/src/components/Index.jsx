import axios from "axios";
import { useEffect, useState } from "react";

function Index() {
    const [places, setPlaces] = useState([]);

    useEffect(() => {
        async function fetchData() {
            const res = await axios.get("/place");
            setPlaces(res.data);
        }
        fetchData();
    }, [])

    return (
        <div className="container mx-auto px-5">
            <div className="grid gap-6 my-10 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                {places.length > 0 && places.map((place, index) => (
                    <div key={index} className="rounded-2xl overflow-hidden">
                        <img
                            className="aspect-square rounded-xl object-cover"
                            src={`${import.meta.env.VITE_API_DOMAIN}:${import.meta.env.VITE_PORT}/uploads/${place.photos[0]}`}
                            alt={place.title}
                        />
                        <div className="p-2">
                        <h3 className="font-medium ">{place.address.city}, {place.address.country}</h3>
                        <p className="text-sm text-gray-500">{place.title}</p>
                        <p className="flex font-medium mt-1 relative right-1"><i className='bx bx-rupee text-lg'></i>{place.price}<span className="font-normal">&nbsp;per night</span></p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Index;