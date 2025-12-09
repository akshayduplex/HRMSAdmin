import React from "react";
import Modal from "react-bootstrap/Modal";

const SalaryStructureModal = (props) => {
    const { salary } = props;
    const earningData = salary?.earning_data || {};
    const deductionData = salary?.deduction_data || {};
    const transportAllowances = earningData?.transport_allowances || 0;
    const medicalAllowances = earningData?.medical_allowances || 0;
    const childrenAllowances = earningData?.children_allowances || 0;
    const specialAllowances = earningData?.special_allowances || 0;
    const projectAllowances = earningData?.project_allowances || 0;
    const chargeAllowances = earningData?.charge_allowances || 0;
    const telephoneAllowances = earningData?.telephone_allowances || 0;
    const perfmAllowances = earningData?.perfm_allowances || 0;
    const medicalReimbursement = earningData?.medical_reimbursement || 0;
    const employeepfAllowances = earningData?.employee_pf || 0;

    const total = deductionData?.total || 0;

    return (
        <Modal {...props} size="lg" className="jobtemp_modal offermodal">
            <Modal.Header className="border-0" closeButton>
                <Modal.Title>
                    <h4>Salary Structure</h4>
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="salary_wraps">
                    <div className="salary_columns">
                    <h5>Earning</h5>
                {salary?.basic_salary > 0 && (
                  <div className="dflexbtwn">
                    <p>Basic</p>
                    <p>
                      {salary?.basic_salary}
                    </p>
                  </div>
                )}
                 {salary?.salary_hra > 0 && (
                  <div className="dflexbtwn">
                    <p>HRA:</p>
                    <p>
                      {salary?.salary_hra}
                    </p>
                  </div>
                )}
                        {transportAllowances > 0 && (
                            <div className="dflexbtwn">
                                <p>Transport</p>
                                <p>{transportAllowances}</p>
                            </div>
                        )}
                        {medicalAllowances > 0 && (
                            <div className="dflexbtwn">
                                <p>Medical</p>
                                <p>{transportAllowances}</p>
                            </div>
                        )}
                        {specialAllowances > 0 && (
                            <div className="dflexbtwn">
                                <p>Special Allowances</p>
                                <p>{specialAllowances}</p>
                            </div>
                        )}

                        {employeepfAllowances > 0 && (
                            <div className="dflexbtwn">
                                <p>Employer PF</p>

                                <p>{employeepfAllowances}</p>

                            </div>
                        )}
                        {childrenAllowances > 0 && (
                            <div className="dflexbtwn">
                                <p>Children Allowances</p>
                                <p>
                                    {childrenAllowances}
                                </p>
                            </div>
                        )}
                        {projectAllowances > 0 && (
                            <div className="dflexbtwn">
                                <p>Project Allowances</p>
                                <p >
                                    {projectAllowances}
                                </p>
                            </div>
                        )}
                        {chargeAllowances > 0 && (
                            <div className="dflexbtwn">
                                <p>Charge Allowances</p>
                                <p>
                                    {chargeAllowances}
                                </p>
                            </div>
                        )}
                        {telephoneAllowances > 0 && (
                            <div className="dflexbtwn">
                                <p>Telephone Allowances</p>
                                <p>
                                    {telephoneAllowances}
                                </p>
                            </div>
                        )}
                        {perfmAllowances > 0 && (
                            <div className="dflexbtwn">
                                <p>Perform Allowances</p>
                                <p>
                                    {perfmAllowances}
                                </p>
                            </div>
                        )}
                        {medicalReimbursement > 0 && (
                            <div className="dflexbtwn">
                                <p>Medical Reimbursement </p>
                                <p>
                                    {medicalReimbursement}
                                </p>
                            </div>
                        )}
                        {salary?.salary_total > 0 && (
                  <div className="dflexbtwn">
                    <p>Total:</p>
                    <p>
                      {salary?.salary_total}
                    </p>
                  </div>
                )}
                    </div>
                    <div className="salary_columns">
                        <h5>Deduction</h5>        
                  {total > 0 && (
                  <div className="dflexbtwn">
                    <p>Employee PF </p>
                    <p>
                      {total}
                    </p>
                  </div>
                )}
              
                    </div>
                </div>
            </Modal.Body>
        </Modal>
    )
}
export default SalaryStructureModal;