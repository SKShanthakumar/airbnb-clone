export default function EditPlaceSkeleton() {
    return (
        <div className="container mx-auto px-5">
            <div className="lg:w-1/12 w-3/12 h-8 rounded-xl bg-gray-200 animate-pulse mt-4"></div>
            <div className="lg:w-3/12 w-1/2 h-5 rounded-xl bg-gray-200 animate-pulse mt-2"></div>
            <div className="w-full h-10 rounded-xl bg-gray-200 animate-pulse mt-2"></div>

            <div className="lg:w-1/12 w-3/12 h-8 rounded-xl bg-gray-200 animate-pulse mt-8"></div>
            <div className="lg:w-2/12 w-5/12 h-5 rounded-xl bg-gray-200 animate-pulse mt-2"></div>
            <div className="w-full h-10 rounded-xl bg-gray-200 animate-pulse mt-2"></div>
            <div className="grid grid-cols-4 gap-2">
                <div className="w-full h-10 rounded-xl bg-gray-200 animate-pulse mt-2"></div>
                <div className="w-full h-10 rounded-xl bg-gray-200 animate-pulse mt-2"></div>
                <div className="w-full h-10 rounded-xl bg-gray-200 animate-pulse mt-2"></div>
                <div className="w-full h-10 rounded-xl bg-gray-200 animate-pulse mt-2"></div>
            </div>

            <div className="lg:w-1/12 w-3/12 h-8 rounded-xl bg-gray-200 animate-pulse mt-8"></div>
            <div className="w-2/12 h-5 rounded-xl bg-gray-200 animate-pulse mt-2"></div>
            <div className="grid grid-cols-12 gap-2">
                <div className="w-full lg:col-span-11 col-span-10 h-10 rounded-xl bg-gray-200 animate-pulse mt-2"></div>
                <div className="w-full lg:col-span-1 col-span-2 h-10 rounded-xl bg-gray-200 animate-pulse mt-2"></div>
            </div>
            <div className="w-44 h-24 rounded-xl bg-gray-200 animate-pulse mt-2"></div>
        </div>
    )
}