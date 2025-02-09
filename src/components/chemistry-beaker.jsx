import React, { useEffect, useState } from 'react';
import { fetchLabValues } from '../redux/features/lab-value/lab-values.service';
import { useDispatch } from 'react-redux';

const ChemistryBeaker = ({ beakerToggledHandler }) => {
    const [tab, setTab] = useState('HAEM');
    const [labValues, setLabValues] = useState([]); // State to store lab values
    const dispatch = useDispatch();

    function tabHandler(e, tab) {
        setTab(tab);
    }

    useEffect(() => {
        dispatch(fetchLabValues())
            .unwrap()
            .then((res) => {
                if (Array.isArray(res) && res.length > 0) {
                    setLabValues(res); // Set the lab values directly
                } else {
                    console.warn("API returned an empty array or invalid data");
                }
            })
            .catch((err) => console.error("Error fetching lab values:", err));
    }, [dispatch]);

    // Function to filter lab values by category
    const getValuesByCategory = (category) => {
        return labValues.filter(value => value.Category === category);
    };

    return (
        <div className="min-w-[399px] mx-auto bg-white text-[#000000] p-5">
            <div className="flex items-center justify-center mb-4">
                <div className="flex items-center gap-x-3">
                    <img src="/assets/chemistry-beaker.svg" alt="" />
                    <h1 className="text-[#3F3F46] font-semibold text-[20px]">Lab Values</h1>
                </div>
            </div>
            <div className="flex justify-center items-center space-x-[22px] mb-4">
                <button className={` ${tab === 'HAEM' && 'text-[#3CC8A1] font-semibold border-b-2 border-[#3CC8A1] '} px-4 py-2`} onClick={(e) => tabHandler(e, "HAEM")}>Haem</button>
                <button className={`text-[#000000] font-semibold px-4 py-2 ${tab === 'CHEM' && 'text-[#3CC8A1] border-b-2 border-[#3CC8A1] '}`} onClick={(e) => tabHandler(e, "CHEM")}>Chem</button>
                <button className={`text-[#000000] font-semibold px-4 py-2 ${tab === 'MISCELLANEOUS' && 'text-[#3CC8A1] border-b-2 border-[#3CC8A1] '}`} onClick={(e) => tabHandler(e, "MISCELLANEOUS")}>Misc.</button>
            </div>
            <div className="font-light">
                {
                    tab === "HAEM" ? (
                        <div className='w-[370px]'>
                            <div className="flex justify-center text-xs">
                                <table className="table-auto border-collapse border border-gray-300">
                                    <thead>
                                        <tr className="bg-gray-200 font-semibold text-[14px]">
                                            <th className="border border-gray-300 px-4 py-2">Category</th>
                                            <th className="border border-gray-300 px-4 py-2">Parameter</th>
                                            <th className="border border-gray-300 px-4 py-2">Normal Range</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {getValuesByCategory('Haematology').map((value, index, array) => {
                                            const isSameCategory = index > 0 && value.Category === array[index - 1].Category;
                                            const rowspan = array.filter(v => v.Category === value.Category).length;

                                            return (
                                                <tr key={value.id}>
                                                    {!isSameCategory && (
                                                        <td className="border border-gray-300 px-4 py-2" rowSpan={rowspan}>
                                                            {value.Category}
                                                        </td>
                                                    )}
                                                    <td className="border border-gray-300 px-4 py-2">{value.Parameter}</td>
                                                    <td className="border border-gray-300 px-4 py-2">{value['Normal Range']}</td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    ) : tab === "CHEM" ? (
                        <div className="w-[370px]">
                            <div className="flex justify-center text-xs">
                                <table className="table-auto border-collapse border border-gray-300">
                                    <thead>
                                        <tr className="bg-gray-200 font-semibold text-[14px]">
                                            <th className="border border-gray-300 px-4 py-2">Category</th>
                                            <th className="border border-gray-300 px-4 py-2">Parameter</th>
                                            <th className="border border-gray-300 px-4 py-2">Normal Range</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {getValuesByCategory('Electrolytes').concat(getValuesByCategory('Metabolic Tests')).concat(getValuesByCategory('Liver Function')).map((value, index, array) => {
                                            const isSameCategory = index > 0 && value.Category === array[index - 1].Category;
                                            const rowspan = array.filter(v => v.Category === value.Category).length;

                                            return (
                                                <tr key={value.id}>
                                                    {!isSameCategory && (
                                                        <td className="border border-gray-300 px-4 py-2" rowSpan={rowspan}>
                                                            {value.Category}
                                                        </td>
                                                    )}
                                                    <td className="border border-gray-300 px-4 py-2">{value.Parameter}</td>
                                                    <td className="border border-gray-300 px-4 py-2">{value['Normal Range']}</td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    ) : tab === "MISCELLANEOUS" ? (
                        <div className="flex justify-center text-xs w-[370px]">
                            <div className="flex justify-center text-xs">
                                <table className="table-auto border-collapse border border-gray-300">
                                    <thead>
                                        <tr className="bg-gray-200 font-semibold text-[14px]">
                                            <th className="border border-gray-300 px-4 py-2">Category</th>
                                            <th className=" border border-gray-300 px-4 py-2">Parameter</th>
                                            <th className="border border-gray-300 px-4 py-2">Normal Range</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {getValuesByCategory('Miscellaneous').map((value, index, array) => {
                                            const isSameCategory = index > 0 && value.Category === array[index - 1].Category;
                                            const rowspan = array.filter(v => v.Category === value.Category).length;

                                            return (
                                                <tr key={value.id}>
                                                    {!isSameCategory && (
                                                        <td className="border border-gray-300 px-4 py-2" rowSpan={rowspan}>
                                                            {value.Category}
                                                        </td>
                                                    )}
                                                    <td className="border border-gray-300 px-4 py-2">{value.Parameter}</td>
                                                    <td className="border border-gray-300 px-4 py-2">{value['Normal Range']}</td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    ) : (
                        <div>No value</div>
                    )
                }
            </div>
        </div>
    );
}

export default ChemistryBeaker;