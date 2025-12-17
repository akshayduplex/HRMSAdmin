import React, { useState, useEffect, useCallback } from "react";
import Form from "react-bootstrap/Form";
import { CiCalendar } from "react-icons/ci";
import { getDesignationList, getProjectList } from "./helper/Api_Helper";
import AsyncSelect from 'react-select/async';
import { useDispatch } from "react-redux";
import FormControl from "@mui/material/FormControl";
import { FetchDesignationListForJob, FetchProjectListDropDown } from "../features/slices/ProjectListDropDown/ProjectListDropdownSlice";
import Select from "react-select";


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

export default function General_info({ formData, handleInputChange, designationData, projectListData, setProjectLists, setProjectNameId }) {
  const [projectOptions, setProjectOptions] = useState([]);
  const [option, setOptions] = useState([]);
  const [projectBudgetEstimate, setProjectBudgetEstimate] = useState([]);
  const dispatch = useDispatch();
  const [projectList, setProjectList] = useState([]);
  const [DesignationValue, setDesignationValue] = useState([]);
  const [filteredOptions, setFilteredOptions] = useState([]);
  const [designationOptions, setDesignationOptions] = useState([]);
  const [designationPage, setDesignationPage] = useState(1);
  const [hasMoreDesignation, setHasMoreDesignation] = useState(true);
  const [designationSearch, setDesignationSearch] = useState("");
  const [loadingDesignation, setLoadingDesignation] = useState(false);
  useEffect(() => {
    loadDesignation("", 1, true);
  }, []);

  const loadDesignation = async (searchKey, page, reset = false) => {
    if (loadingDesignation || (!hasMoreDesignation && !reset)) return;

    setLoadingDesignation(true);

    const response = await getDesignationList(searchKey, page);
    const list = response?.data || [];

    const mapped = list.map(item => ({
      label: item.name,
      value: item._id,
    }));

    setDesignationOptions(prev =>
      reset ? mapped : [...prev, ...mapped]
    );

    setHasMoreDesignation(list.length === 25);
    setDesignationPage(page);
    setLoadingDesignation(false);
  };
  const handleDesignationInputChange = (inputValue) => {
    setDesignationSearch(inputValue);
    setDesignationPage(1);
    setHasMoreDesignation(true);
    loadDesignation(inputValue, 1, true);
  };
  const handleDesignationScroll = () => {
    if (hasMoreDesignation) {
      loadDesignation(designationSearch, designationPage + 1);
    }
  };

  useEffect(() => {
    fetchDesignation();
  }, []);

  const fetchDesignation = async () => {
    const response = await getDesignationList("");
    if (response?.data?.length > 0) {
      const options = response.data.map((item) => ({
        label: item.name,
        value: item._id
      }));
      setDesignationOptions(options);
    }
  };

  const loadDesignationOptions = async (inputValue) => {
    const response = await getDesignationList(inputValue);
    return response?.data?.map((item) => ({
      label: item.name,
      value: item._id
    })) || [];
  };


  useEffect(() => {
    if (projectListData) {
      setProjectList(projectListData?.map((key) => {
        return {
          value: key._id,
          label: key.title,
          budget_estimate_list: key.budget_estimate_list,
          location: key.location
        }
      }));
    }
    //  add the Designation List Selected Designation ListData ->

    if (designationData?.length > 0 && formData.designation) {
      const designationOptions = designationData?.map((key) => {
        return {
          label: `${key.designation} (${key.no_of_positions} positions) - CTC: ${key.ctc}`,
          value: key.designation,
          ctc: key.ctc,
          id: key.designation_id
        }
      });

      setFilteredOptions(designationOptions);

      const selectedDesignation = designationOptions.find((data) => data.value === formData.designation);
      if (selectedDesignation) {
        setDesignationValue([selectedDesignation]);
      }
    }
    // Handle case when designationData is empty but formData.designation exists (editing existing employee)
    else if (designationData?.length === 0 && formData.designation) {
      // Create a temporary option for the existing designation
      const tempDesignationOption = [{
        label: formData.designation,
        value: formData.designation,
        ctc: formData.ctc || 0,
        id: formData.designation_id || ''
      }];

      setFilteredOptions(tempDesignationOption);
      setDesignationValue(tempDesignationOption);
    }
  }, [designationData, formData.designation, projectListData])


  /********************** Project List Dropdown ********************/
  const projectLoadOption = async (input) => {
    const result = await dispatch(FetchProjectListDropDown(input)).unwrap();
    return result;
  }
  const projectMenuOpen = async () => {
    const result = await dispatch(FetchProjectListDropDown('')).unwrap();
    setOptions(result);
  }
  const handleProjectChanges = (option) => {
    setProjectList(option)
    setProjectNameId(option?.value)
    handleInputChange({
      target: {
        name: "project_name",
        value: option.label,
      },
    });

    handleInputChange({
      target: {
        name: "project_id",
        value: option.value,
      },
    });
    localStorage.setItem("onBoardingLocation", JSON.stringify(option.location));
    localStorage.setItem(
      "onBoardingbudget_estimate_list",
      JSON.stringify(option.budget_estimate_list)
    );
    setDesignationValue([])
    setFilteredOptions(option.budget_estimate_list?.map((key) => {
      return {
        label: `${key.designation} (${key.no_of_positions} positions) - CTC: ${key.ctc}`,
        value: key.designation,
        ctc: key.ctc,
        id: key._id,
      }
    }))
  }

  /************** Old code changes *************/

  const handleDesignationChange = (option) => {
    setDesignationValue(option)
    handleInputChange({
      target: {
        name: "designation",
        value: option ? option.value : "",
      }
    });
    handleInputChange({
      target: {
        name: "ctc",
        value: option ? option.ctc : 0,
      }
    });
    handleInputChange({
      target: {
        name: "designation_id",
        value: option ? option.id : '',
      }
    });
  };

  const onMenuOpen = () => {
    if (designationData?.length > 0) {
      setFilteredOptions(designationData?.map((key) => {
        return {
          label: `${key.designation} (${key.no_of_positions} positions) - CTC: ${key.ctc}`,
          value: key.designation,
          ctc: key.ctc,
          id: key.designation_id
        }
      }))
    }
  }

  return (
    <>
      <div
        className="mt-5 gy-3 align-items-end"
        data-aos="fade-in"
        data-aos-duration="3000"
      >

        <div className="row ">
          <div className="col-6 d-flex flex-row gap-3 mb-4 ">
            <Form.Group
              className="position-relative"
              controlId="exampleForm.ControlInput13"
            >
              <Form.Label>Is This On Role or On Consultant or Empaneled </Form.Label>
              <div className="col-12 d-flex flex-row gap-3">
                <Form.Check
                  type="radio"
                  label="On Role"
                  name="employee_type"
                  id="formHorizontalRadios1"
                  value="onRole"
                  checked={formData.employee_type === "onRole"}
                  onChange={handleInputChange}
                />
                <Form.Check
                  type="radio"
                  label="On Consultant"
                  name="employee_type"
                  id="formHorizontalRadios2"
                  value="onContract"
                  checked={formData.employee_type === "onContract"}
                  onChange={handleInputChange}
                />
                <Form.Check
                  type="radio"
                  label="Empaneled"
                  name="employee_type"
                  id="formHorizontalRadios3"
                  value="emPanelled"
                  checked={formData.employee_type === "emPanelled"}
                  onChange={handleInputChange}
                />
              </div>
            </Form.Group>
          </div>
          <div className="col-6 projname mb-4 ">
            <Form.Group
              className="position-relative"
              controlId="exampleForm.ControlInput13"
            >
              <Form.Label>Employee Code (EC No.)</Form.Label>
              <Form.Control
                type="text"
                placeholder="100101000"
                name="employee_code"
                value={formData.employee_code || ""}
                // onChange={handleInputChange}
                onChange={(e) => {
                  const value = e.target.value;
                  const filteredValue = value.replace(/[^a-zA-Z0-9 ]/g, "");
                  handleInputChange({
                    target: {
                      name: "employee_code",
                      value: filteredValue
                    }
                  });
                }}
              />
            </Form.Group>
          </div>
        </div>
        <div className="gy-3">
          <Form>
            <div className="row">
              <Form.Group
                className="mb-4 col-6 position-relative"
                controlId="employee_code"
              >
                <Form.Label>Project</Form.Label>
                <div className="d-flex flex-row gap-5">
                  <FormControl fullWidth>
                    <AsyncSelect
                      cacheOptions
                      defaultOptions
                      defaultValue={option}
                      loadOptions={projectLoadOption}
                      value={projectList}
                      onMenuOpen={projectMenuOpen}
                      placeholder="Select Project"
                      onChange={handleProjectChanges}
                      classNamePrefix="react-select"
                      styles={customStyles}
                    />
                  </FormControl>
                </div>
              </Form.Group>


              <Form.Group className="mb-4 col-6">
                <Form.Label>Designation</Form.Label>
                <FormControl fullWidth>
                  <AsyncSelect
                    cacheOptions={false}
                    isLoading={loadingDesignation}
                    defaultOptions={designationOptions}
                    options={designationOptions}
                    value={DesignationValue}
                    onChange={(option) => {
                      setDesignationValue(option);
                      handleInputChange({
                        target: {
                          name: "designation",
                          value: option?.label || "",
                        },
                      });
                      handleInputChange({
                        target: {
                          name: "designation_id",
                          value: option?.value || "",
                        },
                      });
                    }}
                    onInputChange={handleDesignationInputChange}
                    onMenuScrollToBottom={handleDesignationScroll}
                    placeholder="Choose Designation"
                    styles={customStyles}
                  />
                </FormControl>
              </Form.Group>

              <Form.Group className="mb-4 col-6" controlId="valid_till">
                <Form.Label>Contract Valid Till</Form.Label>
                <div className="d-flex flex-row gap-5 datebox">
                  <Form.Control
                    type="date"
                    name="valid_till"
                    value={formData.valid_till || ""}
                    onChange={handleInputChange}
                  />
                  <CiCalendar />
                </div>
              </Form.Group>

              <Form.Group className="mb-4 col-6" controlId="name">
                <Form.Label>Name</Form.Label>
                <div className="d-flex flex-row gap-5">
                  <Form.Control
                    type="text"
                    placeholder="Enter the Name"
                    name="name"
                    value={formData.name || ""}
                    onChange={(e) => {
                      const value = e.target.value;
                      // Only allow letters, numbers, and spaces
                      const filteredValue = value.replace(/[^a-zA-Z0-9 ]/g, "");
                      handleInputChange({
                        target: {
                          name: "name",
                          value: filteredValue
                        }
                      });
                    }}
                  />

                </div>
              </Form.Group>

              <Form.Group className="mb-4 col-6" controlId="father_name">
                <Form.Label>Father’s Name</Form.Label>
                <div className="d-flex flex-row gap-5">
                  <Form.Control
                    type="text"
                    placeholder="Enter Father's Name"
                    name="father_name"
                    value={formData.father_name || ""}
                    // onChange={handleInputChange}
                    onChange={(e) => {
                      const value = e.target.value;
                      const filteredValue = value.replace(/[^a-zA-Z0-9 ]/g, "");
                      handleInputChange({
                        target: {
                          name: "father_name",
                          value: filteredValue
                        }
                      });
                    }}
                  />
                </div>
              </Form.Group>

              <Form.Group className="mb-4 col-6" controlId="email">
                <Form.Label>Email ID</Form.Label>
                <div className="d-flex flex-row gap-5">
                  <Form.Control
                    type="email"
                    placeholder="abc@gmail.com"
                    name="email"
                    value={formData.email || ""}
                    onChange={handleInputChange}
                  />
                </div>
              </Form.Group>
              <Form.Group className="mb-4 col-6" controlId="alt_email">
                <Form.Label>Alt Email ID</Form.Label>
                <div className="d-flex flex-row gap-5">
                  <Form.Control
                    type="text"
                    placeholder="abc@gmail.com"
                    name="alt_email"
                    value={formData.alt_email || ""}
                    onChange={handleInputChange}
                  // onChange={(e) => {
                  //   const value = e.target.value;
                  //   const filteredValue = value.replace(/[^0-9]/g, "").slice(0, 10);
                  //   handleInputChange({
                  //     target: {
                  //       name: "alt_email",
                  //       value: filteredValue
                  //     }
                  //   });
                  // }}
                  />
                </div>
              </Form.Group>
              <Form.Group className="mb-4 col-6" controlId="mobile_no">
                <Form.Label>Mobile number</Form.Label>
                <div className="d-flex flex-row gap-5">
                  <Form.Control
                    type="text"
                    maxLength={10}
                    placeholder="+91-9794XXXX52"
                    name="mobile_no"
                    value={formData.mobile_no || ""}
                    // onChange={handleInputChange}
                    onChange={(e) => {
                      let value = e.target.value;
                      const filteredValue = value.replace(/[^0-9]/g, "").slice(0, 10);
                      handleInputChange({
                        target: {
                          name: "mobile_no",
                          value: filteredValue
                        }
                      });
                    }}
                  />
                </div>
              </Form.Group>
              <Form.Group className="mb-4 col-6" controlId="aadhar">
                <Form.Label>Aadhaar number</Form.Label>
                <div className="d-flex flex-row gap-5">
                  <Form.Control
                    type="text"
                    maxLength={12}
                    placeholder="6622XXXX9284"
                    name="aadhaar_no"
                    value={formData.aadhaar_no || ""}
                    // onChange={handleInputChange}
                    onChange={(e) => {
                      let value = e.target.value;
                      const filteredValue = value.replace(/[^a-zA-Z0-9 ]/g, "");
                      handleInputChange({
                        target: {
                          name: "aadhaar_no",
                          value: filteredValue
                        }
                      });
                    }}
                  />
                </div>
              </Form.Group>
              <Form.Group className="mb-4 col-6" controlId="date_of_birth">
                <Form.Label>Date Of Birth</Form.Label>
                <div className="d-flex flex-row gap-5 datebox">
                  <Form.Control
                    type="date"
                    name="date_of_birth"
                    value={formData.date_of_birth || ""}
                    onChange={handleInputChange}
                  />
                  <CiCalendar />
                </div>
              </Form.Group>

              <Form.Group className="mb-4 col-6" controlId="mobile_no">
                <Form.Label>Batch Id</Form.Label>
                <div className="d-flex flex-row gap-5">
                  <Form.Control
                    type="text"
                    maxLength={10}
                    placeholder="1xxxx"
                    name="batch_id"
                    value={formData.batch_id || ""}
                    // onChange={handleInputChange}
                    onChange={(e) => {
                      let value = e.target.value;
                      const filteredValue = value.replace(/[^a-zA-Z0-9 ]/g, "");
                      handleInputChange({
                        target: {
                          name: "batch_id",
                          value: filteredValue
                        }
                      });
                    }}
                  />
                </div>
              </Form.Group>

              <Form.Group className="mb-4 col-6" controlId="gender">
                <Form.Label>Gender</Form.Label>
                <div className="d-flex flex-row gap-5">
                  <Form.Check
                    type="radio"
                    label="Male"
                    name="gender"
                    id="formHorizontalRadios11"
                    value="Male"
                    checked={formData.gender === "Male"}
                    onChange={handleInputChange}
                  />
                  <Form.Check
                    type="radio"
                    label="Female"
                    name="gender"
                    id="formHorizontalRadios22"
                    value="Female"
                    checked={formData.gender === "Female"}
                    onChange={handleInputChange}
                  />
                </div>
              </Form.Group>

              <Form.Group className="mb-4 col-6" controlId="marital_status">
                <Form.Label>Marital Status</Form.Label>
                <div className="d-flex flex-row gap-5">
                  <Form.Check
                    type="radio"
                    label="Single"
                    name="marital_status"
                    id="formHorizontalRadios21"
                    value="Single"
                    checked={formData.marital_status === "Single"}
                    onChange={handleInputChange}
                  />
                  <Form.Check
                    type="radio"
                    label="Married"
                    name="marital_status"
                    id="formHorizontalRadios32"
                    value="Married"
                    checked={formData.marital_status === "Married"}
                    onChange={handleInputChange}
                  />
                </div>
              </Form.Group>
            </div>
          </Form>
        </div>
      </div>
    </>
  );
}
