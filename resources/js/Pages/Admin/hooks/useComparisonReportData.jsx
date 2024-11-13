// useReportData.js
import { useState, useEffect } from "react";
import axios from "axios";

const useComparisonReportData = (selectedComputer, selectedNewDate, selectedOldDate) => {
    const [newDateOptions, setNewDateOptions] = useState([]);
    const [oldDateOptions, setOldDateOptions] = useState([]);
    const [newReportNumberOptions, setNewReportNumberOptions] = useState([]);
    const [oldReportNumberOptions, setOldReportNumberOptions] = useState([]);

    useEffect(() => {
        const getUniqueDates = async () => {
            if (selectedComputer) {
                try {
                    const response = await axios.get(
                        `/admin/getReportsByComputer?computer_identifier=${selectedComputer}`
                    );
                    const uniqueDates = [
                        ...new Set(response.data.map((report) => report.report_date)),
                    ];
                    setNewDateOptions(uniqueDates);
                    setOldDateOptions(uniqueDates);
                } catch (error) {
                    console.error("Error loading dates", error);
                }
            } else {
                setNewDateOptions([]);
                setOldDateOptions([]);
            }
        };

        getUniqueDates();
    }, [selectedComputer]);

    useEffect(() => {
        const getNewReportNumbers = async () => {
            if (selectedNewDate) {
                try {
                    const response = await axios.get(
                        `/admin/getReportsByComputer?computer_identifier=${selectedComputer}&report_date=${selectedNewDate}`
                    );
                    setNewReportNumberOptions(response.data.map((report) => report.report_number));
                } catch (error) {
                    console.error("Error loading report numbers", error);
                }
            } else {
                setNewReportNumberOptions([]);
            }
        };

        getNewReportNumbers();
    }, [selectedComputer, selectedNewDate]);

    useEffect(() => {
        const getOldReportNumbers = async () => {
            if (selectedOldDate) {
                try {
                    const response = await axios.get(
                        `/admin/getReportsByComputer?computer_identifier=${selectedComputer}&report_date=${selectedOldDate}`
                    );
                    setOldReportNumberOptions(response.data.map((report) => report.report_number));
                } catch (error) {
                    console.error("Error loading report numbers", error);
                }
            } else {
                setOldReportNumberOptions([]);
            }
        };

        getOldReportNumbers();
    }, [selectedComputer, selectedOldDate]);

    return {
        newDateOptions,
        oldDateOptions,
        newReportNumberOptions,
        oldReportNumberOptions,
    };
};

export default useComparisonReportData;