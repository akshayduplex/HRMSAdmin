import React, { useEffect, useState } from "react";
import { BsBriefcase, BsBuildings } from "react-icons/bs";
import { FaCheckCircle } from "react-icons/fa";
import { LiaRupeeSignSolid } from "react-icons/lia";
import { GiSandsOfTime } from "react-icons/gi";
import { RiTimelineView } from "react-icons/ri";
import { JobSubmit, EditJob } from "../masters/jobtypes/JobSumitSlice";
import { useSelector, useDispatch } from "react-redux";
import { toast } from 'react-toastify';
import { useNavigate } from "react-router-dom";
import DOMPurify from 'dompurify';
import { Spinner } from "react-bootstrap";
import { CiUser } from "react-icons/ci";
import { FcDepartment } from "react-icons/fc";
import { changeJobTypeLabel } from "../../utils/common";
import moment from "moment";





export default function Job_preview({ formData, handleAllInputChange }) {

  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const submitResponse = useSelector((state) => state.job_submit)

  const handleCreateJobSubmit = () => {
    let data = {
      "benefits": formData.benefits?.map((key) => key.name),
      "company": formData.company,
      "deadline": formData.deadline,
      "department": formData.department,
      "description": formData.description,
      "educations": formData.educations?.map((key) => key.name),
      "experience": formData.experience,
      "filename": formData.filename || "",
      "form_personal_data": formData.form_personal_data,
      "form_profile": formData.form_profile,
      "form_social_links": formData.form_social_links,
      "job_title": formData.job_title,
      "job_type": formData.job_type,
      "location": formData.location?.map((item) => ({
        "id": item.value,
        "name": item.label
      })),
      "project_id": formData.project_id,
      "project_name": formData.project_name,
      "salary_range": formData.salary_range,
      "status": formData.status,
      "tags": formData.tags?.map((key) => key.name),
      "working": formData.working,
      "designation": formData.designation,
      "designation_id": formData.designation_id,
      "total_vacancy": formData.TotalVacancy,
      "available_vacancy": formData.TotalVacancy,
      "ctc_amount": formData.ctcAmount,
      "division": formData.division?.map((item) => ({
        "id": item.value,
        "name": item.label
      })),
      "region": formData.region?.map((item) => ({
        "id": item.value,
        "name": item.label
      })),
      "requisition_form_id": formData.requisition_form_id,
      "requisition_form_title": formData.requisition_form_title,
      "department_id": formData.department_id,
      "assessment_status":formData?.assessment_status
    }

    if (formData?.id) {
      data._id = formData.id
      setLoading(true)
      dispatch(EditJob(data)).unwrap()
        .then((response) => {
          console.log(response)
          toast.success(response?.message);
          setLoading(false)
          setTimeout(() => {
            navigate('/ats')
          }, 1000);
        })
        .catch(err => {
          console.log(err)
          setLoading(false)
          toast.error(err.message || 'Submission failed');
        })
    } else {
      setLoading(true)
      dispatch(JobSubmit(data)).unwrap()
        .then((response) => {
          console.log(response)
          setLoading(false)
          toast.success('Job Created Successfully');
          setTimeout(() => {
            navigate('/ats')
          }, 1000);
        })
        .catch(err => {
          setLoading(false)
          console.log( err , 'this is Error of the madharchode' )
          toast.error(err?.message || err.message?.message || 'Submission failed');
        })
    }
  }


  return (
    <>


      <div className="maininnerSec">
        <div className="privew-innerSec">
          <div className="details-privew">
            <h4>{formData?.job_title}</h4>
            <div className="innderdetails jobtags">
              {
                formData?.tags && formData.tags.length !== 0
                && formData.tags.map((key) => {
                  return (
                    <span className="bg_redlt">{key.name}</span>
                  )
                })
              }
            </div>
            <div className="d-flex gap-5">
              <p className="text-start">
                <BsBuildings /> {formData.project_name}
              </p>
              <p className="text-start">
              <CiUser /> Sanctioned Position(s): {formData.TotalVacancy}
              </p>
              <p className="text-start">
                <BsBriefcase />  {formData.designation}
              </p>
              <p className="text-start">
              <FcDepartment />  {formData.department}
              </p>
            </div>

            {/* <p className="text-start">
              Sanction Position {formData.TotalVacancy}
            </p> */}
          </div>
          <div className="priew-submit">
            <button className="submitbtn px-5" onClick={handleCreateJobSubmit} disabled={loading}>
              {loading ? (
                <>
                  <Spinner animation="border" size="sm" /> {/* Loading spinner */}
                  <span className="ml-2">Loading...</span>
                </>
              ) : (
                <>
                  <FaCheckCircle /> Submit
                </>
              )}
            </button>
          </div>
        </div>
      </div>
      <div className="jobdetailsSecmain">
        <h6>Job Details</h6>
        <div className="jobdetailsInner">
          <div className="Jobtypes">
            <span>Job Type</span>
            <p>
              <RiTimelineView /> {formData.job_type === '' ? 'N/A' : changeJobTypeLabel(formData.job_type) }
            </p>
          </div>
          <div className="Jobtypes">
            <span>Salary Range</span>
            <p>
              <LiaRupeeSignSolid /> {formData.salary_range === '' ? 'N/A' : formData.salary_range}
            </p>
          </div>
          <div className="Jobtypes">
            <span>Deadline</span>
            <p>
              <GiSandsOfTime /> {moment(formData.deadline).format("DD/MM/YYYY")}
            </p>
          </div>
        </div>

        <div className="healthmain-Sec">
          <h6>Benefits</h6>
          <div className="health-Sec">
            {
              formData?.benefits && formData.benefits.length !== 0
              && formData.benefits.map((key) => {
                return (
                  <div className="Jobtypes">
                    <p>{key.name}</p>
                  </div>
                )
              })
            }
          </div>
        </div>
        <div className="mt-3" dangerouslySetInnerHTML={{ __html: formData.description }} />
        {/* <div className="mt-3">{formData.description}</div> */}
      </div>
    </>
  );
}
