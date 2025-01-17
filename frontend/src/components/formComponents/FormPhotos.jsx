import axios from "axios";

export default function FormPhotos({photos, setPhotos, photoLink, setPhotoLink}) {

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

    return (
        <div>
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
        </div>
    );
}