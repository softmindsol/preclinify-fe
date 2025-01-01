import CustomTooltip from "./custom-Tooltip";

import {
    CartesianGrid,
    XAxis,
    YAxis,
    ResponsiveContainer,
    BarChart,
    Bar,
    Tooltip,
    Legend,
    ReferenceLine,
} from "recharts";

const data = [
    { name: "Page A", uv: 4000, pv: 2400, amt: 2400 },
    { name: "Page B", uv: -3000, pv: 1398, amt: 2210 },
    { name: "Page C", uv: -2000, pv: -9800, amt: 2290 },
    { name: "Page D", uv: 2780, pv: 3908, amt: 2000 },
    { name: "Page E", uv: -1890, pv: 4800, amt: 2181 },
    { name: "Page F", uv: 2390, pv: -3800, amt: 2500 },
    { name: "Page G", uv: 3490, pv: 4300, amt: 2100 },
];

const StackedBarWithSign = ({ height = 300 }) => {
    // Define static colors
    const gridColor = "#e0e0e0"; // Light gray
    const textColorLight = "#64748b"; // Darker gray for light mode
    const textColorDark = "#cbd5e1"; // Lighter gray for dark mode
    const primaryColor = "#4f46e5"; // Indigo
    const successColor = "#10b981"; // Green
    const isDarkMode = false; // Set dark mode manually if required

    return (
        <ResponsiveContainer width="100%" height={height}>
            <BarChart height={height} data={data} stackOffset="sign">
                <CartesianGrid stroke={gridColor} strokeDasharray="3 3" vertical={false} />
                <XAxis
                    dataKey="name"
                    tick={{
                        fill: isDarkMode ? textColorDark : textColorLight,
                        fontSize: "12px",
                    }}
                    tickLine={false}
                    stroke={gridColor}
                    axisLine={false}
                />
                <YAxis
                    tick={{
                        fill: isDarkMode ? textColorDark : textColorLight,
                        fontSize: "12px",
                    }}
                    tickLine={false}
                    stroke={gridColor}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend
                    formatter={(value, entry) => (
                        <span style={{ color: entry.color }}>{value}</span>
                    )}
                />
                <ReferenceLine y={0} stroke={gridColor} />
                <Bar dataKey="pv" stackId="stack" fill={primaryColor} />
                <Bar dataKey="uv" stackId="stack" fill={successColor} />
            </BarChart>
        </ResponsiveContainer>
    );
};

export default StackedBarWithSign;
