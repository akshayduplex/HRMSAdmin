import React, { useEffect } from "react";
import { BsBuildings } from "react-icons/bs";
import { FaCheckCircle } from "react-icons/fa";
import { LiaRupeeSignSolid } from "react-icons/lia";
import { GiSandsOfTime } from "react-icons/gi";
import { RiTimelineView } from "react-icons/ri";
import { JobSubmit } from "../masters/jobtypes/JobSumitSlice";
import { useSelector , useDispatch } from "react-redux";
import { toast } from 'react-toastify';
import { useNavigate } from "react-router-dom";
import DOMPurify from 'dompurify';




export default function Job_preview({ formData, handleAllInputChange }) {
  const navigate = useNavigate();

  const dispatch = useDispatch();
  const submitResponse = useSelector((state) => state.job_submit)

  // useEffect(() => {
  //   if (submitResponse.loading === 'success') {
  //     toast.success('Job Created Successfully');
  //     setTimeout(() => {
  //       navigate('/ats')
  //     }, 1000);
  //   } else if (submitResponse.loading === 'failed') {
  //     toast.error(submitResponse.message || 'Submission failed');
  //   }
  // }, [submitResponse]);




  const handleCreateJobSubmit = () => {
    let data = new FormData();

    console.log(formData.location)

    data.append("benefits", JSON.stringify(formData.benefits));
    data.append("company", formData.company);
    data.append("deadline", formData.deadline);
    data.append("department", formData.department);
    data.append("description", formData.description);
    data.append("educations", JSON.stringify(formData.educations));
    data.append("experience", formData.experience);
    if (formData.filename) {
      data.append("filename", formData.filename);
    }else {
      data.append("filename", "");
    }
    data.append("form_personal_data", JSON.stringify(formData.form_personal_data));
    data.append("form_profile", JSON.stringify(formData.form_profile));
    data.append("form_social_links", JSON.stringify(formData.form_social_links));
    data.append("job_title", formData.job_title);
    data.append("job_type", formData.job_type);
    data.append("location", JSON.stringify(formData.location));
    data.append("project_id", formData.project_id);
    data.append("project_name", formData.project_name);
    data.append("salary_range", formData.salary_range);
    data.append("status", formData.status);
    data.append("tags", JSON.stringify(formData.tags));
    data.append("working", formData.working);
    dispatch(JobSubmit(data)).unwrap()
    .then((response) => {
        console.log(response)
        toast.success('Job Created Successfully');
        setTimeout(() => {
          navigate('/ats')
        }, 1000);
    })
    .catch(err => {
      toast.error(err.message || 'Submission failed');
    })
  }

  const sanitizedContent = DOMPurify.sanitize(formData.description);

  // Function to detect if content is plain text
  const isPlainText = (content) => {
      const doc = new DOMParser().parseFromString(content, 'text/html');
      return doc.body.children.length === 0;
  };


  return (
    <>


      <div className="maininnerSec">
        <div className="privew-innerSec">
          <div className="details-privew">
            <h4>{formData?.job_title}</h4>
            <div className="innderdetails jobtags">
              {/* <span className="bg_redlt"> Engineering</span>
                      <span className="bg-pink"> Automation</span> */}
              {
                formData?.tags && formData.tags.length !== 0
                && formData.tags.map((key) => {
                  return (
                    <span className="bg_redlt">{key}</span>
                  )
                })
              }
            </div>
            <p className="text-start">
              <BsBuildings /> {formData.project_name}
            </p>
          </div>
          <div className="priew-submit">
            <button className="submitbtn px-5" onClick={handleCreateJobSubmit}>
              <FaCheckCircle /> Submit
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
              <RiTimelineView /> {formData.job_type === '' ? 'N/A' : formData.job_type}
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
              <GiSandsOfTime /> {formData.deadline}
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
                    <p>{key}</p>
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
