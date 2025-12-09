import { Button as ButtonBase, Tooltip } from "@mui/material";
import React, { memo, useCallback, useEffect, useState } from "react";
import { Button, Col, Form, InputGroup, Modal, OverlayTrigger, Row, Table } from "react-bootstrap";
import { CiCircleRemove } from "react-icons/ci";
import Select from 'react-select';
import { debounce } from 'lodash';
import axios from "axios";
import config from "../../../../config/config";
import { apiHeaderToken } from "../../../../config/api_header";
import moment from "moment";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { toast } from "react-toastify";
import { TiEdit } from "react-icons/ti";
import { FaCalendarAlt } from "react-icons/fa";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";



const customStyles = {
    control: (provided, state) => ({
        ...provided,
        backgroundColor: '#fff',
        borderColor: state.isFocused ? '#D2C9FF' : state.isHovered ? '#80CBC4' : provided.borderColor,
        boxShadow: state.isFocused ? '0 0 0 1px #D2C9FF' : 'none',
        '&:hover': {
            borderColor: '#D2C9FF',
        },
        height: '44px',
    }),
    menu: (provided) => ({
        ...provided,
        borderTop: '1px solid #D2C9FF',
    }),
    option: (provided, state) => ({
        ...provided,
        borderBottom: '1px solid #D2C9FF',
        color: state.isSelected ? '#fff' : '#000',
        backgroundColor: state.isSelected ? '#4CAF50' : state.isFocused ? '#80CBC4' : provided.backgroundColor,
        '&:hover': {
            backgroundColor: '#80CBC4',
            color: '#fff',
        },
    }),
};


function ApprovalModalApprovalCandidate({ open, setOpen, memberListData, approvalNotes }) {
    const [option, setOption] = useState([]);
    const [selectedMember, setSelectedMember] = useState([])
    const { id } = useParams();
    const [addPeriority, setAddPriority] = useState('')
    const [pen, setPen] = useState(false);
    const [offerApproveMember, setMember] = useState(null)
    const [loadingApproval, setLodingApproval] = useState(false);
    const [docId, setDocId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [mergeCandidate, setMergeCandidate] = useState(false);
    const [editApprovalDate, setEditApprovalDate] = useState(false);
    const filterJobDetails = useSelector((state) => state.appliedJobList.selectedJobList);


    const [editDesignation, setEditDesignation] = useState({
        index: 0,
        status: false
    })

    const [selectedDate, setSelectedDate] = useState(null);


    /**
     * @description Get User Detials From the Local Storage - Loggin User Details
     */
    const getUserDetails = JSON.parse(localStorage.getItem('admin_role_user')) ?? {};




    /**
     * @description Added the Handle changes when Select Employee
     * @param {*} option 
     * @set set the Option in Employee 
     */
    const handleChange = (option) => {
        setSelectedMember(option)
    }

    /**
     * @description member filter
     * @param {*} input 
     */
    const handleInputChange = (input) => {
        if (input) {
            setPen(true);
            debouncedFetch(input);
        } else {
            setPen(false);
            setOption([]);
        }
    };

    /**
     * @description Added the Debounce in when fetch the member records
     * @method getMemberList is that whether member is called from
     * @param {*} setpen - is react state which can use to loading state when data is fetching
     * @param {Array || any} setOption where we can set the Option when we are setting the records
     */
    const debouncedFetch = useCallback(
        debounce((input) => {
            getMemberList(input)
                .then((res) => {
                    setPen(false)
                    setOption(res);
                })
                .catch((err) => {
                    setOption([]);
                });
        }, 500), // Adjust the delay (in milliseconds) as needed
        []
    );

    /**
     * @description fetch the member records
     * @param {*} input which take a input and return the matching records
     * @returns return the mutated result in react-select
     */

    const getMemberList = async (input = '') => {
        try {
            let payloads = {
                "keyword": input,
                "page_no": "1",
                "per_page_record": "10",
                "scope_fields": ["employee_code", "name", "email", "mobile_no", "_id", "designation"],
                "profile_status": "Active",
            }
            let response = await axios.post(`${config.API_URL}getEmployeeList`, payloads, apiHeaderToken(config.API_TOKEN));
            if (response.status === 200) {
                return response.data?.data?.map((key) => {
                    return {
                        label: `${key?.name} (${key?.employee_code})`,
                        value: key._id,
                        emp: key
                    }
                })
            } else {
                return [];
            }
        } catch (error) {
            return [];
        }
    }

    /**
     * @description handle On menu Open when click to Open the Select Open then Fetch the existing recods
     */
    const handleMenuOpen = () => {
        setPen(true);
        getMemberList("")
            .then((res) => {
                setPen(false)
                setOption(res)
            })
            .catch(err => {
                setPen(false)
                setOption([])
            })
    }

    /**
     * @description handle Priority changes in input when make the Update 
     * @param {*} index 
     * @param {*} newPriority 
     */
    const handlePriorityChange = (index, newPriority) => {

        let existing = offerApproveMember?.some((item) => item?.priority === newPriority)

        if (existing) {
            return toast.warn('Priority Already Exist')
        }

        const updatedMembers = offerApproveMember?.map((member, i) =>
            i === index ? { ...member, priority: newPriority } : member
        );
        setMember(updatedMembers);
    };

    /**
     * @description Handle the send Email with base On the Member and when Added manages and status from the next ->
     * @param {*} item 
     * @returns 
     */

    const getActionButtonByPriority = (item) => {
        const validMembers = offerApproveMember?.filter(member => member?.priority != null);
        const sortedMembers = validMembers?.sort((a, b) => a.priority - b.priority);
        const lowestPriorityMember = sortedMembers?.find(
            (member) => member.approval_status === "Approved"
        );
        const secondLowestMember = sortedMembers?.find(
            (member) => member.priority > (lowestPriorityMember?.priority || 0) && (member.approval_status === "" || member.approval_status === "Pending")
        );

        if (item?.priority === secondLowestMember?.priority && (item?.approval_status === "" || item?.approval_status === "Pending")) {
            return (
                <Button
                    type="button"
                    className="btn btn-success"
                    style={{ height: '40px', fontSize: '10px', color: 'white' }}
                    onClick={() => sendOfferApproval(item)}
                    disabled={loadingApproval}
                >
                    {loadingApproval ? "Sending Approval.." : "Send Mail"}
                </Button>
            );
        }
        if (item?.approval_status === "Approved") {
            return <span>Already Approved</span>;
        }
        if (item?.approval_status === 'Rejected') {
            return <span className="color-red">Already Rejected</span>;
        }
        return <span>No Actions Available</span>;
    };
    /**
     * @description Send Email for Approval when Clicked the Send it's would be sended in one member by member
     * @param {*} item 
     */
    const sendOfferApproval = async (item) => {
        try {
            setLodingApproval(true)
            let payloads = {
                "approval_note_doc_id": docId,
                "employee_id": item?.emp_doc_id,
                "add_by_name": getUserDetails?.name,
                "add_by_mobile": getUserDetails?.mobile_no,
                "add_by_designation": getUserDetails?.designation,
                "add_by_email": getUserDetails?.email
            }

            let response = await axios.post(`${config.API_URL}sendJobOfferApprovalMailToMember`, payloads, apiHeaderToken(config.API_TOKEN));
            if (response.status === 200) {
                toast.success(response.data.message);
                getApprovalMemberListById(docId)
                setLodingApproval(false)
            } else {
                toast.error(response.data.message);
                setLodingApproval(false)
            }
        } catch (error) {
            toast.error(error?.response.data?.message || error.message || 'Someting Went Wrong');
            setLodingApproval(false)
        }
    }
    /**
     * @description Handle The Removed the Member List when clicked to removed -
     * @param {*} item 
     */
    const handleRemove = (item) => {
        let deletedItem = offerApproveMember?.filter((data) => data?._id !== item?._id)?.map((item) => {
            if (item?.emp_doc_id === 'NA') {
                return {
                    id: item?.emp_doc_id,
                    priority: 0
                }
            }
            return {
                id: item?.emp_doc_id,
                priority: item.priority
            }
        })
        // Delete the member 
        memberAction(deletedItem)
            .then((res) => {
                if (res.status === 200) {
                    setMember(offerApproveMember?.filter((data) => data?._id !== item?._id))
                    getApprovalMemberListById(docId)
                }
            })
    }

    /**
     * @description This is Member Action Called && Form the Curd Action -
     * @param {Array || any} memberList 
     * @returns 
     */
    const memberAction = async (memberList, newAdded = {
        merge_approval_note_doc_id: '',
        approval_date: ''
    }) => {
        try {
            // docId
            let paylods = {
                "approval_note_doc_id": docId,
                "employee_ids": memberList,
                "add_by_name": getUserDetails?.name,
                "add_by_mobile": getUserDetails?.mobile_no,
                "add_by_designation": getUserDetails?.designation,
                "add_by_email": getUserDetails?.email,
                ...newAdded
            }
            let response = await axios.post(`${config.API_URL}addJobOfferApprovalMember`, paylods, apiHeaderToken(config.API_TOKEN))
            if (response.status === 200) {
                toast.success(response.data?.message)
                return response
            } else {
                toast.error(response.data?.message)
                return response
            }
        } catch (error) {
            toast.error(error?.response.data?.message || error.message || 'Someting Went Wrong');
            return error?.response.data?.message || error.message || 'Someting Went Wrong';
        }
    }
    /**
     * @description Add member with in Approval List ->  
     * @returns 
     */
    const addMember = () => {
        if (!selectedMember) {
            return toast.warn("Please Select the Member");
        }
        if (!addPeriority) {
            return toast.warn("Please Add Priority");
        }

        // Called the here Api After that update the member =;
        let payload = offerApproveMember?.map((item) => {
            if (item?.emp_doc_id === 'NA') {
                return {
                    id: item?.emp_doc_id,
                    priority: 0
                }
            }
            return {
                id: item?.emp_doc_id,
                priority: item.priority
            }
        })

        memberAction([...payload, { id: selectedMember?.emp?._id, priority: parseInt(addPeriority) }])
            .then((res) => {
                if (res.status === 200) {
                    setSelectedMember(null)
                    setAddPriority("")
                    getApprovalMemberListById(docId)
                }
            })
    };

    /**
     * @description Hanlde Update Member
     * @param {Object} item
     */
    const handleUpdateMember = async () => {
        let payload = offerApproveMember?.map((item) => {
            if (item?.emp_doc_id === 'NA') {
                return {
                    id: item?.emp_doc_id,
                    priority: 0,
                    designation: item?.designation
                }
            }
            return {
                id: item?.emp_doc_id,
                priority: item.priority,
                designation: item?.designation
            }
        })
        await memberAction(payload)
        setEditDesignation({
            index: 0,
            status: false
        })
        getApprovalMemberListById(docId)
    }

    /**
     * @description On the First Render Called the Member List Data when Make changes ->
     */

    useEffect(() => {
        if (memberListData?.approval_note_doc_id) {
            getApprovalMemberListById(memberListData?.approval_note_doc_id)
            setDocId(memberListData?.approval_note_doc_id)
        }
    }, [memberListData])

    /**
     * @description Get the Member List Data by Docs Id ->
     * @param {*} id 
     * @returns set the member State -
     */
    const getApprovalMemberListById = (id) => {
        const payload = {
            "approval_note_doc_id": id,
            "scope_fields": []
        }
        setLoading(true)
        axios.post(`${config.API_URL}getAppraisalNoteById`, payload, apiHeaderToken(config.API_TOKEN))
            .then((res) => {
                if (res.status === 200) {
                    setMember(res.data?.data?.panel_members_list)
                    setLoading(false)
                } else {
                    console.log(res.data)
                    setLoading(false)
                }
            })
            .catch((err) => {
                console.log(err)
                setLoading(false)
            })
    }

    const [approvalNoteSelected, setSelectApprovalNot] = useState(null);

    /**
     * @description Merge Candidate Changes - 
     * @param {*} option 
     * @returns 
     */
    const handleApprovalNoteMarge = async (option) => {

        if (!id && !filterJobDetails) {
            return toast.warning('Please select job first');
        }

        setSelectApprovalNot(option)

        let payload = offerApproveMember?.map((item) => {
            if (item?.emp_doc_id === 'NA') {
                return {
                    id: item?.emp_doc_id,
                    priority: 0,
                    designation: item?.designation
                }
            }
            return {
                id: item?.emp_doc_id,
                priority: item.priority,
                designation: item?.designation
            }
        })
        await memberAction(payload, {
            merge_approval_note_doc_id: option?.value,
            approval_date: ''
        })
        getApprovalMemberListById(docId)
    }

    /**
     * @description Edit Date Changes -> 
     * @param {*} date 
     * @returns 
     */

    const handleDateChanges = async (event) => {

        setSelectedDate(event.target.value);

        if (!id && !filterJobDetails) {
            return toast.warning('Please select job first');
        }

        let payload = offerApproveMember?.map((item) => {
            if (item?.emp_doc_id === 'NA') {
                return {
                    id: item?.emp_doc_id,
                    priority: 0,
                    designation: item?.designation
                }
            }
            return {
                id: item?.emp_doc_id,
                priority: item.priority,
                designation: item?.designation
            }
        })

        await memberAction(payload, {
            merge_approval_note_doc_id: '',
            approval_date: event.target.value
        })

        getApprovalMemberListById(docId)

    }

    const handleBlur = () => {

    };



    return (
        <>
            <Modal
                show={open}
                onHide={() => setOpen(false)}
                size={"lg"}
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter" className="d-flex justify-content-between align-items-center w-100">
                        <span>Set Offer Amount For Approval</span>
                        <div className="d-flex align-items-center gap-3">
                            {/* Merge Candidate Checkbox */}
                            <Form.Check
                                type="checkbox"
                                id="mergeCandidate"
                                label={<span style={{ fontSize: "0.875rem" }}>Merge Candidate</span>} // Smaller label
                                className="mb-0"
                                checked={mergeCandidate}
                                onChange={(e) => setMergeCandidate(e.target.checked)}
                            />

                            {/* Edit Approval Date Checkbox */}
                            <Form.Check
                                type="checkbox"
                                id="editApprovalDate"
                                label={<span style={{ fontSize: "0.875rem" }}>Edit Approval Date</span>} // Smaller label
                                className="mb-0"
                                checked={editApprovalDate}
                                onChange={(e) => setEditApprovalDate(e.target.checked)}
                            />
                        </div>
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="col-sm-12">
                        <Row>
                            <Col sm={4}>
                                <Select
                                    options={option}
                                    placeholder="Select Member"
                                    isSearchable
                                    value={selectedMember}
                                    onChange={handleChange}
                                    onInputChange={handleInputChange}
                                    onMenuOpen={handleMenuOpen}
                                    isLoading={pen}
                                    styles={customStyles}
                                />
                            </Col>
                            <Col sm={4}>
                                <Form.Control
                                    type="text"
                                    placeholder="Enter Priority"
                                    value={addPeriority}
                                    onChange={(e) => {
                                        const newValue = e.target.value;
                                        if (/^\d*$/.test(newValue)) {
                                            setAddPriority(newValue) // Parse or fallback to empty
                                        }
                                    }}
                                    className="form-control"
                                />
                            </Col>
                            {
                                approvalNotes?.find((item) => item?._id === memberListData?.approval_note_doc_id)?.status !== 'Completed' &&
                                <Col sm={4}>
                                    <Form.Group className="mb-3 position-relative" controlId="exampleForm.ControlInput1">
                                        <button
                                            type="button"
                                            class="sitebtn btn btn-primary ratebtn"
                                            onClick={addMember}
                                            disabled={approvalNotes?.find((item) => item?._id === memberListData?.approval_note_doc_id)?.status === 'Completed'}
                                        > <CheckCircleIcon /> Add Member </button>
                                    </Form.Group>
                                </Col>
                            }
                        </Row>

                        <Row className="mt-3">


                            {
                                mergeCandidate &&

                                <Col sm={4}>

                                    <Select
                                        options={approvalNotes?.filter((item) => item?._id !== memberListData?.approval_note_doc_id && !item.panel_members_list?.some((member) => member?.approval_status === 'Approved'))?.map((item) => {
                                            return {
                                                value: item._id,
                                                label: item.approval_note_id,
                                            }
                                        })}
                                        placeholder="Select Approval Note"
                                        isSearchable
                                        value={approvalNoteSelected}
                                        onChange={handleApprovalNoteMarge}
                                        styles={customStyles}
                                    />
                                </Col>
                            }


                            {
                                editApprovalDate &&


                                <Col sm={4}>
                                    <Form.Group controlId="datePicker">
                                        {/* <Form.Label>Select Date</Form.Label> */}
                                        <InputGroup>
                                            <Form.Control
                                                type="date"
                                                value={selectedDate}
                                                onChange={handleDateChanges}
                                                placeholderText="Select a date"
                                                className="form-control"
                                            />
                                            <InputGroup.Text>
                                                <FaCalendarAlt style={{ cursor: "pointer" }} />
                                            </InputGroup.Text>
                                        </InputGroup>
                                    </Form.Group>
                                </Col>
                            }


                        </Row>
                    </div>

                    <>
                        <div className="modaltbl mt-3">
                            <Table hover>
                                <thead>
                                    <tr>
                                        <th>Sno.</th>
                                        <th>Panel Member</th>
                                        <th>Priority</th>
                                        <th>Status</th>
                                        <th>Send Date</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        loading ? <tr> <td colSpan={6} className="text-center"> Loading...... </td> </tr> :
                                            offerApproveMember && offerApproveMember?.length > 0 ?
                                                offerApproveMember?.sort((a, b) => a?.priority - b?.priority)?.map((item, index) => {
                                                    return (
                                                        <tr key={item?.employee_doc_id}>
                                                            <td>{index + 1}</td>
                                                            <td>
                                                                <div className='d-flex flex-column align-items-start gap-1'>
                                                                    {/* <span>{item?.emp_code}</span> */}
                                                                    <span>{item?.name}</span>
                                                                    {
                                                                        editDesignation?.index === index && editDesignation.status ?
                                                                            <div className="d-flex align-items-start gap-1">
                                                                                <Form.Group className="mb-3 position-relative" controlId="exampleForm.ControlInput1">
                                                                                    <Form.Control
                                                                                        type="text"
                                                                                        value={item.designation}
                                                                                        placeholder="Enter Designation"
                                                                                        autoComplete="off"
                                                                                        onChange={(e) => {
                                                                                            let value = e.target.value;
                                                                                            setMember((prev) =>
                                                                                                prev.map((data, i) =>
                                                                                                    i === index ? { ...data, designation: value } : data
                                                                                                )
                                                                                            );
                                                                                        }}
                                                                                        className="form-control"
                                                                                    />
                                                                                </Form.Group>

                                                                                {/* <MdOutlineUpdate 
                                                                                    className=""
                                                                                    size={20}
                                                                                    color="blue"
                                                                                    style={{ cursor: "pointer" }}
                                                                                    onClick={() => {
                                                                                        setEditDesignation({ index: 0, status: false })
                                                                                    }}
                                                                                /> */}
                                                                            </div> :
                                                                            <span>{item?.designation} {item?.designation === 'CEO' && "Sir"} {item?.designation !== 'CEO' && <p className="d-inline p-1" style={{ cursor: 'pointer' }}> <TiEdit onClick={(e) => setEditDesignation({ index: index, status: true })} color="green" size={18} /></p>}</span>
                                                                    }
                                                                </div>
                                                            </td>
                                                            {/* <td width={'18%'}>
                                                                <Form.Control
                                                                    type="text"
                                                                    value={item?.priority}
                                                                    readOnly={(item?.approval_status === "Approved" || item?.approval_status === "Pending")}
                                                                    onChange={(e) => {
                                                                        const newValue = e.target.value;
                                                                        if (/^\d*$/.test(newValue)) {
                                                                            handlePriorityChange(index, parseInt(newValue, 10) || ""); // Parse or fallback to empty
                                                                        }
                                                                    }}
                                                                    className="form-control w-50"
                                                                />
                                                            </td> */}
                                                            <td width="18%">
                                                                {item?.approval_status !== "Approved" && item?.approval_status !== "Pending" ? (
                                                                    <Form.Control
                                                                        type="text"
                                                                        value={item?.priority}
                                                                        readOnly={item?.approval_status === "Approved" || item?.approval_status === "Pending"}
                                                                        onChange={(e) => {
                                                                            const newValue = e.target.value;
                                                                            if (/^\d*$/.test(newValue)) {
                                                                                handlePriorityChange(index, parseInt(newValue, 10) || "");
                                                                            }
                                                                        }}
                                                                        className="form-control w-50"
                                                                    />
                                                                ) : (
                                                                    <span
                                                                        key={item?.priority}
                                                                        style={{ display: "inline-block", width: "100%" }}
                                                                    >
                                                                        {item?.priority}
                                                                    </span>
                                                                )}
                                                            </td>
                                                            <td>{item?.approval_status || "-"}</td>
                                                            <td>{item?.send_mail_date ? moment(item?.send_mail_date).format('DD/MM/YYYY') : 'N/A'}</td>
                                                            <td>
                                                                <div className="d-flex gap-2">
                                                                    <span className="" style={{ height: '44px' }}>{getActionButtonByPriority(item)}</span>
                                                                    {
                                                                        item?.approval_status === "" &&
                                                                        <OverlayTrigger
                                                                            placement="top" // Tooltip position: 'top', 'bottom', 'left', or 'right'
                                                                            overlay={
                                                                                <Tooltip id={`tooltip-delete-${item.id || Math.random()}`}>
                                                                                    Delete Member
                                                                                </Tooltip>
                                                                            }
                                                                        >
                                                                            <span onClick={() => handleRemove(item)} style={{ cursor: 'pointer' }}>
                                                                                <CiCircleRemove size={25} color="red" />
                                                                            </span>
                                                                        </OverlayTrigger>
                                                                    }
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    )
                                                })
                                                :
                                                <tr className='text-center'>
                                                    <td colSpan={6} className='text-center'>No Record Found</td>
                                                </tr>
                                    }
                                </tbody>
                            </Table>
                        </div>

                        {
                            approvalNotes?.find((item) => item?._id === memberListData?.approval_note_doc_id)?.status !== 'Completed' &&
                            <div className="col-sm-12 text-center">
                                <button
                                    style={{ marginTop: '36px' }}
                                    type="button"
                                    class="sitebtn btn btn-primary ratebtn"
                                    onClick={handleUpdateMember}
                                    disabled={approvalNotes?.find((item) => item?._id === memberListData?.approval_note_doc_id)?.status === 'Completed'}
                                > <CheckCircleIcon /> Update </button>
                            </div>
                        }

                    </>
                </Modal.Body>
            </Modal>
        </>
    )
}

export default memo(ApprovalModalApprovalCandidate)