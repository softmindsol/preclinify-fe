import { useState, useEffect } from 'react';
import ReactApexChart from 'react-apexcharts';

const StackedBarChart = ({ heading, series, colors, categories }) => {
    const [chartData, setChartData] = useState({
        series: [],
        options: {
            chart: {
                type: 'bar',
                height: 350,
                stacked: true, 
            },
            plotOptions: {
                bar: {
                    horizontal: false,
                    columnWidth: '50%',
                    endingShape: 'rounded',
                    stacked: true, 
                },
            },
            colors: [],
            dataLabels: {
                enabled: false,
            },
            stroke: {
                show: true,
                width: 2,
                colors: ['transparent'],
            },
            xaxis: {
                categories: [],
            },
            yaxis: {
                title: {
                    text: 'Progress',
                },
            },
            fill: {
                opacity: 1,
            },
            tooltip: {
                y: {
                    formatter: function (val) {
                        return val;
                    },
                },
            },
            legend: {
                position: 'bottom', // Position legend at the top
                horizontalAlign: 'center', // Align legend to the center
                offsetX: 0, // Adjust legend position if needed
            },
        },
    });

    useEffect(() => {
        setChartData((prevData) => ({
            series: series,
            options: {
                ...prevData.options,
                colors: colors,
                xaxis: {
                    categories: categories,
                },
            },
        }));
    }, [series, colors, categories]);

    return (
        <div className='bg-white dark:bg-[#1E1E2A] dark:text-white shadow-lg rounded-lg p-4'>
            <h2 className='text-xl font-bold text-[#52525B] dark:text-white mb-4 text-center'>{heading}</h2>
            <ReactApexChart
                options={chartData.options}
                series={chartData.series}
                type='bar'
                height={410}
            />
        </div>
    );
};

export default StackedBarChart;