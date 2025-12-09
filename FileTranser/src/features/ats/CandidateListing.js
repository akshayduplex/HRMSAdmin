import React , {useEffect} from "react";
import GoBackButton from '../goBack/GoBackButton';
import AllHeaders from "../partials/AllHeaders";
import { useSelector , useDispatch } from "react-redux";
// JobCardsCandidateTabs
import JobCardsCandidateTabs from "../job/JobCartsDetails/JobsCartsCandidateTabs";
import { FetchAppliedCandidateDetails } from '../slices/AppliedJobCandidates/JobAppliedCandidateSlice'



const CandidateListing = () => {
  const AppliedJobs = useSelector((state) => state.appliedJobList.AppliedCandidate)
  const dispatch = useDispatch()

  useEffect(() => {
      dispatch(FetchAppliedCandidateDetails());
  } , [dispatch])
  
  return (
    <>
    <AllHeaders/>
      <div className="maincontent">
        <div className="container" data-aos="fade-in" data-aos-duration="3000">
          <GoBackButton />
          <div class="d-flex justify-content-between align-items-center my-3">
            <div className="hrhdng">
              <h2 class="mb-0">Total Candidates ({AppliedJobs.status === 'success' && AppliedJobs.data?.length})</h2>
              <p class="mb-0 text-start">
                Potential Candidate tracking and management
              </p>
            </div>
          </div>
          <JobCardsCandidateTabs/>
        </div>
      </div>
    </>
  );
}

export default CandidateListing;