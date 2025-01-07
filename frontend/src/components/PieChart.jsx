import React from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const options = {
    responsive: true,
    plugins: {
        legend: {
            position: "top" // Position of the legend (top, bottom, left, right)
        },
        tooltip: {
            callbacks: {
                label: function (tooltipItem) {
                    const dataset = tooltipItem.dataset;
                    const currentValue = dataset.data[tooltipItem.dataIndex];
                    const total = dataset.data.reduce(
                        (acc, val) => acc + val,
                        0
                    );
                    const percentage = ((currentValue / total) * 100).toFixed(
                        2
                    );
                    return `${currentValue} (${percentage}%)`;
                }
            }
        }
    }
};

// const pieData = {
//     labels: ["Text Messages", "File Attachments", "Links"],
//     datasets: [
//         {
//             label: "Message Types",
//             data: [60, 25, 15], // Replace with your actual data
//             backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
//             hoverBackgroundColor: ["#FF6384CC", "#36A2EBCC", "#FFCE56CC"]
//         }
//     ]
// };

const PieChartExample = ({ pieData }) => {
    return (
        <div style={{ width: "300px", height: "300px" }}>
            <Pie data={pieData} options={options} />
        </div>
    );
};

export default PieChartExample;
