import { Outlet } from "react-router-dom"
import Header from "./components/Header"

function Layout(){
    return(
        <>
        <Header/>
        <Outlet/>        {/* this is where child route components would be rendered */}
        </>
    );
}

export default Layout;