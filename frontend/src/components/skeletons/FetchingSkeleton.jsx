export default function FetchingSkeleton({ text }){
    return(
        <div className="border bg-gray-200 animate-pulse my-10 mx-20 p-10 rounded-2xl text-center">{text}...</div>
    )
}