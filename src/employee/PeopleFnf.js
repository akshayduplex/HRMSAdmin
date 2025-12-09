import React, { useEffect, useState } from "react";
import Form from "react-bootstrap/Form";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css"; // Import Quill styles
import { CiCalendar } from "react-icons/ci";
import InputGroup from "react-bootstrap/InputGroup";
import { MdOutlineCurrencyRupee } from "react-icons/md";
import { toast } from "react-toastify";
import { HandOverFNF } from "../features/slices/LeaveSlices/LeaveSlices";
import { useDispatch } from "react-redux";
import moment from "moment";

const PeopleFNF = ({userData}) => {
    const [text, setText] = useState([]);


    const dispatch = useDispatch();
    const id = localStorage.getItem('onBoardingId')


    const [FormDataState, setFormDataState] = useState({
        ExistType: "",
        region: '',
        assetsHandoverForm: null,
        existInterviewForm: null,
        affectCondition: '',
        lastWorkingDay: '',
        NoticePay: "",
        ImmediatePay: '',
        payTypes:false,
    });

    const handleInputChanges = (obj) => {
        setFormDataState(prev => ({
            ...prev,
            ...obj
        }));
    };

    useEffect(() => {
            if(userData?.job_status === 'onNotice'){
                handleInputChanges({ affectCondition: 'Notice' })
            }else if (userData?.job_status === "Immediate"){
                handleInputChanges({ affectCondition: 'Immediate' })
            }
            handleInputChanges({ ExistType: userData?.termination_mode})
            handleInputChanges({ NoticePay: userData?.notice_pay ? userData?.notice_pay : "" })
            handleInputChanges({ lastWorkingDay:  moment(userData?.date_of_leaving).format('YYYY-MM-DD') })
            handleInputChanges({ region:  userData?.termination_reason })
            handleInputChanges({ ImmediatePay:  userData?.recoverable_payable })
    } , [userData])

    const handleNumericChange = (e) => {
        const inputValue = e.target.value;
        const regex = /^[0-9]*\.?[0-9]*$/; 

        if (regex.test(inputValue)) {
            handleInputChanges({ NoticePay: inputValue });
        }
    };

    /**************** handle Fnf Submit  ****************************/
    const handleFNFSubmit = (e) => {
        e.preventDefault();
        if(!FormDataState.ExistType){
            toast.warning('Please choose The Exit Mode');
            return;
        }
        if(!FormDataState.region){
            toast.warning('Please Add the Region');
            return;
        }
        if(!FormDataState.affectCondition){
            toast.warning('Please Choose the Effected mode');
            return;
        }
        if(!FormDataState.lastWorkingDay){
            return toast.warn('Please choose the Last Working Day')
        }


        let payload = {
            "_id":"66cc5ac0fa2035264257c9fc",
            "termination_mode":"",
            "ejection_mode":"",
            "termination_reason":"",
            "date_of_leaving":"",
            "asset_handover_form":"<Browse File>",
            "exit_interview_form":"<Browse File>",
            "notice_pay":"",
            "recoverable_payable":""
        }

        let formData = new FormData();
        formData.append('termination_mode', FormDataState.ExistType);
        formData.append('ejection_mode', FormDataState.affectCondition);
        formData.append('termination_reason', FormDataState.region);
        formData.append('date_of_leaving', FormDataState.lastWorkingDay);
        formData.append('asset_handover_form', FormDataState.assetsHandoverForm);
        formData.append('exit_interview_form', FormDataState.existInterviewForm);
        formData.append('notice_pay', FormDataState.NoticePay);
        formData.append('recoverable_payable', FormDataState.ImmediatePay);
        formData.append('_id', id);

        dispatch(HandOverFNF(formData)).unwrap()
        .then((response) => {
            toast.success(response.message);
        })
        .catch((err) => {
            toast.error(err.data.message);
        })
    }

    return (
        <>
            <div className="row my-3" data-aos="fade-in" data-aos-duration="3000">
                <div className="col-lg-12">
                    <div className="sitecard pr-0 ">
                        <div className="d-flex gap-5 flex-row">
                            <Form.Check
                                label="Resign"
                                name="group1"
                                value="Resigned"
                                type="radio"
                                id="check1"
                                checked={FormDataState.ExistType === 'Resigned'}
                                onChange={(e) => handleInputChanges({ ExistType: e.target.value })}
                            />
                            <Form.Check
                                label="Terminated"
                                name="group1"
                                value="Terminated"
                                type="radio"
                                id="check2"
                                checked={FormDataState.ExistType === 'Terminated'}
                                onChange={(e) => handleInputChanges({ ExistType: e.target.value })}
                            />
                            <Form.Check
                                label="Contract Closer"
                                name="group1"
                                value="Contract-Closer"
                                type="radio"
                                id="check2"
                                checked={FormDataState.ExistType === 'Contract-Closer'}
                                onChange={(e) => handleInputChanges({ ExistType: e.target.value })}
                            />
                            <Form.Check
                                label="Project Closer"
                                name="group1"
                                value="Project-Closer"
                                type="radio"
                                id="check2"
                                checked={FormDataState.ExistType === 'Project-Closer'}
                                onChange={(e) => handleInputChanges({ ExistType: e.target.value })}
                            />
                            <Form.Check
                                label="Retired"
                                name="group1"
                                value="Retired"
                                type="radio"
                                id="check2"
                                checked={FormDataState.ExistType === 'Retired'}
                                onChange={(e) => handleInputChanges({ ExistType: e.target.value })}
                            />
                        </div>
                        <div className="my-3">
                            <Form>
                                <Form.Group controlId="exampleForm.ControlTextarea1">
                                    <Form.Label className=" text-start w-100">
                                        State Reason
                                    </Form.Label>
                                    <div className="texteditor" style={{ width: '98%' }}>
                                        <ReactQuill
                                            value={FormDataState.region}
                                            onChange={(value) => handleInputChanges({ region: value })}
                                            placeholder="Enter description"
                                            className="custom-quill"
                                        />
                                    </div>
                                </Form.Group>
                            </Form>
                        </div>
                        <Form.Group controlId="formFile" className="mb-3">
                            <Form.Label className="text-start w-100">
                                Upload Asset Handover Form
                            </Form.Label>
                            <div className="customfile_upload">
                                <input
                                    type="file"
                                    className="cstmfile"
                                    placeholder="Please Choose Pdf , docx Only"
                                    accept="application/pdf, application/msword, application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                                    onChange={(event) => {
                                        const file = event.target.files[0];
                                        if (file) {
                                            handleInputChanges({ assetsHandoverForm: file });
                                        }
                                    }}
                                    required
                                />
                            </div>
                        </Form.Group>
                        <Form.Group controlId="formFile" className="mb-3">
                            <Form.Label className="text-start w-100">
                                Upload Exit Interview Form
                            </Form.Label>
                            <div className="customfile_upload">
                                <input
                                    type="file"
                                    placeholder="Please Choose Pdf , docx Only"
                                    className="cstmfile"
                                    accept="application/pdf, application/msword, application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                                    onChange={(event) => {
                                        const file = event.target.files[0];
                                        if (file) {
                                            handleInputChanges({ existInterviewForm: file });
                                        }
                                    }}
                                />
                            </div>
                        </Form.Group>
                        <div className="d-flex gap-5 flex-row mb-3">
                            <Form.Check
                                label="With Immediate Effect"
                                name="group11"
                                value="Immediate"
                                type="radio"
                                id="check11"
                                checked={FormDataState.affectCondition === 'Immediate'}
                                onChange={(e) => {
                                    handleInputChanges({payTypes:false})
                                    handleInputChanges({ affectCondition: e.target.value })
                                }}
                            />
                            <Form.Check
                                label="Notice Period"
                                name="group11"
                                value="Notice"
                                type="radio"
                                id="check22"
                                checked={FormDataState.affectCondition === 'Notice'}
                                onChange={(e) => {
                                    handleInputChanges({payTypes:false})
                                    handleInputChanges({ affectCondition: e.target.value })
                                }}
                            />
                        </div>
                        <div className="lastdaywrap">
                            <Form.Label className="text-start">Last Working Day</Form.Label>

                            <div className="datebox mb-3">
                                <Form.Control
                                    type="date"
                                    value={FormDataState.lastWorkingDay}
                                    onChange={(e) =>  handleInputChanges({ lastWorkingDay: e.target.value })}
                                />
                                <CiCalendar />
                            </div>
                        </div>
                        <div className="notice_recover">
                            <div className="d-flex gap-5 flex-row mb-3">
                                <Form.Check
                                    label="Notice Pay"
                                    name="group111"
                                    type="radio"
                                    id="check111"
                                    checked={ FormDataState.affectCondition === 'Notice'  || FormDataState.payTypes}
                                    onChange={(e) => handleInputChanges({payTypes:true})}
                                /> 
                                <InputGroup>
                                    <InputGroup.Text id="">
                                        <MdOutlineCurrencyRupee />
                                    </InputGroup.Text>
                                    <Form.Control
                                        value={FormDataState.NoticePay}
                                        onChange={handleNumericChange}
                                    />
                                </InputGroup>
                            </div>
                            <div className="d-flex gap-5 flex-row mb-3">
                                <Form.Check
                                    label="Recoverable Payable"
                                    name="group111"
                                    type="radio"
                                    id="check211"
                                    checked={FormDataState.affectCondition === 'Immediate' || FormDataState.payTypes}
                                    onChange={(e) => handleInputChanges({payTypes:true})}
                                />
                                <InputGroup>
                                    <InputGroup.Text id="">
                                        <MdOutlineCurrencyRupee />
                                    </InputGroup.Text>
                                    <Form.Control
                                        value={FormDataState.ImmediatePay}
                                        onChange={(e) => {
                                            const inputValue = e.target.value;
                                            const regex = /^[0-9]*\.?[0-9]*$/;
                                            if (regex.test(inputValue)) {
                                                handleInputChanges({ ImmediatePay: e.target.value })
                                            }
                                        }}
                                    />
                                </InputGroup>
                            </div>
                            <div className="btneditortest"  onClick={handleFNFSubmit}>
                                <button className="sitebtn">Submit</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default PeopleFNF;
