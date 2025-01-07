import { Line } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
} from "chart.js";

// Register the necessary components
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);
const options = {
    maintainAspectRatio: false, // Enable custom width/height
    layout: {
        padding: {
            top: 10,
            bottom: 10,
            left: 10,
            right: 10
        }
    },
    scales: {
        x: {
            ticks: {
                maxRotation: 45, // Tilt labels
                minRotation: 45,
                autoSkip: true // Skip some labels for compactness
            }
        },
        y: {
            beginAtZero: true
        }
    }
};

export default function LineChart({ data }) {
    return (
        <div style={{ width: "400px", height: "300px" }}>
            <Line data={data} options={options} />
        </div>
    );
}
