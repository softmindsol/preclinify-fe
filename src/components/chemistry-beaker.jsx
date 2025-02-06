import React, { useState } from 'react'

const ChemistryBeaker = ({ beakerToggledHandler }) => {
    const [tab, setTab] = useState('HAEM');

    function tabHandler(e, tab) {
        setTab(tab);
    }
    console.log("tab:", tab);

    return (
        <div className="max-w-lg mx-auto bg-white text-[#000000]  p-5">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-x-3">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-flask-conical"><path d="M14 2v6a2 2 0 0 0 .245.96l5.51 10.08A2 2 0 0 1 18 22H6a2 2 0 0 1-1.755-2.96l5.51-10.08A2 2 0 0 0 10 8V2" /><path d="M6.453 15h11.094" /><path d="M8.5 2h7" /></svg>
                    <h1 className="text-xl font-light">Lab Values</h1>
                </div>
                <svg onClick={beakerToggledHandler} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-x cursor-pointer"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
            </div>
            <div className="flex space-x-[22px] border-b mb-4">
                <button className={` ${tab === 'HAEM' && 'text-[#3CC8A1] border-b-2 border-[#3CC8A1] '} px-4 py-2`} onClick={(e) => tabHandler(e, "HAEM")}>HAEM</button>
                <button className={`text-[#000000] px-4 py-2 ${tab === 'CHEM' && ' text-[#3CC8A1] border-b-2 border-[#3CC8A1] '}`} onClick={(e) => tabHandler(e, "CHEM")}>CHEM</button>
                <button className={`text-[#000000] px-4 py-2 ${tab === 'MISCELLANEOUS' && 'text-[#3CC8A1] border-b-2 border-[#3CC8A1] '}`} onClick={(e) => tabHandler(e, "MISCELLANEOUS")}>MISCELLANEOUS</button>
            </div>
            <div className="font-light">
                {
                    tab === "HAEM" ?
                        <div className='w-[370px]'>
                    <div className="flex justify-center  text-xs ">
                        <table className="table-auto border-collapse border border-gray-300">
                            <thead>
                                <tr className="bg-gray-200">
                                    <th className="border border-gray-300 px-4 py-2 ">Category</th>
                                    <th className="border border-gray-300 px-4 py-2">Parameter</th>
                                    <th className="border border-gray-300 px-4 py-2">Normal Range</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td className="border border-gray-300 px-4 py-2" rowSpan="10">Haematology</td>
                                    <td className="border border-gray-300 px-4 py-2">Haemoglobin</td>
                                    <td className="border border-gray-300 px-4 py-2">(M) 130 - 170 g/L, (F) 115 - 155 g/L</td>
                                </tr>
                                <tr>
                                    <td className="border border-gray-300 px-4 py-2">White cell count</td>
                                    <td className="border border-gray-300 px-4 py-2">3.0 - 10.0 x 10<sup>9</sup>/L</td>
                                </tr>
                                <tr>
                                    <td className="border border-gray-300 px-4 py-2">Platelets</td>
                                    <td className="border border-gray-300 px-4 py-2">27 - 33 pg</td>
                                </tr>
                                <tr>
                                    <td className="border border-gray-300 px-4 py-2">Mean cell haemoglobin concentration (MCHC)</td>
                                    <td className="border border-gray-300 px-4 py-2">320 - 350 g/L</td>
                                </tr>
                                <tr>
                                    <td className="border border-gray-300 px-4 py-2">Mean cell volume (MCV)</td>
                                    <td className="border border-gray-300 px-4 py-2">80 - 96 fL</td>
                                </tr>
                                <tr>
                                    <td className="border border-gray-300 px-4 py-2">Neutrophils</td>
                                    <td className="border border-gray-300 px-4 py-2">2.0 - 7.5 x 10<sup>9</sup>/L</td>
                                </tr>
                                <tr>
                                    <td className="border border-gray-300 px-4 py-2">Lymphocytes</td>
                                    <td className="border border-gray-300 px-4 py-2">1.5 - 4.0 x 10<sup>9</sup>/L</td>
                                </tr>
                                <tr>
                                    <td className="border border-gray-300 px-4 py-2">Monocytes</td>
                                    <td className="border border-gray-300 px-4 py-2">0.2 - 1.0 x 10<sup>9</sup>/L</td>
                                </tr>
                                <tr>
                                    <td className="border border-gray-300 px-4 py-2">Basophils</td>
                                    <td className="border border-gray-300 px-4 py-2">0 - 0.1 x 10<sup>9</sup>/L</td>
                                </tr>
                                <tr>
                                    <td className="border border-gray-300 px-4 py-2">Reticulocytes</td>
                                    <td className="border border-gray-300 px-4 py-2">25 - 100 x 10<sup>9</sup>/L</td>
                                </tr>

                                <tr>
                                    <td className="border border-gray-300 px-4 py-2">Packed cell volume (PCV)</td>
                                    <td className="border border-gray-300 px-4 py-2">(M) 0.40 - 0.54, (F) 0.37 - 0.50</td>
                                </tr>
                                <tr>
                                    <td className="border border-gray-300 px-4 py-2">Erythrocyte sedimentation rate (ESR)</td>
                                    <td className="border border-gray-300 px-4 py-2">&lt; 20 mm/hr</td>
                                </tr>
                                <tr>
                                    <td className="border border-gray-300 px-4 py-2">D-dimers</td>
                                    <td className="border border-gray-300 px-4 py-2">&lt; 0.5 mg/L</td>
                                </tr>

                                <tr>
                                    <td className="border border-gray-300 px-4 py-2" rowSpan="4">Coagulation Screen</td>
                                    <td className="border border-gray-300 px-4 py-2">International normalised ratio (INR)</td>
                                    <td className="border border-gray-300 px-4 py-2">1.0</td>
                                </tr>
                                <tr>
                                    <td className="border border-gray-300 px-4 py-2">Activated partial thromboplastin time (APTT)</td>
                                    <td className="border border-gray-300 px-4 py-2">22 - 41 seconds</td>
                                </tr>
                                <tr>
                                    <td className="border border-gray-300 px-4 py-2">Prothrombin time (PT)</td>
                                    <td className="border border-gray-300 px-4 py-2">10 - 12 seconds</td>
                                </tr>
                                <tr>
                                    <td className="border border-gray-300 px-4 py-2">Thrombin time (TT)</td>
                                    <td className="border border-gray-300 px-4 py-2">9 - 15 seconds</td>
                                </tr>
                                <tr>
                                    <td className="border border-gray-300 px-4 py-2">Fibrinogen degradation products</td>
                                    <td className="border border-gray-300 px-4 py-2">&lt; 8 mg/mL</td>
                                </tr>
                                <tr>
                                    <td className="border border-gray-300 px-4 py-2">Factor VIII:C</td>
                                    <td className="border border-gray-300 px-4 py-2">50 - 150 U/dL</td>
                                </tr>
                                <tr>
                                    <td className="border border-gray-300 px-4 py-2">Bleeding time</td>
                                    <td className="border border-gray-300 px-4 py-2">&lt; 10 minutes</td>
                                </tr>

                                <tr>
                                    <td className="border border-gray-300 px-4 py-2" rowSpan="7">Arterial Blood Gas</td>
                                    <td className="border border-gray-300 px-4 py-2">pH</td>
                                    <td className="border border-gray-300 px-4 py-2">7.35 - 7.45</td>
                                </tr>
                                <tr>
                                    <td className="border border-gray-300 px-4 py-2">PaO<sub>2</sub></td>
                                    <td className="border border-gray-300 px-4 py-2">11 - 15 kPa</td>
                                </tr>
                                <tr>
                                    <td className="border border-gray-300 px-4 py-2">PaCO<sub>2</sub></td>
                                    <td className="border border-gray-300 px-4 py-2">4.6 - 6.4 kPa</td>
                                </tr>
                                <tr>
                                    <td className="border border-gray-300 px-4 py-2">Bicarbonate</td>
                                    <td className="border border-gray-300 px-4 py-2">22 - 30 mmol/L</td>
                                </tr>
                                <tr>
                                    <td className="border border-gray-300 px-4 py-2">Base excess</td>
                                    <td className="border border-gray-300 px-4 py-2">-2 to +2 mmol/L</td>
                                </tr>

                            </tbody>
                        </table>
                            </div></div> :
                        tab === "CHEM" ? <div className=" w-[370px]">
                            <div className="flex justify-center  text-xs">
                                <table className="table-auto border-collapse border border-gray-300">
                                    <thead>
                                        <tr className="bg-gray-200">
                                            <th className="border border-gray-300 px-4 py-2 ">Category</th>
                                            <th className="border border-gray-300 px-4 py-2">Parameter</th>
                                            <th className="border border-gray-300 px-4 py-2">Normal Range</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td className="border border-gray-300 px-4 py-2" rowSpan="10">Electrolytes</td>
                                            <td className="border border-gray-300 px-4 py-2">Sodium</td>
                                            <td className="border border-gray-300 px-4 py-2">135 - 145 mmol/L</td>
                                        </tr>
                                        <tr>
                                            <td className="border border-gray-300 px-4 py-2">Potassium</td>
                                            <td className="border border-gray-300 px-4 py-2">3.5 - 5.3 mmol/L</td>
                                        </tr>
                                        <tr>
                                            <td className="border border-gray-300 px-4 py-2">Chloride</td>
                                            <td className="border border-gray-300 px-4 py-2">95 - 106 mmol/L</td>
                                        </tr>
                                        <tr>
                                            <td className="border border-gray-300 px-4 py-2">Bicarbonate</td>
                                            <td className="border border-gray-300 px-4 py-2">22 - 29 mmol/L</td>
                                        </tr>
                                        <tr>
                                            <td className="border border-gray-300 px-4 py-2">Urea</td>
                                            <td className="border border-gray-300 px-4 py-2">2.5 - 7.8 mmol/L</td>
                                        </tr>
                                        <tr>
                                            <td className="border border-gray-300 px-4 py-2">Creatinine</td>
                                            <td className="border border-gray-300 px-4 py-2">60 - 120 μmol/L</td>
                                        </tr>
                                        <tr>
                                            <td className="border border-gray-300 px-4 py-2">Calcium</td>
                                            <td className="border border-gray-300 px-4 py-2">2.2 - 2.6 mmol/L</td>
                                        </tr>
                                        <tr>
                                            <td className="border border-gray-300 px-4 py-2">Magnesium</td>
                                            <td className="border border-gray-300 px-4 py-2">0.7 - 1.0 mmol/L</td>
                                        </tr>
                                        <tr>
                                            <td className="border border-gray-300 px-4 py-2">Phosphate</td>
                                            <td className="border border-gray-300 px-4 py-2">0.8 - 1.5 mmol/L</td>
                                        </tr>
                                        <tr>
                                            <td className="border border-gray-300 px-4 py-2">eGFR</td>
                                            <td className="border border-gray-300 px-4 py-2">&gt; 60 mL/min/1.73m²</td>
                                        </tr>
                                        <tr>
                                            <td className="border border-gray-300 px-4 py-2" rowSpan="4">Metabolic Tests</td>
                                            <td className="border border-gray-300 px-4 py-2">Fasting glucose</td>
                                            <td className="border border-gray-300 px-4 py-2">3.5 - 5.5 mmol/L</td>
                                        </tr>
                                        <tr>
                                            <td className="border border-gray-300 px-4 py-2">Glycated haemoglobin</td>
                                            <td className="border border-gray-300 px-4 py-2">&lt; 6.0 mmol/mol or 4-6%</td>
                                        </tr>
                                        <tr>
                                            <td className="border border-gray-300 px-4 py-2">Total cholesterol</td>
                                            <td className="border border-gray-300 px-4 py-2">&lt; 5.0 mmol/L</td>
                                        </tr>
                                        <tr>
                                            <td className="border border-gray-300 px-4 py-2">Triglycerides (fasting)</td>
                                            <td className="border border-gray-300 px-4 py-2">&lt; 2.3 mmol/L</td>
                                        </tr>
                                        <tr>
                                            <td className="border border-gray-300 px-4 py-2" rowSpan="7">Liver Function</td>
                                            <td className="border border-gray-300 px-4 py-2">Serum osmolality</td>
                                            <td className="border border-gray-300 px-4 py-2">285 - 295 mOsmol/kg</td>
                                        </tr>
                                        <tr>
                                            <td className="border border-gray-300 px-4 py-2">Albumin</td>
                                            <td className="border border-gray-300 px-4 py-2">35 - 50 g/L</td>
                                        </tr>
                                        <tr>
                                            <td className="border border-gray-300 px-4 py-2">Alanine aminotransferase (ALT)</td>
                                            <td className="border border-gray-300 px-4 py-2">10 - 50 IU/L</td>
                                        </tr>
                                        <tr>
                                            <td className="border border-gray-300 px-4 py-2">Aspartate aminotransferase (AST)</td>
                                            <td className="border border-gray-300 px-4 py-2">10 - 40 IU/L</td>
                                        </tr>
                                        <tr>
                                            <td className="border border-gray-300 px-4 py-2">Alkaline phosphatase (ALP)</td>
                                            <td className="border border-gray-300 px-4 py-2">25 - 115 IU/L</td>
                                        </tr>
                                        <tr>
                                            <td className="border border-gray-300 px-4 py-2">Bilirubin</td>
                                            <td className="border border-gray-300 px-4 py-2">&lt; 17 μmol/L</td>
                                        </tr>
                                        <tr>
                                            <td className="border border-gray-300 px-4 py-2">Gamma glutamyl transferase (GGT)</td>
                                            <td className="border border-gray-300 px-4 py-2">9 - 40 IU/L</td>
                                        </tr>
                                        <tr>
                                            <td className="border border-gray-300 px-4 py-2" rowSpan="2">Cardiac Enzymes</td>
                                            <td className="border border-gray-300 px-4 py-2">Creatine kinase</td>
                                            <td className="border border-gray-300 px-4 py-2">(M) 25 - 200 U/L, (F) 25 - 175 U/L</td>
                                        </tr>
                                        <tr>
                                            <td className="border border-gray-300 px-4 py-2">Troponin T</td>
                                            <td className="border border-gray-300 px-4 py-2">&lt;14 ng/L</td>
                                        </tr>
                                        <tr>
                                            <td className="border border-gray-300 px-4 py-2" rowSpan="4">Haematics</td>
                                            <td className="border border-gray-300 px-4 py-2">Serum vitamin B12</td>
                                            <td className="border border-gray-300 px-4 py-2">160 - 925 ng/L</td>
                                        </tr>
                                        <tr>
                                            <td className="border border-gray-300 px-4 py-2">Serum folate</td>
                                            <td className="border border-gray-300 px-4 py-2">3 - 15 μg/L</td>
                                        </tr>
                                        <tr>
                                            <td className="border border-gray-300 px-4 py-2">Ferritin</td>
                                            <td className="border border-gray-300 px-4 py-2">12 - 200 μg/L</td>
                                        </tr>
                                        <tr>
                                            <td className="border border-gray-300 px-4 py-2">Iron</td>
                                            <td className="border border-gray-300 px-4 py-2">(M) 14 - 31 μmol/L, (F) 11 - 30 μmol/L</td>
                                        </tr>
                                        <tr>
                                            <td className="border border-gray-300 px-4 py-2" rowSpan="10">Endocrinology</td>
                                            <td className="border border-gray-300 px-4 py-2">Total iron binding capacity</td>
                                            <td className="border border-gray-300 px-4 py-2">54 - 75 μmol/L</td>
                                        </tr>
                                        <tr>
                                            <td className="border border-gray-300 px-4 py-2">Thyroid stimulating hormone</td>
                                            <td className="border border-gray-300 px-4 py-2">0.4 - 4.0 mU/L</td>
                                        </tr>
                                        <tr>
                                            <td className="border border-gray-300 px-4 py-2">Total T4</td>
                                            <td className="border border-gray-300 px-4 py-2">60 - 150 nmol/L</td>
                                        </tr>
                                        <tr>
                                            <td className="border border-gray-300 px-4 py-2">Free T4</td>
                                            <td className="border border-gray-300 px-4 py-2">9 - 25 pmol/L</td>
                                        </tr>
                                        <tr>
                                            <td className="border border-gray-300 px-4 py-2">Cortisol (9am)</td>
                                            <td className="border border-gray-300 px-4 py-2">140 - 700 nmol/L</td>
                                        </tr>
                                        <tr>
                                            <td className="border border-gray-300 px-4 py-2">Parathyroid hormone</td>
                                            <td className="border border-gray-300 px-4 py-2">1.6 - 8.5 pmol/L</td>
                                        </tr>
                                        <tr>
                                            <td className="border border-gray-300 px-4 py-2">Vitamin D</td>
                                            <td className="border border-gray-300 px-4 py-2">&gt;50 nmol/L</td>
                                        </tr>
                                        <tr>
                                            <td className="border border-gray-300 px-4 py-2">Prolactin</td>
                                            <td className="border border-gray-300 px-4 py-2">(M) 50 - 300 U/L, (F) 100 - 500 U/L</td>
                                        </tr>
                                        <tr>
                                            <td className="border border-gray-300 px-4 py-2">Luteinising hormone</td>
                                            <td className="border border-gray-300 px-4 py-2">1 - 11 U/L (luteal)</td>
                                        </tr>
                                        <tr>
                                            <td className="border border-gray-300 px-4 py-2">Follicle stimulating hormone</td>
                                            <td className="border border-gray-300 px-4 py-2">2 - 8 U/L (luteal)</td>
                                        </tr>
                                        <tr>
                                            <td className="border border-gray-300 px-4 py-2">Renin</td>
                                            <td className="border border-gray-300 px-4 py-2">3.0 - 4.5 pmol/mL/hr</td>
                                        </tr>
                                        <tr>
                                            <td className="border border-gray-300 px-4 py-2">Aldosterone</td>
                                            <td className="border border-gray-300 px-4 py-2">600 - 1200 pmol/L</td>
                                        </tr>
                                        <tr>
                                            <td className="border border-gray-300 px-4 py-2">Testosterone</td>
                                            <td className="border border-gray-300 px-4 py-2">(M) 9.9 - 27.8 nmol/L, (F) 0.2 - 2.9 nmol/L</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div> :
                            tab === "MISCELLANEOUS" ? <div className="flex justify-center  text-xs w-[370px] ">
                                <div className="flex justify-center  text-xs">
                                    <table className="table-auto border-collapse border border-gray-300">
                                        <thead>
                                            <tr className="bg-gray-200">
                                                <th className="border border-gray-300 px-4 py-2 ">Category</th>
                                                <th className="border border-gray-300 px-4 py-2">Parameter</th>
                                                <th className="border border-gray-300 px-4 py-2">Normal Range</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td class="border border-gray-300 px-4 py-2" rowspan="14">Haematology</td>
                                                <td class=" border border-gray-300 px-4 py-2">Haemoglobin</td>
                                                <td class="border border-gray-300 px-4 py-2">(M) 130 - 170 g/L, (F) 115 - 155 g/L</td>
                                            </tr>
                                            <tr>
                                                <td class="border border-gray-300 px-4 py-2">White cell count</td>
                                                <td class="border border-gray-300 px-4 py-2">3.0 - 10.0 x 10<sup>9</sup>/L</td>
                                            </tr>
                                            <tr>
                                                <td class="border border-gray-300 px-4 py-2">Platelets</td>
                                                <td class="border border-gray-300 px-4 py-2">150 - 400 x 10<sup>9</sup>/L</td>
                                            </tr>
                                            <tr>
                                                <td class="border border-gray-300 px-4 py-2">Mean cell haemoglobin (MCH)</td>
                                                <td class="border border-gray-300 px-4 py-2">27 - 33 pg</td>
                                            </tr>
                                            <tr>
                                                <td class="border border-gray-300 px-4 py-2">Mean cell haemoglobin concentration (MCHC)</td>
                                                <td class="border border-gray-300 px-4 py-2">320 - 350 g/L</td>
                                            </tr>
                                            <tr>
                                                <td class="border border-gray-300 px-4 py-2">Mean cell volume (MCV)</td>
                                                <td class="border border-gray-300 px-4 py-2">80 - 96 fL</td>
                                            </tr>
                                            <tr>
                                                <td class="border border-gray-300 px-4 py-2">Neutrophils</td>
                                                <td class="border border-gray-300 px-4 py-2">2.0 - 7.5 x 10<sup>9</sup>/L</td>
                                            </tr>
                                            <tr>
                                                <td class="border border-gray-300 px-4 py-2">Lymphocytes</td>
                                                <td class="border border-gray-300 px-4 py-2">1.5 - 4.0 x 10<sup>9</sup>/L</td>
                                            </tr>
                                            <tr>
                                                <td class="border border-gray-300 px-4 py-2">Monocytes</td>
                                                <td class="border border-gray-300 px-4 py-2">0.2 - 1.0 x 10<sup>9</sup>/L</td>
                                            </tr>
                                            <tr>
                                                <td class="border border-gray-300 px-4 py-2">Eosinophils</td>
                                                <td class="border border-gray-300 px-4 py-2">0 - 0.4 x 10<sup>9</sup>/L</td>
                                            </tr>
                                            <tr>
                                                <td class="border border-gray-300 px-4 py-2">Basophils</td>
                                                <td class="border border-gray-300 px-4 py-2">0 - 0.1 x 10<sup>9</sup>/L</td>
                                            </tr>
                                            <tr>
                                                <td class="border border-gray-300 px-4 py-2">Reticulocytes</td>
                                                <td class="border border-gray-300 px-4 py-2">25 - 100 x 10<sup>9</sup>/L</td>
                                            </tr>
                                            <tr>
                                                <td class="border border-gray-300 px-4 py-2">Packed cell volume (PCV)</td>
                                                <td class="border border-gray-300 px-4 py-2">(M) 0.40 - 0.54, (F) 0.37 - 0.50</td>
                                            </tr>
                                            <tr>
                                                <td class="border border-gray-300 px-4 py-2">Erythrocyte sedimentation rate (ESR)</td>
                                                <td class="border border-gray-300 px-4 py-2">&lt; 20 mm/hr</td>
                                                
                                            </tr>
                                            <tr>
                                                
                                                <td class="border border-gray-300 px-4 py-2">D-dimers</td>
                                                <td class="border border-gray-300 px-4 py-2">&lt; 0.5 mg/L</td>
                                            </tr>
                                            <tr>
                                                <td className="border border-gray-300 px-4 py-2" rowSpan="4">Coagulation Screen</td>
                                                <td className="border border-gray-300 px-4 py-2">International normalised ratio (INR)</td>
                                                <td className="border border-gray-300 px-4 py-2">Activiated partial thromboplastin time (APTT)</td>
                                              
                                            </tr>
                                            <tr>
                                                <td className="border border-gray-300 px-4 py-2">Prothrombin time (PT)</td>
                                                <td className="border border-gray-300 px-4 py-2">Thrombin time (TT)</td>
                                                
                                            </tr>
                                            <tr>
                                                <td className="border border-gray-300 px-4 py-2">Fibrinogen</td>
                                                <td className="border border-gray-300 px-4 py-2">Fibrinogen degradation products</td>
                                               
                                            </tr>
                                            <tr>
                                                <td className="border border-gray-300 px-4 py-2">Factor VII:C</td>
                                                <td className="border border-gray-300 px-4 py-2">Bleeding time</td>
                                            </tr>
                                            <tr>
                                                <td className="border border-gray-300 px-4 py-2" rowSpan="8">Arterial Blood Gas</td>
                                                <td className="border border-gray-300 px-4 py-2">pH</td>
                                                <td className="border border-gray-300 px-4 py-2">7.35 - 7.45</td>
                                            </tr>
                                            <tr>
                                                <td className="border border-gray-300 px-4 py-2">PaO <sub>2</sub></td>
                                                <td className="border border-gray-300 px-4 py-2">11-15 kPa</td>
                                            </tr>
                                            <tr>
                                                <td className="border border-gray-300 px-4 py-2">PaCO <sub>2</sub></td>
                                                <td className="border border-gray-300 px-4 py-2">4.6-6.4 kPa</td>
                                            </tr>
                                            <tr>
                                                <td className="border border-gray-300 px-4 py-2">Bicarbonate</td>
                                                <td className="border border-gray-300 px-4 py-2">22-30 mmol/L</td>
                                            </tr>
                                            <tr>
                                                <td className="border border-gray-300 px-4 py-2">Base excess</td>
                                                <td className="border border-gray-300 px-4 py-2">-2 to +2 mmol/L</td>
                                            </tr>

                                           
                                            
                                        </tbody>
                                    </table>
                                </div>
                            </div> : <div>no value</div>

                }

            </div>
        </div>

    )
}

export default ChemistryBeaker