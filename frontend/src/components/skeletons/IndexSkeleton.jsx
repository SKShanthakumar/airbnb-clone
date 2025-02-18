export default function IndexSkeleton() {
    return (
        <div className="container mx-auto px-5">
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