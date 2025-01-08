import React from 'react'

const ChemistryBeaker = ({ beakerToggledHandler }) => {
    return (
        <div className="max-w-lg mx-auto bg-white text-[#000000]  p-8">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-x-3">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-flask-conical"><path d="M14 2v6a2 2 0 0 0 .245.96l5.51 10.08A2 2 0 0 1 18 22H6a2 2 0 0 1-1.755-2.96l5.51-10.08A2 2 0 0 0 10 8V2" /><path d="M6.453 15h11.094" /><path d="M8.5 2h7" /></svg>
                    <h1 className="text-xl font-light">Lab Values</h1>
                </div>
                <svg onClick={beakerToggledHandler} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-x cursor-pointer"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
            </div>
            <div className="flex border-b mb-4">
                <button className="text-blue-500 border-b-2 border-blue-500 px-4 py-2">HAEM</button>
                <button className="text-[#000000] px-4 py-2">CHEM</button>
                <button className="text-[#000000] px-4 py-2">MISCELLANEOUS</button>
            </div>
            <div className="font-light">
                <h2 className="text-lg font-medium mb-2">Normal Values</h2>
                <p className="text-[#000000] mb-4">
                    The figures quoted within the themes are all standardised to the units shown below. Note ranges vary between populations and age groups and it is important to always check the reference ranges.
                </p>
                <h3 className="text-lg font-medium mb-2">Haematology</h3>
                <div className="mb-2">
                    <div className="flex justify-between ">
                        <span>Haemoglobin</span>
                        <span>(M) 130 – 170 g/L</span>
                    </div>
                    <div className="flex justify-between">
                        <span></span>
                        <span>(F) 115 – 155 g/L</span>
                    </div>
                </div>
                <div className="flex justify-between mb-2">
                    <span>White cell count</span>
                    <span>3.0 – 10.0 x 10⁹ /L</span>
                </div>
                <div className="flex justify-between mb-2">
                    <span>Platelets</span>
                    <span>150 – 400 x 10⁹/L</span>
                </div>
                <div className="flex justify-between mb-2">
                    <span>Mean cell Haemoglobin (MCH)</span>
                    <span>27 – 33 pg</span>
                </div>
                <div className="flex justify-between mb-2">
                    <span>Mean cell haemoglobin concentration <br /> (MCHC)</span>
                    <span>320 – 350 g/L</span>
                </div>
                <div className="flex justify-between mb-2">
                    <span>Mean cell volume (MCV)</span>
                    <span>80 – 96 fL</span>
                </div>
                <div className="flex justify-between mb-2">
                    <span>Neutrophils</span>
                    <span>2.0 – 7.5 x 10⁹ /L</span>
                </div>
                <div className="flex justify-between mb-2">
                    <span>Lymphocytes</span>
                    <span>1.5 – 4.0 x 10⁹/L</span>
                </div>
                <div className="flex justify-between mb-2">
                    <span>Monocytes</span>
                    <span>0.2 – 1.0 x 10⁹/L</span>
                </div>
                <div className="flex justify-between mb-2">
                    <span>Eosinophils</span>
                    <span>0 – 0.4 x 10⁹/L</span>
                </div>
                <div className="flex justify-between mb-2">
                    <span>Basophils</span>
                    <span>0 – 0.1 x 10⁹/L</span>
                </div>
                <div className="flex justify-between mb-2">
                    <span>Reticulocytes</span>
                    <span>25 – 100 x 10⁹/L</span>
                </div>
            </div>
        </div>
   
    )
}

export default ChemistryBeaker