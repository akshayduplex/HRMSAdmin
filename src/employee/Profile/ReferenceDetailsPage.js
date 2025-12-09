import React from "react";
import { Button } from "react-bootstrap";


const ReferenceDetailsPage = ({employeeDoc , setReferenceFormEdit }) => {

    let data = employeeDoc && employeeDoc?.reference_check_form_data;

    return (
        <>
            <div className="InductionForm">
                <div className='dflexbtwn'>
                    <div className='pagename'>
                        <h4>Reference From Details</h4>
                    </div>
                    <div className='pagename'>
                        <Button onClick={setReferenceFormEdit}>Edit</Button>
                    </div>
                </div>
                <div className='row mt-4'>
                    <div className='sitecard'>
                        <div className="d-flex  flex-wrap">
                            <div className="datafield" style={{ width: '45%', minWidth: '100px' }}>
                                <p><strong>Date : </strong>  <span> {employeeDoc && data.date}</span> </p>
                            </div>
                            <div className="datafield" style={{ width: '45%', minWidth: '100px' }}>
                                <p>   <strong>Candidate Name :  </strong>  <span>{data.name_Of_candidate}</span> </p>
                            </div>
                            <div className="datafield" style={{ width: '45%', minWidth: '100px' }}>
                                <p>  <strong>Designation For Applied :  </strong> <span>{data.designation_for_applied}</span>
                                </p>
                            </div>

                            {/* <div className="" style={{ width: '30%', minWidth: '100px' }}>
                                <p>  <strong>Name of Facilitators : </strong> {data.name_of_facilitators}</p>
                            </div> */}
                            <div className="datafield" style={{ width: '45%', minWidth: '100px' }}>
                                <p>    <strong>Referee Name : </strong> <span> {data.referee_name}</span> </p>
                            </div>

                            <div className="datafield" style={{ width: '45%', minWidth: '100px' }}>
                                <p>   <strong>Name of Organization : </strong>  <span>{data.name_of_organization}</span> </p>
                            </div>

                            <div className="datafield" style={{ width: '45%', minWidth: '100px' }}>
                                <p>  <strong>Mode of Reference : </strong>  <span>{data.mode_of_reference}</span> </p>
                            </div>

                            <div className="datafield" style={{ width: '45%', minWidth: '100px' }}>
                                <p> <strong>Reference Contact Id : </strong>  <span>{data.mentioned_contact_id}</span> </p>
                            </div>

                            <div className="datafield" style={{ width: '45%', minWidth: '100px' }}>
                                <p>   <strong>How Long You Know Him : </strong>  <span>{data.how_long_you_know}</span> </p>
                            </div>

                            <div className="datafield" style={{ width: '45%', minWidth: '100px' }}>
                                <p>    <strong>In What Capacity : </strong>  <span>{data.in_what_capacity}</span> </p>
                            </div>

                            {/* <div className="" style={{ width: '30%', minWidth: '100px' }}>
                                <p><strong>Participant signature : </strong>  <FaEye onClick={(e) => handleImageClick(`${config.IMAGE_PATH}${data.signature}`)} /></p>
                            </div> */}

                            <div className="datafield" style={{ width: '45%', minWidth: '100px' }}>
                               <p>    <strong>Worked With You Organization: </strong> <span>{data.worked_with_you_organization}</span> </p>
                            </div>
                            <div className="datafield" style={{ width: '45%', minWidth: '100px' }}>
                               <p>    <strong>Reference Checker Name: </strong> <span>{data.reference_checker_name}</span> </p>
                            </div>
                            <div className="datafield" style={{ width: '45%', minWidth: '100px' }}>
                               <p>    <strong>Reference Checker Designation: </strong> <span>{data.reference_checker_designation}</span> </p>
                            </div>
                            <div className="datafield" style={{ width: '45%', minWidth: '100px' }}>
                               <p>    <strong>From: </strong> <span>{data.worked_with_you_from_date}</span> </p>
                            </div>

                            <div className="datafield" style={{ width: '45%', minWidth: '100px' }}>
                               <p><strong>Over All Performance: </strong> <span>{data?.overall_work_performance}</span> </p>
                            </div>

                            <div className="datafield" style={{ width: '45%', minWidth: '100px' }}>
                               <p><strong>Why: </strong> <span dangerouslySetInnerHTML={{__html:data?.why_data}}></span></p>
                            </div>

                            <div className="datafield" style={{ width: '45%', minWidth: '100px' }}>
                               <p><strong>Person excelled: </strong> <span dangerouslySetInnerHTML={{__html:data?.person_excelled}}></span></p>
                            </div>

                            <div className="datafield" style={{ width: '45%', minWidth: '100px' }}>
                               <p><strong>Would you re-employ this person if you were given the opportunity: </strong> <span>{data?.re_employ_status}</span> </p>
                            </div>

                            <div className="datafield" style={{ width: '45%', minWidth: '100px' }}>
                               <p><strong>Region: </strong> <span dangerouslySetInnerHTML={{__html:data?.re_employ_data}}></span></p>
                            </div>

                            <div className="datafield" style={{ width: '45%', minWidth: '100px' }}>
                               <p><strong>Additional Comment: </strong> <span dangerouslySetInnerHTML={{__html:data?.comment}}></span></p>
                            </div>



                            {/* <div className="p-2" style={{ width: '100%' }}>
                                <p> <strong>Over All Performance:</strong> {data?.overall_work_performance} </p>
                                <p><strong>Region</strong>:{data.why_data}</p>
                            </div> */}

                            {/* <div style={{ width: '100%', minWidth: '250px' }}>
                                <p> <strong>Facilities:</strong></p>
                                <hr />
                            </div>

                            <div className="p-2  m-2" style={{ width: '100%', minWidth: '250px' }}>
                                <p> <strong>1. The Ambiance Wan Conductive And Comfortable</strong></p>
                                <p><strong>Answer</strong>:{data.facilities_option_1}</p>
                            </div>

                            <div className="p-2  m-2" style={{ width: '100%', minWidth: '250px' }}>
                                <p><strong>2. Good Training Aids and Audio-visual aids were used:</strong></p>
                                <p><strong>Answer</strong>:{data.facilities_option_2}</p>
                            </div>

                            <div style={{ width: '100%', minWidth: '250px' }}>
                                <p><strong>Subject And Content:</strong></p>
                                <hr />
                            </div>

                            <div className="p-2  m-2" style={{ width: '100%', minWidth: '250px' }}>
                                <p><strong>1. Introduction to Organization (including parent organization), its leadership team , Vision , Mission & Value explained and presented neatly:</strong></p>
                                <p> <strong>Answer</strong>: {data.subject_content_1}</p>
                            </div>

                            <div className="p-2  m-2" style={{ width: '100%', minWidth: '250px' }}>
                                <p><strong>2. Current Position of organization , its operational footprints , products & services , donor / partners , was explained and presented neatly</strong></p>
                                <p> <strong>Answer</strong>:{data.subject_content_2}</p>
                            </div>

                            <div className="p-2  m-2" style={{ width: '100%', minWidth: '250px' }}>
                                <p><strong>3. HR norms including leave, Working hours & attendance, Performance Appraisal process , Employee benefits schema & travel policy were explained properly</strong></p>
                                <p> <strong>Answer</strong>: {data.subject_content_3}</p>
                            </div>

                            <div className="p-2  m-2" style={{ width: '100%', minWidth: '250px' }}>
                                <p> <strong>4. HRIS (Employee Self Service ) module Introduction and usage explained by the Facilitator properly</strong></p>
                                <p> <strong>Answer</strong>: {data.subject_content_4}</p>
                            </div>

                            <div style={{ width: '100%', minWidth: '250px' }}>
                                <p><strong>Presentation / Pedagogy</strong></p>
                                <hr />
                            </div>

                            <div className="p-2  m-2" style={{ width: '100%', minWidth: '250px' }}>
                                <p> <strong>1. The Facilitator/presenter had good presentation and effective teaching skills</strong></p>
                                <p> <strong>Answer</strong>: {data.presentation_1}</p>
                            </div>

                            <div className="p-2  m-2" style={{ width: '100%', minWidth: '250px' }}>
                                <p> <strong>2. The Facilitator could give value added inputs in additional to the induction content</strong></p>
                                <p> <strong>Answer</strong>: {data.presentation_2}</p>
                            </div>

                            <div className="p-2  m-2" style={{ width: '100%', minWidth: '250px' }}>
                                <p><strong>3. Trainer wan interested and addressed participants concern</strong></p>
                                <p> <strong>Answer</strong>: {data.presentation_3}</p>
                            </div>

                            <div style={{ width: '100%', minWidth: '250px' }}>
                                <p> <strong>Over All Relevance / Usefulness</strong></p>
                                <hr />
                            </div>

                            <div className="p-2  m-2" style={{ width: '100%', minWidth: '250px' }}>
                                <p>  <strong>1. This induction is relevant to my current job & use my future growth and learning</strong></p>
                                <p><strong>Answer</strong>: {data.over_all_usefulness_1}</p>
                            </div>

                            <div className="p-2  m-2" style={{ width: '100%', minWidth: '250px' }}>
                                <p> <strong>2. I would recommend this induction to my department personnel</strong> </p>
                                <p><strong>Answer</strong>: {data.over_all_usefulness_2}</p>
                            </div>

                            <div style={{ width: '100%', minWidth: '250px' }}>
                                <p><strong>Others</strong></p>
                                <hr />
                            </div>

                            <div className="p-2  m-2" style={{ width: '100%', }}>
                                <p> <strong>1. What changes to the HR Induction training would you suggest? ( including time , value , course , content , facilities , ect. )</strong></p>
                                <p dangerouslySetInnerHTML={{ __html: data.others_1 }} />
                            </div>
                            <div className="p-2 m-2" style={{ width: '100%', }}>
                                <p> <strong>2. Comments on the most useful parts of the induction training or areas that need to be extended further</strong> </p>
                                <p dangerouslySetInnerHTML={{ __html: data.others_2 }} />
                            </div> */}
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default ReferenceDetailsPage;