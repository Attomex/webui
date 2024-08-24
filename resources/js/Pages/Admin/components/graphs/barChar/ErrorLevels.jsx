import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';
import axios from 'axios';
import { Spinner } from 'react-bootstrap';
import c from '../ChartsModules/MainModule.module.css';

const ErrorLevels = () => {
    const [chartData, setChartData] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchChartData = async () => {
            
        
        // Загрузка данных с сервера
        axios.get('/admin/errors')
            .then(response => {
                const data = response.data.error_levels_count;
                setChartData({
                    labels: Object.keys(data),
                    datasets: [
                        {
                            label: 'Количество уникальных уязвимостей',
                            data: Object.values(data),
                            backgroundColor: [
                                'rgba(255, 99, 132, 0.2)',
                                'rgba(54, 162, 235, 0.2)',
                                'rgba(255, 206, 86, 0.2)',
                                'rgba(75, 192, 192, 0.2)'
                            ],
                            borderColor: [
                                'rgba(255, 99, 132, 1)',
                                'rgba(54, 162, 235, 1)',
                                'rgba(255, 206, 86, 1)',
                                'rgba(75, 192, 192, 1)'
                            ],
                            borderWidth: 1,
                        },
                    ],
                });
            })
            .catch(error => {
                console.error('Error fetching error levels count:', error);
            })
            .finally(() => setLoading(false));
        };

        fetchChartData();
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
            <h5 style={{height: "48px"}}>Количество уникальных уязвимостей по уровням</h5>
            {loading ? (
                <div className="d-flex justify-content-center flex-column align-items-center">
                    <Spinner animation="border" role="status">
                    </Spinner>
                    <div>
                        <span>Загрузка графика</span>
                    </div>
                </div>
            ) : (
            chartData.labels ? <Bar data={chartData} options={options} /> : <p>Loading...</p>
            )}
        </div>
    );
};

export default ErrorLevels;