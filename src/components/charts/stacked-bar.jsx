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
import { data } from "./data";
import CustomTooltip from "./custom-Tooltip";

const StackedBar = ({ height = 300 }) => {
    return (
        <div className="mt-8">
            <ResponsiveContainer width="100%" height={height}>
                <BarChart height={height} data={data}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" tickLine={false} axisLine={false} />
                    <YAxis />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="pv" stackId="a" fill="#3CC8A1" />
                    <Bar dataKey="uv" stackId="a" fill="#FF9741" />
                </BarChart>
            </ResponsiveContainer>
        </div>
      
    );
};

export default StackedBar;
