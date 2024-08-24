import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import { Spinner } from "react-bootstrap";
import axios from "axios";
import "chart.js/auto";
import c from "../ChartsModules/MainModule.module.css";
import { Ticks } from "chart.js/auto";

const TotalComputersReports = () => {
    const [chartData, setChartData] = useState({});
    const [loading, setLoading] = useState(true);


    
    useEffect(() => {
        // Загрузка данных с сервера
        const fetchData = async () => {
            
        
        Promise.all([
            await axios.get("/admin/computers/count"),
            await axios.get("/admin/reports/count"),
        ])
            .then((responses) => {
                const computerCount = responses[0].data.count;
                const reportCount = responses[1].data.count;

                setChartData({
                    labels: ["Компьютеры", "Отчёты"],
                    datasets: [
                        {
                            label: "Общее количество",
                            data: [computerCount, reportCount],
                            backgroundColor: [
                                "rgba(54, 162, 235, 0.2)",
                                "rgba(255, 206, 86, 0.2)",
                            ],
                            borderColor: [
                                "rgba(54, 162, 235, 1)",
                                "rgba(255, 206, 86, 1)",
                            ],
                            borderWidth: 1,
                        },
                    ],
                });
            })
            .catch((error) => {
                console.error("Error fetching counts:", error);
            })
            .finally(() => setLoading(false));
        };

        fetchData();
    }, []);

    const options = {
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    stepSize: 1,
                    callback: function (value) {
                        if (Number.isInteger(value)) {
                            return value;
                        }
                        return "";
                    },
                },
            },
        },
    };

    return (
        <div className={c.main__bars__container}>
            <h5 style={{height: "48px"}}>Общее количество компьютеров и отчётов</h5>
            {loading ? (
                <div className="d-flex justify-content-center flex-column align-items-center">
                    <Spinner animation="border" role="status"></Spinner>
                    <div>
                        <span>Загрузка графика</span>
                    </div>
                </div>
            ) : chartData.labels ? (
                <Bar data={chartData} options={options} />
            ) : (
                <p>No data available</p>
            )}
        </div>
    );
};

export default TotalComputersReports;
