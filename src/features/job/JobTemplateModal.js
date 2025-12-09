import React, { useEffect, useMemo, useState } from "react";
import { IoMdSearch } from "react-icons/io";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import Modal from "react-bootstrap/Modal";
import { useSelector, useDispatch } from "react-redux";
import { JobTemplateList } from "../slices/TemplateSlice/Template";
import { FetchDepartmentListDropDown } from "../slices/departmentSlice";
import AsyncSelect from 'react-select/async';
import { InfinitySpin } from "react-loader-spinner";




const customStyles = {
  control: (provided, state) => ({
    ...provided,
    backgroundColor: '#fff',
    borderColor: state.isFocused ? '#D2C9FF' : state.isHovered ? '#80CBC4' : provided.borderColor,
    boxShadow: state.isFocused ? '0 0 0 1px #D2C9FF' : 'none',
    '&:hover': {
      borderColor: '#D2C9FF',
    },
    minHeight: '44px',
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

const JobTemplateModal = (props) => {

  const { handleAllInputChange, onHide } = props;

  const { TemplateList } = useSelector((state) => state.template)
  const [option, setOptions] = useState(null);
  const [departMentSelected, selectDepartment] = useState(null);
  const [text, setText] = useState("");
  const [debouncedText, setDebouncedText] = useState(text);

  const debounce = (func, delay) => {
    let timeoutId;
    return (...args) => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      timeoutId = setTimeout(() => {
        func.apply(null, args);
      }, delay);
    };
  };

  // Update debounced text when the text changes
  const updateDebouncedText = debounce((newText) => {
    setDebouncedText(newText);
  }, 300)

  const dispatch = useDispatch()

  useEffect(() => {
    updateDebouncedText(text);
  }, [text, updateDebouncedText]);




  const ListOfTemplate = useMemo(() => {
    if (departMentSelected || debouncedText) {
      return {
        "page_no": "1",
        "keyword": debouncedText,
        "per_page_record": "10",
        "department_id": departMentSelected?.value,
        "department_name": departMentSelected?.label,
        "scope_fields": []
      }
    } else {
      return {
        "page_no": "1",
        "per_page_record": "10",
        "scope_fields": []
      }
    }
  }, [departMentSelected, debouncedText])

  useEffect(() => {
    dispatch(JobTemplateList(ListOfTemplate))
  }, [ListOfTemplate, dispatch])

  /********************** Get Department Dropdown ***********/
  const departmentLoadOption = async (input) => {
    const result = await dispatch(FetchDepartmentListDropDown(input)).unwrap();
    return result;
  }
  const departmentMenuOpen = async () => {
    const result = await dispatch(FetchDepartmentListDropDown('')).unwrap();
    setOptions(result);
  }
  const handleDepartmentChanges = (option) => {
    // handleFilterState({ department_id: option.value, department_name: option.label })
    selectDepartment(option);
  }

  // Add the Description Data form Now 
  const AddTemplateDescription = (e, data) => {
    e.preventDefault();
    handleAllInputChange({ description: data?.description })
    onHide();
  }


  return (
    <Modal {...props} size="lg" className="jobtemp_modal">
      <Modal.Header className="border-0" closeButton>
        <Modal.Title>
          <h4>Select from job templates</h4>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="d-flex flex-column gap-3">
          <h5 className="mb-0">Choose template</h5>
          <div className="row">
            <Form.Group
              className="col-lg-6"
              controlId="exampleForm.ControlInput1"
            >
              <AsyncSelect
                placeholder="Department"
                defaultOptions
                defaultValue={option}
                value={departMentSelected}
                loadOptions={departmentLoadOption}
                onMenuOpen={departmentMenuOpen}
                onChange={(option) => handleDepartmentChanges(option)}
                classNamePrefix="react-select"
                styles={customStyles}
              />
            </Form.Group>
            <Form.Group
              className="col-lg-6 "
              controlId="exampleForm.ControlInput1"
            >
              <InputGroup className="h-100">
                <InputGroup.Text id="basic-addon1" className="white-bg">
                  <IoMdSearch />
                </InputGroup.Text>
                <Form.Control
                  placeholder="Search by job title"
                  aria-label="Username"
                  aria-describedby="basic-addon1"
                  className="bor-left"
                  onChange={(e) => {
                    setText(e.target.value)
                  }}
                />
              </InputGroup>
            </Form.Group>
          </div>
          <div className="mx-fuller d-flex flex-column gap-3 infobox pe-3">
            {/* <div className="card w-100 ">
              <div className="card-body">
                <div className="d-flex justify-content-between">
                  <div className="d-flex flex-column gap-1">
                    <h5>QA Engineer (Manual + Automation)</h5>
                    <p className="color-light">
                      We have urgent requirement for QA Engineer For Noida
                      location
                    </p>
                    <p className="color-light">
                      Created on 12/01/2024
                    </p>
                  </div>
                  <div className="chooose_temp">
                    <button className="sitebtn btnblue fullbtn btn-defaulter">
                      Select
                    </button>
                  </div>
                </div>
              </div>
            </div> */}

            {
              TemplateList?.status === 'loading'
                ?
                <div className="d-flex align-content-center justify-content-center w-100">
                  <InfinitySpin
                    visible={true}
                    width="200"
                    color="#4fa94d"
                    ariaLabel="infinity-spin-loading"
                  />
                </div>
                : TemplateList?.status === 'success' && TemplateList.data?.data?.length > 0
                  ? TemplateList.data?.data.map((item, index) => {
                    return (
                      <>
                        <div className="card w-100 " key={index}>
                          <div className="card-body">
                            <div className="d-flex justify-content-between">
                              <div className="d-flex flex-column gap-1">
                                <h5>{item?.title}</h5>
                                {/* <p className="color-light">
                                  {item?.description}
                                </p> */}
                                <p
                                  className="color-light"
                                  dangerouslySetInnerHTML={{
                                    __html: item?.description.slice(0, 200) + (item?.description.length > 200 ? '...' : ''),
                                  }}
                                />
                                <p className="color-light">
                                  Created on {item?.add_date}
                                </p>
                              </div>
                              <div className="chooose_temp">
                                <button className="sitebtn btnblue fullbtn btn-defaulter" onClick={(e) => AddTemplateDescription(e, item)}>
                                  Select
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </>
                    )
                  })
                  : TemplateList?.status === 'success' && TemplateList?.data?.length === 0 &&
                  <div className="card w-100 ">
                    <div className="card-body">
                      <div className="d-flex justify-content-between align-items-center">
                        <span> Template Not Available </span>
                      </div>
                    </div>
                  </div>
            }
            {/* <div className="card w-100 ">
              <div className="card-body">
                <div className="d-flex justify-content-between">
                  <div className="d-flex flex-column gap-1">
                    <h5>QA Engineer (Manual + Automation)</h5>
                    <p className="color-light">
                      We have urgent requirement for QA Engineer For Noida
                      location
                    </p>
                    <p className="color-light">
                      Created on 12/01/2024
                    </p>
                  </div>
                  <div className="chooose_temp">
                    <button className="sitebtn btnblue fullbtn btn-defaulter">
                      Select
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="card w-100 ">
              <div className="card-body">
                <div className="d-flex justify-content-between">
                  <div className="d-flex flex-column gap-1">
                    <h5>QA Engineer (Manual + Automation)</h5>
                    <p className="color-light">
                      We have urgent requirement for QA Engineer For Noida
                      location
                    </p>
                    <p className="color-light">
                      Created on 12/01/2024
                    </p>
                  </div>
                  <div className="chooose_temp">
                    <button className="sitebtn btnblue fullbtn btn-defaulter">
                      Select
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="card w-100 ">
              <div className="card-body">
                <div className="d-flex justify-content-between">
                  <div className="d-flex flex-column gap-1">
                    <h5>QA Engineer (Manual + Automation)</h5>
                    <p className="color-light">
                      We have urgent requirement for QA Engineer For Noida
                      location
                    </p>
                    <p className="color-light">
                      Created on 12/01/2024
                    </p>
                  </div>
                  <div className="chooose_temp">
                    <button className="sitebtn btnblue fullbtn btn-defaulter">
                      Select
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="card w-100  ">
              <div className="card-body">
                <div className="d-flex justify-content-between">
                  <div className="d-flex flex-column gap-1">
                    <h5>QA Engineer (Manual + Automation)</h5>
                    <p className="color-light">
                      We have urgent requirement for QA Engineer For Noida
                      location
                    </p>
                    <p className="color-light">
                      Created on 12/01/2024
                    </p>
                  </div>
                  <div className="chooose_temp">
                    <button className="sitebtn btnblue fullbtn btn-defaulter">
                      Select
                    </button>
                  </div>
                </div>
              </div>
            </div> */}
          </div>
        </div>
      </Modal.Body>
    </Modal>
  )
}
export default JobTemplateModal;
