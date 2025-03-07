import { useState } from "react";

export default function IndexSkeleton() {
    const [close, setClose] = useState(false);
    return (
        <div className="container mx-auto px-5">
            {!close &&
                <div className="relative mx-auto w-fit h-fit bg-gray-200 rounded-lg text-center mt-5 py-5 overflow-hidden px-8">
                    <span className="font-semibold">Please note:</span> The server may take up to 50 seconds to start on the initial load due to hosting limitations. Thank you for your patience!
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"
                        className="absolute bg-red-500 text-white p-1 top-0 right-0 size-7 rounded-bl-lg cursor-pointer"
                        onClick={e => setClose(true)} >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                    </svg>
                </div>
            }
            <div className="grid gap-6 my-10 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                {[...Array(10)].map((_, index) => (
                    <div key={index} className="h-fit pb-2 border rounded-2xl p-0">
                        <div className="aspect-video sm:aspect-square rounded-xl bg-gray-200 animate-pulse"></div>
                        <div className="w-3/4 h-6 rounded-lg m-3 bg-gray-200 animate-pulse"></div>
                        <div className="w-1/2 h-6 rounded-lg m-3 bg-gray-200 animate-pulse"></div>
                    </div>
                ))}
            </div>
        </div>
    );
}