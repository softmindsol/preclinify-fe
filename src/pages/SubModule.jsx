import React, { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import { FaAngleLeft } from "react-icons/fa6";
import Fuse from 'fuse.js';

const SubModule = () => {
    const { id } = useParams();
    const navigate = useNavigate(); // Hook to navigate programmatically

    const categories = [
        "Acid-base abnormality",
        "Acute bronchitis",
        "Acute coronary syndromes",
        "Acute kidney injury",
        "Allergic disorder",
        "Anaphylaxis",
        "Aortic aneurysm",
        "Arrhythmias",
        "Cardiac arrest",
        "Cardiac failure",
        "Chronic obstructive pulmonary disease",
        "Compartment syndrome",
        "Deep vein thrombosis",
        "Dehydration",
        "Diabetic ketoacidosis",
        "Drug overdose",
        "Ectopic pregnancy",
        "Epilepsy",
        "Epistaxis",
        "Extradural haemorrhage",
        "Gastrointestinal perforation",
        "Haemoglobinopathies",
        "Hyperosmolar hyperglycaemic state",
    ];
    const [query, setQuery] = useState("");
    const fuse = new Fuse(categories, { keys: ["name"], threshold: 0.4 });

    // Perform fuzzy search
    const results = query ? fuse.search(query).map((result) => result.item) : categories;

    return (
        <div className='flex gap-x-10'>
            <div>
                <Sidebar />
            </div>

            <div>
                <div className='  flex items-start mt-5'>
                    <div className='flex items-center justify-center gap-x-5 bg-[#FFFFFF] rounded-[8px] w-[214px] h-[40px] cursor-pointer ' onClick={() => navigate(-1)}>
                        <FaAngleLeft className='' color='#3CC8A1' />
                        <p className='text-[16px] font-semibold text-[#3CC8A1]'>Back To All Modules</p>
                    </div>

                </div>
                <p className='text-[24px] font-bold text-[#27272A] mt-5'> Acute and Emergency</p>

                <div className="bg-white rounded-[2px] p-5 mt-5 w-screen">
                    <ul className="divide-y divide-gray-200">
                        {results.length > 0 ? (
                            results.map((category, index) => (
                                <li
                                    key={index}
                                    className="py-4 text-[#000000] text-[14px] font-semibold hover:bg-gray-100 cursor-pointer"
                                >
                                    {category}
                                </li>
                            ))
                        ) : (
                            <li className="py-4 text-gray-500">No results found</li>
                        )}
                    </ul>
                </div>
            </div>



        </div>
    )
}

export default SubModule