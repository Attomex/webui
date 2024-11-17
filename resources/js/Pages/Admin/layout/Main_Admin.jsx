import React, { useEffect } from "react";
import {
    AppContent,
    AppSidebar,
    AppFooter,
    AppHeader,
} from "../components/index";
import "../scss/style.scss";

import ErrorLevels from "../components/graphs/barChar/ErrorLevels";
import c from "./layoutModules/Main_Admin.module.css";
import TotalComputersReports from "../components/graphs/barChar/TotalComputersReports";
import LatestVulnerability from "../shared/LatestVulnerability/LatestVulnerability";

const Main_Admin = ({ latest }) => {
    return (
        <div>
            <AppSidebar />
            <div className="wrapper d-flex flex-column min-vh-100">
                <AppHeader />
                <div className="body flex-grow-1">
                    <AppContent />
                    <div style={{ marginLeft: "10px" }}>
                        <br />
                        <LatestVulnerability latest={latest}/>
                        <br />
                        <h2>Графики</h2>
                        <div className={c.app__container}>
                            <div className={c.chart__wrapper}>
                                <ErrorLevels />
                            </div>
                            <div className={c.chart__wrapper}>
                                <TotalComputersReports />
                            </div>
                        </div>
                    </div>
                </div>
                <AppFooter />
            </div>
        </div>
    );
};

export default Main_Admin;
