export default function PlacePageSkeleton() {
    return (
        <div className="container mx-auto xl:w-4/6 mt-6 px-5">
            <div className="w-1/2 h-6 rounded-lg bg-gray-200 animate-pulse mt-2"></div>
            <div className="w-1/4 h-6 rounded-lg bg-gray-200 animate-pulse mt-3"></div>
            <div className="w-full xl:h-[500px] lg:h-[450px] sm:h-[350px] h-[260px] rounded-2xl bg-gray-200 animate-pulse my-5"></div>

            <div className="lg:w-2/3 w-full h-6 rounded-lg bg-gray-200 animate-pulse mt-2"></div>
            <div className="lg:w-2/3 w-full h-6 rounded-lg bg-gray-200 animate-pulse mt-2"></div>
            <div className="lg:w-2/3 w-full h-6 rounded-lg bg-gray-200 animate-pulse mt-2"></div>
            <div className="lg:w-1/3 w-2/3 h-6 rounded-lg bg-gray-200 animate-pulse mt-2"></div>

        </div>
    )
}