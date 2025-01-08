"use client";
import {
    CartesianGrid,
    XAxis,
    YAxis,
    ResponsiveContainer,
    BarChart,
    Bar,
    Tooltip,
} from "recharts";
import CustomTooltip from "./custom-Tooltip";

const StackedBar = ({ days, height = 300 }) => {
    // Create a mapping of day indices to friendly names
    const friendlyNames = days.map((day, index) => `Day ${index + 1}`);

    // Transform the days data into the format required for the chart
    const chartData = days.map((day, index) => ({
        name: friendlyNames[index], // Use friendly names instead of dates
        correct: day.correct, // Correct answers
        incorrect: day.incorrect, // Incorrect answers
    }));

    console.log("chartData:", chartData);

    return (
        <div className="mt-8">
            <ResponsiveContainer width="95%" height={height}>
                <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" tickLine={false} axisLine={false} />
                    <YAxis />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="correct" stackId="a" fill="#3CC8A1" />
                    <Bar dataKey="incorrect" stackId="a" fill="#FF9741" />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default StackedBar;