import React from 'react'
import Sidebar from './Siderbar'
import { LiaSearchSolid } from "react-icons/lia";


const Dashboard = () => {
    const categories = [
        "Acute and Emergency",
        "Allergy and Immunology",
        "Biomedical Sciences",
        "Cancer",
        "Cardiovascular",
        "Child Health",
        "Clinical Biochemistry",
        "Clinical Haematology",
        "Clinical Imaging",
        "Clinical Pharmacology and Therapeutics",
        "Dermatology",
        "Ear, Nose and Throat",
        "Endocrine and Metabolic",
        "Gastrointestinal including Liver",
        "General Practice and Primary Healthcare",
        "Genetics and Genomics",
        "Histopathology",
        "Human Factors and Quality Improvement",
        "Laboratory Haematology",
        "Medical Ethics and Law",
        "Medicine of Older Adult",
        "Mental Health",
        "Microbiology",
        "Musculoskeletal",
    ];
  return (
    <div className='flex'>
          <div className="">
              <Sidebar />
              
          </div>
          <div className="bg-gray-50 py-8 px-4 w-full">
            <div className='flex justify-end'> 
                  <div className="relative w-[320px] ">
                      <input
                          type="search"
                          placeholder="Search for anything"
                          className="p-2 pl-10 w-full rounded-[8px]  focus:outline-none focus:ring-2 focus:ring-gray-400"
                      />
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                          <LiaSearchSolid />
                      </span>
                  </div>
            </div>
             
         
              <div className="bg-white rounded-[2px] p-5 mt-10">
                  <ul className="divide-y divide-gray-200">
                      {categories.map((category, index) => (
                          <li
                              key={index}
                              className="py-4 text-[#000000] text-[14px] font-semibold hover:bg-gray-100 cursor-pointer"
                          >
                              {category}
                          </li>
                      ))}
                  </ul>
              </div>
          </div>
    </div>
  )
}

export default Dashboard