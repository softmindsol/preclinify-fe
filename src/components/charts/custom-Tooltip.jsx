const CustomTooltip = ({ active, payload }) => {
    if (active && payload) {
        return (
            <div className="bg-gray-50  p-3 rounded-md space-x-2 rtl:space-x-reverse ">
                <span>{`${payload[0].name}`}</span>
                <span>:</span>
                <span>{`${payload[0].value}%`}</span>
            </div>
        );
    }

    return null;
};

export default CustomTooltip