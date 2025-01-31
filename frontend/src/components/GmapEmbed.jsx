export default function GmapEmbed({ address }) {
    if (!address || !address.city || !address.country) return null;

    const formattedAddress = `${address.locality || ""}, ${address.city}, ${address.pincode || ""}, ${address.country}`;
    const mapSrc = `https://www.google.com/maps?q=${encodeURIComponent(formattedAddress)}&output=embed`;

    return (
        <div className="rounded-2xl overflow-hidden">
            <iframe
                width="100%"
                height="400"
                loading="lazy"
                allowFullScreen
                src={mapSrc}
            ></iframe>
        </div>
    );
};