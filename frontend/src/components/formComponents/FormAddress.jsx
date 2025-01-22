import { useEffect, useState } from 'react';

export default function FormAddress({ address, setAddress }) {
    const [street, setStreet] = useState('');
    const [locality, setLocality] = useState('');
    const [city, setCity] = useState('');
    const [pincode, setPincode] = useState('');
    const [country, setCountry] = useState('');

    useEffect(() => {
        // Only update local state if address has changed (for initial load or when it is different)
        if (street == '' || locality == '' || city == '' || pincode == '' || country == '') {
            setStreet(address.street);
            setLocality(address.locality);
            setCity(address.city);
            setPincode(address.pincode);
            setCountry(address.country);
        }
    }, [address]);

    useEffect(() => {
        setAddress({
            street,
            locality,
            city,
            pincode,
            country
        });
    }, [street, locality, city, pincode, country]);

    return (
        <>
            <h2 className="text-2xl mt-4">Address</h2>
            <p className="text-gray-500 text-sm my-1">Address to this place</p>

            <input
                type="text"
                value={street}
                onChange={(e) => { setStreet(e.target.value) }}
                className="border rounded-2xl py-2 px-3 w-full"
                placeholder="Address line 1"
            />

            <div className="grid grid-cols-1 md:grid-cols-4 gap-2 mt-2">
                <input
                    type="text"
                    value={locality}
                    onChange={(e) => { setLocality(e.target.value) }}
                    className="border rounded-2xl py-2 px-3 w-full"
                    placeholder="Locality"
                />
                <input
                    type="text"
                    value={city}
                    onChange={(e) => { setCity(e.target.value) }}
                    className="border rounded-2xl py-2 px-3 w-full"
                    placeholder="City"
                />
                <input
                    type="text"
                    value={pincode}
                    onChange={(e) => { setPincode(e.target.value) }}
                    className="border rounded-2xl py-2 px-3 w-full"
                    placeholder="Pincode"
                />
                <input
                    type="text"
                    value={country}
                    onChange={(e) => { setCountry(e.target.value) }}
                    className="border rounded-2xl py-2 px-3 w-full"
                    placeholder="Country"
                />
            </div>
        </>
    );
}
