import React from "react";
import { Modal, Table } from "react-bootstrap";



export default function ReviewFeedBackModal ( { openFeedBack , setOpenFeedBack ,  feedbackData  , IsLoading} ){
    

    return (
        <Modal
        show={openFeedBack}
        onHide={() => setOpenFeedBack(false)}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
    >
        <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title-vcenter">
                Rating and Feedback
            </Modal.Title>
        </Modal.Header>
        <Modal.Body className="h-auto">
            <div className="col-sm-12 " style={{ overflowX: "auto" }}>
                <Table hover>
                    <thead>
                        <tr>
                            <th>Sno.</th>
                            <th>Interviewer Name</th>
                            <th>JOb Match(5)</th>
                            <th>Job Knowledge(10)</th>
                            <th>Creative Problem Solving Capacity(10)</th>
                            <th>Team Player(5)</th>
                            <th>Communication Skill(10)</th>
                            <th>Exposure to Job Profile(10)	</th>
                            <th>Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                           IsLoading ? <tr className="text-center"> <td colSpan={0} className="text-center"> Loading........ </td> </tr> :
                           feedbackData && feedbackData?.applied_jobs
                                ?.find((item) => item?.job_id === feedbackData?.job_id)
                                ?.interviewer
                                ?.filter((interviewer) => interviewer?.feedback_status === 'Approved') // Filter approved feedback
                                ?.map((interviewer, index) => (
                                    <tr key={interviewer?.employee_name}>
                                        <td>{index + 1}</td>
                                        <td className="text-wrap">
                                            <span>{interviewer?.employee_name}</span>
                                            <span className="text-wrap">{interviewer?.designation}</span>
                                        </td>
                                        <td>{interviewer?.job_match}</td>
                                        <td>{interviewer?.job_knowledge}</td>
                                        <td>{interviewer?.creative_problem_solving}</td>
                                        <td>{interviewer?.team_player}</td>
                                        <td>{interviewer?.communication_skill}</td>
                                        <td>{interviewer?.exposure_to_job_profile}</td>
                                        <td>{interviewer?.total}</td>
                                    </tr>
                                )) || (
                                <tr>
                                    <td colSpan="9" className="text-center">
                                        No Records Found
                                    </td>
                                </tr>
                            )
                        }
                    </tbody>
                </Table>
            </div>
        </Modal.Body>
    </Modal>
    )
}