export default function UpdateSkeleton() {
    return (
        <div className="w-96 border rounded-xl p-7 shadow-md mx-auto mt-20 max-h-fit min-w-80">
            <h1 className="text-3xl text-center">Update</h1>
            <div className="w-full h-10 rounded-xl bg-gray-200 animate-pulse mt-8"></div>
            <div className="grid grid-cols-3 gap-2">
                <div className="w-full col-span-2 h-10 rounded-xl bg-gray-200 animate-pulse mt-6"></div>
                <div className="w-full h-10 rounded-xl bg-gray-200 animate-pulse mt-6"></div>
            </div>
            <div className="w-1/4 h-5 rounded-xl bg-gray-200 animate-pulse mt-3"></div>
            <div className="w-full h-8 rounded-xl bg-gray-200 animate-pulse mt-8"></div>
        </div>
    );
}