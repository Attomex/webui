import React from "react";

import Main_Admin from "./layout/Main_Admin";

const Main = ({ latest }) => {
    return (
        <>
        {/* try this one */}
            <Main_Admin latest={latest}></Main_Admin>
        </>
    );
};

export default Main;