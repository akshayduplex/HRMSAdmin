import React from "react";
import { MdCurrencyRupee } from "react-icons/md";

export default function EmployeeSalary() {
    return (
        <>
            <div className="row my-3" data-aos="fade-in" data-aos-duration="3000">
                <div className="col-lg-12">
                    <div className="sitecard pr-0 ">
                        <div className="infobox ">
                            <h5>Earning</h5>
                            <div className="infotext mx-50 mt-3">
                                <div className="infos">
                                    <h6>Basic</h6>
                                    <p className="d-flex flex-row gap-1 align-items-center">

                                        <MdCurrencyRupee />
                                        23,893.00
                                    </p>
                                </div>
                                <div className="infos">
                                    <h6>HRA</h6>
                                    <p className="d-flex flex-row gap-1 align-items-center">

                                        <MdCurrencyRupee />
                                        11,947.00
                                    </p>
                                </div>
                                <div className="infos">
                                    <h6>Transport</h6>
                                    <p className="d-flex flex-row gap-1 align-items-center">

                                        <MdCurrencyRupee />
                                        1,600.00
                                    </p>
                                </div>
                                <div className="infos">
                                    <h6>Medical</h6>
                                    <p className="d-flex flex-row gap-1 align-items-center">

                                        <MdCurrencyRupee />
                                        1250.00
                                    </p>
                                </div>
                                <div className="infos">
                                    <h6>Special Allowances</h6>
                                    <p className="d-flex flex-row gap-1 align-items-center">

                                        <MdCurrencyRupee />
                                        22,151.00
                                    </p>
                                </div>
                                <div className="infos">
                                    <h6>Employer PF</h6>
                                    <p className="d-flex flex-row gap-1 align-items-center">

                                        <MdCurrencyRupee />
                                        2867.00
                                    </p>
                                </div>
                                <div className="infos">
                                    <h6>Total Earning</h6>
                                    <p className="d-flex flex-row gap-1 align-items-center">

                                        <MdCurrencyRupee />
                                        60,841.00
                                    </p>
                                </div>
                            </div>
                            <h5>Deductions</h5>
                            <div className=" mx-50">
                                <div className="infos">
                                    <h6>Employer PF (D)</h6>
                                    <p className="d-flex flex-row gap-1 align-items-center">

                                        <MdCurrencyRupee />
                                        2867.00
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
