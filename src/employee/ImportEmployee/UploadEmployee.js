import React, { useCallback, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { Form } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import AsyncSelect from 'react-select/async';
import Select from 'react-select';
import { FetchClosedProjectListDropDown } from "../../features/slices/ProjectListDropDown/ProjectListDropdownSlice";
import { toast } from "react-toastify";
import { FetchDepartmentListDropDown } from "../../features/slices/departmentSlice";
import { FetchProjectLocationDropDown, FetchProjectDivisionDropDown, FetchProjectRegionDropDown, FetchGradeListDropdown } from "../../features/slices/ProjectListDropDown/ProjectListDropdownSlice";
import { GetDesignationList } from "../../features/slices/DesignationDropDown/designationDropDown";
import { DataGrid } from "@mui/x-data-grid";
import { JsonDataParsed } from "../../features/slices/ImportCandidateSlice/ImportCandidate";
import { useLocation } from "react-router-dom";
import Cursor from "quill/blots/cursor";
import { Padding } from "@mui/icons-material";



const customStyles = {
    control: (provided, state) => ({
        ...provided,
        backgroundColor: '#fff',
        borderColor: state.isFocused ? '#D2C9FF' : state.isHovered ? '#80CBC4' : provided.borderColor,
        boxShadow: state.isFocused ? '0 0 0 1px #D2C9FF' : 'none',
        '&:hover': {
            borderColor: '#D2C9FF',
        },
        height: '90%',
    }),
    menu: (provided) => ({
        ...provided,
        position: 'absolute !important',
        zIndex: 99999999999999999999999999,
        backgroundColor: 'white',
        border: '1px solid #D2C9FF',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        width: '200px',
    }),
    menuList: (provided) => ({
        ...provided,
        maxHeight: '150px', // Reduced from 200px
        overflowY: 'auto',
        fontSize: '11px', // Reduced from 12px
        padding: '2px', // Reduced from 4px
        '&::-webkit-scrollbar': {
            width: '4px', // Reduced from 6px
        },
        '&::-webkit-scrollbar-thumb': {
            backgroundColor: '#D2C9FF',
            borderRadius: '3px',
        },
    }),
    menuPortal: (base) => ({
        ...base,
        zIndex: 99999999999999999999999999,
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
        fontSize: '11px', // Reduced from 12px
        padding: '4px 8px', // Reduced padding
        minHeight: '24px', // Add minimum height
        display: 'flex',
        alignItems: 'center',
        cursor: 'pointer'
    }),
};
const defaultOptionValue = [
    { value: 'onRole', label: 'On Role' },
    { value: 'onContract', label: 'On Consultant' },
    { value: 'emPanelled', label: 'Empanelled' },
];

const Gender = [
    { value: 'male', label: 'male' },
    { value: 'female', label: 'female' },
    { value: 'other', label: 'other' },
];




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
    const { extractedData } = useSelector((state) => state.import)
    const location = useLocation();
    const [columnVisibilityModel, setColumnVisibilityModel] = useState({
        project_id: false,
        designation_id: false,
        designation_drop_down: false
    });


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

    const filteredColumns = Object.keys(extractedData[0])
        .filter((key) => key !== 'id')
        .map((header) => ({
            field: header,
            headerName: header.replace(/_/g, " ").toUpperCase(),
            flex: 1,
            minWidth: ['sno', 'gender', 'joining_date', 'employee_id'].includes(header.toLowerCase()) ? 100 : 200,
            editable: header.toLowerCase() !== "sno",

            // Render cell to avoid overflow
            renderCell: (params) => (
                <div
                    style={{
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        // width: "100%",
                        // height:'100%',
                        // textAlign:'center'
                    }}
                    title={params.value}
                >
                    {params.value}
                </div>
            ),

            ...(header.toLowerCase() === 'sno' && {
                pinned: 'left',  // Makes the column sticky on the left
                width: 80,  // Fixed width for better appearance
                minWidth: 80,
                flex: 0, // Prevent column from flexing
                resizable: false,
            }),
            ...(header.toLowerCase() === 'employee_id' && {
                pinned: 'left',  // Makes the column sticky on the left
                width: 120,  // Fixed width for better appearance
                minWidth: 120,
                flex: 0, // Prevent column from flexing
                resizable: false,
            }),

            // Date handling
            ...(header.toLowerCase().includes("date") && {
                renderEditCell: (params) => (
                    <Form.Control
                        type="date"
                        style={{ width: "100%", height: "100%", position: 'relative' }}
                        value={params.value || ''}
                        onChange={(e) => {
                            params.api.setEditCellValue({
                                id: params.id,
                                field: params.field,
                                value: e.target.value,
                            });
                        }}
                    />
                ),
            }),

            // Employee Type as single select
            ...(header === 'employee_type' && {
                type: 'singleSelect',
                valueOptions: defaultOptionValue,
            }),
            // gender - 

            ...(header === 'gender' && {
                type: 'singleSelect',
                valueOptions: Gender,
            }),

            // Project Name with AsyncSelect and hidden project_id field
            ...(header === 'project_name' && {
                renderEditCell: (params) => (
                    <Form.Group className="mb-3" style={{
                        width: '100%',
                        height: '80%',
                        position: 'relative !important', // Add this
                        zIndex: 1, // Add this
                    }}>
                        <AsyncSelect
                            cacheOptions
                            defaultOptions
                            loadOptions={projectLoadOption}
                            value={params.row.project_id
                                ? { value: params.row.project_id, label: params.row.project_name }
                                : null
                            }
                            placeholder="Select Project"
                            onChange={(selectedOption) => {

                                params.api.setEditCellValue({
                                    id: params.id,
                                    field: 'project_id',
                                    value: selectedOption?.value || ''
                                }, true); // true to skip focus
            
                                // Update project_name
                                params.api.setEditCellValue({
                                    id: params.id,
                                    field: 'project_name',
                                    value: selectedOption?.label || ''
                                }, true);
            
                                // Trigger row update
                                const updatedRow = {
                                    ...params.row,
                                    project_id: selectedOption?.value || '',
                                    project_name: selectedOption?.label || '',
                                };
                                params.api.updateRows([{ id: params.id, ...updatedRow }]);
                            }}
                            // onMenuOpen={() => {
                            //     // Ensure proper z-index when menu opens
                            //     const gridCells = document.querySelectorAll('.MuiDataGrid-cell');
                            //     gridCells.forEach(cell => {
                            //         cell.style.overflow = 'visible';
                            //     });
                            // }}
                            // menuPortalTarget={document.body}
                            styles={customStyles}
                            classNamePrefix="react-select"
                            menuPosition="absolute"
                            menuPlacement="bottom"
                        />
                    </Form.Group>
                ),
            }),
            

            ...(header === 'designation' && {
                renderEditCell: (params) => {

                    return (
                        <Form.Group controlId="designation" style={{
                            height: '80%',
                            width: '100%',
                        }}>

                            <AsyncSelect
                                cacheOptions
                                defaultOptions
                                loadOptions={GetDesignationListDropwon}
                                value={{
                                    value: params.row.designation_id,
                                    label: params.row.designation,
                                }}
                                placeholder="Select Designation"
                                onChange={(selectedOption) => {
                                    // First update Designation_id
                                    params.api.setEditCellValue({
                                        id: params.id,
                                        field: 'designation_id',
                                        value: selectedOption?.id || ''
                                    }, true); // true to skip focus

                                    // Then update designation name
                                    params.api.setEditCellValue({
                                        id: params.id,
                                        field: 'designation',
                                        value: selectedOption?.label || ''
                                    }, true);
                                    // Trigger row update
                                    const updatedRow = {
                                        ...params.row,
                                        designation_id: selectedOption?.id || '',
                                        designation: selectedOption?.label || '',
                                    };
                                    params.api.updateRows([{ id: params.id, ...updatedRow }]);
                                }}
                                classNamePrefix="react-select"
                                styles={customStyles}
                            />
                        </Form.Group>
                    )
                }
            }),

            ...(header === 'department_name') && {

                renderEditCell: (params) => (
                    <Form.Group className="mb-3" style={{
                        width: '100%',
                        height: '80%',
                    }}>
                        <AsyncSelect
                            cacheOptions
                            defaultOptions
                            loadOptions={departmentList}
                            value={params.row.department_name
                                ? { value: params.row.department_name, label: params.value }
                                : null
                            }
                            placeholder="Select Department"
                            onChange={(selectedOption) => {

                                // Then update Department_name
                                params.api.setEditCellValue({
                                    id: params.id,
                                    field: 'department_name',
                                    value: selectedOption?.label || ''
                                }, true);
                                // Trigger row update
                                const updatedRow = {
                                    ...params.row,
                                    department_name: selectedOption?.label || '',
                                };
                                params.api.updateRows([{ id: params.id, ...updatedRow }]);
                            }}
                            classNamePrefix="react-select"
                            styles={customStyles}
                        />
                    </Form.Group>
                ),
            },
            ...(header === 'location') && {

                renderEditCell: (params) => (
                    <Form.Group className="mb-3" style={{
                        width: '100%',
                        height: '80%',
                    }}>
                        <AsyncSelect
                            cacheOptions
                            defaultOptions
                            loadOptions={locationList}
                            value={params.row.location
                                ? { value: params.row.location, label: params.value }
                                : null
                            }
                            placeholder="Select Location"
                            onChange={(selectedOption) => {

                                // Then update project_name
                                params.api.setEditCellValue({
                                    id: params.id,
                                    field: 'location',
                                    value: selectedOption?.label || ''
                                }, true);
                                // Trigger row update
                                const updatedRow = {
                                    ...params.row,
                                    location: selectedOption?.label || '',
                                };
                                params.api.updateRows([{ id: params.id, ...updatedRow }]);
                            }}
                            classNamePrefix="react-select"
                            styles={customStyles}
                        />
                    </Form.Group>
                ),
            },
            ...(header === 'division') && {

                renderEditCell: (params) => (
                    <Form.Group className="mb-3" style={{
                        width: '100%',
                        height: '80%',

                    }}>
                        <AsyncSelect
                            cacheOptions
                            defaultOptions
                            loadOptions={DivisionLoadOption}
                            value={params.row.division
                                ? { value: params.row.division, label: params.value }
                                : null
                            }
                            placeholder="Select Division"
                            onChange={(selectedOption) => {
                                // Then update project_name
                                params.api.setEditCellValue({
                                    id: params.id,
                                    field: 'division',
                                    value: selectedOption?.label || ''
                                }, true);
                                // Trigger row update
                                const updatedRow = {
                                    ...params.row,
                                    division: selectedOption?.label || '',
                                };
                                params.api.updateRows([{ id: params.id, ...updatedRow }]);
                            }}
                            classNamePrefix="react-select"
                            styles={customStyles}
                        />
                    </Form.Group>
                ),
            },
            ...(header === 'region') && {

                renderEditCell: (params) => (
                    <Form.Group className="mb-3" style={{
                        width: '100%',
                        height: '80%',
                    }}>
                        <AsyncSelect
                            cacheOptions
                            defaultOptions
                            loadOptions={ResionList}
                            value={params.row.region
                                ? { value: params.row.region, label: params.value }
                                : null
                            }
                            placeholder="Select region"
                            onChange={(selectedOption) => {
                                // Then update project_name
                                params.api.setEditCellValue({
                                    id: params.id,
                                    field: 'region',
                                    value: selectedOption?.label || ''
                                }, true);
                                // Trigger row update
                                const updatedRow = {
                                    ...params.row,
                                    region: selectedOption?.label || '',
                                };
                                params.api.updateRows([{ id: params.id, ...updatedRow }]);
                            }}
                            classNamePrefix="react-select"
                            styles={customStyles}
                        />
                    </Form.Group>
                ),
            },
            ...(header === 'grade') && {

                renderEditCell: (params) => (
                    <Form.Group className="mb-3" style={{
                        width: '100%',
                        height: '80%',
                    }}>
                        <AsyncSelect
                            cacheOptions
                            defaultOptions
                            loadOptions={gradeListDropDown}
                            value={params.row.grade
                                ? { value: params.row.grade, label: params.value }
                                : null
                            }
                            placeholder="Select grade"
                            onChange={(selectedOption) => {
                                // Then update project_name
                                params.api.setEditCellValue({
                                    id: params.id,
                                    field: 'grade',
                                    value: selectedOption?.label || ''
                                }, true);
                                // Trigger row update
                                const updatedRow = {
                                    ...params.row,
                                    grade: selectedOption?.label || '',
                                };
                                params.api.updateRows([{ id: params.id, ...updatedRow }]);
                            }}
                            classNamePrefix="react-select"
                            styles={customStyles}
                        />
                    </Form.Group>
                ),
            },
        }));

    const hiddenColumns = [
        {
            field: 'project_id',
            hide: true,
            editable: false
        },
        {
            field: 'designation_id',
            hide: true,
            editable: false
        },
        {
            field: 'designation_drop_down',
            hide: true,
            editable: false,
            valueFormatter: (params) => {
                if (!params.value) return '';
                return Array.isArray(params.value)
                    ? params.value.map(item => item.designation).join(', ')
                    : '';
            },
            valueGetter: (params) => params?.row?.designation_drop_down || []
        }
    ];


    const columns = [...filteredColumns, ...hiddenColumns];





    const projectLoadOption = async (input) => {
        const result = await dispatch(FetchClosedProjectListDropDown(input)).unwrap();
        return result;
    }

    const departmentList = async (input) => {
        const result = await dispatch(FetchDepartmentListDropDown(input)).unwrap();
        return result;
    }

    const locationList = async (input) => {
        const result = await dispatch(FetchProjectLocationDropDown(input)).unwrap();
        return result;
    }

    const DivisionLoadOption = async (input) => {
        const result = await dispatch(FetchProjectDivisionDropDown(input)).unwrap();
        return result;
    }

    const ResionList = async (input) => {
        const result = await dispatch(FetchProjectRegionDropDown(input)).unwrap();
        return result;
    }

    const gradeListDropDown = async (input) => {
        const result = await dispatch(FetchGradeListDropdown(input)).unwrap();
        return result;
    }

    const GetDesignationListDropwon = async (input) => {
        const result = await dispatch(GetDesignationList(input)).unwrap();
        return result;
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

                            {/* {
                                location.pathname === '/import-employee' && (

                                    <>

                                        <Col sm={4}>

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
                                                // styles={customStyles}
                                                />
                                            </Form.Group>

                                        </Col>

                                        <Col sm={4}>

                                            <Form.Group className="mb-3">
                                                <Form.Label>Designation</Form.Label>
                                                <Select
                                                    value={designationSelectedValue}
                                                    onChange={handleDesignationChanges}
                                                    options={defaultDesignation || []}
                                                    placeholder="Select a Designation"
                                                    isSearchable={true}   // Enable search
                                                    // styles={customStyles}
                                                    onMenuOpen={() => {
                                                        if (!project) {
                                                            return toast.warn("Please Select the Project");
                                                        }
                                                    }}
                                                />
                                            </Form.Group>

                                        </Col>
                                    </>
                                )
                            } */}

                            {
                                location.pathname === '/import-salary' &&
                                <Col sm={location.pathname === '/import-salary' ? 6 : 4}>

                                    <Form.Group className="mb-3">
                                        <Form.Label>Job Type</Form.Label>
                                        <Select
                                            value={selectedOption}
                                            onChange={handleChange}
                                            options={defaultOptionValue}
                                            placeholder="Select Job Type"
                                            isSearchable={true}   // Enable search
                                        // styles={customStyles}
                                        />
                                    </Form.Group>
                                </Col>
                            }

                        </Row>

                    </Form>

                    <Col sx={12} className="mt-3 mb-2">
                        <span> {location.pathname === '/import-salary' ? "Import Employee Salary List" : "Import Employee List"}   </span>
                    </Col>

                    <Col sx={12} >
                        <DataGrid className="tblimportemp"
                            rows={rows}
                            columns={columns}
                            initialState={{
                                columns: {
                                    columnVisibilityModel: columnVisibilityModel,
                                    pinnedColumns: {
                                        left: ['sno', 'employee_id'],
                                        right: []
                                    }
                                },
                                // pagination: {
                                //     paginationModel: { pageSize: 10 }
                                // }
                            }}
                            pageSizeOptions={[10, 20 , 50 , 99]}
                            disableSelectionOnClick
                            rowHeight={30}
                            processRowUpdate={(updatedRow) => {
                                handleEditCellChange(updatedRow);
                                return updatedRow;
                            }}
                            sx={{
                                height:'800px',
                                maxHeight:'800px',
                                '& .MuiDataGrid-cell': {
                                  overflow: 'visible !important',
                                },
                                '& .MuiDataGrid-cell:focus-within': {
                                  zIndex: 9999, // Higher than dropdown z-index
                                },
                                '& .MuiDataGrid-row:hover': {
                                  zIndex: 'unset !important', // Prevent row hover from covering dropdown
                                },
                                '& .MuiDataGrid-columnHeader--pinned': {
                                    bgcolor: 'background.paper',
                                    // Add shadow to distinguish sticky columns
                                    boxShadow: '2px 0 4px rgba(0,0,0,0.1)',
                                },
                                '& .MuiDataGrid-cell--pinned': {
                                    bgcolor: 'background.paper',
                                    // Add shadow to distinguish sticky columns
                                    boxShadow: '2px 0 4px rgba(0,0,0,0.1)',
                                }
                            }}
                        />
                    </Col>

                </Row>
            </Container>
        </>
    )

}

export default UploadsCandidate