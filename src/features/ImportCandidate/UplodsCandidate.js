import React, { useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { Form } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import AsyncSelect from 'react-select/async';
import Select from 'react-select';
import { FetchClosedProjectListDropDown } from "../slices/ProjectListDropDown/ProjectListDropdownSlice";
import { toast } from "react-toastify";
import { GetDesignationWiseJobList } from "../slices/AtsSlices/getJobListSlice";
import { DataGrid } from "@mui/x-data-grid";
import { JsonDataParsed } from "../slices/ImportCandidateSlice/ImportCandidate";




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




const UploadsCandidate = ({
    project,
    setProject,
    option,
    setOptions,
    projectWiseJobList,
    setJobList,
    selectedOption,
    setSelectedOption,
    jobSelectedOption,
    setSelectedJobOption,
    defaultDesignation,
    setDefaultDesignation,
    designationSelectedValue,
    setSelectedDesignationValue,
}) => {

    // const [project, setProject] = useState(null);
    const dispatch = useDispatch();
    // const [option, setOptions] = useState(null)
    // const [projectWiseJobList, setJobList] = useState(null)
    // const [selectedOption, setSelectedOption] = useState(null);
    // const [jobSelectedOption, setSelectedJobOption] = useState(null);
    // const [defaultDesignation, setDefaultDesignation] = useState(null);
    // const [designationSelectedValue, setSelectedDesignationValue] = useState(null)
    const { extractedData } = useSelector((state) => state.import)



    const handleEditCellChange = (params) => {
        const updatedRows = extractedData.map((row) =>
            row.Sno === params.Sno ? { ...params } : row
        );
        dispatch(JsonDataParsed(updatedRows));
    };


    const rows = extractedData.map((row, index) => ({
        id: row.Sno || index,
        ...row,
    }));

    const columns = Object.keys(extractedData[0])
        .filter((key) => key !== 'id')
        .map((header) => ({
            field: header,
            headerName: header.replace(/_/g, " ").toUpperCase(),
            flex: 1,
            minWidth: 150,
            editable: header.toLowerCase() !== "sno",
            renderCell: (params) => (
                <div
                    style={{
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        width: "100%",
                    }}
                    title={params.value}
                >
                    {params.value}
                </div>
            ),
        }));

    const defaultOptionValue = [
        { value: 'Devnet', label: 'Devnet' },
        { value: 'Linkedin', label: 'Linkedin' },
        { value: 'Naukri', label: 'Naukri' },
        { value: 'Outgrow', label: 'Outgrow' }
    ];





    const projectLoadOption = async (input) => {
        const result = await dispatch(FetchClosedProjectListDropDown(input)).unwrap();
        return result;
    }
    const projectMenuOpen = async () => {
        const result = await dispatch(FetchClosedProjectListDropDown('')).unwrap();
        setOptions(result);
    }

    const handleProjectChanges = (option) => {
        setProject(option);
        setSelectedDesignationValue(null)
        setSelectedJobOption(null)
        setDefaultDesignation(option?.budget_estimate_list?.map((item) => {
            return {
                value: item?.designation_id,
                label: item?.designation
            }
        }))
    }

    const handleDesignationChanges = (option) => {
        setSelectedDesignationValue(option)
        setSelectedJobOption(null)
        let Payloads = {
            "keyword": "",
            "department": "",
            "job_title": "",
            "location": "",
            "designation": option?.label,
            "designation_id": option?.value,
            "job_type": "",
            "salary_range": "",
            "page_no": "1",
            "project_id": project?.value,
            "per_page_record": "100",
            "scope_fields": [
                "_id",
                "project_name",
                "department",
                "job_title",
                "job_type",
                "experience",
                "location",
                "salary_range",
                "status",
                "working",
                "deadline",
                "form_candidates",
                "total_vacancy",
                "available_vacancy",
                "add_date",
                "designation"
            ],
        }
        dispatch(GetDesignationWiseJobList(Payloads)).unwrap()
            .then((response) => {
                if (response && response?.length > 0) {
                    setJobList(response?.map((item) => {
                        return {
                            id: item._id,
                            label: item?.job_title,
                            value: item?._id,
                        }
                    }))
                }
            })
            .catch((err) => {
                console.log(err, 'this is Job List Error');
            })
    }

    const handleJobChange = (option) => {
        setSelectedJobOption(option)
    }

    const handleChange = (selectedOption) => {
        setSelectedOption(selectedOption);
    };
    


    return (
        <>
            <Container>
                <Row>
                    <Form>

                        <Row>
                            <Col sm={6}>

                                <Form.Group className="mb-3">
                                    <Form.Label>Project</Form.Label>
                                    <AsyncSelect
                                        cacheOptions
                                        defaultOptions
                                        defaultValue={option}
                                        loadOptions={projectLoadOption}
                                        value={project}
                                        onMenuOpen={projectMenuOpen}
                                        placeholder="Select Project"
                                        onChange={handleProjectChanges}
                                        classNamePrefix="react-select"
                                        isClearable
                                        styles={customStyles}
                                    />
                                </Form.Group>

                            </Col>

                            <Col sm={6}>

                                <Form.Group className="mb-3">
                                    <Form.Label>Designation</Form.Label>
                                    <Select
                                        value={designationSelectedValue}
                                        onChange={handleDesignationChanges}
                                        options={defaultDesignation || []}
                                        placeholder="Select a Designation"
                                        isSearchable={true}   // Enable search
                                        isClearable
                                        styles={customStyles}
                                        onMenuOpen={() => {
                                            if (!project) {
                                                return toast.warn("Please Select the Project");
                                            }
                                        }}
                                    />
                                </Form.Group>

                            </Col>

                            <Col sm={6}>

                                <Form.Group className="mb-3">
                                    <Form.Label>Posted Job</Form.Label>
                                    <Select
                                        value={jobSelectedOption}
                                        onChange={handleJobChange}
                                        options={projectWiseJobList || []}
                                        placeholder="Search the Posted Job"
                                        isSearchable={true}   // Enable search
                                        isClearable
                                        styles={customStyles}
                                        onMenuOpen={() => {
                                            if (!project) {
                                                return toast.warn('Please Select the Project')
                                            }
                                        }}
                                    />
                                </Form.Group>

                            </Col>

                            <Col sm={6}>

                                <Form.Group className="mb-3">
                                    <Form.Label>Applied From</Form.Label>
                                    <Select
                                        value={selectedOption}
                                        onChange={handleChange}
                                        options={defaultOptionValue}
                                        placeholder="Select a platform"
                                        isSearchable={true}   // Enable search
                                        styles={customStyles}
                                    />
                                </Form.Group>

                            </Col>

                        </Row>

                    </Form>

                    <Col sx={12} className="mt-3">
                        <span> Import Candidate List  </span>
                    </Col>

                    <Col sx={12} >
                        <DataGrid
                            rows={rows}
                            columns={columns}
                            pageSizeOptions={[5, 10, 20]}
                            disableSelectionOnClick
                            rowHeight={80}
                            processRowUpdate={(updatedRow) => {
                                handleEditCellChange(updatedRow);
                                return updatedRow;
                            }}
                        />
                    </Col>

                </Row>
            </Container>
        </>
    )

}

export default UploadsCandidate