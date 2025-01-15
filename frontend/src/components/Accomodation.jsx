import { Link, useParams } from "react-router-dom";
import AddPlace from "./AddPlace";

export default function Accommodation() {
    const { action } = useParams();

    return (
        <>
            {action != "new" && (
                <div className="text-center mt-3">
                    <Link to="/account/accommodations/new" className="inline-flex gap-2 bg-primary text-white py-2 px-3 rounded-full shadow-md">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                        </svg>
                        Add new place
                    </Link>
                </div>
            )}
            {action == "new" && (
                <AddPlace/>
            )}
        </>
    )
}