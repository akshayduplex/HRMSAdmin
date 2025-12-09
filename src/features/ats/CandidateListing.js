import React, { useEffect, useState } from "react";
import GoBackButton from '../goBack/GoBackButton';
import { useSelector, useDispatch } from "react-redux";
import JobCardsCandidateTabs from "../job/JobCartsDetails/JobsCartsCandidateTabs";
import { setSelecteJobList, setReset, FetchAppliedCandidateDetailsCount } from '../slices/AppliedJobCandidates/JobAppliedCandidateSlice'
import { Col, Form, Row } from "react-bootstrap";
import AsyncSelect from 'react-select/async';
import { GetDesignationWiseJobList } from "../slices/AtsSlices/getJobListSlice";
import { useSearchParams } from "react-router-dom";
import { AsyncPaginate } from "react-select-async-paginate";


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



const CandidateListing = () => {
  const AppliedCandidateListCount = useSelector((state) => state.appliedJobList.AppliedCandidateListCount)
  const dispatch = useDispatch()
  const [option, setOptions] = useState(null);
  const [jobSearchValue, setJobSearchValue] = useState();
  const [QueryParams] = useSearchParams();
  const type = QueryParams.get('type');

  useEffect(() => {
    let jobFilter = localStorage.getItem('jobFilter')
    if (jobFilter) {
      let jobFilterData = JSON.parse(jobFilter)
      setJobSearchValue(jobFilterData)
      dispatch(setSelecteJobList(jobFilterData))
      dispatch(FetchAppliedCandidateDetailsCount({ id: jobFilterData?.value, type: type }));
    } else {
      setJobSearchValue(null)
      dispatch(setSelecteJobList(null))
      dispatch(FetchAppliedCandidateDetailsCount({ id: '', type: '' }));
    }
  }, [dispatch, type])


  const jobLoadOption = async (inputValue, loadedOptions, { page }) => {

    let payloads = {
      "keyword": inputValue,
      "page_no": page.toString(),
      "per_page_record": "10",
      // "status": "Published",
      "scope_fields": [
        "_id",
        "job_title",
        "project_id",
        "status",
        "project_name"
      ],
    }

    const result = await dispatch(GetDesignationWiseJobList(payloads)).unwrap();

    // Format all results to options
    const formattedOptions = result?.map((item) => ({
      id: item._id,
      label: `${item?.job_title} (${item?.project_name})`,
      value: item?._id,
      project_id: item?.project_id
    })) || [];

    return {
      options: page === 1
        ? [
          { label: 'All', value: null, id: 'all', project_id: null },
          ...formattedOptions
        ]
        : formattedOptions,
      hasMore: result?.length >= 10,
      additional: { page: page + 1 }
    };
  };

  const JobInputChanges = async (input) => {
    let Payloads = {
      "keyword": input,
      "department": "",
      "job_title": "",
      "location": "",
      "page_no": "1",
      "per_page_record": "100",
      "status": "Published",
      "scope_fields": [
        "_id",
        "job_title",
        "project_id",
        "project_name"
      ],
    }

    const result = await dispatch(GetDesignationWiseJobList(Payloads)).unwrap();
    if (result?.length > 0) {
      return [
        { id: 'all', label: 'All', value: null, project_id: null },
        ...result.map((item) => ({
          id: item._id,
          label: `${item?.job_title} (${item?.project_name})`,
          value: item?._id,
          project_id: item?.project_id
        }))
      ]
    }

    return []
  }
  // Handle Filter By Job Selected ->
  const FilterByJobSelected = async (option) => {
    // create a local storage for store the filters job list
    localStorage.setItem('jobFilter', JSON.stringify(option))
    setJobSearchValue(option)
    if (option?.value) {
      dispatch(setSelecteJobList(option))
    } else {
      dispatch(setSelecteJobList(null));
    }
    // dispatch(FetchAppliedCandidateDetails(option?.value));
    dispatch(FetchAppliedCandidateDetailsCount({ id: option?.value, type: type }));
    dispatch(setReset(false))
  }

  return (
    <>
      {/* <AllHeaders/> */}
      <div className="maincontent">
        <div className="container" data-aos="fade-in" data-aos-duration="3000">
          <GoBackButton />
          <div class="d-flex justify-content-between align-items-center my-3">
            <div className="hrhdng">
              <h2 class="mb-0">Total Candidates ({AppliedCandidateListCount.status === 'success' && AppliedCandidateListCount.data?.all})</h2>
              <p class="mb-0 text-start">
                Potential Candidate tracking and management
              </p>
            </div>
            <Row className="w-50">
              <Col sm={12}>
                <Form.Group className="mb-3">
                  {/* <Form.Label>Job List</Form.Label> */}
                  {/* <AsyncSelect
                    cacheOptions
                    defaultOptions
                    defaultValue={option}
                    loadOptions={JobInputChanges}
                    value={jobSearchValue}
                    onMenuOpen={jobLoadOption}
                    // menuIsOpen={menuOpen}
                    placeholder="Filter By Job"
                    onChange={FilterByJobSelected}
                    classNamePrefix="react-select"
                    isClearable={true}
                    styles={customStyles}
                  /> */}

                  <AsyncPaginate
                    // cacheOptions
                    // defaultOptions
                    // defaultValue={option}
                    placeholder="Filter By Job"
                    value={jobSearchValue}
                    loadOptions={jobLoadOption}
                    onChange={FilterByJobSelected}
                    debounceTimeout={300}
                    isClearable
                    styles={customStyles}
                    additional={{
                      page: 1
                    }}
                    classNamePrefix="react-select"
                  />
                </Form.Group>
              </Col>
            </Row>
          </div>

          <JobCardsCandidateTabs />

        </div>
      </div>
    </>
  );
}

export default CandidateListing;