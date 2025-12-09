import React, { useState } from "react";
import Table from "react-bootstrap/Table";
import { MdDelete } from "react-icons/md";
import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import { useDispatch } from "react-redux";
import {
  AddManagerList,
  GetEmployeeListDropDown,
  DeleteManagerList,
} from "../features/slices/EmployeeSlices/EmployeeSlice";
import AsyncSelect from "react-select/async";
import { toast } from "react-toastify";
import Spinner from 'react-bootstrap/Spinner';

const customStyles = {
  control: (provided, state) => ({
    ...provided,
    backgroundColor: "#fff",
    borderColor: state.isFocused
      ? "#D2C9FF"
      : state.isHovered
        ? "#80CBC4"
        : provided.borderColor,
    boxShadow: state.isFocused ? "0 0 0 1px #D2C9FF" : "none",
    "&:hover": {
      borderColor: "#D2C9FF",
    },
    height: "44px",
  }),
  menu: (provided) => ({
    ...provided,
    borderTop: "1px solid #D2C9FF",
    zIndex: 999999999999999,
  }),
  option: (provided, state) => ({
    ...provided,
    borderBottom: "1px solid #D2C9FF",
    color: state.isSelected ? "#fff" : "#000",
    backgroundColor: state.isSelected
      ? "#4CAF50"
      : state.isFocused
        ? "#80CBC4"
        : provided.backgroundColor,
    "&:hover": {
      backgroundColor: "#80CBC4",
      color: "#fff",
    },
  }),
};

export default function ReportingManager({ userData, getEmployeeListFun }) {
  const [option, setOption] = useState([]);
  const [selectedOption, setSelectedOption] = useState([]);
  const dispatch = useDispatch();
  const [reportingManager, setReportingManager] = useState("");
  const [loading, setLoading] = useState(false);

  const EmplooyListOpenMenu = async () => {
    let data = await dispatch(GetEmployeeListDropDown("")).unwrap();
    setOption(data);
  };
  const handleEmployeeChange = (option) => {
    setSelectedOption(option);
  };
  const EmployeeLoadOption = async (input) => {
    let data = await dispatch(GetEmployeeListDropDown(input)).unwrap();
    return data;
  };

  // handle Add manger
  const handleAddManager = async () => {
    if (!selectedOption || !selectedOption.value) {
      return toast.warn("Please Select the Manager");
    }
    if (!reportingManager) {
      return toast.warn("Please Choose the Reporting Type");
    }
    setLoading(true);
    let payloads = {
      _id: userData?._id,
      manager_id: selectedOption?.value,
      manager_name: selectedOption?.label,
      work_type: reportingManager,
    };

    try {
      let response = await dispatch(AddManagerList(payloads)).unwrap();
      if (response.status) {
        toast.success(response?.message);
        setLoading(false);
        getEmployeeListFun();
        return;
      } else {
        toast.error(response.message);
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
      toast.error(error?.message);
    }
  };

  const handleDeleteRepoertingManager = async (e, data) => {
    let payloads = {
      _id: userData?._id,
      manager_id: data?.manager_id,
    };

    try {
      let response = await dispatch(DeleteManagerList(payloads)).unwrap();
      if (response.status) {
        toast.success(response?.message);
        getEmployeeListFun();
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <>
      <div className="row my-3" data-aos="fade-in" data-aos-duration="3000">
        <div className="col-lg-12">
          <div className="sitecard pr-0">
            <div className="infobox">
              <h5> Add Reporting Manager</h5>
              <div className="add_managrrow">
                <div
                  className="formfield"
                  style={{ transform: "translateX(10px)" }}
                >
                  <label className="form-label">Enter Manager Name</label>
                  <Box sx={{ width: 350 }}>
                    <FormControl fullWidth>
                      <AsyncSelect
                        cacheOptions
                        defaultOptions
                        defaultValue={option}
                        loadOptions={EmployeeLoadOption}
                        value={selectedOption}
                        onMenuOpen={EmplooyListOpenMenu}
                        placeholder="Select Manager"
                        onChange={handleEmployeeChange}
                        classNamePrefix="react-select"
                        styles={customStyles}
                      />
                    </FormControl>
                  </Box>
                </div>
                <div className="formfield">
                  <label className="form-label">Select Type</label>
                  <select
                    className="form-control"
                    type="text"
                    onChange={(e) => setReportingManager(e.target.value)}
                  >
                    <option value="">Choose Reporting Type</option>
                    <option value="Reporting Manager">Reporting Manager</option>
                    <option value="Approval Manager">Approval Manager</option>
                  </select>
                </div>
                {
                  loading ?
                    <button
                      className="sitebtn addmang_btn"
                    >
                      <Spinner animation="border" variant="light" />
                    </button>
                    : <button
                      className="sitebtn addmang_btn"
                      onClick={handleAddManager}
                    >
                      Add
                    </button>
                }
              </div>
              <div className="managerlist mt-5 ">
                <h5>Manager List</h5>
                <div className="mt-1 smalldata widthManagement">
                  <Table hover className="candd_table">
                    <thead>
                      <tr>
                        <th>Sr No.</th>
                        <th>Manager Name</th>
                        <th>Type</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {userData?.reporting_manager &&
                        userData?.reporting_manager?.length > 0 ? (
                        userData?.reporting_manager?.map((data, index) => {
                          return (
                            <>
                              <tr>
                                <td>{index + 1}</td>
                                <td>{data?.manager_name}</td>
                                <td>{data?.work_type}</td>
                                <td>
                                  <button
                                    className="delbtn"
                                    onClick={(e) =>
                                      handleDeleteRepoertingManager(e, data)
                                    }
                                  >
                                    {" "}
                                    <MdDelete />
                                  </button>
                                </td>
                              </tr>
                            </>
                          );
                        })
                      ) : (
                        <tr>
                          <td colSpan="4" className="text-center">
                            No records found
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </Table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
