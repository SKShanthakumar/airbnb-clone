import { Outlet } from "react-router-dom"
import Header from "./components/Header"

function Layout(){
    return(
        <>
        <Header/>
        <div className="h-24"></div> {/* space on top of elements to render them below header */}
        <Outlet/>        {/* this is where child route components would be rendered */}
        </>
    );
}

export default Layout;