import React from "react";
import { useLocation } from "react-router-dom";
import DashNav from "./DashNav";

function MyComponent() {
    const location = useLocation();
    const pageName = location.pathname;

    return (
        <>
            {pageName === "/login" || pageName === '/' ? " " : <DashNav />}

        </>
    );
}

export default MyComponent;
