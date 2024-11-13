// deleteReport.js
import axios from "axios";

export const handleDeleteReport = async (selectedReportNumber, selectedDate, handleCloseModal, setError, setMessage) => {
    try {
        const response = await axios.delete(`/admin/view/`, {
            data: {
                report_number: selectedReportNumber,
                report_date: selectedDate,
            },
        });
        handleCloseModal();
        alert(response.data.message);
        setError("");
        window.location.reload(true);
    } catch (error) {
        setError(error.response?.data?.error || "An error occurred");
        setMessage("");
    }
};
