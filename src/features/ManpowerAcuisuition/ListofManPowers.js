import React, { useState } from 'react';
import GoBackButton from '../goBack/GoBackButton';
import { Link } from 'react-router-dom';
import RequisitionTable from './RequisitionTable';
import { FetchProjectListDropDownOnScroll } from '../slices/ProjectListDropDown/ProjectListDropdownSlice';
import { useDispatch } from 'react-redux';
import { AsyncPaginate } from 'react-select-async-paginate';
import { toast } from 'react-toastify';
import Select from 'react-select';

const customStyles = {
    control: (provided, state) => ({
        ...provided,
        backgroundColor: '#fff',
        borderColor: state.isFocused ? '#D2C9FF' : state.isHovered ? '#8b7dceff' : provided.borderColor,
        boxShadow: state.isFocused ? '0 0 0 1px #D2C9FF' : 'none',
        '&:hover': {
            borderColor: '#8b7dceff',
        },
        width: '250px',
        minWidth: '250px',
        maxWidth: '250px', // limit width to prevent overflow
    }),
    menu: (provided) => ({
        ...provided,
        borderTop: '1px solid #D2C9FF',
        zIndex: 1300, // ensure menu overlays table and other content
        // position: 'relative',
    }),
    option: (provided, state) => ({
        ...provided,
        borderBottom: '1px solid #D2C9FF',
        color: state.isSelected ? '#fff' : '#000',
        backgroundColor: state.isSelected ? '#34209b' : state.isFocused ? '#8b7dceff' : provided.backgroundColor,
        fontSize: '0.95rem', // match Select font size
        minHeight: '36px', // match Select option height
        '&:hover': {
            backgroundColor: '#8b7dceff',
            color: '#fff',
        },
    }),
};

const ListManpowerRequisition = () => {
    const [vacancyProject, setVacancyProject] = useState(null);
    const [designation, setDesignation] = useState(null);
    const [projectEstimatedList, setProjectEstimated] = useState([]);
    const dispatch = useDispatch();
    const [filterRecords, setFilterRecords] = useState({ projectName: null, projectId: null, designation: null, designationId: null });

    const projectLoadOptionPageNations = async (inputValue, loadedOptions, { page }) => {
        
        const payload = {
            keyword: inputValue,
            page_no: page.toString(),
            per_page_record: "10",
            scope_fields: ["_id", "title", "budget_estimate_list", "location"],
            status: "Active"
        };

        const result = await dispatch(FetchProjectListDropDownOnScroll(payload)).unwrap();

        return {
            options: result, // must be array of { label, value } objects
            hasMore: result.length >= 10, // if true, next page will load
            additional: {
                page: page + 1
            }
        };
    };

    const handleProjectChanges = (option) => {
        setDesignation(null)
        setVacancyProject(option);
        setProjectEstimated(option?.budget_estimate_list?.map((item, index) => {
            return {
                label: item.designation,
                value: item.designation,
                id: item.designation_id ? item.designation_id : null,
                no_of_vacancy: item?.no_of_positions ?? 0,
                ctc: item?.ctc
            }
        }))
    };

    const handleSearch = () => {
        setFilterRecords({
            projectName: vacancyProject?.label,
            projectId: vacancyProject?.value,
            designation: designation?.label,
            designationId: designation?.id
        })
    }

    return (
        <>
            {/* <AllHeaders /> */}
            <div className="maincontent">
                <div className="container hrdashboard" data-aos="fade-in" data-aos-duration="3000">
                    <GoBackButton />
                    <div className='dflexbtwn'>
                        <div className='pagename'>
                            <h3>List of Requisition Form</h3>
                            <p>Requisition raise request Lisitng  </p>
                        </div>
                        <div className='linkbtn' style={{ maxWidth: "70%" , textAlign: "end" }}>
                            <Link to='/manpower-acquisition'><button className='purplbtn' style={{ minWidth: 90 , marginBottom: 8 }}>+ Add</button></Link>
                            <div className="row g-2 align-items-center"   style={{marginBottom: 8 , textAlign: "start" }}>
                                <div className="col-12 d-flex flex-wrap justify-content-end gap-2">
                                    <AsyncPaginate
                                        placeholder="Select Project"
                                        value={vacancyProject}
                                        loadOptions={projectLoadOptionPageNations}
                                        onChange={(option) => handleProjectChanges(option)}
                                        debounceTimeout={300}
                                        isClearable
                                        styles={customStyles}
                                        additional={{
                                            page: 1
                                        }}
                                        classNamePrefix="react-select"
                                    />

                                    <Select
                                        placeholder="Designation"
                                        value={designation}
                                        options={projectEstimatedList}
                                        onChange={(option) => setDesignation(option)}
                                        classNamePrefix="react-select"
                                        isClearable
                                        isDisabled={!vacancyProject}
                                        onMenuOpen={() => {
                                            if (!vacancyProject) {
                                                toast.error('Please choose the project first');
                                                return false;  // Prevent the menu from opening
                                            }
                                        }}
                                        isSearchable
                                        styles={customStyles}
                                    />

                                    <button className='btn btn-primary' disabled={vacancyProject === null && designation === null}
                                        onClick={handleSearch} style={{ minWidth: 90 }}>Search</button>
                                    <button className='btn btn-primary' onClick={(e) => {
                                        e.preventDefault();
                                        setDesignation(null);
                                        setVacancyProject(null);
                                        setProjectEstimated([]);
                                        setFilterRecords({ projectName: null, projectId: null, designation: null, designationId: null });
                                        document.querySelector('.react-select__input').value = ''; // Clear the input field
                                    }} style={{ minWidth: 90 }}
                                        disabled={filterRecords.projectName === null && filterRecords.projectId === null}
                                    >Reset</button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='row'>
                        <RequisitionTable filterRecords={filterRecords} />
                    </div>
                </div>
            </div>
        </>
    )
}


export default ListManpowerRequisition;
