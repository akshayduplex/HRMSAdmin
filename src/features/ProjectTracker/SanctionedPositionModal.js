import React from "react";
import Modal from "react-bootstrap/Modal";
import Table from "react-bootstrap/Table";

const SanctionedPositionModal = (props) => {

    const { ProjectBudgets } = props

    console.log(ProjectBudgets, 'this is Project section bugetsssssss here to shwo ekjandfkjbgjbagr');

    return (
        <Modal {...props} size="lg" className="jobtemp_modal offermodal">
            <Modal.Header className="border-0" closeButton>
                <Modal.Title>
                    <h4>Sanctioned Position  <span className="postn_name">{ProjectBudgets?.title}</span></h4>
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="snactioned_table">
                    <Table hover>
                        <thead>
                            <tr>
                                <th>Sanctioned Position</th>
                                <th>Number of Positions</th>
                                <th>Hired</th>
                                <th>Vacant</th>
                                <th>Max CTC (in INR)</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                ProjectBudgets?.budget_estimate_list?.map((item, index) => {
                                    return (
                                        <>
                                            <tr key={index}>
                                                <td>
                                                    <p className="color-blue">{item?.designation}</p>
                                                </td>
                                                <td>{item?.no_of_positions}</td>
                                                <td>{item?.hired ? item?.hired : 0 }</td>
                                                <td>{item?.available_vacancy ? item?.available_vacancy : 0 }</td>
                                                <td>{item?.total_ctc}</td>
                                            </tr>
                                        </>
                                    )
                                })
                            }
                            {/* <tr>
                                <td>
                                    <p className="color-blue">BD & Research</p>
                                </td>
                                <td>1</td>
                                <td>1</td>
                                <td>0</td>
                                <td>7,00,000</td>
                            </tr>
                            <tr>
                                <td>
                                    <p className="color-blue">CSR</p>
                                </td>
                                <td>1</td>
                                <td>1</td>
                                <td>0</td>
                                <td>7,00,000</td>
                            </tr>
                            <tr>
                                <td>
                                    <p className="color-blue">Finance</p>
                                </td>
                                <td>1</td>
                                <td>1</td>
                                <td>0</td>
                                <td>7,00,000</td>
                            </tr>
                            <tr>
                                <td>
                                    <p className="color-blue">BD & Research</p>
                                </td>
                                <td>1</td>
                                <td>1</td>
                                <td>0</td>
                                <td>7,00,000</td>
                            </tr>
                            <tr>
                                <td>
                                    <p className="color-blue">CSR</p>
                                </td>
                                <td>1</td>
                                <td>1</td>
                                <td>0</td>
                                <td>7,00,000</td>
                            </tr>
                            <tr>
                                <td>
                                    <p className="color-blue">Finance</p>
                                </td>
                                <td>1</td>
                                <td>1</td>
                                <td>0</td>
                                <td>7,00,000</td>
                            </tr> */}
                        </tbody>
                    </Table>
                </div>
            </Modal.Body>
        </Modal>
    )
}
export default SanctionedPositionModal;
