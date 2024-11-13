// useReportsData.js
import { useEffect, useState } from "react";
import axios from "axios";

// Хук для загрузки идентификаторов компьютеров
export const useComputerOptions = () => {
    const [computerOptions, setComputerOptions] = useState([]);

    useEffect(() => {
        const loadComputerOptions = async () => {
            try {
                const response = await axios.get("/admin/getComputersIdentifiers");
                setComputerOptions(response.data);
            } catch (error) {
                console.error("Error loading computers", error);
            }
        };
        loadComputerOptions();
    }, []);

    return computerOptions;
};

// Хук для загрузки уникальных дат по выбранному компьютеру
export const useDateOptions = (selectedComputer) => {
    const [dateOptions, setDateOptions] = useState([]);

    useEffect(() => {
        const loadUniqueDates = async () => {
            if (selectedComputer) {
                try {
                    const response = await axios.get(`/admin/getReportsByComputer?computer_identifier=${selectedComputer}`);
                    const uniqueDates = [...new Set(response.data.map(report => report.report_date))];
                    setDateOptions(uniqueDates);
                } catch (error) {
                    console.error("Error loading dates", error);
                }
            } else {
                setDateOptions([]);
            }
        };
        loadUniqueDates();
    }, [selectedComputer]);

    return dateOptions;
};

// Хук для загрузки номеров отчетов по выбранным компьютеру и дате
export const useReportNumberOptions = (selectedComputer, selectedDate) => {
    const [reportNumberOptions, setReportNumberOptions] = useState([]);

    useEffect(() => {
        const loadReportNumbers = async () => {
            if (selectedDate) {
                try {
                    const response = await axios.get(`/admin/getReportsByComputer?computer_identifier=${selectedComputer}&report_date=${selectedDate}`);
                    setReportNumberOptions(response.data.map(report => report.report_number));
                } catch (error) {
                    console.error("Error loading report numbers", error);
                }
            } else {
                setReportNumberOptions([]);
            }
        };
        loadReportNumbers();
    }, [selectedComputer, selectedDate]);

    return reportNumberOptions;
};
