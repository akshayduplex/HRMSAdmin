import React, { useCallback, useEffect, useState } from "react";
import GoBackButton from "../goBack/GoBackButton";
import Form from "react-bootstrap/Form";
import { CiCalendar } from "react-icons/ci";
import { GetEmployeeListDropDown } from "../slices/EmployeeSlices/EmployeeSlice";
import { useDispatch } from "react-redux";
import AsyncSelect from 'react-select/async';
import { FormControl, InputGroup } from "react-bootstrap";
import { toast } from "react-toastify";
import { HandOverFNF } from "../slices/LeaveSlices/LeaveSlices";

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

const EmployeeContractClosure = () => {
  const dispatch = useDispatch();
  const [employee, setEmployee] = useState(null);
  const [options, setOptions] = useState([]);
  const [stateData, setStateData] = useState({
    exitCondition: 'Resigned',
    exitRegion: '',
    assetsHandOverForm: null,
    exitInterviewFrom: null,
    exitAffectType: "",
    salaryReleaseDate: "",
    workingDays: "",
    immediateOrNoticePayable: "",
    noticePeriodPay: "",
    immediatePay: "",
    lastWorkingDate: null,
  });

  // Handle State changes
  const handleStateChanges = (obj) => {
    setStateData(prev => ({
      ...prev,
      ...obj
    }));
  };

  // Load employee options
  const loadOptions = useCallback(async (inputValue) => {
    const result = await dispatch(GetEmployeeListDropDown(inputValue)).unwrap();
    return result.slice(0, 10);
  }, [dispatch]);

  const handleMenuOpen = async () => {
    const result = await dispatch(GetEmployeeListDropDown('')).unwrap();
    setOptions(result);
  };

  const handleChangeEmployee = (selectedEmployee) => {
    setEmployee(selectedEmployee);
  };

  // Handle file change
  const handleFileChange = (event) => {
    handleStateChanges({ assetsHandOverForm: event.target.files });
  };

  useEffect(() => {
    if (['Immediate', 'Notice'].includes(stateData.exitAffectType)) {
      if (stateData.exitAffectType === 'Immediate') {
        handleStateChanges({ immediateOrNoticePayable: 'recoverable_payable' });
      } else if (stateData.exitAffectType === 'Notice') {
        handleStateChanges({ immediateOrNoticePayable: 'Notice pay' });
      }
    }
  }, [stateData.exitAffectType]);

  const handleSubmit = () => {
    if (!employee) {
      return toast.warn("Please select the employee");
    }
    if (!stateData.exitCondition) {
      return toast.warn("please choose the Exit type");
    }
    if (!stateData.exitRegion) {
      return toast.warn("Please Enter the Exit Region")
    }
    if (!stateData.exitAffectType) {
      return toast.warn("please choose the Exit type");
    }
    if (!stateData.immediateOrNoticePayable) {
      return toast.warn("Please choose the Immediate or Notice Payable");
    }
    if (!stateData.lastWorkingDate) {
      return toast.warn("Please Enter the Last Working Date");
    }


    let formData = new FormData();
    formData.append('termination_mode', stateData.exitCondition);
    formData.append('ejection_mode', stateData.exitAffectType);
    formData.append('termination_reason', stateData.exitRegion);
    formData.append('date_of_leaving', stateData.lastWorkingDate);
    formData.append('asset_handover_form', stateData.assetsHandOverForm);
    formData.append('exit_interview_form', stateData.exitInterviewFrom);
    formData.append('notice_pay', stateData.noticePeriodPay);
    formData.append('recoverable_payable', stateData.immediatePay);
    formData.append('_id', employee?.value);

    dispatch(HandOverFNF(formData)).unwrap()
      .then((response) => {
        if (response.status) {
          toast.success(response.message);
          setEmployee(null);
          handleStateChanges({
            exitCondition: 'Resigned',
            exitRegion: '',
            assetsHandOverForm: null,
            exitInterviewFrom: null,
            exitAffectType: "",
            salaryReleaseDate: "",
            workingDays: "",
            immediateOrNoticePayable: "",
            noticePeriodPay: "",
            immediatePay: "",
            lastWorkingDate: null,
          })
        } else {
          toast.error(response.message);
        }
      })
      .catch((err) => {
        toast.error(err?.data.message || err?.message);
      })
  }

  return (
    <>
      <div className="maincontent">
        <div className="container" data-aos="fade-in" data-aos-duration="3000">
          <GoBackButton />
          <div className="d-flex justify-content-start align-items-start flex-column ">
            <h2>Full & Final</h2>
            <span>Employees full & final</span>
            <div className="row mt-4 w-100">
              <div className="col-lg-10">
                <div className="card card-border rounded-4 w-100 py-4 px-3">
                  <div className="row mt-4">
                    <div className="col-lg-12">
                      <Form.Group controlId="formBasicEmail">
                        <Form.Label>Choose Employee</Form.Label>
                        <AsyncSelect
                          cacheOptions
                          defaultOptions
                          value={employee}
                          loadOptions={loadOptions}
                          onMenuOpen={handleMenuOpen}
                          onChange={handleChangeEmployee}
                          placeholder="Choose Employee"
                          classNamePrefix="react-select"
                          styles={customStyles}
                        />
                      </Form.Group>
                    </div>
                  </div>

                  {/* Exit Conditions */}
                  <div className="card-body">
                    <div className="d-flex gap-5 flex-row">
                      {['Resigned', 'Terminated', 'Contract-Closer', 'Project-Closer', 'Retired'].map(condition => (
                        <Form.Check
                          key={condition}
                          label={condition}
                          name="exitCondition"
                          type="radio"
                          id={`check-${condition}`}
                          value={condition}
                          checked={stateData.exitCondition === condition}
                          onClick={() => handleStateChanges({ exitCondition: condition })}
                        />
                      ))}
                    </div>

                    {/* Exit Reason */}
                    <div className="mt-4">
                      <Form.Group controlId="exitRegion">
                        <Form.Label className=" text-start w-100">State Reason</Form.Label>
                        <Form.Control
                          value={stateData.exitRegion}
                          as="textarea"
                          rows={6}
                          className="h-100"
                          onChange={(e) => handleStateChanges({ exitRegion: e.target.value })}
                        />
                      </Form.Group>
                    </div>

                    {/* File Uploads */}
                    <div className="row mt-4">
                      <div className="col-md-6">
                        <Form.Group className="mb-3">
                          <Form.Label>Assets HandOver Form</Form.Label>
                          <Form.Control
                            type="file"
                            multiple
                            onChange={handleFileChange}
                          />
                        </Form.Group>
                      </div>
                      <div className="col-md-6">
                        <Form.Group className="mb-3">
                          <Form.Label>Exit Interview Form</Form.Label>
                          <Form.Control
                            type="file"
                            multiple
                            onChange={(event) => handleStateChanges({ exitInterviewFrom: event.target.files })}
                          />
                        </Form.Group>
                      </div>
                    </div>

                    {/* Exit Affect Type */}
                    <div className="row mt-4">
                      {['Immediate', 'Notice'].map((label) => (
                        <div className="col-md-6" key={label}>
                          <Form.Check
                            label={label}
                            name="exitAffectType"
                            type="checkbox"
                            value={label}
                            checked={stateData.exitAffectType === label}
                            onChange={() => handleStateChanges({ exitAffectType: label })}
                          />
                        </div>
                      ))}
                    </div>

                    {/* Payment Fields */}
                    <div className="row mt-4">
                      <div className="col-sm-6">
                        <Form.Group className="w-100" controlId="noticePay">
                          <Form.Label>
                            <Form.Check
                              label="Notice Pay"
                              type="checkbox"
                              value="Notice pay"
                              checked={stateData.immediateOrNoticePayable === 'Notice pay'}
                              onChange={(e) => handleStateChanges({ immediateOrNoticePayable: e.target.checked ? 'Notice pay' : '' })}
                            />
                          </Form.Label>
                          <InputGroup className="mb-3">
                            <InputGroup.Text>₹</InputGroup.Text>
                            <FormControl
                              type="text"
                              placeholder="Enter amount"
                              value={stateData.noticePeriodPay}
                              onChange={(event) => handleStateChanges({ noticePeriodPay: event.target.value })}
                              disabled={stateData.immediateOrNoticePayable !== 'Notice pay'}
                            />
                          </InputGroup>
                        </Form.Group>
                      </div>
                      <div className="col-sm-6">
                        <Form.Group className="w-100" controlId="recoverablePayable">
                          <Form.Label>
                            <Form.Check
                              label="Recoverable Payable"
                              type="checkbox"
                              value="recoverable_payable"
                              checked={stateData.immediateOrNoticePayable === 'recoverable_payable'}
                              onChange={(e) => handleStateChanges({ immediateOrNoticePayable: e.target.checked ? 'recoverable_payable' : '' })}
                            />
                          </Form.Label>
                          <InputGroup className="mb-3">
                            <InputGroup.Text>₹</InputGroup.Text>
                            <FormControl
                              type="text"
                              placeholder="Enter amount"
                              value={stateData.recoverablePayable}
                              onChange={(event) => handleStateChanges({ recoverablePayable: event.target.value })}
                              disabled={stateData.immediateOrNoticePayable !== 'recoverable_payable'}
                            />
                          </InputGroup>
                        </Form.Group>
                      </div>
                    </div>

                    {/* Last Working Date */}
                    <div className="row mt-4">
                      <div className="col-sm-6">
                        <Form.Group className="w-100" controlId="lastWorkingDate">
                          <Form.Label>Last Working Date</Form.Label>
                          <div className="datebox">
                            <Form.Control
                              type="date"
                              value={stateData.lastWorkingDate}
                              onChange={(event) => handleStateChanges({ lastWorkingDate: event.target.value })}
                            />
                            <CiCalendar />
                          </div>
                        </Form.Group>
                      </div>
                    </div>

                    {/* Save Button */}
                    <div className="d-flex justify-content-center align-items-center mt-4">
                      <div className="read-btn w-small w-100">
                        <button onClick={handleSubmit} className="btn">Save</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default EmployeeContractClosure;
