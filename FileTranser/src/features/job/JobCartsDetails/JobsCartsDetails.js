import React, { useEffect } from "react";
import GoBackButton from "../JobDetails/GoBackButton.js";
import JobCardsCandidateTabs from "./JobsCartsCandidateTabs.js";
import JobDtlHeader from "./JobCartsDtlHeaders.js";
import AllHeaders from "../../partials/AllHeaders.js";
import { useDispatch } from "react-redux";
import { FetchAppliedCandidateDetails } from "../../slices/AppliedJobCandidates/JobAppliedCandidateSlice.js";
import { useParams } from "react-router-dom";


export default function JobCardDetails() {
  const dispatch = useDispatch();
  const { id } = useParams();
  useEffect(() => {
    dispatch(FetchAppliedCandidateDetails(id));
  } , [dispatch , id])
  return (
    <>
      <AllHeaders />
      <div className="maincontent">
        <div className="container" data-aos="fade-in" data-aos-duration="3000">
          <GoBackButton />
          <JobDtlHeader />         
          <JobCardsCandidateTabs/>
        </div>
      </div>
    </>
  );
}
