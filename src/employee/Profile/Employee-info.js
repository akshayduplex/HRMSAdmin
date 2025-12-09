
import axios from "axios";
import React, { useState, useRef, useMemo } from "react";
import { Button, Form, Modal, Row, Table } from "react-bootstrap";
import { FaEdit } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import config from "../../config/config";
import { apiHeaderToken } from "../../config/api_header";
import moment from "moment";

export default function Emp_info({ data, getEmployeeListFun }) {
    const educationData = (Array.isArray(data.education_data) && data.education_data.length > 0) ? data.education_data : [];
    const experienceData = (Array.isArray(data.experience_info) && data.experience_info.length > 0) ? data.experience_info : [];
    let loggedData = useMemo(() => {
        return JSON.parse(localStorage.getItem('admin_role_user')) ?? {}
    }, [])

    const [show, setShow] = useState(false);
    const [EditMode , setEditMode] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [AddFamily, setFamily] = useState({
        name: '',
        age: '',
        Gender: '',
        relationship: '',
        Is_Independent: 'Yes',
        Occupation: '',
        Added_by: '',
        Added_date: '',
    })
    const [loading, setLoading] = useState(false)

    // Using The Focus of Element 
    const nameRef = useRef(null);
    const nameAge = useRef(null);
    const nameGender = useRef(null);
    const nameRelationship = useRef(null);
    const nameIs_Independent = useRef(null);
    const nameOccupation = useRef(null);

    // const [validationError, setValidationError] = useState({
    //     nameError: {
    //         message: '',
    //         status: false
    //     },
    //     ageError: {
    //         message: '',
    //         status: false
    //     },
    //     GenderError: {
    //         message: '',
    //         status: false
    //     },
    //     relationshipError: {
    //         message: '',
    //         status: false
    //     },
    //     Is_IndependentError: {
    //         message: '',
    //         status: false
    //     },
    //     OccupationError: {
    //         message: '',
    //         status: false
    //     },
    // })

    //  State update 
    const updateState = (obj) => {
        setFamily((prev) => (
            {
                ...prev,
                ...obj,
            }
        ))
    }
    // Error State Update Error 
    // const ErrorStateUpdate = (obj) => {
    //     setValidationError((prev) => (
    //         {
    //             ...prev,
    //             ...obj,
    //         }
    //     ))
    // }

    const navigation = useNavigate();
    const calculateDateDifference = (fromDate, toDate) => {
        if (!fromDate || !toDate) return { days: 0, months: 0 };

        const startDate = new Date(fromDate);
        const endDate = new Date(toDate);

        // Calculate the difference in days
        const timeDiff = endDate - startDate;
        const daysDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24));

        // Calculate the difference in months
        let monthsDiff = (endDate.getFullYear() - startDate.getFullYear()) * 12;
        monthsDiff += endDate.getMonth() - startDate.getMonth();

        return { days: daysDiff, months: monthsDiff };
    };

    const handleProfileEditRedirect = (id, type) => {
        switch (type) {
            case 'Education':
                localStorage.setItem("onBoardingId", id);
                localStorage.setItem("stepsCount", 1);
                navigation('/onboarding');
                return;
            case 'Account':
                localStorage.setItem("onBoardingId", id);
                localStorage.setItem("stepsCount", 4);
                navigation('/onboarding');
                return;
            case 'TDS':
                localStorage.setItem("onBoardingId", id);
                localStorage.setItem("stepsCount", 4);
                navigation('/onboarding');
                return;
            default:
                localStorage.setItem("onBoardingId", id);
                localStorage.setItem("stepsCount", 0);
                navigation('/onboarding');
        }
    };

    const HandleAddApi = async (Payloads) => {
        try {
            let response = await axios.post(`${config.API_URL}addEmployeeFamilyDetails`, Payloads, apiHeaderToken(config.API_TOKEN))

            if (response.status === 200) {
                toast.success(response.data?.message)
                getEmployeeListFun()
                setLoading(false)
                setDeleteLoading(false)
                updateState({ name: '', age: '', Gender: '', relationship: '', Is_Independent: 'Yes', Occupation: '' })
                setEditMode(false)
            } else {
                toast.error(response.data?.message)
                setLoading(false)
                setDeleteLoading(false)
            }
        } catch (error) {
            toast.error(error?.response.data?.message)
            setLoading(false)
            setDeleteLoading(false)
        }
    }

    const handleAddMember = async () => {
        if (!AddFamily.name && AddFamily.name < 4) {
            return toast.warn('Please Enter the Name')
        }
        if (!AddFamily.age) {
            return toast.warn('Please Enter the Age')
        }
        if (!AddFamily.Gender) {
            return toast.warn('Please Choose the Gender')
        }
        if (!AddFamily.relationship) {
            return toast.warn('Please Enter the Member Relationship')
        }
        if (!AddFamily.Occupation) {
            return toast.warn('Please Enter the Member Occupation')
        }
        setLoading(true)


        let FamilyDetails = data?.family_details
        ?.filter((item) => item.name !== AddFamily.name) 
        .map((item) => ({
            name: item.name,
            age: item.age,
            gender: item.gender,
            relationship: item.relationship,
            occupation: item.occupation,
            is_independent: item?.is_independent,
            add_by: item.add_by
        }));
    

        let Payloads = {
            "employee_doc_id": data?._id,
            "family_data": [...FamilyDetails,
            {
                "name": AddFamily.name,
                "age": AddFamily.age,
                "gender": AddFamily.Gender,
                "relationship": AddFamily.relationship,
                "is_independent": AddFamily.Is_Independent,
                "occupation": AddFamily.Occupation,
                "add_by": loggedData.name
            },
            ]
        }

        HandleAddApi(Payloads)
    }

    const handleDelete = async (event, records) => {
        event.preventDefault()
        if (records) {
            let filteredRecords = data?.family_details.filter((item) => item.name !== records?.name)
            let Payloads = {
                "employee_doc_id": data?._id,
                "family_data": [...filteredRecords]
            }
            setDeleteLoading(true)
            HandleAddApi(Payloads)
        }
    }

    const handleEdit = (event , records) => {
        event.preventDefault()
        updateState({
            name: records.name,
            age: records.age,
            Gender: records.gender,
            relationship: records.relationship,
            Occupation: records.occupation,
            Is_Independent: records.is_independent,
        })
        setEditMode(true)
    }



    return (
        <>
            <div className="row my-3" data-aos="fade-in" data-aos-duration="3000">
                <div className="col-lg-12">
                    <div className="sitecard pr-0">
                        <div className="infobox">
                            <div className="AddPencialInTabs">
                                <h5>Employment Information</h5>
                                <span className="PensileEdit" onClick={(e) => handleProfileEditRedirect(data?._id, '')}><FaEdit size={20} /></span>
                            </div>
                            <div className="threecolm infotext w-100 mt-3">
                                <div className="infos">
                                    <h6>Full name</h6>
                                    <p>{data.name}</p>
                                </div>
                                <div className="infos">
                                    <h6>Father’s Name</h6>
                                    <p>{data.father_name}</p>
                                </div>
                                <div className="infos">
                                    <h6>Gender</h6>
                                    <p>{data.gender}</p>
                                </div>
                                <div className="infos">
                                    <h6>Marital Status</h6>
                                    <p>{data.marital_status}</p>
                                </div>
                                <div className="infos">
                                    <h6>Date of Joining</h6>
                                    <p>{moment(data.joining_date).format("DD/MM/YYYY")}</p>
                                </div>
                                <div className="infos">
                                    <h6>Probation Completion Date</h6>
                                    <p>{moment(data.probation_complete_date).format("DD/MM/YYYY")}</p>
                                </div>
                                <div className="infos">
                                    <h6>Designation</h6>
                                    <p>{data.designation}</p>
                                </div>
                                <div className="infos">
                                    <h6>Branch </h6>
                                    {Array.isArray(data.branch) && data.branch.length > 0 ? (
                                        data.branch.map((item, index) => (
                                            <p key={index}>{item}</p>
                                        ))
                                    ) : (
                                        <p>N/A</p>
                                    )}
                                </div>
                                <div className="infos">
                                    <h6>Occupation</h6>
                                    <p>{data.occupation}</p>
                                </div>
                                <div className="infos">
                                    <h6>Department</h6>
                                    <p>{data.department}</p>
                                </div>
                                <div className="infos">
                                    <h6>Division</h6>
                                    <p>{data.division}</p>
                                </div>
                                <div className="infos">
                                    <h6>Grade</h6>
                                    <p>{data.grade}</p>
                                </div>
                            </div>
                            <div className="AddPencialInTabs">
                                <h5>Account Details</h5>
                                <span className="PensileEdit" onClick={(e) => handleProfileEditRedirect(data?._id, 'Account')}><FaEdit size={20} /></span>
                            </div>
                            <div className="infotext threecolm w-100 mt-3">
                                <div className="infos">
                                    <h6>Bank Name</h6>
                                    <p>{data.bank_name}</p>
                                </div>
                                <div className="infos">
                                    <h6>Branch Name</h6>
                                    <p>{data.bank_branch}</p>
                                </div>
                                <div className="infos">
                                    <h6>Bank Ifsc Code</h6>
                                    <p>{data.ifsc_code}</p>
                                </div>
                                <div className="infos">
                                    <h6>Bank Account Number</h6>
                                    <p>{data.bank_account_number}</p>
                                </div>
                                <div className="infos">
                                    <h6>Bank Type</h6>
                                    <p>{data.bank_account_type}</p>
                                </div>
                            </div>

                            <div className="AddPencialInTabs">
                                <h5>TDS/PF/ESI/PT Details</h5>
                                <span className="PensileEdit" onClick={(e) => handleProfileEditRedirect(data?._id, 'TDS')}><FaEdit size={20} /></span>
                            </div>
                            <div className="infotext threecolm w-100 mt-3">
                                <div className="infos">
                                    <h6>Pan Number</h6>
                                    <p>{data.pan_number}</p>
                                </div>
                                <div className="infos">
                                    <h6>PF Number</h6>
                                    <p>{data.pf_number}</p>
                                </div>
                                <div className="infos">
                                    <h6>UAN Number</h6>
                                    <p>{data.uan_number}</p>
                                </div>
                                <div className="infos">
                                    <h6>ESI Number</h6>
                                    <p>{data.esi_number}</p>
                                </div>
                            </div>

                            <div className="AddPencialInTabs">
                                <h5>Education</h5>
                                <span className="PensileEdit" onClick={(e) => handleProfileEditRedirect(data?._id, 'Education')}><FaEdit size={20} /></span>
                            </div>

                            <div className="infotext w-100 threecolm">
                                {educationData.length > 0 ? (
                                    educationData.map((item) => (
                                        <div className="infos" key={item._id}>
                                            {item.degree_certificates ? <h6>{item.degree_certificates}</h6> : null}
                                            {item.passing_year ? <p>{item.passing_year}</p> : null}
                                            {item.marks ? <p>{item.marks}</p> : null}
                                        </div>
                                    ))
                                ) : (
                                    <p></p>
                                )}

                                {experienceData.length > 0 ? (
                                    experienceData.map((item) => {
                                        // Check if at least one field has a value
                                        const hasContent = item.employer_name || item.designation;

                                        return hasContent ? (
                                            <div className="infos" key={item._id}>
                                                {item.employer_name ? <h6>{item.employer_name}</h6> : null}
                                                {item.designation ? <p>{item.designation}</p> : null}
                                                <p>Duration: {item.from_date && item.to_date ? `${calculateDateDifference(item.from_date, item.to_date).months} months (${calculateDateDifference(item.from_date, item.to_date).days} days)` : 'N/A'}</p>
                                            </div>
                                        ) : null;
                                    })
                                ) : (
                                    <p></p>
                                )}

                                <div className="infos">
                                    <h6>Current CTC</h6>
                                    <p>{data.ctc}</p>
                                </div>
                                <div className="infos">
                                    <h6>Notice Period</h6>
                                    <p>-</p>
                                </div>
                                <div className="infos">
                                    <h6>Last Working day </h6>
                                    <p>{moment(data.valid_till).format("DD/MM/YYYY")}</p>
                                </div>
                                <div className="infos">
                                    <h6>Joining Date</h6>
                                    <p>{moment(data.joining_date).format("DD/MM/YYYY") }</p>
                                </div>
                                <div className="infos">
                                    <h6>Reference employee</h6>
                                    <p>-</p>
                                </div>
                            </div>

                            {/* Have Some Remaining  */}

                            <div className="AddPencialInTabs">
                                <h5>Family Details</h5>
                                <span className="PensileEdit" onClick={(e) => setShow(true)}><FaEdit size={20} /></span>
                            </div>
                            <div className="infotext threecolm w-100 mt-3">
                                {
                                    data && data?.family_details &&
                                    (
                                        data?.family_details?.map((item) => {
                                            return (
                                                <>
                                                    <div className="infos">
                                                        <h6>{item?.relationship || 'N/A'}</h6>
                                                        <p>{data.name || 'N/A'}</p>
                                                    </div>
                                                </>
                                            )
                                        })
                                    )
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Model To be Add Family Details To Add The Family Member */}
            <Modal show={show} onHide={() => setShow(false)} size='lg'>
                <Modal.Header closeButton>
                    <Modal.Title>Add Family Member</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Row>
                        <Form.Group className="mb-3 col-6">
                            <Form.Label>Name</Form.Label>
                            <Form.Control
                                ref={nameRef}
                                type="text"
                                placeholder="Enter the Name"
                                value={AddFamily.name}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    if (/^[A-Za-z\s]*$/.test(value)) {
                                        updateState({ name: value });
                                        // if (value?.length < 4) {
                                        //     ErrorStateUpdate({ nameError: { status: true, message: 'Name must be at least 4 characters long' } })
                                        // } else {
                                        //     ErrorStateUpdate({ nameError: { status: false, message: '' } })
                                        // }
                                    }
                                }}
                            // isInvalid={validationError?.nameError?.status}
                            />
                            {/* {
                                validationError.nameError?.status &&
                                (
                                    <Form.Control.Feedback type="invalid">
                                        {validationError.nameError?.message}
                                    </Form.Control.Feedback>
                                )
                            } */}
                        </Form.Group>
                        <Form.Group className="mb-3 col-6">
                            <Form.Label>Age</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter Age"
                                value={AddFamily.age}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    const regex = /^[0-9]*\.?[0-9]*$/;
                                    if (regex.test(value)) {
                                        updateState({ age: value })
                                        // if (value?.length < 0) {
                                        //     ErrorStateUpdate({ ageError: { status: true, message: 'Please Enter The Age' } })
                                        // } else {
                                        //     ErrorStateUpdate({ ageError: { status: false, message: '' } })
                                        // }
                                    }
                                }}
                            // isInvalid={validationError?.ageError?.status}
                            />
                            {/* {
                                validationError.ageError?.status &&
                                (
                                    <Form.Control.Feedback type="invalid">
                                        {validationError.ageError?.message}
                                    </Form.Control.Feedback>
                                )
                            } */}
                        </Form.Group>

                        <Form.Group className="mb-3 col-6">
                            <Form.Label>Gender</Form.Label>
                            <Form.Select
                                value={AddFamily.Gender}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    updateState({ Gender: value });
                                }}
                            >
                                <option value="">Choose Gender</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Other">Other</option>
                            </Form.Select>
                        </Form.Group>

                        <Form.Group className="mb-3 col-6">
                            <Form.Label>Relationship</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter Relationship"
                                value={AddFamily.relationship}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    if (/^[A-Za-z\s]*$/.test(value)) {
                                        updateState({ relationship: value });
                                    }
                                }}
                            />
                        </Form.Group>

                        {/* Posted Job Input */}

                        <Form.Group className="mb-3 col-6">
                            <Form.Label>Occupation</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter Occupation"
                                value={AddFamily.Occupation}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    if (/^[A-Za-z\s]*$/.test(value)) {
                                        updateState({ Occupation: value });
                                    }
                                }}
                            />
                        </Form.Group>


                        {/* CSV File Upload */}
                        <Form.Group controlId="formFile" className="mb-3 col-6">
                            <Form.Label>Is-Independent</Form.Label>
                            <div className="d-flex flex-row gap-5">
                                <Form.Check
                                    type="radio"
                                    label="Yes"
                                    name="formHorizontalRadios"
                                    id="formHorizontalRadios1"
                                    value={AddFamily.Is_Independent}
                                    checked={AddFamily.Is_Independent === 'Yes'}
                                    onChange={() => updateState({ Is_Independent: 'Yes' })}
                                />
                                <Form.Check
                                    type="radio"
                                    label="No"
                                    name="formHorizontalRadios"
                                    id="formHorizontalRadios2"
                                    value={AddFamily.Is_Independent}
                                    checked={AddFamily.Is_Independent === 'No'}
                                    onChange={() => updateState({ Is_Independent: 'No' })}
                                />
                            </div>
                        </Form.Group>


                        <div className='text-center mb-4'>
                            <Button variant="primary" type="button" disabled={loading} onClick={handleAddMember}>
                                {loading ? 'Loading...' :  EditMode ? 'Update Member' : 'Add Member'}
                            </Button>
                        </div>
                        </Row>
                    </Form>

                    {/* Adding The Family Member Tables */}
                    <hr />
                    <h6 className="mt-4 text-center"> Family Details </h6>

                    <div className="modaltbl">
                        {data && (
                            <Table hover>
                                <thead>
                                    <tr>
                                        <th>Sno.</th>
                                        <th>Name /  Age / Gender</th>
                                        <th>Relationship / Occupation</th>
                                        <th>Added By / Added Date</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data?.family_details && data.family_details?.length > 0 ? (
                                        data?.family_details?.map((item, index) => (
                                            <tr key={index}>
                                                <td>
                                                    <span>{index + 1}</span>
                                                </td>
                                                <td>
                                                    <span>{item?.name}</span> {" / "}
                                                    <span>{item?.age}</span> {" / "}
                                                    <span>{item?.gender}</span>
                                                </td>
                                                <td>
                                                    <span>{item?.relationship}</span> {" / "}
                                                    <span>{item.occupation}</span>
                                                </td>
                                                <td>
                                                    <span>{item?.add_by}</span> {" / "}
                                                    <span>{moment(item?.add_date).format('DD/MM/YYYY')}</span>
                                                </td>
                                                <td>
                                                    <span>
                                                        <div className='d-flex justify-content-around text-center mb-4'>
                                                            <Button  variant="primary" type="button" onClick={(e) => handleEdit(e, item)}>
                                                                Edit
                                                            </Button>
                                                            <Button   variant="primary" type="button" onClick={(e) => handleDelete(e, item)}>
                                                                Delete
                                                            </Button>
                                                        </div>
                                                    </span>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="4">No Record Found</td>
                                        </tr>
                                    )}
                                </tbody>
                            </Table>
                        )}
                    </div>
                </Modal.Body>
            </Modal>
        </>
    );
}
